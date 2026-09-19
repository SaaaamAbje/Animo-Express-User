import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes (Server Actions Equivalent) ---

  // Stalls & Menu Items
  app.get('/api/stalls', async (_req, res) => {
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

  app.get('/api/stalls/:id', async (req, res) => {
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
  app.get('/api/slots', async (_req, res) => {
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
  app.post('/api/orders', async (req, res) => {
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

  app.get('/api/orders/user/:userId', async (req, res) => {
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

  app.get('/api/orders/:id', async (req, res) => {
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

  app.patch('/api/orders/:id/status', async (req, res) => {
    try {
      const { status } = req.body;
      const order = await prisma.order.update({
        where: { id: req.params.id },
        data: { status },
      });
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update order status' });
    }
  });

  // Notifications
  app.get('/api/notifications/user/:userId', async (req, res) => {
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

  app.patch('/api/notifications/:id/read', async (req, res) => {
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
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
