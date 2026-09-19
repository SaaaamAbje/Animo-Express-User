import { Home, ClipboardList, Bell, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';

export function BottomNav() {
  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: ClipboardList, label: 'Orders', path: '/orders' },
    { icon: Bell, label: 'Alerts', path: '/notifications' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="h-20 bg-white border-t border-[#E2E8F0] flex justify-around items-center px-6 shrink-0 z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-1.5 transition-colors',
              isActive ? 'text-[#065F46]' : 'text-[#94A3B8]'
            )
          }
        >
          {({ isActive }) => (
            <>
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
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
