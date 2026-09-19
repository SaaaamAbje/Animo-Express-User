import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, Info, Search, Plus, Minus } from 'lucide-react';
import { TopBar } from '../../components/navigation/TopBar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Skeleton } from '../../components/ui/Skeleton';
import { MOCK_STALLS, MOCK_MENU_ITEMS } from '../../lib/data';
import { formatPrice } from '../../lib/utils';
import { useCartStore } from '../../store/useCartStore';
import { api } from '../../lib/api';

export default function StallMenuPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items: cartItems, addItem, clearCart, stall: cartStall } = useCartStore();
  
  const [stall, setStall] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingItem, setPendingItem] = useState<{item: any, stall: any} | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStall = async () => {
      if (!id) return;
      try {
        const data = await api.stalls.getById(id);
        setStall(data);
        setMenuItems(data.menuItems || []);
      } catch (error) {
        console.error('Failed to fetch stall:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStall();
  }, [id]);

  const categories = ['All', ...new Set(menuItems.map(item => item.category))];
  
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col bg-white">
        <TopBar showBack showCart title="Loading Stall..." />
        <div className="px-6 py-6 space-y-6">
          <Skeleton className="h-10 w-3/4 mb-4 rounded-xl" />
          <Skeleton className="h-4 w-1/2 mb-8 rounded-xl" />
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-1">
                  <Skeleton className="h-5 w-3/4 mb-2 rounded-lg" />
                  <Skeleton className="h-3 w-full mb-1 rounded-lg" />
                  <Skeleton className="h-5 w-16 rounded-lg mt-4" />
                </div>
                <Skeleton className="w-24 h-24 rounded-2xl shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stall) return null;

  const handleAddToCart = (item: any) => {
    try {
      addItem({
        id: Math.random().toString(36).substr(2, 9),
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
      }, stall);
    } catch (error: any) {
      if (error.message === 'MULTIPLE_STALL_ERROR') {
        setPendingItem({ item, stall });
        setIsModalOpen(true);
      }
    }
  };

  const confirmClearCart = () => {
    clearCart();
    if (pendingItem) {
      addItem({
        id: Math.random().toString(36).substr(2, 9),
        menuItemId: pendingItem.item.id,
        name: pendingItem.item.name,
        price: pendingItem.item.price,
        quantity: 1,
      }, pendingItem.stall);
    }
    setIsModalOpen(false);
  };

  const filteredItems = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <div className="flex-1 flex flex-col bg-white">
      <TopBar showBack showCart title="Stall Menu" />
      
      <div className="flex-1 overflow-y-auto">
        {/* Stall Header */}
        <div className="px-6 py-6 border-b border-slate-100">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-black text-[#0F172A] leading-tight">{stall.name}</h2>
            <Badge variant={stall.status === 'OPEN' ? 'success' : 'warning'}>
              {stall.status}
            </Badge>
          </div>
          <p className="text-sm text-[#64748B] mb-4">{stall.category} • DLSL Canteen</p>
          
          <div className="flex gap-6">
            <div className="flex items-center gap-1.5">
              <Star size={16} className="text-[#F59E0B] fill-[#F59E0B]" />
              <span className="text-sm font-bold text-[#0F172A]">{stall.rating}</span>
              <span className="text-xs text-[#94A3B8] font-medium">(100+ ratings)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={16} className="text-[#065F46]" />
              <span className="text-sm font-bold text-[#0F172A]">{stall.estimatedTime}</span>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="sticky top-0 bg-white z-10 py-4 border-b border-slate-50">
          <div className="flex gap-3 overflow-x-auto px-6 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-[#065F46] text-white'
                    : 'bg-slate-100 text-[#64748B]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="px-6 py-6 space-y-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-1">
                  <Skeleton className="h-5 w-3/4 mb-2 rounded-lg" />
                  <Skeleton className="h-3 w-full mb-1 rounded-lg" />
                  <Skeleton className="h-3 w-2/3 mb-4 rounded-lg" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-16 rounded-lg" />
                    <Skeleton className="w-8 h-8 rounded-full" />
                  </div>
                </div>
                <Skeleton className="w-24 h-24 rounded-2xl shrink-0" />
              </div>
            ))
          ) : (
            filteredItems.map((item) => (
              <div 
                key={item.id}
                onClick={() => navigate(`/item/${item.id}`)}
                className="flex gap-4 group"
              >
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-[#0F172A] group-hover:text-[#065F46] transition-colors">{item.name}</h4>
                    {!item.isAvailable && <Badge variant="neutral">Sold Out</Badge>}
                  </div>
                  <p className="text-xs text-[#64748B] line-clamp-2 mb-3 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-black text-[#065F46]">{formatPrice(item.price)}</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="p-1.5 h-auto rounded-full bg-[#D1FAE5] text-[#065F46]"
                      disabled={!item.isAvailable}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>
                <div className="w-24 h-24 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shrink-0">
                  <div className="w-8 h-8 border border-slate-200 rounded-md" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Cart Summary (Floating) */}
      {cartItems.length > 0 && cartStall?.id === stall.id && (
        <div className="px-6 py-4 bg-white border-t border-slate-100 animate-in slide-in-from-bottom duration-300">
          <Button 
            className="w-full justify-between px-6" 
            onClick={() => navigate('/cart')}
          >
            <div className="flex items-center gap-3">
              <div className="bg-[#D1FAE5]/20 px-2 py-0.5 rounded text-xs">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
              </div>
              <span>View Cart</span>
            </div>
            <span className="font-black">₱{useCartStore.getState().getTotal().toFixed(2)}</span>
          </Button>
        </div>
      )}

      {/* Cross-Stall Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Clear Cart?"
        footer={
          <>
            <Button variant="ghost" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" className="flex-1" onClick={confirmClearCart}>Clear & Add</Button>
          </>
        }
      >
        <p className="text-sm text-[#64748B] leading-relaxed">
          You can only order from one stall at a time. Adding this item will clear your current cart from <strong>{cartStall?.name}</strong>.
        </p>
      </Modal>
    </div>
  );
}
