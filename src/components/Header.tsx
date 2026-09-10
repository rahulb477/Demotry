import React from 'react';
import { ArrowLeft, Bot, Wallet, Bell } from 'lucide-react';

interface HeaderProps {
  title: string;
  isMainPage: boolean;
  onBack: () => void;
  balance: number;
  unreadNotifs: number;
  onNavigate: (page: string) => void;
  onToggleAi: () => void;
}

export const BattleZoneLogoIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} shrink-0`}
  >
    <path
      d="M3.5 4.5L10.5 12L3.5 19.5"
      stroke="url(#bz-header-grad1)"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20.5 4.5L13.5 12L20.5 19.5"
      stroke="url(#bz-header-grad2)"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient id="bz-header-grad1" x1="3.5" y1="4.5" x2="10.5" y2="19.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1" />
        <stop offset="1" stopColor="#818cf8" />
      </linearGradient>
      <linearGradient id="bz-header-grad2" x1="20.5" y1="4.5" x2="13.5" y2="19.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="#a855f7" />
        <stop offset="1" stopColor="#6366f1" />
      </linearGradient>
    </defs>
  </svg>
);

export const Header: React.FC<HeaderProps> = ({
  title,
  isMainPage,
  onBack,
  balance,
  unreadNotifs,
  onNavigate,
  onToggleAi,
}) => {
  return (
    <header className="app-header" id="mainHeader">
      <div className="header-left">
        {!isMainPage && (
          <div className="header-back" onClick={onBack} id="headerBack">
            <ArrowLeft className="w-5 h-5 text-current" />
          </div>
        )}
        <div className="header-logo" id="headerTitle">
          {isMainPage ? (
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
              <BattleZoneLogoIcon className="w-6 h-6" />
              <span className="font-extrabold tracking-tight text-white text-[1.15rem]">BattleZone X</span>
            </div>
          ) : (
            title
          )}
        </div>
      </div>
      <div className="header-right">
        <div className="header-ai-btn" onClick={onToggleAi} title="Support Assistant" id="headerAiBtn">
          <Bot className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="header-balance" onClick={() => onNavigate('wallet')} id="headerWalletPill">
          <Wallet className="w-3.5 h-3.5 mr-1 text-white shrink-0" />
          <span className="font-bold text-white text-[0.82rem]">₹ {balance}</span>
        </div>
        <div className="header-icon" onClick={() => onNavigate('notifications')} id="headerNotifBtn">
          <Bell className="w-4 h-4 text-slate-300" />
          {unreadNotifs > 0 && (
            <span className="notif-badge" id="notifBadge">
              {unreadNotifs > 9 ? '9+' : unreadNotifs}
            </span>
          )}
        </div>
      </div>
    </header>
  );
};

