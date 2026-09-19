import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Clock, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { TopBar } from '../../components/navigation/TopBar';
import { BottomNav } from '../../components/navigation/BottomNav';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { Modal } from '../../components/ui/Modal';
import { formatPrice, cn } from '../../lib/utils';
import { useCartStore } from '../../store/useCartStore';
import { MOCK_STALLS, MOCK_MENU_ITEMS } from '../../lib/data';

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingReorder, setPendingReorder] = useState<any>(null);
  const [errorModal, setErrorModal] = useState<{title: string, message: string} | null>(null);

  const addItem = useCartStore((state) => state.addItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const currentStall = useCartStore((state) => state.stall);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const tabs = ['All', 'Active', 'Completed', 'Cancelled'];

  const orders = [
    { 
      id: 'AE-1024', 
      stallId: 'stall-1',
      stallName: 'Stall #1 (Vendor Pending)', 
      total: 150.0, 
      date: 'Sept 19, 2023', 
      status: 'ACTIVE', 
      items: [
        { menuItemId: 'item-1', quantity: 2 }
      ] 
    },
    { 
      id: 'AE-0985', 
      stallId: 'stall-2',
      stallName: 'Stall #2 (Vendor Pending)', 
      total: 45.0, 
      date: 'Sept 18, 2023', 
      status: 'COMPLETED', 
      items: [
        { menuItemId: 'item-4', quantity: 1 }
      ] 
    },
    { 
      id: 'AE-0942', 
      stallId: 'stall-1',
      stallName: 'Stall #1 (Vendor Pending)', 
      total: 220.0, 
      date: 'Sept 15, 2023', 
      status: 'CANCELLED', 
      items: [
        { menuItemId: 'item-1', quantity: 2 },
        { menuItemId: 'item-2', quantity: 1 }
      ] 
    },
  ];

  const handleReorder = (order: any) => {
    const stall = MOCK_STALLS.find(s => s.id === order.stallId);
    
    if (!stall || stall.status !== 'OPEN') {
      setErrorModal({
        title: 'Stall Unavailable',
        message: `${order.stallName} is currently closed or paused. You cannot reorder at this time.`
      });
      return;
    }

    // Check if any items are sold out
    const orderItems = order.items.map((oi: any) => {
      const menuItem = MOCK_MENU_ITEMS.find(m => m.id === oi.menuItemId);
      return { ...oi, menuItem };
    });

    const unavailableItems = orderItems.filter((oi: any) => !oi.menuItem || !oi.menuItem.isAvailable);
    if (unavailableItems.length > 0) {
      setErrorModal({
        title: 'Items Unavailable',
        message: 'Some items from your previous order are currently sold out or unavailable.'
      });
      return;
    }

    // Check for multi-stall cart conflict
    if (currentStall && currentStall.id !== order.stallId) {
      setPendingReorder(order);
      setIsModalOpen(true);
      return;
    }

    // Add all items to cart
    executeReorder(order);
  };

  const executeReorder = (order: any) => {
    const stall = MOCK_STALLS.find(s => s.id === order.stallId)!;
    
    order.items.forEach((oi: any) => {
      const menuItem = MOCK_MENU_ITEMS.find(m => m.id === oi.menuItemId)!;
      addItem({
        id: Math.random().toString(36).substr(2, 9),
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: oi.quantity,
      }, stall);
    });

    navigate('/cart');
  };

  const confirmClearAndReorder = () => {
    clearCart();
    executeReorder(pendingReorder);
    setIsModalOpen(false);
    setPendingReorder(null);
  };

  const filteredOrders = activeTab === 'All' 
    ? orders 
    : orders.filter(o => o.status === activeTab.toUpperCase());

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC]">
      <TopBar title="My Orders" />
      
      {/* Tabs */}
      <div className="bg-white border-b border-slate-100">
        <div className="flex px-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all relative',
                activeTab === tab ? 'text-[#065F46]' : 'text-[#94A3B8]'
              )}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-4 right-4 h-1 bg-[#065F46] rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32 rounded-lg" />
                    <Skeleton className="h-2 w-24 rounded-lg" />
                  </div>
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <Skeleton className="h-3 w-12 rounded-lg" />
                <Skeleton className="h-5 w-20 rounded-lg" />
              </div>
            </div>
          ))
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div 
              key={order.id}
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm transition-all"
            >
              <div 
                onClick={() => navigate(`/order-details/${order.id.toLowerCase()}`)}
                className="flex justify-between items-start mb-4 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#94A3B8]">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F172A] leading-tight">{order.stallName}</h4>
                    <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">{order.id} • {order.date}</p>
                  </div>
                </div>
                <Badge variant={order.status === 'ACTIVE' ? 'info' : order.status === 'COMPLETED' ? 'success' : 'error'}>
                  {order.status}
                </Badge>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                  <Clock size={14} />
                  <span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                  <span className="mx-1">•</span>
                  <span className="font-black text-[#0F172A]">{formatPrice(order.total)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {(order.status === 'COMPLETED' || order.status === 'CANCELLED') && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 px-3 rounded-full text-[10px] font-black uppercase tracking-wider gap-1.5 border-slate-200 text-[#065F46] hover:bg-[#D1FAE5] hover:border-[#D1FAE5]"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReorder(order);
                      }}
                    >
                      <RotateCcw size={12} />
                      Reorder
                    </Button>
                  )}
                  <div 
                    onClick={() => navigate(`/order-details/${order.id.toLowerCase()}`)}
                    className="p-1 cursor-pointer"
                  >
                    <ChevronRight size={18} className="text-[#94A3B8]" />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-[32px] flex items-center justify-center mb-4 text-slate-300">
              <ShoppingBag size={32} />
            </div>
            <p className="text-[#64748B] text-sm font-medium">No orders found in this category.</p>
          </div>
        )}
      </div>

      <BottomNav />

      {/* Cart Conflict Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Replace cart items?"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#64748B] leading-relaxed">
            Your cart already contains items from <span className="font-bold text-[#0F172A]">{currentStall?.name}</span>. 
            Do you want to discard them and reorder from <span className="font-bold text-[#0F172A]">{pendingReorder?.stallName}</span>?
          </p>
          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline" 
              className="flex-1 rounded-2xl" 
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 rounded-2xl bg-[#065F46] hover:bg-[#059669]" 
              onClick={confirmClearAndReorder}
            >
              Replace
            </Button>
          </div>
        </div>
      </Modal>

      {/* Error Modal */}
      <Modal
        isOpen={!!errorModal}
        onClose={() => setErrorModal(null)}
        title={errorModal?.title || ''}
      >
        <div className="space-y-4">
          <p className="text-sm text-[#64748B] leading-relaxed">
            {errorModal?.message}
          </p>
          <Button 
            className="w-full rounded-2xl bg-[#065F46] hover:bg-[#059669]" 
            onClick={() => setErrorModal(null)}
          >
            Got it
          </Button>
        </div>
      </Modal>
    </div>
  );
}
