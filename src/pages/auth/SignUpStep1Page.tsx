import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Phone, BookOpen, Hash, ArrowRight, GraduationCap } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function SignUpStep1Page() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    degreeProgram: '',
    yearLevel: '',
    phone: '',
  });

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, save to state and navigate
    navigate('/signup/password');
  };

  return (
    <div className="flex-1 flex flex-col px-8 pt-10 pb-8 bg-white">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-6 bg-[#065F46] rounded-full" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#065F46]">Step 1 of 2</span>
        </div>
        <h2 className="text-2xl font-black text-[#0F172A] leading-tight">Student Information</h2>
        <p className="text-[#64748B] text-sm mt-1">Provide your DLSL academic details</p>
      </div>

      <form onSubmit={handleNext} className="space-y-4 flex-1">
        <Input
          label="Student ID Number"
          placeholder="2023-XXXXX"
          value={formData.studentId}
          onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
          leftIcon={<Hash size={20} />}
          required
        />
        <Input
          label="Full Name"
          placeholder="Juan Dela Cruz"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          leftIcon={<User size={20} />}
          required
        />
        <Input
          label="Degree Program"
          placeholder="e.g. BS Computer Science"
          value={formData.degreeProgram}
          onChange={(e) => setFormData({ ...formData, degreeProgram: e.target.value })}
          leftIcon={<BookOpen size={20} />}
          required
        />
        <Input
          label="Year Level"
          placeholder="e.g. 1st Year"
          value={formData.yearLevel}
          onChange={(e) => setFormData({ ...formData, yearLevel: e.target.value })}
          leftIcon={<GraduationCap size={20} />}
          required
        />
        <Input
          label="Mobile Phone"
          placeholder="09XXXXXXXXX"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          leftIcon={<Phone size={20} />}
          required
        />
        
        <Button type="submit" className="w-full mt-6">
          Continue <ArrowRight size={18} className="ml-2" />
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-[#64748B] text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-[#065F46] font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
