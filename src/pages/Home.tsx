import React, { useState, useEffect } from 'react';
import {
  Plus,
  Minus,
  Gift,
  Crown,
  Gamepad2,
  Flame,
  Calendar,
  Trophy,
  Crosshair,
  MapPin,
} from 'lucide-react';
import { Tournament, GameMode, Announcement, HomeBanner } from '../types';
import { EmptyState } from '../components/EmptyState';

interface HomeProps {
  banners: HomeBanner[];
  announcements: Announcement[];
  modes: Record<string, GameMode>;
  tournaments: Record<string, Tournament>;
  currentUid: string;
  onNavigate: (page: string, data?: any) => void;
  onSelectMode: (modeId: string) => void;
  onJoinMatch: (tourney: Tournament) => void;
  onWatchAd: () => void;
  adLoading: boolean;
}

export const Home: React.FC<HomeProps> = ({
  banners,
  modes,
  tournaments,
  currentUid,
  onNavigate,
  onSelectMode,
  onJoinMatch,
}) => {
  const [slideIdx, setSlideIdx] = useState(0);

  // Auto slide banner
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [banners.length]);

  const upcomingTournaments = (Object.entries(tournaments) as [string, Tournament][])
    .filter(([_, t]) => t.status === 'upcoming')
    .sort((a, b) => (a[1].matchTime || 0) - (b[1].matchTime || 0));

  const formatDate = (ts: number) => {
    if (!ts) return '29 Apr 2026, 08:23 am';
    return new Date(ts).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="page active" id="homePage" style={{ padding: '12px 14px 24px' }}>
      {/* Top Banner Slider */}
      {banners.length > 0 && (
        <div
          id="homeBannerSlider"
          className="relative w-full h-[185px] sm:h-[210px] overflow-hidden rounded-[24px] mb-4 shadow-2xl cursor-pointer group select-none border border-[#1e2448]/80"
          onClick={() => {
            const current = banners[slideIdx];
            if (current?.link === 'liveStream') {
              onNavigate('liveStream');
            } else if (current?.link) {
              window.open(current.link, '_blank');
            } else {
              onNavigate('liveStream');
            }
          }}
        >
          {/* Top-Left Red "LIVE!" Badge */}
          <div className="absolute top-3 left-3 z-20 bg-rose-600 text-white text-[10px] font-black tracking-wider px-2.5 py-0.5 rounded-full shadow-lg flex items-center gap-1 border border-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            LIVE!
          </div>

          <div
            className="slider-container flex w-full h-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${slideIdx * 100}%)` }}
          >
            {banners.map((b, idx) => (
              <div key={b.id || idx} className="min-w-full h-full relative">
                <img
                  src={b.image}
                  alt={b.title || 'Live Stream Banner'}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Stylized Esports Overlay Text matching the screenshot banner */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 flex flex-col justify-end p-4">
                  {idx === 0 && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none w-full px-4">
                      <div className="text-[#facc15] font-black text-2xl sm:text-3xl tracking-wider drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] uppercase font-sans">
                        TCM HP
                      </div>
                      <div className="text-[#fde047] font-black text-xl sm:text-2xl tracking-widest drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] uppercase">
                        I'M ON LIVE
                      </div>
                    </div>
                  )}

                  {/* Bottom-left LIVE label */}
                  <div className="text-white font-black text-base sm:text-lg tracking-wider drop-shadow-md">
                    LIVE
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom-Right Pagination Dots */}
          <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5 pointer-events-none">
            {banners.map((_, i) => {
              const isActive = i === slideIdx;
              return (
                <div
                  key={i}
                  className={`transition-all duration-300 rounded-full ${
                    isActive
                      ? 'w-6 h-2 bg-[#818cf8] shadow-sm'
                      : 'w-2 h-2 bg-white/40'
                  }`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* 4 Quick Action Cards */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3 mb-5" id="homeQuickActions">
        {/* Deposit */}
        <div
          className="bg-[#13162b] hover:bg-[#181c38] active:scale-95 border border-[#202547] rounded-[18px] py-3.5 px-2 flex flex-col items-center justify-center cursor-pointer transition-all shadow-md"
          onClick={() => onNavigate('deposit')}
          id="actionDeposit"
        >
          <div className="w-10 h-10 rounded-full bg-[#10b981] flex items-center justify-center mb-2 shadow-sm">
            <Plus className="w-5 h-5 text-black stroke-[3]" />
          </div>
          <span className="text-[12px] font-semibold text-slate-200 tracking-tight">Deposit</span>
        </div>

        {/* Withdraw */}
        <div
          className="bg-[#13162b] hover:bg-[#181c38] active:scale-95 border border-[#202547] rounded-[18px] py-3.5 px-2 flex flex-col items-center justify-center cursor-pointer transition-all shadow-md"
          onClick={() => onNavigate('withdraw')}
          id="actionWithdraw"
        >
          <div className="w-10 h-10 rounded-full bg-[#ef4444] flex items-center justify-center mb-2 shadow-sm">
            <Minus className="w-5 h-5 text-black stroke-[3]" />
          </div>
          <span className="text-[12px] font-semibold text-slate-200 tracking-tight">Withdraw</span>
        </div>

        {/* Referral */}
        <div
          className="bg-[#13162b] hover:bg-[#181c38] active:scale-95 border border-[#202547] rounded-[18px] py-3.5 px-2 flex flex-col items-center justify-center cursor-pointer transition-all shadow-md"
          onClick={() => onNavigate('referral')}
          id="actionReferral"
        >
          <div className="w-10 h-10 flex items-center justify-center mb-2">
            <Gift className="w-7 h-7 text-amber-400 fill-amber-400/20" />
          </div>
          <span className="text-[12px] font-semibold text-slate-200 tracking-tight">Referral</span>
        </div>

        {/* Premium */}
        <div
          className="bg-[#13162b] hover:bg-[#181c38] active:scale-95 border border-[#202547] rounded-[18px] py-3.5 px-2 flex flex-col items-center justify-center cursor-pointer transition-all shadow-md"
          onClick={() => onNavigate('premium')}
          id="actionPremium"
        >
          <div className="w-10 h-10 flex items-center justify-center mb-2">
            <Crown className="w-7 h-7 text-sky-400 fill-sky-400/20" />
          </div>
          <span className="text-[12px] font-semibold text-slate-200 tracking-tight">Premium</span>
        </div>
      </div>

      {/* Explore Modes Section */}
      <div className="mb-5" id="homeExploreModesSection">
        <div className="flex items-center gap-2 mb-3">
          <Gamepad2 className="w-5 h-5 text-slate-400" />
          <h2 className="text-white font-bold text-[17px] tracking-wide">Explore Modes</h2>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none" id="homeModesList">
          {(Object.entries(modes) as [string, GameMode][]).map(([id, m]) => (
            <div
              key={id}
              className="w-[112px] h-[126px] shrink-0 relative rounded-[18px] overflow-hidden border border-[#232950] bg-[#14172f] cursor-pointer active:scale-95 transition-all shadow-lg group"
              onClick={() => onSelectMode(id)}
            >
              <img
                src={m.image}
                alt={m.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />

              {/* Bottom bar with mode title */}
              <div className="absolute bottom-0 inset-x-0 bg-black/80 backdrop-blur-sm py-1.5 px-2 text-center border-t border-white/10">
                <div className="text-[11px] font-extrabold text-white tracking-wide uppercase truncate">
                  {m.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Matches Section */}
      <div className="mb-4" id="homeUpcomingSection">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500/20" />
            <h2 className="text-white font-bold text-[17px] tracking-wide">Upcoming Matches</h2>
          </div>
          <span
            className="text-indigo-400 hover:text-indigo-300 font-semibold text-xs cursor-pointer transition-colors"
            onClick={() => onNavigate('tournaments')}
          >
            See All
          </span>
        </div>

        <div id="homeTournamentsList">
          {upcomingTournaments.length === 0 ? (
            <EmptyState
              icon="gamepad"
              title="No upcoming matches"
              message="Check back soon for new tournaments."
            />
          ) : (
            upcomingTournaments.map(([id, tr]) => {
              const filled = tr.filledSlots || 0;
              const max = tr.maxSlots || 50;
              const pct = Math.min((filled / max) * 100, 100);
              const isFull = filled >= max;
              const isJoined = !!(tr.participants && tr.participants[currentUid]);
              const feeText = tr.entryFee > 0 ? `₹${tr.entryFee}` : 'FREE';
              const btnText = isJoined ? 'JOINED' : isFull ? 'FULL' : `${feeText} JOIN`;
              const btnClass = isJoined
                ? 'bg-emerald-600 hover:bg-emerald-500'
                : isFull
                ? 'bg-slate-700 opacity-60'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30';

              return (
                <div
                  key={id}
                  className="rounded-[22px] bg-[#13162b] border border-[#202547] overflow-hidden mb-4 shadow-xl cursor-pointer transition-all hover:border-[#2f376a]"
                  onClick={() => onNavigate('tournamentDetail', id)}
                >
                  {/* Top Banner Image with Badges */}
                  <div className="relative h-[155px] sm:h-[180px] w-full overflow-hidden bg-slate-900">
                    <img
                      src={tr.bannerUrl || '/src/assets/images/ff_br_banner_1789014071244.jpg'}
                      alt={tr.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />

                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                      <div className="bg-black/75 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-md text-white text-[10px] font-bold flex items-center gap-1.5 uppercase shadow-md">
                        <Gamepad2 className="w-3.5 h-3.5 text-white" />
                        <span>{tr.modeName || tr.game}</span>
                      </div>
                      <div className="bg-black/75 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-md text-white text-[10px] font-bold flex items-center gap-1.5 uppercase shadow-md">
                        <MapPin className="w-3.5 h-3.5 text-white" />
                        <span>{tr.map || 'Bermuda'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body Content */}
                  <div className="p-4 sm:p-5">
                    {/* Match Title */}
                    <h3 className="text-white font-extrabold text-[17px] mb-2.5 tracking-tight">
                      {tr.name}
                    </h3>

                    {/* Stats Row */}
                    <div className="flex items-center justify-between mb-3 text-xs sm:text-sm">
                      <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                        <Trophy className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                        <span>₹{tr.prizePool || 0} Pool</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-rose-500 font-semibold">
                        <Crosshair className="w-4 h-4 text-rose-500" />
                        <span>₹{tr.perKillPrize || 0}/Kill</span>
                      </div>
                    </div>

                    {/* Slots Progress Bar */}
                    <div className="mb-4">
                      <div className="w-full bg-[#1e2447] h-1.5 rounded-full overflow-hidden mb-1.5">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                        <span>{filled}/{max} Slots Filled</span>
                        <span>{Math.round(pct)}%</span>
                      </div>
                    </div>

                    {/* Footer Row: Date & Join Button */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                        <Calendar className="w-4 h-4 text-indigo-400" />
                        <span>{formatDate(tr.matchTime)}</span>
                      </div>
                      <button
                        className={`text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer ${btnClass}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isJoined && !isFull) {
                            onJoinMatch(tr);
                          }
                        }}
                        disabled={isFull && !isJoined}
                      >
                        {btnText}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
