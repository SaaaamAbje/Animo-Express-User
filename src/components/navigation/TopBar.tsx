import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCartStore } from '../../store/useCartStore';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  showCart?: boolean;
  transparent?: boolean;
}

export function TopBar({ title, showBack, showCart, transparent }: TopBarProps) {
  const navigate = useNavigate();
  const cartItemsCount = useCartStore((state) => state.items.length);

  return (
    <div className={`h-16 flex items-center justify-between px-6 shrink-0 z-40 transition-colors ${transparent ? 'bg-transparent' : 'bg-white border-b border-slate-100'}`}>
      <div className="flex items-center gap-4">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="-ml-2 hover:bg-slate-50"
          >
            <ChevronLeft size={24} className="text-[#0F172A]" />
          </Button>
        )}
        {title && <h1 className="text-lg font-bold text-[#0F172A]">{title}</h1>}
      </div>

      <div className="flex items-center">
        {showCart && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/cart')}
            className="relative"
          >
            <ShoppingCart size={22} className="text-[#0F172A]" />
            {cartItemsCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-[#F59E0B] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {cartItemsCount}
              </span>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
