import React, { useState, useEffect } from 'react';
import { Home, ClipboardList, Bell, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';

export function BottomNav() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const eventSource = new EventSource('/api/notifications/stream');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setUnreadCount(data.unreadCount);
    };

    eventSource.onerror = (err) => {
      console.error('SSE Error (notifications):', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: ClipboardList, label: 'Orders', path: '/orders' },
    { icon: Bell, label: 'Alerts', path: '/notifications', badge: unreadCount },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="h-20 bg-white border-t border-[#E2E8F0] flex justify-around items-center px-6 shrink-0 z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }: { isActive: boolean }) =>
            cn(
              'flex flex-col items-center gap-1.5 transition-colors relative',
              isActive ? 'text-[#065F46]' : 'text-[#94A3B8]'
            )
          }
        >
          {({ isActive }: { isActive: boolean }) => (
            <>
              <div className="relative">
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className={cn('text-[10px] font-bold uppercase tracking-tight')}>
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
