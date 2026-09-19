import React from 'react';
import { Bell, CheckCircle2, ChefHat, ShoppingBag, Clock } from 'lucide-react';
import { TopBar } from '../../components/navigation/TopBar';
import { BottomNav } from '../../components/navigation/BottomNav';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../lib/api';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        const data = await api.notifications.getByUser(user.id);
        const formatted = data.map((n: any) => ({
          ...n,
          icon: n.type === 'READY' ? Bell : n.type === 'PREPARING' ? ChefHat : CheckCircle2,
          color: n.type === 'READY' ? 'bg-[#D1FAE5] text-[#065F46]' : n.type === 'PREPARING' ? 'bg-[#FEF3C7] text-[#D97706]' : 'bg-blue-100 text-blue-700',
          time: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
        setNotifications(formatted);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, [user]);

  const markAllAsRead = async () => {
    try {
      await Promise.all(notifications.filter(n => !n.isRead).map(n => api.notifications.markAsRead(n.id)));
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC]">
      <TopBar title="Alerts" />
      
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-4 flex justify-between items-center">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#94A3B8]">Recent Activity</h3>
          <button onClick={markAllAsRead} className="text-xs font-bold text-[#065F46]">Mark all read</button>
        </div>

        <div className="space-y-1">
          {isLoading ? (
            <div className="px-6 py-10 text-center text-[#64748B]">Loading alerts...</div>
          ) : notifications.length > 0 ? (
            notifications.map((note) => (
              <div 
                key={note.id}
                onClick={async () => {
                  if (!note.isRead) await api.notifications.markAsRead(note.id);
                  navigate('/order-history');
                }}
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
            ))
          ) : (
            <div className="px-6 py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-[32px] flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Bell size={32} />
              </div>
              <p className="text-[#64748B] text-sm font-medium">No alerts yet</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
