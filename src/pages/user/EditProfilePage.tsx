import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Phone, BookOpen, GraduationCap, ArrowLeft, Save, Info } from 'lucide-react';
import { TopBar } from '../../components/navigation/TopBar';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/useAuthStore';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    phone: user?.phone || '',
    degreeProgram: user?.degreeProgram || '',
    yearLevel: user?.yearLevel || '',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      updateUser(formData);
      setIsLoading(false);
      navigate(-1);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC]">
      <TopBar showBack title="Edit Profile" />
      
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="mb-10 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-[24px] flex items-center justify-center mx-auto mb-4 border-2 border-slate-200">
             <span className="text-2xl font-black text-slate-400 uppercase">
                {user?.fullName.split(' ').map(n => n[0]).join('')}
              </span>
          </div>
          <h3 className="text-lg font-bold text-[#0F172A]">{user?.fullName}</h3>
          <p className="text-xs text-[#64748B]">Member since 2023</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-[#94A3B8] ml-1">Read-Only Information</h4>
            <Input
              label="Student ID"
              value={user?.studentId}
              readOnly
              disabled
              leftIcon={<Lock size={18} />}
              className="bg-slate-50 border-dashed text-slate-400"
            />
            <Input
              label="Institutional Email"
              value={user?.email}
              readOnly
              disabled
              leftIcon={<Lock size={18} />}
              className="bg-slate-50 border-dashed text-slate-400"
            />
            <div className="flex gap-2 items-start p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed text-blue-600">
                Student ID and Email are managed by DLSL Registrar and cannot be changed here.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-[#94A3B8] ml-1">Editable Fields</h4>
            <Input
              label="Mobile Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              leftIcon={<Phone size={18} />}
            />
            <Input
              label="Degree Program"
              value={formData.degreeProgram}
              onChange={(e) => setFormData({ ...formData, degreeProgram: e.target.value })}
              leftIcon={<BookOpen size={18} />}
            />
            <Input
              label="Year Level"
              value={formData.yearLevel}
              onChange={(e) => setFormData({ ...formData, yearLevel: e.target.value })}
              leftIcon={<GraduationCap size={18} />}
            />
          </div>

          <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
            Save Changes <Save size={18} className="ml-2" />
          </Button>
        </form>
      </div>
    </div>
  );
}
