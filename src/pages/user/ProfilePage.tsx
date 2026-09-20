import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Shield, HelpCircle, LogOut, ChevronRight, Edit3, Mail, Hash, BookOpen } from 'lucide-react';
import { TopBar } from '../../components/navigation/TopBar';
import { BottomNav } from '../../components/navigation/BottomNav';
import { Button } from '../../components/ui/Button';
import { useSession } from '../../components/auth/AuthContext';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { data: session, signOut } = useSession();
  const user = session?.user;

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const menuItems = [
    { icon: Shield, label: 'Security & Privacy', path: '#' },
    { icon: HelpCircle, label: 'Help & Support', path: '#' },
    { icon: Settings, label: 'App Settings', path: '#' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC]">
      <TopBar title="Profile" />
      
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {/* Profile Card */}
        <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm mb-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-[#065F46]/5" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-[#065F46] rounded-[32px] flex items-center justify-center mb-4 border-4 border-white shadow-xl">
              <span className="text-3xl font-black text-white uppercase">
                {user?.name?.split(' ').map(n => n[0]).join('') || '?'}
              </span>
            </div>
            <h2 className="text-xl font-black text-[#0F172A] mb-1">{user?.name}</h2>
            <p className="text-xs font-bold text-[#065F46] uppercase tracking-[0.2em] mb-6">DLSL Student</p>
            
            <Button 
              size="sm" 
              variant="outline" 
              className="rounded-full px-5 h-9 text-xs"
              onClick={() => navigate('/edit-profile')}
            >
              <Edit3 size={14} className="mr-2" /> Edit Profile
            </Button>
          </div>
        </div>

        {/* Student Details */}
        <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm mb-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#94A3B8]">
              <Hash size={20} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-[#94A3B8]">Student ID</p>
              <h4 className="font-bold text-[#0F172A]">{user?.studentId}</h4>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#94A3B8]">
              <Mail size={20} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-[#94A3B8]">Institutional Email</p>
              <h4 className="font-bold text-[#0F172A]">{user?.email}</h4>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#94A3B8]">
              <BookOpen size={20} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-[#94A3B8]">Program & Year</p>
              <h4 className="font-bold text-[#0F172A]">{(user as any)?.program || 'N/A'} • {(user as any)?.yearLevel || 'N/A'}</h4>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm mb-8 overflow-hidden">
          {menuItems.map((item, i) => (
            <button 
              key={i}
              className={`w-full px-6 py-5 flex items-center justify-between active:bg-slate-50 transition-colors ${i !== menuItems.length - 1 ? 'border-b border-slate-50' : ''}`}
            >
              <div className="flex items-center gap-4">
                <item.icon size={20} className="text-[#64748B]" />
                <span className="font-bold text-[#334155]">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-[#94A3B8]" />
            </button>
          ))}
        </div>

        <Button 
          variant="ghost" 
          className="w-full text-red-500 font-bold h-14 rounded-2xl bg-red-50 hover:bg-red-100"
          onClick={handleLogout}
        >
          <LogOut size={20} className="mr-3" /> Sign Out
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
