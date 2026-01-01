
import React from 'react';
import { Trophy, Ticket } from 'lucide-react';
import { User, Voucher } from '../types';
import { VOUCHER_DATA } from '../constants';

interface ShopPageProps {
  user: User;
  onRedeemVoucher: (voucher: Voucher) => void;
}

const ShopPage: React.FC<ShopPageProps> = ({ user, onRedeemVoucher }) => {
  return (
    <div className="pt-20 pb-32 p-4 min-h-screen">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Gold Shop</h2>
        <p className="text-sm text-slate-500">Tukarkan Gold-mu dengan hadiah menarik!</p>
        <div className="mt-4 inline-flex items-center gap-2 text-lg font-bold bg-amber-100 text-amber-800 px-4 py-2 rounded-full">
          <Trophy size={20} />
          <span>{user.gold} Gold</span>
        </div>
      </div>

      <div className="space-y-3">
        {VOUCHER_DATA.map(voucher => (
          <div key={voucher.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-amber-100 text-amber-600 rounded-xl"><Ticket size={24} /></div>
              <div>
                <h4 className="font-bold text-slate-800">{voucher.title}</h4>
                <p className="text-xs text-slate-500">{voucher.description}</p>
              </div>
            </div>
            <button
              onClick={() => onRedeemVoucher(voucher)}
              disabled={user.gold < voucher.costInGold || user.vouchers.some(v => v.id === voucher.id)}
              className="bg-[#1b4332] text-white text-xs font-bold px-4 py-2 rounded-lg disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              {user.vouchers.some(v => v.id === voucher.id) ? 'Dimiliki' : `${voucher.costInGold}`}
              {!user.vouchers.some(v => v.id === voucher.id) && <Trophy size={12} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopPage;
