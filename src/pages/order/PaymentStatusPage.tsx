import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function PaymentStatusPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'LOADING' | 'SUCCESS' | 'FAILED'>('LOADING');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('SUCCESS');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    setStatus('LOADING');
    setTimeout(() => setStatus('FAILED'), 2000);
  };

  const handleContinue = () => {
    navigate('/order/confirmation');
  };

  return (
    <div className="flex-1 flex flex-col bg-white px-8 pt-20 pb-12">
      <div className="flex-1 flex flex-col items-center justify-center">
        {status === 'LOADING' && (
          <div className="text-center animate-in fade-in duration-500">
            <div className="relative mb-8">
              <Loader2 size={80} className="text-[#065F46] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-[#D1FAE5] rounded-full" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-[#0F172A] mb-2">Verifying Payment</h2>
            <p className="text-[#64748B] text-sm leading-relaxed max-w-[240px]">
              Talking to your bank. Please do not close the app or refresh.
            </p>
          </div>
        )}

        {status === 'SUCCESS' && (
          <div className="text-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-[#D1FAE5] rounded-[40px] flex items-center justify-center mb-8 mx-auto shadow-xl shadow-[#065F46]/10">
              <CheckCircle2 size={48} className="text-[#065F46]" />
            </div>
            <h2 className="text-2xl font-black text-[#0F172A] mb-2">Payment Received</h2>
            <p className="text-[#64748B] text-sm leading-relaxed mb-12">
              Your transaction was successful. <br/> Redirecting to your receipt...
            </p>
            <Button onClick={handleContinue} className="w-full">
              Finish Transaction
            </Button>
          </div>
        )}

        {status === 'FAILED' && (
          <div className="text-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-red-100 rounded-[40px] flex items-center justify-center mb-8 mx-auto shadow-xl shadow-red-500/10">
              <XCircle size={48} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-[#0F172A] mb-2">Payment Failed</h2>
            <p className="text-[#64748B] text-sm leading-relaxed mb-12">
              Insufficient balance or transaction timeout. Please try again.
            </p>
            <div className="space-y-4 w-full">
              <Button onClick={handleRetry} className="w-full">
                Try Again
              </Button>
              <Button variant="ghost" onClick={() => navigate('/checkout')} className="w-full text-[#64748B] font-bold">
                Change Payment Method
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Simulation Toggle */}
      <div className="mt-auto">
        <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
          <div className="flex items-center gap-3">
            <AlertCircle size={18} className="text-[#94A3B8]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Dev Simulation</span>
          </div>
          <button 
            onClick={() => setStatus(status === 'FAILED' ? 'LOADING' : 'FAILED')}
            className={`w-12 h-6 rounded-full transition-colors relative ${status === 'FAILED' ? 'bg-red-500' : 'bg-slate-200'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${status === 'FAILED' ? 'right-1' : 'left-1'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
