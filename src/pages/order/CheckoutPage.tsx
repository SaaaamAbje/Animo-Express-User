import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, CreditCard, ChevronRight, Wallet, Banknote } from 'lucide-react';
import { TopBar } from '../../components/navigation/TopBar';
import { Button } from '../../components/ui/Button';
import { useCartStore } from '../../store/useCartStore';
import { formatPrice, cn } from '../../lib/utils';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, stall, getTotal } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<'GCASH' | 'MAYA' | 'CASH'>('GCASH');

  const methods = [
    { id: 'GCASH', name: 'GCash', icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'MAYA', name: 'Maya', icon: CreditCard, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'CASH', name: 'Cash on Pickup', icon: Banknote, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC]">
      <TopBar showBack title="Checkout" />
      
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
        {/* Order Summary Header */}
        <div>
          <h2 className="text-2xl font-black text-[#0F172A] mb-1">Final Review</h2>
          <p className="text-[#64748B] text-sm">Please check your order details</p>
        </div>

        {/* Pickup Details */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-[#D1FAE5] flex items-center justify-center shrink-0">
              <MapPin size={20} className="text-[#065F46]" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-[#94A3B8] mb-0.5">Location</p>
              <h4 className="font-bold text-[#0F172A]">{stall?.name}</h4>
              <p className="text-xs text-[#64748B]">DLSL Main Canteen, Ground Floor</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 pt-4 border-t border-slate-50">
            <div className="w-10 h-10 rounded-2xl bg-[#FEF3C7] flex items-center justify-center shrink-0">
              <Clock size={20} className="text-[#F59E0B]" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-[#94A3B8] mb-0.5">Pickup Time</p>
              <h4 className="font-bold text-[#0F172A]">09:30 AM - 09:45 AM</h4>
              <p className="text-xs text-[#64748B]">Today, Sept 19, 2023</p>
            </div>
          </div>
        </div>

        {/* Item Review */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-black text-[#0F172A] text-sm uppercase tracking-wider">Order Items</h3>
            <span className="text-xs font-bold text-[#065F46]">{items.length} items</span>
          </div>
          <div className="px-6 py-4 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <span className="font-black text-[#065F46] w-6">x{item.quantity}</span>
                  <span className="font-bold text-[#0F172A]">{item.name}</span>
                </div>
                <span className="font-medium text-[#64748B]">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
            <span className="text-sm font-bold text-[#0F172A]">Subtotal</span>
            <span className="text-lg font-black text-[#0F172A]">{formatPrice(getTotal())}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-4">
          <h3 className="font-black text-[#0F172A] text-sm uppercase tracking-wider ml-1">Payment Method</h3>
          <div className="space-y-3">
            {methods.map((method) => {
              const isSelected = paymentMethod === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={cn(
                    'w-full bg-white rounded-3xl p-5 border-2 transition-all flex items-center justify-between active:scale-[0.99]',
                    isSelected ? 'border-[#065F46] shadow-md' : 'border-slate-100'
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center', method.bg, method.color)}>
                      <method.icon size={24} />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-[#0F172A]">{method.name}</h4>
                      <p className="text-xs text-[#64748B]">{method.id === 'CASH' ? 'Pay at stall counter' : 'E-wallet transaction'}</p>
                    </div>
                  </div>
                  <div className={cn(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                    isSelected ? 'border-[#065F46] bg-[#065F46]' : 'border-slate-200'
                  )}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-6 bg-white border-t border-slate-100">
        <Button 
          className="w-full h-16 rounded-[24px] text-lg font-black shadow-lg"
          onClick={() => navigate('/payment')}
        >
          Pay {formatPrice(getTotal())}
        </Button>
      </div>
    </div>
  );
}
