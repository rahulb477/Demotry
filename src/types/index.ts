export interface UserProfile {
  id?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  gameName?: string;
  gameUID?: string;
  gameType?: string;
  profileImage?: string;
  photoUrl?: string;
  dob?: string;
  gender?: string;
  referralCode?: string;
  refCode?: string;
  referredBy?: string;
  referralCount?: number;
  premium?: boolean;
  premiumExpiry?: number;
  premiumPlan?: string;
  premiumPurchasedAt?: number;
  createdAt: number;
  banned?: boolean;
  theme?: 'dark' | 'light';
  role?: string;
  rank?: number;
}

export interface UserWallet {
  balance: number;
  deposit: number;
  winning: number;
}

export interface Transaction {
  id?: string;
  userId?: string;
  type:
    | 'deposit'
    | 'withdraw'
    | 'entry_fee'
    | 'tournament_fee'
    | 'winning'
    | 'referral'
    | 'referral_bonus'
    | 'promo'
    | 'admin_add'
    | 'admin_deduct'
    | 'premium'
    | 'premium_purchase'
    | 'premium_refund'
    | 'reward';
  amount: number;
  status: 'approved' | 'pending' | 'rejected';
  description: string;
  depositId?: string;
  utr?: string;
  screenshotUrl?: string;
  upi?: string;
  timestamp: number;
}

export interface Participant {
  name: string;
  gameName?: string;
  gameUID?: string;
  photoURL?: string;
  profileImage?: string;
  joinedAt: number;
  kills?: number;
  rank?: number;
  prize?: number;
  screenshotURL?: string;
  claimedRank?: number;
  claimedKills?: number;
}

export interface Tournament {
  id: string;
  name: string;
  game: string;
  type: string;
  map: string;
  modeId?: string;
  modeName?: string;
  entryFee: number;
  prizePool: number;
  perKillPrize: number;
  maxSlots: number;
  filledSlots: number;
  matchTime: number;
  status: 'upcoming' | 'live' | 'ongoing' | 'completed' | 'cancelled';
  bannerUrl?: string;
  rules?: string;
  roomId?: string;
  roomPassword?: string;
  isCustom?: boolean;
  createdBy?: string;
  createdByName?: string;
  screenshotRequired?: boolean;
  screenshotSubmitted?: boolean;
  resultVerified?: boolean;
  visibility?: 'public' | 'premium';
  createdAt?: number;
  participants?: Record<string, Participant>;
  resultScreenshots?: Record<
    string,
    {
      screenshot: string;
      rank: number;
      kills: number;
      submittedBy: string;
      submittedAt: number;
      verified: boolean;
    }
  >;
}

export interface GameMode {
  id: string;
  name: string;
  image: string;
}

export interface Announcement {
  id?: string;
  title?: string;
  message?: string;
  active: boolean;
  order?: number;
  timestamp?: number;
}

export interface HomeBanner {
  id?: string;
  title?: string;
  image: string;
  link?: string;
  active: boolean;
  order?: number;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type?: 'payment' | 'match' | 'result' | 'system';
  read: boolean;
  timestamp: number;
}

export type AppNotification = NotificationItem;

export interface LeaderboardPlayer {
  uid: string;
  name: string;
  img: string;
  score: number;
  meta: string;
  rank?: number;
}

export interface PremiumStatus {
  active: boolean;
  plan?: 'weekly' | 'monthly' | 'yearly';
  expiresAt?: number;
}

export interface AppUpdateInfo {
  title?: string;
  message?: string;
  link?: string;
}
