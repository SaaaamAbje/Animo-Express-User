import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { ExpressAuth, getSession } from '@auth/express';
import Credentials from '@auth/express/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { EventEmitter } from 'events';

dotenv.config();

const orderEvents = new EventEmitter();
const notificationEvents = new EventEmitter();
orderEvents.setMaxListeners(100);
notificationEvents.setMaxListeners(100);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient();
const AUTH_SECRET = process.env.AUTH_SECRET || process.env.JWT_SECRET || 'fallback-secret';

const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(credentials.password as string, user.passwordHash);
        
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          studentId: user.studentId,
          program: user.program,
          yearLevel: user.yearLevel,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: any, user?: any }) {
      if (user) {
        token.id = user.id;
        token.studentId = (user as any).studentId;
        token.program = (user as any).program;
        token.yearLevel = (user as any).yearLevel;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).studentId = token.studentId;
        (session.user as any).program = token.program;
        (session.user as any).yearLevel = token.yearLevel;
      }
      return session;
    }
  },
  secret: AUTH_SECRET,
  trustHost: true,
  basePath: "/api/auth",
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Trust proxy for secure cookies and CSRF protection when behind a reverse proxy
  app.set('trust proxy', true);

  app.use(express.json());

  // --- Auth.js Setup ---
  app.use("/api/auth/*", ExpressAuth(authConfig));

  // SSE: Order Status Stream
  app.get('/api/orders/:id/stream', async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const onStatusUpdate = (orderId: string, status: string) => {
      if (orderId === id) {
        res.write(`data: ${JSON.stringify({ status })}\n\n`);
      }
    };

    orderEvents.on('update', onStatusUpdate);

    req.on('close', () => {
      orderEvents.off('update', onStatusUpdate);
    });
  });

  // SSE: Notifications Stream
  app.get('/api/notifications/stream', async (req: express.Request, res: express.Response) => {
    const session = await getSession(req, authConfig);
    if (!session || !session.user) {
      return res.status(401).end();
    }

    const userId = (session.user as any).id;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const sendCount = async () => {
      const count = await prisma.notification.count({
        where: { userId, isRead: false }
      });
      res.write(`data: ${JSON.stringify({ unreadCount: count })}\n\n`);
    };

    // Send initial count
    await sendCount();

    const onNotification = (targetUserId: string) => {
      if (targetUserId === userId) {
        sendCount();
      }
    };

    notificationEvents.on('new', onNotification);

    req.on('close', () => {
      notificationEvents.off('new', onNotification);
    });
  });

  // Middleware to protect API routes
  const authenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const session = await getSession(req, authConfig);
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    (req as any).session = session;
    next();
  };

  // --- Auth Routes ---

  app.post('/api/auth/signup', async (req: express.Request, res: express.Response) => {
    try {
      const { studentId, fullName, email, phone, degreeProgram, yearLevel, password } = req.body;

      // 1. Domain Restriction
      if (!email.endsWith('@dlsl.edu.ph')) {
        return res.status(400).json({ error: 'Only @dlsl.edu.ph emails are allowed.' });
      }

      // 2. Check if user exists
      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email }, { studentId }] }
      });
      if (existingUser) {
        return res.status(400).json({ error: 'User with this Email or Student ID already exists.' });
      }

      // 3. Hash Password
      const passwordHash = await bcrypt.hash(password, 10);

      // 4. Create User
      const user = await prisma.user.create({
        data: {
          studentId,
          name: fullName,
          email,
          mobile: phone,
          program: degreeProgram,
          yearLevel,
          passwordHash,
        }
      });

      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Failed to create account' });
    }
  });

  // --- API Routes (Server Actions Equivalent) ---

  // Stalls & Menu Items
  app.get('/api/stalls', async (_req: express.Request, res: express.Response) => {
    try {
      const stalls = await prisma.stall.findMany({
        include: { menuItems: true },
      });
      const stallsWithStatus = stalls.map(s => ({
        ...s,
        status: s.isPaused ? 'PAUSED' : 'OPEN'
      }));
      res.json(stallsWithStatus);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stalls' });
    }
  });

  app.get('/api/stalls/:id', async (req: express.Request, res: express.Response) => {
    try {
      const stall = await prisma.stall.findUnique({
        where: { id: req.params.id },
        include: { menuItems: true },
      });
      if (!stall) return res.status(404).json({ error: 'Stall not found' });
      res.json({
        ...stall,
        status: stall.isPaused ? 'PAUSED' : 'OPEN'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stall' });
    }
  });

  // Slots
  app.get('/api/slots', async (_req: express.Request, res: express.Response) => {
    try {
      const slots = await prisma.pickupSlot.findMany({
        where: { status: 'AVAILABLE' },
      });
      res.json(slots);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch slots' });
    }
  });

  // Orders
  app.post('/api/orders', authenticated, async (req: express.Request, res: express.Response) => {
    try {
      const { userId, stallId, items, totalAmount, paymentMethod, pickupSlotId } = req.body;
      
      const orderCount = await prisma.order.count();
      const orderNumber = `AE-${(orderCount + 1000).toString()}`;

      const order = await prisma.order.create({
        data: {
          userId,
          stallId,
          orderNumber,
          items: JSON.stringify(items),
          totalAmount,
          paymentMethod,
          pickupSlotId,
          status: 'PENDING',
        },
      });

      if (pickupSlotId) {
        await prisma.pickupSlot.update({
          where: { id: pickupSlotId },
          data: { bookedCount: { increment: 1 } },
        });
      }

      res.json(order);
    } catch (error) {
      console.error('Order creation error:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  });

  app.get('/api/orders/user/:userId', authenticated, async (req: express.Request, res: express.Response) => {
    try {
      const orders = await prisma.order.findMany({
        where: { userId: req.params.userId },
        include: { stall: true },
        orderBy: { createdAt: 'desc' },
      });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  app.get('/api/orders/:id', authenticated, async (req: express.Request, res: express.Response) => {
    try {
      const order = await prisma.order.findUnique({
        where: { id: req.params.id },
        include: { stall: true, user: true, pickupSlot: true },
      });
      if (!order) return res.status(404).json({ error: 'Order not found' });
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  });

  app.patch('/api/orders/:id/status', authenticated, async (req: express.Request, res: express.Response) => {
    try {
      const { status } = req.body;
      const order = await prisma.order.update({
        where: { id: req.params.id },
        data: { status },
      });

      // Emit event for SSE
      orderEvents.emit('update', req.params.id, status);

      // Also create a notification
      const notification = await prisma.notification.create({
        data: {
          userId: order.userId,
          title: 'Order Update',
          message: `Your order from ${order.stallId} is now ${status.replace(/_/g, ' ')}.`,
          type: 'ORDER_STATUS',
        }
      });

      notificationEvents.emit('new', order.userId);

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update order status' });
    }
  });

  app.patch('/api/user/profile', authenticated, async (req: express.Request, res: express.Response) => {
    try {
      const { phone, degreeProgram, yearLevel } = req.body;
      const session = (req as any).session;
      
      const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: {
          mobile: phone,
          program: degreeProgram,
          yearLevel,
        }
      });
      
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

  // Notifications
  app.get('/api/notifications/user/:userId', authenticated, async (req: express.Request, res: express.Response) => {
    try {
      const notifications = await prisma.notification.findMany({
        where: { userId: req.params.userId },
        orderBy: { createdAt: 'desc' },
      });
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  });

  app.patch('/api/notifications/:id/read', authenticated, async (req: express.Request, res: express.Response) => {
    try {
      const notification = await prisma.notification.update({
        where: { id: req.params.id },
        data: { isRead: true },
      });
      res.json(notification);
    } catch (error) {
      res.status(500).json({ error: 'Failed to mark notification as read' });
    }
  });

  // Vite Middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
