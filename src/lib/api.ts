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
};
