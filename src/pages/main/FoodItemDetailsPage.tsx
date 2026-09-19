import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Minus, ArrowLeft, Heart, Info, ShoppingCart } from 'lucide-react';
import { TopBar } from '../../components/navigation/TopBar';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { MOCK_MENU_ITEMS, MOCK_STALLS } from '../../lib/data';
import { formatPrice } from '../../lib/utils';
import { useCartStore } from '../../store/useCartStore';

export default function FoodItemDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, clearCart, stall: cartStall } = useCartStore();
  
  const item = MOCK_MENU_ITEMS.find(i => i.id === id);
  const stall = MOCK_STALLS.find(s => s.id === item?.stallId);
  
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!item || !stall) return null;

  const handleAddToCart = () => {
    try {
      addItem({
        id: Math.random().toString(36).substr(2, 9),
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: quantity,
        specialInstructions: instructions,
      }, stall);
      navigate(-1);
    } catch (error: any) {
      if (error.message === 'MULTIPLE_STALL_ERROR') {
        setIsModalOpen(true);
      }
    }
  };

  const confirmClearCart = () => {
    clearCart();
    addItem({
      id: Math.random().toString(36).substr(2, 9),
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: quantity,
      specialInstructions: instructions,
    }, stall);
    setIsModalOpen(false);
    navigate(-1);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC]">
      <div className="relative h-[40vh] bg-slate-200 shrink-0">
        {/* Back Button Overlay */}
        <div className="absolute top-12 left-6 z-10">
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-white/90 backdrop-blur shadow-lg rounded-2xl"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={24} className="text-[#0F172A]" />
          </Button>
        </div>
        
        {/* Photo Placeholder */}
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-slate-400">
          <div className="w-20 h-20 border-4 border-slate-300 rounded-3xl" />
          <span className="text-xs font-bold uppercase tracking-widest">Photo Placeholder</span>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-t-[40px] -mt-10 relative z-20 px-8 pt-10 pb-8 flex flex-col">
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-2xl font-black text-[#0F172A] mb-1">{item.name}</h2>
              <p className="text-[#065F46] text-sm font-bold">{stall.name}</p>
            </div>
            <div className="text-2xl font-black text-[#0F172A]">
              {formatPrice(item.price)}
            </div>
          </div>

          <div className="flex items-center gap-4 my-6 py-4 border-y border-slate-50">
            <div className="flex items-center gap-1.5">
              <Heart size={18} className="text-red-500 fill-red-500" />
              <span className="text-xs font-bold text-[#0F172A]">95% (200+)</span>
            </div>
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
            <div className="flex items-center gap-1.5">
              <Info size={18} className="text-[#065F46]" />
              <span className="text-xs font-bold text-[#64748B]">Allergy Info</span>
            </div>
          </div>

          <p className="text-[#64748B] text-sm leading-relaxed mb-8">
            {item.description}
          </p>

          <div className="space-y-4">
            <label className="text-sm font-black text-[#0F172A] block">Special Instructions</label>
            <textarea
              className="w-full bg-[#F8FAFC] border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:border-[#065F46] focus:ring-4 focus:ring-[#D1FAE5] transition-all resize-none min-h-[100px]"
              placeholder="e.g. No onions, extra spicy, etc."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-[#0F172A]">Quantity</span>
            <div className="flex items-center gap-4 bg-[#F8FAFC] p-1.5 rounded-2xl border border-slate-100">
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-10 h-10 rounded-xl bg-white shadow-sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus size={18} />
              </Button>
              <span className="w-8 text-center font-black text-[#0F172A]">{quantity}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-10 h-10 rounded-xl bg-white shadow-sm"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus size={18} />
              </Button>
            </div>
          </div>

          <Button 
            className="w-full h-16 rounded-[24px] text-lg font-black shadow-xl shadow-[#065F46]/20"
            onClick={handleAddToCart}
          >
            Add to Cart <ShoppingCart size={20} className="ml-3" />
          </Button>
        </div>
      </div>

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
