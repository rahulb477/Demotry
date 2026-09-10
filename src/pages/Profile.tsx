import React, { useRef } from 'react';
import {
  Camera,
  Crown,
  Gamepad2,
  Trophy,
  Coins,
  UserCheck,
  PlusCircle,
  FileCheck,
  History,
  Gift,
  Tag,
  Flag,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { UserProfile, UserWallet, PremiumStatus } from '../types';

interface ProfileProps {
  profile: UserProfile | null;
  wallet: UserWallet | null;
  premium: PremiumStatus | null;
  stats: { matches: number; wins: number; earnings: number };
  onNavigate: (page: string) => void;
  onUpdateAvatar: (file: File) => Promise<void>;
  onLogout: () => void;
}

export const Profile: React.FC<ProfileProps> = ({
  profile,
  premium,
  stats,
  onNavigate,
  onUpdateAvatar,
  onLogout,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isPro = premium?.active && (premium?.expiresAt || 0) > Date.now();
  const avatarUrl =
    profile?.photoUrl ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpdateAvatar(file);
    }
  };

  return (
    <div className="page active" id="profilePage">
      <div className="profile-card" id="profileCard">
        <div className="profile-avatar-wrap">
          <img
            src={avatarUrl}
            alt="Profile Avatar"
            className="profile-avatar"
            id="profileAvatar"
          />
          <div
            className="avatar-edit-btn"
            id="editPhotoBtn"
            onClick={() => fileInputRef.current?.click()}
            title="Change Avatar"
          >
            <Camera className="w-4 h-4 text-white" />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </div>

        <div className="flex items-center justify-center gap-2 mb-1">
          <h2 className="profile-name" id="profileName">
            {profile?.name || 'Player'}
          </h2>
          {isPro && (
            <span
              className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-warning text-black flex items-center gap-1"
              id="profileProBadge"
            >
              <Crown className="w-3 h-3" />
              <span>PRO</span>
            </span>
          )}
        </div>

        <p className="profile-email" id="profileEmail">
          {profile?.email || 'player@battlezone.com'}
        </p>

        {(profile?.gameName || profile?.gameUID) && (
          <div className="profile-game-info" id="profileGameInfo">
            {profile.gameName && <span>IGN: {profile.gameName}</span>}
            {profile.gameName && profile.gameUID && <span> | </span>}
            {profile.gameUID && <span>UID: {profile.gameUID}</span>}
          </div>
        )}

        <div className="profile-stats">
          <div className="profile-stat-item">
            <Gamepad2 className="w-4 h-4 text-gray-400 mx-auto mb-1" />
            <span className="val" id="profileMatches">
              {stats.matches}
            </span>
            <span className="lbl">Matches</span>
          </div>
          <div className="profile-stat-item">
            <Trophy className="w-4 h-4 text-warning mx-auto mb-1" />
            <span className="val" id="profileWins">
              {stats.wins}
            </span>
            <span className="lbl">Wins</span>
          </div>
          <div className="profile-stat-item">
            <Coins className="w-4 h-4 text-success mx-auto mb-1" />
            <span className="val" id="profileEarnings">
              ₹{stats.earnings}
            </span>
            <span className="lbl">Earnings</span>
          </div>
        </div>
      </div>

      <div className="profile-menu">
        <div className="profile-menu-item" onClick={() => onNavigate('editProfile')}>
          <div className="menu-left">
            <UserCheck className="w-5 h-5 text-primary" />
            <span>Edit Profile</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </div>

        <div className="profile-menu-item" onClick={() => onNavigate('premium')}>
          <div className="menu-left">
            <Crown className="w-5 h-5 text-warning" />
            <span>BattleZone Premium Pass</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </div>

        <div className="profile-menu-item" onClick={() => onNavigate('createMatch')}>
          <div className="menu-left">
            <PlusCircle className="w-5 h-5 text-success" />
            <span>Host Custom Tournament</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </div>

        <div className="profile-menu-item" onClick={() => onNavigate('screenshotSubmit')}>
          <div className="menu-left">
            <FileCheck className="w-5 h-5 text-info" />
            <span>Submit Match Results</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </div>

        <div className="profile-menu-item" onClick={() => onNavigate('matchHistory')}>
          <div className="menu-left">
            <History className="w-5 h-5 text-gray-400" />
            <span>Match History</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </div>

        <div className="profile-menu-item" onClick={() => onNavigate('leaderboard')}>
          <div className="menu-left">
            <Trophy className="w-5 h-5 text-warning" />
            <span>Leaderboard & Hall of Fame</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </div>

        <div className="profile-menu-item" onClick={() => onNavigate('referral')}>
          <div className="menu-left">
            <Gift className="w-5 h-5 text-primary" />
            <span>Refer and Earn</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </div>

        <div className="profile-menu-item" onClick={() => onNavigate('promoCode')}>
          <div className="menu-left">
            <Tag className="w-5 h-5 text-success" />
            <span>Redeem Promo Code</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </div>

        <div className="profile-menu-item" onClick={() => onNavigate('reportPlayer')}>
          <div className="menu-left">
            <Flag className="w-5 h-5 text-danger" />
            <span>Report Player / Issue</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </div>

        <div className="profile-menu-item" onClick={() => onNavigate('settings')}>
          <div className="menu-left">
            <Settings className="w-5 h-5 text-gray-400" />
            <span>App Settings</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </div>

        <div className="profile-menu-item text-danger" onClick={onLogout}>
          <div className="menu-left">
            <LogOut className="w-5 h-5 text-danger" />
            <span className="text-danger font-semibold">Logout</span>
          </div>
          <ChevronRight className="w-4 h-4 text-danger/50" />
        </div>
      </div>
    </div>
  );
};
