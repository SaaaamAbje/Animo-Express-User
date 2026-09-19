import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { TopBar } from '../../components/navigation/TopBar';
import { Button } from '../../components/ui/Button';
import { useCartStore } from '../../store/useCartStore';
import { formatPrice } from '../../lib/utils';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, stall, updateQuantity, removeItem, clearCart, getTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col bg-white">
        <TopBar showBack title="Your Cart" />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-24 h-24 bg-[#F8FAFC] rounded-[40px] flex items-center justify-center mb-6">
            <ShoppingBag size={48} className="text-[#94A3B8]" />
          </div>
          <h3 className="text-xl font-bold text-[#0F172A] mb-2">Cart is empty</h3>
          <p className="text-[#64748B] text-sm mb-10 leading-relaxed">
            Looks like you haven't added anything yet. Explore the canteen stalls and start ordering!
          </p>
          <Button onClick={() => navigate('/home')} className="w-full">
            Browse Stalls
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC]">
      <TopBar showBack title="Your Cart" />
      
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Stall Header */}
        <div className="bg-white rounded-3xl p-5 mb-6 border border-slate-100 flex justify-between items-center shadow-sm">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#94A3B8]">Ordering from</span>
            <h3 className="text-lg font-bold text-[#0F172A]">{stall?.name}</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={clearCart} className="text-red-500 font-bold hover:bg-red-50">
            <Trash2 size={18} className="mr-2" /> Clear
          </Button>
        </div>

        {/* Item List */}
        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 pr-4">
                  <h4 className="font-bold text-[#0F172A] leading-tight mb-1">{item.name}</h4>
                  {item.specialInstructions && (
                    <p className="text-[10px] text-[#64748B] font-medium italic">"{item.specialInstructions}"</p>
                  )}
                </div>
                <span className="font-black text-[#0F172A]">{formatPrice(item.price * item.quantity)}</span>
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-50">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeItem(item.id)}
                  className="text-red-400 p-0 h-auto hover:bg-transparent"
                >
                  Remove
                </Button>
                
                <div className="flex items-center gap-4 bg-[#F8FAFC] p-1 rounded-xl border border-slate-100">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-8 h-8 rounded-lg bg-white shadow-sm"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus size={14} />
                  </Button>
                  <span className="w-6 text-center font-bold text-[#0F172A] text-sm">{item.quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-8 h-8 rounded-lg bg-white shadow-sm"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total Card */}
        <div className="bg-[#065F46] rounded-[32px] p-6 text-white shadow-xl shadow-[#065F46]/20">
          <div className="flex justify-between items-center mb-2 opacity-80 text-sm">
            <span>Subtotal</span>
            <span>{formatPrice(getTotal())}</span>
          </div>
          <div className="flex justify-between items-center mb-6 opacity-80 text-sm">
            <span>Platform Fee</span>
            <span>₱0.00</span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-white/20">
            <span className="text-lg font-bold">Total Amount</span>
            <span className="text-2xl font-black">{formatPrice(getTotal())}</span>
          </div>
        </div>
      </div>

      {/* Checkout CTA */}
      <div className="p-6 bg-white border-t border-slate-100">
        <Button 
          className="w-full h-16 rounded-[24px] text-lg font-black shadow-lg"
          onClick={() => navigate('/pickup-slot')}
        >
          Select Pickup Slot <ArrowRight size={20} className="ml-3" />
        </Button>
      </div>
    </div>
  );
}
