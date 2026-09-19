export type UserRole = 'student' | 'admin' | 'vendor';

export interface User {
  id: string;
  studentId: string;
  fullName: string;
  email: string;
  phone: string;
  degreeProgram: string;
  yearLevel: string;
  avatarUrl?: string;
}

export type StallStatus = 'OPEN' | 'PAUSED' | 'CLOSED';

export interface Stall {
  id: string;
  name: string;
  status: StallStatus;
  category: string;
  imageUrl?: string;
  rating: number;
  estimatedTime: string;
}

export interface MenuItem {
  id: string;
  stallId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  isAvailable: boolean;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';

export interface Order {
  id: string;
  userId: string;
  stallId: string;
  stallName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  pickupSlot: string;
  paymentMethod: 'GCASH' | 'MAYA' | 'CASH';
  createdAt: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
}

export interface PickupSlot {
  id: string;
  time: string;
  capacity: number; // 0 to 100
  status: 'AVAILABLE' | 'FULL' | 'SELECTED';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'ORDER_UPDATE' | 'PROMO' | 'SYSTEM';
  createdAt: string;
  isRead: boolean;
  orderId?: string;
}
