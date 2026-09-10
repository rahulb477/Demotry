import React, { useState } from 'react';
import { Tag, Sparkles, CheckCircle2 } from 'lucide-react';

interface PromoCodeProps {
  onApplyPromo: (code: string) => Promise<boolean>;
}

export const PromoCode: React.FC<PromoCodeProps> = ({ onApplyPromo }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    try {
      const ok = await onApplyPromo(code.trim().toUpperCase());
      if (ok) {
        setCode('');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page active" id="promoCodePage">
      <div className="section-title">
        <span>Redeem Promo Code</span>
      </div>

      <div className="p-5 rounded-2xl mb-6 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="w-14 h-14 rounded-2xl bg-success/20 border border-success/40 flex items-center justify-center mx-auto mb-3">
          <Tag className="w-7 h-7 text-success" />
        </div>
        <h3 className="font-extrabold text-base text-center text-white mb-1">Enter Your Promo Code</h3>
        <p className="text-xs text-center text-gray-400 mb-5">
          Redeem coupons and promotional vouchers for instant bonus balance.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <input
              type="text"
              className="form-input text-center font-mono font-extrabold uppercase text-lg tracking-widest"
              placeholder="e.g. WELCOME10 or BZFREE"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading || !code.trim()}>
            {loading ? <div className="spinner" /> : <span>Redeem Promo Voucher</span>}
          </button>
        </form>
      </div>

      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Terms & Conditions</h4>
        <div className="flex items-start gap-2 text-xs text-gray-300">
          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <span>Each promo code can only be redeemed once per account.</span>
        </div>
        <div className="flex items-start gap-2 text-xs text-gray-300">
          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <span>Promotional credits can be used towards tournament entry fees.</span>
        </div>
        <div className="flex items-start gap-2 text-xs text-gray-300">
          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <span>Promo codes have limited validity and may expire without notice.</span>
        </div>
      </div>
    </div>
  );
};
