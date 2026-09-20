import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, GraduationCap } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useSession } from '../../components/auth/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await signIn('credentials', { email, password, redirect: false });
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC]">
      {/* Hero Header */}
      <div className="relative h-[45%] w-full overflow-hidden">
        <img 
          src="/image.png" 
          alt="DLSL Campus" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-16 left-8 text-white z-10">
          <h1 className="text-4xl font-black mb-1 drop-shadow-md">Animo Express</h1>
          <div className="flex gap-3 text-[10px] font-bold uppercase tracking-widest opacity-90">
            <span>De La Salle Lipa</span>
            <span className="opacity-50">|</span>
            <span>Student Food Ordering</span>
          </div>
        </div>
      </div>

      {/* Login Card Container */}
      <div className="flex-1 px-4 relative -mt-10 z-20 pb-8">
        <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#0F172A]">Welcome back</h2>
            <p className="text-[#64748B] text-sm mt-0.5">Sign in with your DLSL student credentials</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] ml-1">Student ID or Email</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                  <Mail size={18} />
                </div>
                <input
                  type="text"
                  placeholder="2023-12345"
                  className="w-full h-14 bg-white border border-slate-200 rounded-2xl pl-12 pr-4 text-sm font-medium focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/5 transition-all outline-none"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] ml-1">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  placeholder="••••••••••"
                  className="w-full h-14 bg-white border border-slate-200 rounded-2xl pl-12 pr-4 text-sm font-medium focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/5 transition-all outline-none"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-5 h-5 border-2 border-slate-200 rounded flex items-center justify-center transition-colors group-active:scale-95 bg-[#065F46] border-[#065F46]">
                  <div className="w-2 h-1 border-l-2 border-b-2 border-white -rotate-45 -mt-0.5" />
                </div>
                <span className="text-xs font-bold text-[#64748B]">Keep me signed in</span>
              </label>
              <Link to="/forgot-password" className="text-xs font-bold text-[#065F46] hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 bg-[#10B981] hover:bg-[#059669] text-white rounded-2xl text-base font-bold shadow-lg shadow-[#10B981]/20 mt-2" 
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>
        </div>

        <div className="mt-8 text-center px-8">
          <p className="text-[#64748B] text-xs leading-relaxed">
            New to Animo Express?{' '}
            <Link to="/signup" className="text-[#065F46] font-bold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
