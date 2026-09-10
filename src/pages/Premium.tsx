import React, { useState } from 'react';
import { Crown, CheckCircle2, Zap } from 'lucide-react';
import { PremiumStatus, UserWallet } from '../types';

interface PremiumProps {
  premium: PremiumStatus | null;
  wallet: UserWallet | null;
  onBuyPlan: (plan: 'weekly' | 'monthly' | 'yearly', price: number, days: number) => Promise<void>;
}

export const Premium: React.FC<PremiumProps> = ({ premium, wallet, onBuyPlan }) => {
  const [selectedPlan, setSelectedPlan] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);

  const isPro = premium?.active && (premium?.expiresAt || 0) > Date.now();

  const plans: Record<'weekly' | 'monthly' | 'yearly', { name: string; price: number; days: number; popular?: boolean }> = {
    weekly: { name: 'Weekly Pass', price: 49, days: 7 },
    monthly: { name: 'Monthly Pass', price: 149, days: 30, popular: true },
    yearly: { name: 'Yearly Pass', price: 500, days: 365 },
  };

  const handleBuy = async () => {
    const plan = plans[selectedPlan];
    if ((wallet?.balance || 0) < plan.price) {
      alert(`Insufficient balance. Required: ₹${plan.price}, Available: ₹${wallet?.balance || 0}. Please add cash in your wallet.`);
      return;
    }
    setLoading(true);
    try {
      await onBuyPlan(selectedPlan, plan.price, plan.days);
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    'Zero commission fee on tournament winnings',
    'Permission to host and organize custom tournaments',
    'VIP Golden Crown badge displayed next to your player name',
    'Priority entry in high prize pool scrims',
    '24/7 dedicated dispute and support escalation',
  ];

  return (
    <div className="page active" id="premiumPage">
      <div className="section-title">
        <span>BattleZone Premium</span>
      </div>

      {isPro ? (
        <div
          className="p-5 rounded-2xl mb-6 text-center border"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 107, 107, 0.15))',
            borderColor: 'var(--warning)',
          }}
        >
          <div className="w-16 h-16 rounded-full bg-warning/20 border border-warning/40 flex items-center justify-center mx-auto mb-3">
            <Crown className="w-8 h-8 text-warning" />
          </div>
          <h2 className="text-xl font-black text-warning mb-1">VIP PASS ACTIVE</h2>
          <p className="text-xs text-gray-300 mb-4">
            Expires on{' '}
            {new Date(premium?.expiresAt || 0).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>

          <div className="text-left bg-black/30 rounded-xl p-4 border border-white/10 mb-2">
            <h4 className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Active Privileges</h4>
            {benefits.map((b, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-gray-200 mb-2">
                <CheckCircle2 className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div
            className="p-5 rounded-2xl mb-6 border"
            style={{
              background: 'linear-gradient(135deg, rgba(233, 69, 96, 0.15), rgba(74, 144, 226, 0.15))',
              borderColor: 'var(--primary)',
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
                <Crown className="w-6 h-6 text-warning" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">Upgrade to Premium</h3>
                <p className="text-xs text-gray-400">Unlock custom hosting, zero fees, and VIP status</p>
              </div>
            </div>

            <div className="space-y-2 mt-4 pt-3 border-t border-white/10">
              {benefits.map((b, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {(Object.entries(plans) as [keyof typeof plans, typeof plans['weekly']][]).map(
              ([key, plan]) => (
                <div
                  key={key}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedPlan === key
                      ? 'border-primary bg-primary/10 shadow-lg'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                  onClick={() => setSelectedPlan(key)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPlan === key ? 'border-primary' : 'border-gray-500'
                      }`}
                    >
                      {selectedPlan === key && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{plan.name}</span>
                        {plan.popular && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-warning text-black">
                            Best Value
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">{plan.days} Days Validity</span>
                    </div>
                  </div>
                  <div className="font-mono font-extrabold text-lg text-white">₹{plan.price}</div>
                </div>
              )
            )}
          </div>

          <button className="btn btn-primary" onClick={handleBuy} disabled={loading}>
            {loading ? (
              <div className="spinner" />
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" />
                <span>Activate for ₹{plans[selectedPlan].price}</span>
              </div>
            )}
          </button>
        </>
      )}
    </div>
  );
};
