import React from 'react';
import { Bell, CheckCircle2, ChefHat, ShoppingBag, Clock } from 'lucide-react';
import { TopBar } from '../../components/navigation/TopBar';
import { BottomNav } from '../../components/navigation/BottomNav';
import { useNavigate } from 'react-router-dom';

export default function NotificationsPage() {
  const navigate = useNavigate();
  
  const notifications = [
    {
      id: '1',
      title: 'Order Ready!',
      message: 'Your order #AE-1024 from Stall #1 is ready for pickup. Head to the counter now!',
      time: '2 mins ago',
      type: 'READY',
      icon: Bell,
      color: 'bg-[#D1FAE5] text-[#065F46]',
      isRead: false
    },
    {
      id: '2',
      title: 'Preparing Order',
      message: 'Stall #1 has started preparing your order. Stay tuned!',
      time: '15 mins ago',
      type: 'PREPARING',
      icon: ChefHat,
      color: 'bg-[#FEF3C7] text-[#D97706]',
      isRead: true
    },
    {
      id: '3',
      title: 'Payment Confirmed',
      message: 'Your payment for #AE-1024 was successful. Order is being processed.',
      time: '20 mins ago',
      type: 'CONFIRMED',
      icon: CheckCircle2,
      color: 'bg-blue-100 text-blue-700',
      isRead: true
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC]">
      <TopBar title="Alerts" />
      
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-4 flex justify-between items-center">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#94A3B8]">Recent Activity</h3>
          <button className="text-xs font-bold text-[#065F46]">Mark all read</button>
        </div>

        <div className="space-y-1">
          {notifications.map((note) => (
            <div 
              key={note.id}
              onClick={() => navigate('/order/track')}
              className={`px-6 py-5 flex gap-4 border-b border-slate-50 transition-colors active:bg-slate-50 ${!note.isRead ? 'bg-white' : 'bg-transparent'}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${note.color}`}>
                <note.icon size={22} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-[#0F172A] text-sm">{note.title}</h4>
                  <span className="text-[10px] font-medium text-[#94A3B8]">{note.time}</span>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2">
                  {note.message}
                </p>
                {!note.isRead && (
                  <div className="w-2 h-2 bg-[#065F46] rounded-full mt-3" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
