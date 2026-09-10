import React, { useState } from 'react';
import { Gift, Copy, Check, Share2, Users, Coins } from 'lucide-react';
import { UserProfile, UserWallet } from '../types';

interface ReferralProps {
  profile: UserProfile | null;
  wallet: UserWallet | null;
  onCopyText: (text: string, label: string) => void;
}

export const Referral: React.FC<ReferralProps> = ({ profile, wallet, onCopyText }) => {
  const [copied, setCopied] = useState(false);

  const refCode = profile?.refCode || profile?.id?.slice(0, 8).toUpperCase() || 'BZ100X';
  const totalRefs = profile?.referralCount || 0;
  const refEarnings = totalRefs * 10;

  const handleCopy = () => {
    onCopyText(refCode, 'Referral Code');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = `Join BattleZone X esports platform and win cash rewards in Free Fire tournaments!\nUse my referral code: ${refCode} to get a ₹10 signup bonus.\nDownload/Play: https://battlezone-x7.onrender.com`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'BattleZone X Referral',
        text: `Use my BattleZone referral code: ${refCode} to get a signup bonus!`,
        url: 'https://battlezone-x7.onrender.com',
      });
    } else {
      handleCopy();
    }
  };

  const topReferrers = [
    { name: 'ThunderKing', count: 142, earned: 1420 },
    { name: 'SniperQueen', count: 98, earned: 980 },
    { name: 'GhostRider', count: 74, earned: 740 },
    { name: 'ApexPredator', count: 52, earned: 520 },
  ];

  return (
    <div className="page active" id="referralPage">
      <div className="section-title">
        <span>Refer & Earn</span>
      </div>

      <div className="referral-card mb-5">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Gift className="w-6 h-6 text-white" />
          <h2 className="text-xl font-black text-white">Invite Friends & Win ₹10</h2>
        </div>
        <p className="text-xs text-white/80 max-w-xs mx-auto mb-4">
          Share your referral code. When your friend registers, both of you earn instant wallet bonuses.
        </p>

        <div className="p-3 bg-black/40 rounded-xl max-w-xs mx-auto flex items-center justify-between border border-white/20 mb-4">
          <span className="font-mono font-extrabold text-lg text-warning tracking-widest pl-2">
            {refCode}
          </span>
          <button
            className="px-3 py-1.5 rounded-lg bg-white/20 text-white text-xs font-bold hover:bg-white/30 flex items-center gap-1"
            onClick={handleCopy}
          >
            {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="flex gap-2 justify-center">
          <button
            className="btn btn-sm"
            style={{ background: '#25D366', color: '#fff' }}
            onClick={handleShareWhatsApp}
          >
            <Share2 className="w-4 h-4 mr-1.5 inline" />
            <span>Share on WhatsApp</span>
          </button>
          <button
            className="btn btn-sm"
            style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}
            onClick={handleNativeShare}
          >
            <span>Share Link</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-4 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Users className="w-4 h-4 text-primary" />
            <span>Friends Invited</span>
          </div>
          <span className="text-2xl font-extrabold text-white">{totalRefs}</span>
        </div>
        <div className="p-4 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Coins className="w-4 h-4 text-success" />
            <span>Referral Earnings</span>
          </div>
          <span className="text-2xl font-extrabold text-success">₹{refEarnings}</span>
        </div>
      </div>

      <div className="section-title">
        <span>Top Referrers This Month</span>
      </div>
      <div className="space-y-2 mb-6">
        {topReferrers.map((r, i) => (
          <div
            key={i}
            className="p-3 rounded-xl flex items-center justify-between border"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-sm text-gray-400 w-5">#{i + 1}</span>
              <div>
                <div className="font-bold text-sm text-white">{r.name}</div>
                <div className="text-[11px] text-gray-400">{r.count} Friends Invited</div>
              </div>
            </div>
            <div className="font-mono font-bold text-sm text-success">+₹{r.earned}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
