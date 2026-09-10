import React from 'react';
import { Home, BarChart3, Wallet, User } from 'lucide-react';

interface BottomNavProps {
  currentPage: string;
  isLiveActive: boolean;
  onNavigate: (page: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentPage,
  isLiveActive,
  onNavigate,
}) => {
  return (
    <nav className="bottom-nav" id="mainBottomNav">
      <div
        className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
        onClick={() => onNavigate('home')}
        id="navHomeBtn"
      >
        <Home className={`w-5 h-5 mb-1 ${currentPage === 'home' ? 'fill-current text-indigo-500' : 'text-slate-400'}`} />
        <span>Home</span>
      </div>

      <div
        className={`nav-item ${currentPage === 'stats' ? 'active' : ''}`}
        onClick={() => onNavigate('stats')}
        id="navStatsBtn"
      >
        <BarChart3 className={`w-5 h-5 mb-1 ${currentPage === 'stats' ? 'text-indigo-500' : 'text-slate-400'}`} />
        <span>Stats</span>
      </div>

      <div className="nav-center-wrap">
        <div
          className="nav-center-btn"
          id="navLiveBtn"
          onClick={() => onNavigate('liveStream')}
          title="Watch Live Stream"
        >
          {/* YouTube style play badge */}
          <div className="w-7 h-5 bg-white rounded-md flex items-center justify-center shadow-inner">
            <div className="w-0 h-0 border-y-[4px] border-y-transparent border-l-[7px] border-l-red-500 ml-0.5" />
          </div>
          {isLiveActive && (
            <span
              className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-white rounded-full animate-ping"
            />
          )}
        </div>
      </div>

      <div
        className={`nav-item ${currentPage === 'wallet' ? 'active' : ''}`}
        onClick={() => onNavigate('wallet')}
        id="navWalletBtn"
      >
        <Wallet className={`w-5 h-5 mb-1 ${currentPage === 'wallet' ? 'text-indigo-500' : 'text-slate-400'}`} />
        <span>Wallet</span>
      </div>

      <div
        className={`nav-item ${currentPage === 'profile' ? 'active' : ''}`}
        onClick={() => onNavigate('profile')}
        id="navProfileBtn"
      >
        <User className={`w-5 h-5 mb-1 ${currentPage === 'profile' ? 'text-indigo-500' : 'text-slate-400'}`} />
        <span>Profile</span>
      </div>
    </nav>
  );
};

