/**
 * API layer for interacting with the Express backend.
 * These act as the "Server Actions" on the client side.
 */

export const api = {
  stalls: {
    getAll: async () => {
      const res = await fetch('/api/stalls');
      if (!res.ok) throw new Error('Failed to fetch stalls');
      return res.json();
    },
    getById: async (id: string) => {
      const res = await fetch(`/api/stalls/${id}`);
      if (!res.ok) throw new Error('Failed to fetch stall');
      return res.json();
    },
  },
  slots: {
    getAvailable: async () => {
      const res = await fetch('/api/slots');
      if (!res.ok) throw new Error('Failed to fetch slots');
      return res.json();
    },
  },
  orders: {
    create: async (data: {
      userId: string;
      stallId: string;
      items: any[];
      totalAmount: number;
      paymentMethod: string;
      pickupSlotId?: string;
    }) => {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create order');
      return res.json();
    },
    getByUser: async (userId: string) => {
      const res = await fetch(`/api/orders/user/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch orders');
      return res.json();
    },
    getById: async (id: string) => {
      const res = await fetch(`/api/orders/${id}`);
      if (!res.ok) throw new Error('Failed to fetch order');
      return res.json();
    },
    updateStatus: async (id: string, status: string) => {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update order status');
      return res.json();
    },
  },
  notifications: {
    getByUser: async (userId: string) => {
      const res = await fetch(`/api/notifications/user/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch notifications');
      return res.json();
    },
    markAsRead: async (id: string) => {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
      });
      if (!res.ok) throw new Error('Failed to mark notification as read');
      return res.json();
    },
  },
  user: {
    updateProfile: async (data: any) => {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      return res.json();
    },
  },
  auth: {
    signup: async (data: any) => {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Signup failed');
      }
      return res.json();
    },
    login: async (credentials: any) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Login failed');
      }
      return res.json();
    },
  },
};
