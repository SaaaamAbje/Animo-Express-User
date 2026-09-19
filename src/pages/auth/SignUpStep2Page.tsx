import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ShieldCheck, Check, Info } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function SignUpStep2Page() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const checklist = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains a number', met: /\d/.test(password) },
    { label: 'Contains a symbol', met: /[!@#$%^&*]/.test(password) },
    { label: 'Passwords match', met: password === confirmPassword && password.length > 0 },
  ];

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checklist.every(c => c.met)) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col px-8 pt-10 pb-8 bg-white">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-6 bg-[#065F46] rounded-full" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#065F46]">Step 2 of 2</span>
        </div>
        <h2 className="text-2xl font-black text-[#0F172A] leading-tight">Secure Your Account</h2>
        <p className="text-[#64748B] text-sm mt-1">Create a strong password for ordering</p>
      </div>

      <form onSubmit={handleFinish} className="space-y-6 flex-1">
        <div className="space-y-4">
          <Input
            label="Create Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock size={20} />}
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            leftIcon={<ShieldCheck size={20} />}
            required
          />
        </div>

        <div className="bg-[#F8FAFC] rounded-2xl p-4 space-y-3">
          <h4 className="text-[10px] font-black uppercase tracking-wider text-[#94A3B8] mb-1">Security Checklist</h4>
          {checklist.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${item.met ? 'bg-[#D1FAE5]' : 'bg-slate-200'}`}>
                {item.met && <Check size={12} className="text-[#065F46]" />}
              </div>
              <span className={`text-xs font-medium ${item.met ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-3 items-start p-4 bg-[#FEF3C7] rounded-2xl">
          <Info size={18} className="text-[#92400E] shrink-0 mt-0.5" />
          <p className="text-[10px] leading-relaxed text-[#92400E]">
            By clicking "Complete Registration", you agree to the <strong>DLSL Terms of Service</strong> and <strong>Animo Express Privacy Policy</strong> regarding student data.
          </p>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          isLoading={isLoading}
          disabled={!checklist.every(c => c.met)}
        >
          Complete Registration
        </Button>
      </form>

      <div className="mt-8 text-center">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-[#64748B] font-bold">
          Go Back
        </Button>
      </div>
    </div>
  );
}
