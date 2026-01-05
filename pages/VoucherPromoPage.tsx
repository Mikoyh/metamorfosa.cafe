
import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Gift, Percent, ChevronRight, Info, Trophy } from 'lucide-react';
import { VOUCHER_DATA } from '../constants';
import { Page, User, Voucher } from '../types';

const MotionDiv = motion.div as any;

interface VoucherPromoPageProps {
  user: User;
  setPage: (page: Page) => void;
  onRedeemVoucher: (voucher: Voucher) => void;
}

const VoucherPromoPage: React.FC<VoucherPromoPageProps> = ({ user, setPage, onRedeemVoucher }) => {
  return (
    <div className="pt-24 pb-32 px-6 min-h-screen bg-slate-50">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-[#1b4332] mb-2">Voucher & Promo</h2>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Klaim keuntungan spesialmu!</p>
        <div className="mt-4 inline-flex items-center gap-2 text-lg font-bold bg-amber-100 text-amber-800 px-4 py-2 rounded-full">
          <Trophy size={20} />
          <span>{user.gold} Gold</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Highlight Section */}
        <div 
          onClick={() => setPage('menu')} 
          className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-[2.5rem] p-8 text-white shadow-xl shadow-amber-900/20 relative overflow-hidden cursor-pointer active:scale-95 transition-transform"
        >
          <Gift className="absolute -bottom-4 -right-4 w-32 h-32 opacity-20 rotate-12" />
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-2 uppercase">Spesial Merdeka!</h3>
            <p className="text-sm opacity-90 font-medium mb-6">Nikmati diskon s/d 50% untuk semua varian Waffle setiap jam 17:00 - 19:00.</p>
            <button className="bg-white text-orange-600 px-6 py-3 rounded-2xl font-black text-xs uppercase shadow-lg">Lihat Menu Waffle</button>
          </div>
        </div>

        {/* Voucher List */}
        <section>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Tukar Gold-mu!</h3>
          <div className="space-y-4">
            {VOUCHER_DATA.map((voucher, i) => {
              const hasVoucher = user.vouchers.some(v => v.id === voucher.id);
              const canAfford = user.gold >= voucher.costInGold;

              return (
                <MotionDiv 
                  key={voucher.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-green-50 text-[#1b4332] rounded-2xl flex items-center justify-center">
                      <Ticket size={24} strokeWidth={3} />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 leading-tight">{voucher.title}</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">{voucher.description}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onRedeemVoucher(voucher)}
                    disabled={hasVoucher || !canAfford}
                    className="bg-[#1b4332] text-white text-xs font-bold px-4 py-2.5 rounded-lg disabled:bg-slate-200 disabled:text-slate-500 flex items-center gap-1.5 active:scale-95 transition-transform min-w-[120px] justify-center"
                  >
                    {hasVoucher ? (
                      'DIMILIKI'
                    ) : canAfford ? (
                      <>
                        <Trophy size={12} /> TUKAR {voucher.costInGold}
                      </>
                    ) : (
                      'GOLD TDK CUKUP'
                    )}
                  </button>
                </MotionDiv>
              )
            })}
          </div>
        </section>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-5 flex gap-4">
          <Info className="text-blue-500 shrink-0" size={20} />
          <p className="text-xs text-blue-800 font-medium leading-relaxed">
            Voucher hanya dapat digunakan satu kali per transaksi. Gold yang sudah ditukarkan tidak dapat dikembalikan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoucherPromoPage;
