import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Check, ChefHat, ShoppingBag, XCircle, ArrowLeft, MoreHorizontal } from 'lucide-react';
import { TopBar } from '../../components/navigation/TopBar';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { cn } from '../../lib/utils';

type TrackStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED';

export default function OrderTrackingPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<TrackStatus>('PENDING');
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const steps = [
    { id: 'PENDING', label: 'Order Sent', icon: ShoppingBag },
    { id: 'CONFIRMED', label: 'Confirmed', icon: Check },
    { id: 'PREPARING', label: 'Preparing', icon: ChefHat },
    { id: 'READY', label: 'Ready for Pickup', icon: BellIcon },
    { id: 'COMPLETED', label: 'Completed', icon: CheckCircleIcon },
  ];

  // Map icons manually as some aren't imported or exist
  function BellIcon(props: any) { return <Clock {...props} /> }
  function CheckCircleIcon(props: any) { return <Check {...props} /> }

  const currentIndex = steps.findIndex(s => s.id === status);

  // Auto-advance for simulation
  useEffect(() => {
    if (status === 'COMPLETED') return;
    const timer = setTimeout(() => {
      const nextIndex = currentIndex + 1;
      if (steps[nextIndex]) {
        setStatus(steps[nextIndex].id as TrackStatus);
      }
    }, 10000); // 10s per step for demo
    return () => clearTimeout(timer);
  }, [status]);

  const canCancel = status === 'PENDING' || status === 'CONFIRMED';

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC]">
      <TopBar showBack title="Track Order" />
      
      <div className="flex-1 overflow-y-auto px-8 py-8">
        {/* Stall Info Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-20 h-20 bg-white rounded-[32px] border border-slate-100 flex items-center justify-center mb-4 shadow-sm">
            <ChefHat size={32} className="text-[#065F46]" />
          </div>
          <h2 className="text-xl font-black text-[#0F172A] mb-1">Stall #1 (Vendor Pending)</h2>
          <p className="text-[#64748B] text-xs font-bold uppercase tracking-widest">Order #AE-1024</p>
        </div>

        {/* Stepper */}
        <div className="relative space-y-10">
          {/* Vertical Line */}
          <div className="absolute left-[21px] top-4 bottom-4 w-0.5 bg-slate-100" />
          
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            
            return (
              <div key={step.id} className="flex items-center gap-6 relative">
                {/* Step Circle */}
                <div className={cn(
                  'w-11 h-11 rounded-full flex items-center justify-center z-10 transition-all duration-500',
                  isCompleted ? 'bg-[#D1FAE5] text-[#065F46] border-2 border-[#065F46]' : 
                  isCurrent ? 'bg-[#065F46] text-white border-[6px] border-[#D1FAE5] shadow-lg shadow-[#065F46]/20' : 
                  'bg-white text-slate-300 border-2 border-slate-100'
                )}>
                  <step.icon size={isCurrent ? 18 : 20} strokeWidth={isCurrent ? 3 : 2} />
                </div>
                
                <div className="flex-1">
                  <h4 className={cn(
                    'font-bold transition-all',
                    isCurrent ? 'text-lg text-[#0F172A]' : 'text-sm text-[#94A3B8]',
                    isCompleted && 'text-[#065F46]'
                  )}>
                    {step.label}
                  </h4>
                  {isCurrent && (
                    <p className="text-xs text-[#64748B] mt-1">
                      {status === 'PREPARING' ? 'The stall is cooking your meal.' : 
                       status === 'READY' ? 'Your food is hot and waiting at the counter!' : 
                       'Please wait while we process.'}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Status Card */}
        {status === 'READY' && (
          <div className="mt-12 p-6 bg-[#065F46] rounded-[32px] text-white shadow-xl shadow-[#065F46]/20 animate-in zoom-in-95 duration-500">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Check size={20} className="text-[#10B981]" />
                </div>
                <h3 className="text-lg font-black italic">Hooray!</h3>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">Pick up now</span>
            </div>
            <p className="text-sm text-white/80 leading-relaxed mb-6">
              Present your <strong>Digital Receipt</strong> or Order ID <strong>#AE-1024</strong> at the stall counter.
            </p>
            <Button 
              className="w-full bg-white text-[#065F46] hover:bg-slate-100"
              onClick={() => navigate('/order-details/ae-1024')}
            >
              Show Receipt
            </Button>
          </div>
        )}

        {/* Cancellation Notice */}
        {status === 'PREPARING' && (
          <div className="mt-12 flex gap-4 p-5 bg-slate-50 border border-slate-100 rounded-3xl">
            <XCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-[#64748B] leading-relaxed">
              Order cancellation is locked. The stall has already started preparing your food.
            </p>
          </div>
        )}
      </div>

      {/* Cancel Action */}
      {canCancel && (
        <div className="p-6 bg-white border-t border-slate-100">
          <Button 
            variant="ghost" 
            className="w-full h-14 rounded-2xl text-red-500 font-bold bg-red-50 hover:bg-red-100"
            onClick={() => setIsCancelModalOpen(true)}
          >
            Cancel Order
          </Button>
        </div>
      )}

      {/* Cancel Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancel Order?"
        footer={
          <>
            <Button variant="ghost" className="flex-1" onClick={() => setIsCancelModalOpen(false)}>No, Keep It</Button>
            <Button variant="danger" className="flex-1" onClick={() => {
              setIsCancelModalOpen(false);
              navigate('/home');
            }}>Yes, Cancel</Button>
          </>
        }
      >
        <p className="text-sm text-[#64748B] leading-relaxed">
          Are you sure you want to cancel your order? This action cannot be undone if the vendor has already confirmed.
        </p>
      </Modal>
    </div>
  );
}
