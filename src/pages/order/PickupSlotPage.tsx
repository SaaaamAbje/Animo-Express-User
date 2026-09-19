import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Check, ArrowRight, Info } from 'lucide-react';
import { TopBar } from '../../components/navigation/TopBar';
import { Button } from '../../components/ui/Button';
import { MOCK_PICKUP_SLOTS } from '../../lib/data';
import { cn } from '../../lib/utils';

export default function PickupSlotPage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const dates = ['Today', 'Tomorrow'];

  const handleContinue = () => {
    if (!selectedSlotId) return;
    navigate('/checkout');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC]">
      <TopBar showBack title="Pickup Time" />
      
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-[#0F172A] leading-tight mb-2">When will you pick up?</h2>
          <p className="text-[#64748B] text-sm">Slots have limited capacity for your safety.</p>
        </div>

        {/* Date Selector */}
        <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-8">
          {dates.map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={cn(
                'flex-1 py-3 rounded-xl text-sm font-bold transition-all',
                selectedDate === date 
                  ? 'bg-white text-[#065F46] shadow-sm' 
                  : 'text-[#94A3B8]'
              )}
            >
              {date}
            </button>
          ))}
        </div>

        {/* Slot Grid */}
        <div className="space-y-4">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#334155]">Available Slots</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#065F46]" />
                <span className="text-[10px] font-bold text-[#64748B]">Available</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-slate-300" />
                <span className="text-[10px] font-bold text-[#64748B]">Full</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {MOCK_PICKUP_SLOTS.map((slot) => {
              const isFull = slot.status === 'FULL';
              const isSelected = selectedSlotId === slot.id;
              
              return (
                <button
                  key={slot.id}
                  disabled={isFull}
                  onClick={() => setSelectedSlotId(slot.id)}
                  className={cn(
                    'group relative overflow-hidden bg-white rounded-3xl p-5 border-2 transition-all flex flex-col gap-4 text-left active:scale-[0.98]',
                    isSelected ? 'border-[#065F46] bg-[#D1FAE5]/10' : 'border-slate-100',
                    isFull && 'opacity-50 grayscale pointer-events-none border-dashed'
                  )}
                >
                  <div className="flex justify-between items-center z-10">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                        isSelected ? 'bg-[#065F46] text-white' : 'bg-slate-100 text-[#64748B]'
                      )}>
                        <Clock size={20} />
                      </div>
                      <span className={cn(
                        'font-bold transition-colors',
                        isSelected ? 'text-[#065F46]' : 'text-[#0F172A]'
                      )}>
                        {slot.time}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-[#065F46] flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>

                  {/* Capacity Bar */}
                  <div className="space-y-2 z-10">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-tight">
                      <span className={isSelected ? 'text-[#065F46]' : 'text-[#64748B]'}>Capacity</span>
                      <span className={isSelected ? 'text-[#065F46]' : 'text-[#64748B]'}>{slot.capacity}% {isFull ? 'FULL' : ''}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          isFull ? 'bg-slate-300' : isSelected ? 'bg-[#065F46]' : 'bg-[#10B981]'
                        )}
                        style={{ width: `${slot.capacity}%` }}
                      />
                    </div>
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
          className="w-full h-16 rounded-[24px] text-lg font-black"
          disabled={!selectedSlotId}
          onClick={handleContinue}
        >
          Confirm Pickup Time <ArrowRight size={20} className="ml-3" />
        </Button>
      </div>
    </div>
  );
}
