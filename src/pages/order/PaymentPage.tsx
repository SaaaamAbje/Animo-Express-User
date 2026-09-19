import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Info, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useCartStore } from '../../store/useCartStore';
import { formatPrice } from '../../lib/utils';

export default function PaymentPage() {
  const navigate = useNavigate();
  const total = useCartStore((state) => state.getTotal());
  const [pin, setPin] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(600); // 10 minutes

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInput = (val: string, index: number) => {
    if (!/^\d*$/.test(val)) return;
    const newPin = [...pin];
    newPin[index] = val.slice(-1);
    setPin(newPin);

    // Auto-focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
    
    // Auto-submit when complete
    if (newPin.every(p => p !== '') && index === 3) {
      setTimeout(() => navigate('/payment-status'), 500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0F172A] text-white">
      {/* Header */}
      <div className="px-8 pt-12 flex justify-between items-center mb-12">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-white hover:bg-white/10">
          <X size={24} />
        </Button>
        <div className="bg-white/10 px-4 py-2 rounded-full border border-white/10 backdrop-blur">
          <span className="text-xs font-black uppercase tracking-widest text-blue-400">GCash Secure</span>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="px-8 flex-1 flex flex-col items-center">
        {/* Merchant Info */}
        <div className="text-center mb-12">
          <p className="text-white/60 text-xs font-black uppercase tracking-widest mb-2">Paying to</p>
          <h2 className="text-2xl font-black mb-1">Animo Express (DLSL)</h2>
          <div className="text-4xl font-black tracking-tight mt-4">
            {formatPrice(total)}
          </div>
        </div>

        {/* Timer */}
        <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 flex items-center gap-3 mb-12">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-sm font-bold text-blue-400">Session expires in {formatTime(timer)}</span>
        </div>

        {/* PIN Input */}
        <div className="w-full max-w-xs space-y-8">
          <div className="text-center">
            <h3 className="text-lg font-bold mb-2">Enter 4-Digit PIN</h3>
            <p className="text-white/40 text-xs">Verify your transaction to proceed</p>
          </div>
          
          <div className="flex justify-between gap-4">
            {[0, 1, 2, 3].map((i) => (
              <input
                key={i}
                id={`pin-${i}`}
                type="password"
                maxLength={1}
                inputMode="numeric"
                className="w-16 h-20 bg-white/10 border-2 border-white/10 rounded-2xl text-center text-3xl font-black outline-none transition-all focus:border-blue-500 focus:bg-white/20 focus:ring-4 focus:ring-blue-500/20"
                value={pin[i]}
                onChange={(e) => handleInput(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
              />
            ))}
          </div>
        </div>

        <div className="mt-auto pb-12 w-full max-w-xs text-center">
          <div className="flex items-center justify-center gap-2 text-white/40 mb-8">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-bold uppercase tracking-wider">End-to-End Encrypted Payment</span>
          </div>
          <div className="flex gap-2 items-start p-4 bg-white/5 rounded-2xl border border-white/5">
            <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[10px] leading-relaxed text-white/60 text-left">
              Ensure you have sufficient balance before proceeding. Transaction fees may apply based on your provider.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
