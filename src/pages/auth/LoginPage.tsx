import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, GraduationCap } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/useAuthStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      login({
        id: 'user-1',
        studentId: '2023-00123',
        fullName: 'Juan Dela Cruz',
        email: email || 'juan.delacruz@dlsl.edu.ph',
        phone: '09123456789',
        degreeProgram: 'BS Information Technology',
        yearLevel: '3rd Year',
      });
      setIsLoading(false);
      navigate('/home');
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col px-8 pt-12 pb-8 bg-white">
      <div className="flex flex-col items-center mb-10">
        <div className="w-20 h-20 bg-[#D1FAE5] rounded-[24px] flex items-center justify-center mb-4 border-2 border-[#065F46]/10">
          <GraduationCap size={40} className="text-[#065F46]" />
        </div>
        <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Animo Express</h1>
        <p className="text-[#64748B] text-sm mt-1">Student Canteen Portal</p>
      </div>

      <div className="space-y-6 flex-1">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">Welcome Back</h2>
          <p className="text-[#64748B] text-sm">Log in with your DLSL institutional account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="DLSL Email"
            placeholder="juan.delacruz@dlsl.edu.ph"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail size={20} />}
            required
          />
          <Input
            label="Password"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock size={20} />}
            required
          />
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm font-semibold text-[#065F46] hover:underline">
              Forgot Password?
            </Link>
          </div>
          <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
            Sign In <LogIn size={18} className="ml-2" />
          </Button>
        </form>
      </div>

      <div className="mt-8 text-center">
        <p className="text-[#64748B] text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#065F46] font-bold hover:underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
}
