import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PartyPopper, Calendar, Clock, ArrowRight, Share2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useCartStore } from '../../store/useCartStore';

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const clearCart = useCartStore((state) => state.clearCart);

  const handleTrack = () => {
    clearCart();
    navigate('/order/track');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#065F46] text-white">
      <div className="flex-1 flex flex-col items-center justify-center px-10 text-center">
        <div className="w-24 h-24 bg-white/10 rounded-[40px] flex items-center justify-center mb-10 border-2 border-white/10 animate-bounce">
          <PartyPopper size={48} className="text-[#10B981]" />
        </div>
        
        <div className="space-y-4 mb-12">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#10B981]">Order Confirmed</span>
          <h2 className="text-4xl font-black leading-tight">Order #AE-1024</h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-[240px] mx-auto">
            Your order has been placed successfully and sent to the stall!
          </p>
        </div>

        <div className="w-full bg-white/5 border border-white/10 rounded-[32px] p-6 space-y-6 mb-12">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <Calendar size={24} className="text-[#10B981]" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-white/40 mb-0.5">Pickup Date</p>
              <h4 className="font-bold">Today, Sept 19</h4>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <Clock size={24} className="text-[#10B981]" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-white/40 mb-0.5">Time Window</p>
              <h4 className="font-bold">09:30 AM - 09:45 AM</h4>
            </div>
          </div>
        </div>

        <div className="w-full space-y-4">
          <Button 
            className="w-full bg-white text-[#065F46] hover:bg-slate-100 h-16 rounded-[24px] text-lg font-black"
            onClick={handleTrack}
          >
            Track Order <ArrowRight size={20} className="ml-3" />
          </Button>
          
          <button className="flex items-center justify-center gap-2 text-sm font-bold text-white/60 hover:text-white transition-colors py-2 w-full">
            <Share2 size={18} /> Share Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
