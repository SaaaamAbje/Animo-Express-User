import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col px-8 pt-10 pb-8 bg-white">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => navigate('/login')} 
        className="-ml-2 mb-6"
      >
        <ArrowLeft size={24} className="text-[#0F172A]" />
      </Button>

      <div className="mb-10">
        <h2 className="text-2xl font-black text-[#0F172A] leading-tight">Reset Password</h2>
        <p className="text-[#64748B] text-sm mt-1">We'll send a recovery link to your DLSL email</p>
      </div>

      {!isSent ? (
        <form onSubmit={handleReset} className="space-y-6 flex-1">
          <Input
            label="DLSL Email Address"
            placeholder="juan.delacruz@dlsl.edu.ph"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail size={20} />}
            required
          />
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Send Reset Link <Send size={18} className="ml-2" />
          </Button>
        </form>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center -mt-20">
          <div className="w-20 h-20 bg-[#D1FAE5] rounded-[32px] flex items-center justify-center mb-6">
            <Send size={40} className="text-[#065F46]" />
          </div>
          <h3 className="text-xl font-bold text-[#0F172A] mb-2">Check Your Email</h3>
          <p className="text-[#64748B] text-sm leading-relaxed mb-10">
            We've sent a password reset link to <br/>
            <strong>{email}</strong>. Please check your inbox.
          </p>
          <Button onClick={() => navigate('/login')} className="w-full">
            Back to Login
          </Button>
          <button 
            onClick={() => setIsSent(false)}
            className="mt-6 text-sm font-bold text-[#065F46] hover:underline"
          >
            Resend Email
          </button>
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-[#64748B] text-sm">
          Need help? <Link to="#" className="text-[#065F46] font-bold hover:underline">Contact Support</Link>
        </p>
      </div>
    </div>
  );
}
