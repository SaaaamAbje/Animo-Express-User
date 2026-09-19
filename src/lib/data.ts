import { Stall, MenuItem, PickupSlot } from '../types';

// MOCK DATA AS REQUESTED (Generic placeholders)

export const MOCK_STALLS: Stall[] = [
  {
    id: 'stall-1',
    name: 'Stall #1 (Vendor Pending)',
    status: 'OPEN',
    category: 'Rice Meals',
    rating: 4.8,
    estimatedTime: '10-15 mins',
  },
  {
    id: 'stall-2',
    name: 'Stall #2 (Vendor Pending)',
    status: 'OPEN',
    category: 'Snacks',
    rating: 4.5,
    estimatedTime: '5-10 mins',
  },
  {
    id: 'stall-3',
    name: 'Stall #3 (Vendor Pending)',
    status: 'PAUSED',
    category: 'Drinks',
    rating: 4.2,
    estimatedTime: 'Paused',
  },
  {
    id: 'stall-4',
    name: 'Stall #4 (Vendor Pending)',
    status: 'OPEN',
    category: 'Pasta',
    rating: 4.7,
    estimatedTime: '15-20 mins',
  },
];

export const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    id: 'item-1',
    stallId: 'stall-1',
    name: 'Menu Item 1',
    description: 'Generic description for menu item 1. Freshly prepared and student-friendly.',
    price: 75.0,
    category: 'Mains',
    isAvailable: true,
  },
  {
    id: 'item-2',
    stallId: 'stall-1',
    name: 'Menu Item 2',
    description: 'Generic description for menu item 2. High quality ingredients.',
    price: 85.0,
    category: 'Mains',
    isAvailable: true,
  },
  {
    id: 'item-3',
    stallId: 'stall-1',
    name: 'Menu Item 3',
    description: 'Generic description for menu item 3. Popular choice.',
    price: 60.0,
    category: 'Sides',
    isAvailable: false,
  },
  {
    id: 'item-4',
    stallId: 'stall-2',
    name: 'Menu Item 4',
    description: 'Generic snack item for quick breaks.',
    price: 45.0,
    category: 'Snacks',
    isAvailable: true,
  },
];

export const MOCK_PICKUP_SLOTS: PickupSlot[] = [
  { id: 'slot-1', time: '09:00 AM - 09:15 AM', capacity: 20, status: 'AVAILABLE' },
  { id: 'slot-2', time: '09:15 AM - 09:30 AM', capacity: 45, status: 'AVAILABLE' },
  { id: 'slot-3', time: '09:30 AM - 09:45 AM', capacity: 85, status: 'AVAILABLE' },
  { id: 'slot-4', time: '09:45 AM - 10:00 AM', capacity: 100, status: 'FULL' },
  { id: 'slot-5', time: '10:00 AM - 10:15 AM', capacity: 10, status: 'AVAILABLE' },
  { id: 'slot-6', time: '10:15 AM - 10:30 AM', capacity: 60, status: 'AVAILABLE' },
];

export const CATEGORIES = ['All', 'Rice Meals', 'Snacks', 'Drinks', 'Pasta', 'Desserts'];
