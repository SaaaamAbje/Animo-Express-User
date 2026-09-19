import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, Clock, MapPin } from 'lucide-react';
import { BottomNav } from '../../components/navigation/BottomNav';
import { TopBar } from '../../components/navigation/TopBar';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { MOCK_STALLS, CATEGORIES } from '../../lib/data';
import { useAuthStore } from '../../store/useAuthStore';

export default function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredStalls = MOCK_STALLS.filter(stall => {
    const matchesCategory = activeCategory === 'All' || stall.category === activeCategory;
    const matchesSearch = stall.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC]">
      <TopBar showCart />
      
      <div className="flex-1 overflow-y-auto pb-6">
        {/* Hero Section */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">👋</span>
            <h2 className="text-xl font-black text-[#0F172A]">Animo, {user?.fullName.split(' ')[0]}!</h2>
          </div>
          <p className="text-[#64748B] text-sm flex items-center gap-1.5">
            <MapPin size={14} className="text-[#065F46]" /> DLSL Campus Canteen
          </p>
        </div>

        {/* Search */}
        <div className="px-6 mb-6">
          <div className="flex gap-3">
            <Input
              placeholder="Search stalls or food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search size={20} />}
              className="bg-slate-100 border-none"
            />
            <button className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-[#065F46] shrink-0 active:scale-95 transition-transform">
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="px-6 flex justify-between items-end mb-4">
            <h3 className="text-lg font-bold text-[#0F172A]">Categories</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto px-6 no-scrollbar pb-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-[#065F46] text-white shadow-lg shadow-[#065F46]/20'
                    : 'bg-white text-[#64748B] border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stall List */}
        <div className="px-6 space-y-6">
          <div className="flex justify-between items-end">
            <h3 className="text-lg font-bold text-[#0F172A]">Food Stalls</h3>
            <span className="text-xs font-bold text-[#065F46]">View All</span>
          </div>
          
          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-4 flex gap-4 border border-slate-100 shadow-sm">
                  <Skeleton className="w-24 h-24 rounded-2xl shrink-0" />
                  <div className="flex-1 flex flex-col justify-center py-1">
                    <div className="flex justify-between items-start mb-2">
                      <Skeleton className="h-5 w-3/4 rounded-lg" />
                      <Skeleton className="h-5 w-12 rounded-full" />
                    </div>
                    <Skeleton className="h-3 w-1/2 rounded-lg mb-4" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-12 rounded-lg" />
                      <Skeleton className="h-4 w-16 rounded-lg" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              filteredStalls.map((stall) => (
                <div
                  key={stall.id}
                  onClick={() => navigate(`/stall/${stall.id}`)}
                  className="bg-white rounded-3xl p-4 flex gap-4 border border-slate-100 shadow-sm active:scale-[0.98] transition-all"
                >
                  <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0">
                    <div className="w-10 h-10 border-2 border-slate-200 rounded-lg" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center py-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-[#0F172A] leading-tight pr-2">{stall.name}</h4>
                      <Badge variant={stall.status === 'OPEN' ? 'success' : 'warning'}>
                        {stall.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#64748B] mb-3">{stall.category}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-[#F59E0B] fill-[#F59E0B]" />
                        <span className="text-xs font-bold text-[#0F172A]">{stall.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} className="text-[#94A3B8]" />
                        <span className="text-xs font-medium text-[#64748B]">{stall.estimatedTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
