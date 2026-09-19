import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QrCode, Download, Printer, ArrowLeft, ExternalLink, MapPin } from 'lucide-react';
import { TopBar } from '../../components/navigation/TopBar';
import { Button } from '../../components/ui/Button';
import { formatPrice } from '../../lib/utils';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC]">
      <TopBar showBack title="Digital Receipt" />
      
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {/* Receipt Paper Effect */}
        <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          {/* Receipt Top Header */}
          <div className="bg-[#065F46] p-8 text-center relative">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
              <QrCode size={24} className="text-white" />
            </div>
            <h2 className="text-xl font-black text-white italic">Animo Express</h2>
            <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Official Digital Receipt</p>
            
            {/* Scalloped edge simulation bottom */}
            <div className="absolute -bottom-1 left-0 right-0 flex justify-around">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-[#F8FAFC] rounded-full" />
              ))}
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Order Info */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#94A3B8]">Order ID</p>
                <h4 className="font-bold text-[#0F172A] uppercase">{id}</h4>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#94A3B8]">Date</p>
                <h4 className="font-bold text-[#0F172A]">Sept 19, 2023</h4>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-[#94A3B8]">Vendor</p>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-[#0F172A]">Stall #1 (Vendor Pending)</h4>
                <ExternalLink size={14} className="text-[#065F46]" />
              </div>
              <p className="text-[10px] text-[#64748B] flex items-center gap-1 mt-1">
                <MapPin size={10} /> DLSL Main Canteen, Stall #01
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-dashed border-slate-200" />

            {/* Itemized List */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">
                <span>Items</span>
                <span>Price</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <div className="flex gap-3">
                    <span className="font-black text-[#065F46]">x2</span>
                    <span className="font-bold text-[#0F172A]">Menu Item 1</span>
                  </div>
                  <span className="font-medium text-[#0F172A]">₱150.00</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100" />

            {/* Totals */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#64748B]">Subtotal</span>
                <span className="font-medium text-[#0F172A]">₱150.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#64748B]">Platform Fee</span>
                <span className="font-medium text-[#0F172A]">₱0.00</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-100">
                <span className="font-black text-[#0F172A] uppercase tracking-wider">Total Paid</span>
                <span className="text-xl font-black text-[#065F46]">₱150.00</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-[#F8FAFC] rounded-2xl p-4 flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#94A3B8]">Payment Method</span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-[8px] font-black text-white">G</span>
                </div>
                <span className="text-xs font-bold text-[#0F172A]">GCash Wallet</span>
              </div>
            </div>

            {/* QR Code Placeholder */}
            <div className="py-6 flex flex-col items-center">
              <div className="w-40 h-40 border-4 border-slate-100 rounded-3xl flex items-center justify-center mb-4">
                <QrCode size={100} className="text-[#0F172A]" />
              </div>
              <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.2em]">Scan at counter to pickup</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-14 rounded-2xl border-slate-200">
            <Download size={18} className="mr-2" /> Save PDF
          </Button>
          <Button variant="outline" className="h-14 rounded-2xl border-slate-200">
            <Printer size={18} className="mr-2" /> Print
          </Button>
        </div>
      </div>
    </div>
  );
}
