import React, { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile as updateAuthProfile,
  updatePassword,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  addDoc,
} from 'firebase/firestore';
import { auth, db } from './firebase/config';
import {
  UserProfile,
  UserWallet,
  Tournament,
  GameMode,
  Announcement,
  HomeBanner,
  Transaction,
  AppNotification,
  LeaderboardPlayer,
  PremiumStatus,
  AppUpdateInfo,
} from './types';
import {
  INITIAL_MODES,
  INITIAL_BANNERS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_TOURNAMENTS,
  INITIAL_LEADERBOARD,
} from './services/initialData';
import {
  sendOtp,
  verifyOtp,
  validateJoinTournament,
  validateWithdraw,
  uploadImage,
} from './services/api';

// Components
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ToastContainer, ToastMessage } from './components/ToastContainer';
import { Modal } from './components/Modal';
import { AIChatPanel } from './components/AIChatPanel';
import { OTPModal } from './components/OTPModal';
import { UpdateModal } from './components/UpdateModal';

// Pages
import { Auth } from './pages/Auth';
import { Home } from './pages/Home';
import { Stats } from './pages/Stats';
import { LiveStream } from './pages/LiveStream';
import { Tournaments } from './pages/Tournaments';
import { TournamentDetail } from './pages/TournamentDetail';
import { Wallet } from './pages/Wallet';
import { Deposit } from './pages/Deposit';
import { Withdraw } from './pages/Withdraw';
import { Profile } from './pages/Profile';
import { EditProfile } from './pages/EditProfile';
import { Premium } from './pages/Premium';
import { CreateMatch } from './pages/CreateMatch';
import { ScreenshotSubmit } from './pages/ScreenshotSubmit';
import { MatchHistory } from './pages/MatchHistory';
import { Leaderboard } from './pages/Leaderboard';
import { Referral } from './pages/Referral';
import { PromoCode } from './pages/PromoCode';
import { ReportPlayer } from './pages/ReportPlayer';
import { Settings } from './pages/Settings';
import { Notifications } from './pages/Notifications';

export function App() {
  // Authentication & User State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [premium, setPremium] = useState<PremiumStatus | null>(null);

  // App Content State
  const [tournaments, setTournaments] = useState<Record<string, Tournament>>(INITIAL_TOURNAMENTS);
  const [modes, setModes] = useState<Record<string, GameMode>>(INITIAL_MODES);
  const [banners, setBanners] = useState<HomeBanner[]>(INITIAL_BANNERS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>(INITIAL_LEADERBOARD);

  // App Configuration
  const [adminUPI, setAdminUPI] = useState('battlezonex@upi');
  const [liveSettings, setLiveSettings] = useState({
    enabled: true,
    title: 'Grand Finals - Season 7 Championship',
    url: 'https://www.youtube.com',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
  });
  const [appUpdate, setAppUpdate] = useState<AppUpdateInfo | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Navigation State
  const [currentPage, setCurrentPage] = useState('home');
  const [pageHistory, setPageHistory] = useState<string[]>(['home']);
  const [selectedTourneyId, setSelectedTourneyId] = useState<string | null>(null);
  const [selectedModeId, setSelectedModeId] = useState<string | null>(null);

  // Modals & Floating State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [otpModal, setOtpModal] = useState<{ isOpen: boolean; email: string; signupData?: any }>({
    isOpen: false,
    email: '',
  });
  const [joinModal, setJoinModal] = useState<{
    isOpen: boolean;
    tournament: Tournament | null;
    gameName: string;
    gameUID: string;
    loading: boolean;
  }>({
    isOpen: false,
    tournament: null,
    gameName: '',
    gameUID: '',
    loading: false,
  });

  // Settings
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [language, setLanguage] = useState('en');
  const [adLoading, setAdLoading] = useState(false);

  // Apply Theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Toast Helper
  const showToast = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Copy to clipboard helper
  const handleCopyText = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    showToast('info', `${label} copied to clipboard`);
  };

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Load user profile & wallet from Firestore
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            setProfile(userSnap.data() as UserProfile);
          } else {
            // Initialize user doc
            const newProfile: UserProfile = {
              id: user.uid,
              name: user.displayName || 'Player',
              email: user.email || '',
              photoUrl: user.photoURL || '',
              role: 'user',
              createdAt: Date.now(),
              referralCount: 0,
              refCode: 'BZ' + user.uid.slice(0, 6).toUpperCase(),
            };
            await setDoc(userDocRef, newProfile);
            setProfile(newProfile);
          }

          // Load Wallet
          const walletDocRef = doc(db, 'wallets', user.uid);
          const walletSnap = await getDoc(walletDocRef);
          if (walletSnap.exists()) {
            setWallet(walletSnap.data() as UserWallet);
          } else {
            const newWallet: UserWallet = {
              balance: 50, // Welcome bonus
              deposit: 50,
              winning: 0,
            };
            await setDoc(walletDocRef, newWallet);
            setWallet(newWallet);
          }

          // Load Premium
          const premDocRef = doc(db, 'premium', user.uid);
          const premSnap = await getDoc(premDocRef);
          if (premSnap.exists()) {
            setPremium(premSnap.data() as PremiumStatus);
          } else {
            setPremium({ active: false });
          }
        } catch (e) {
          console.warn('Firestore user fetch fallback:', e);
          // Fallback profile if Firestore is uninitialized
          setProfile({
            id: user.uid,
            name: user.displayName || 'Player',
            email: user.email || '',
            role: 'user',
            createdAt: Date.now(),
            refCode: 'BZ' + user.uid.slice(0, 6).toUpperCase(),
          });
          setWallet({ balance: 50, deposit: 50, winning: 0 });
        }
      } else {
        setProfile(null);
        setWallet(null);
        setPremium(null);
      }
      setAuthInitialized(true);
    });

    return () => unsubscribe();
  }, []);

  // Listen to Firestore Realtime Updates for Tournaments
  useEffect(() => {
    try {
      const tourneyCol = collection(db, 'tournaments');
      const unsub = onSnapshot(
        tourneyCol,
        (snapshot) => {
          if (!snapshot.empty) {
            const data: Record<string, Tournament> = {};
            snapshot.forEach((d) => {
              data[d.id] = { id: d.id, ...d.data() } as Tournament;
            });
            setTournaments((prev) => ({ ...prev, ...data }));
          }
        },
        (error) => {
          console.warn('Realtime tournaments snapshot fallback:', error);
        }
      );
      return () => unsub();
    } catch {
      // Keep initial data
    }
  }, []);

  // Listen to User Transactions
  useEffect(() => {
    if (!currentUser) {
      setTransactions([]);
      return;
    }
    try {
      const txCol = collection(db, 'transactions');
      const q = query(txCol, where('userId', '==', currentUser.uid), orderBy('timestamp', 'desc'));
      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const list: Transaction[] = [];
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as Transaction);
          });
          setTransactions(list);
        },
        () => {
          // Fallback initial transaction if queries are pending
          if (wallet) {
            setTransactions([
              {
                id: 'tx_welcome',
                userId: currentUser.uid,
                type: 'deposit',
                amount: 50,
                status: 'approved',
                timestamp: Date.now() - 3600000,
                description: 'Welcome Sign-up Bonus',
              },
            ]);
          }
        }
      );
      return () => unsub();
    } catch {
      // Fallback
    }
  }, [currentUser]);

  // Navigation controller
  const navigateTo = (page: string, data?: any) => {
    if (page === 'tournamentDetail' && data) {
      setSelectedTourneyId(data);
    }
    setPageHistory((prev) => [...prev, page]);
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    if (pageHistory.length > 1) {
      const newHistory = [...pageHistory];
      newHistory.pop();
      const prevPage = newHistory[newHistory.length - 1];
      setPageHistory(newHistory);
      setCurrentPage(prevPage);
    } else {
      setCurrentPage('home');
    }
  };

  // Auth Actions
  const handleLogin = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      showToast('success', 'Logged in successfully');
      setCurrentPage('home');
    } catch (e: any) {
      showToast('error', e.message || 'Failed to login');
    }
  };

  const handleSignupStart = async (formData: any) => {
    // Send email OTP
    const res = await sendOtp(formData.email);
    if (!res.success) {
      showToast('error', res.message || 'Could not send OTP');
      return;
    }
    showToast('info', 'Verification code sent to ' + formData.email);
    setOtpModal({
      isOpen: true,
      email: formData.email,
      signupData: formData,
    });
  };

  const handleVerifyOtp = async (otp: string): Promise<boolean> => {
    const res = await verifyOtp(otpModal.email, otp);
    if (!res.success) {
      showToast('error', res.message || 'Invalid code');
      return false;
    }

    // OTP Verified, create account
    try {
      const { email, password, name, phone, gameName, gameUID, ref } = otpModal.signupData;
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateAuthProfile(userCred.user, { displayName: name });

      const newProfile: UserProfile = {
        id: userCred.user.uid,
        name,
        email,
        phone,
        gameName,
        gameUID,
        role: 'user',
        createdAt: Date.now(),
        referralCount: 0,
        refCode: 'BZ' + userCred.user.uid.slice(0, 6).toUpperCase(),
        referredBy: ref || undefined,
      };
      await setDoc(doc(db, 'users', userCred.user.uid), newProfile);

      // Initial wallet
      const initWallet: UserWallet = {
        balance: 50,
        deposit: 50,
        winning: 0,
      };
      await setDoc(doc(db, 'wallets', userCred.user.uid), initWallet);

      setProfile(newProfile);
      setWallet(initWallet);
      setOtpModal({ isOpen: false, email: '' });
      showToast('success', 'Account registered successfully with ₹50 bonus');
      setCurrentPage('home');
      return true;
    } catch (e: any) {
      showToast('error', e.message || 'Account creation error');
      return false;
    }
  };

  const handleResendOtp = async (): Promise<boolean> => {
    const res = await sendOtp(otpModal.email);
    if (res.success) {
      showToast('info', 'New verification code sent');
      return true;
    }
    showToast('error', 'Error resending code');
    return false;
  };

  const handleLogout = async () => {
    await signOut(auth);
    showToast('info', 'Logged out successfully');
    setCurrentPage('home');
  };

  // Profile Updates
  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    try {
      const updated = { ...profile, ...updates } as UserProfile;
      await updateDoc(doc(db, 'users', currentUser.uid), updates as any);
      setProfile(updated);
      showToast('success', 'Profile updated successfully');
    } catch {
      setProfile((prev) => ({ ...prev, ...updates } as UserProfile));
      showToast('success', 'Profile updated');
    }
  };

  const handleChangePassword = async (newPass: string) => {
    if (!currentUser) return;
    try {
      await updatePassword(currentUser, newPass);
      showToast('success', 'Password updated successfully');
    } catch (e: any) {
      showToast('error', e.message || 'Failed to update password');
    }
  };

  const handleUpdateAvatar = async (file: File) => {
    if (!currentUser) return;
    showToast('info', 'Uploading avatar...');
    try {
      const url = await uploadImage(file);
      await updateDoc(doc(db, 'users', currentUser.uid), { photoUrl: url });
      setProfile((prev) => (prev ? { ...prev, photoUrl: url } : null));
      showToast('success', 'Avatar updated successfully');
    } catch (e: any) {
      showToast('error', 'Failed to upload avatar');
    }
  };

  // Tournament Join Flow
  const handleOpenJoinModal = (t: Tournament) => {
    if (!currentUser) {
      showToast('warning', 'Please login to join tournaments');
      setCurrentPage('auth');
      return;
    }
    setJoinModal({
      isOpen: true,
      tournament: t,
      gameName: profile?.gameName || '',
      gameUID: profile?.gameUID || '',
      loading: false,
    });
  };

  const handleConfirmJoinMatch = async () => {
    if (!joinModal.tournament || !currentUser) return;
    const t = joinModal.tournament;
    const ign = joinModal.gameName.trim();
    const uid = joinModal.gameUID.trim();

    if (!ign || !uid) {
      showToast('warning', 'Please enter your In-Game Name and UID');
      return;
    }

    setJoinModal((prev) => ({ ...prev, loading: true }));

    try {
      // Validate server-side
      const val = await validateJoinTournament(t, wallet, profile);
      if (!val.valid) {
        showToast('error', val.message || 'Cannot join this tournament');
        setJoinModal((prev) => ({ ...prev, loading: false }));
        return;
      }

      // Perform deduction & participant register
      const fee = t.entryFee || 0;
      let newDep = wallet?.deposit || 0;
      let newWin = wallet?.winning || 0;

      if (fee > 0) {
        if (newDep >= fee) {
          newDep -= fee;
        } else {
          const rem = fee - newDep;
          newDep = 0;
          newWin = Math.max(0, newWin - rem);
        }
      }

      const updatedWallet: UserWallet = {
        balance: newDep + newWin,
        deposit: newDep,
        winning: newWin,
      };

      // Update wallet
      try {
        await updateDoc(doc(db, 'wallets', currentUser.uid), updatedWallet as any);
      } catch {
        // local state fallback
      }
      setWallet(updatedWallet);

      // Update tournament participants
      const newFilled = (t.filledSlots || 0) + 1;
      const participants = {
        ...(t.participants || {}),
        [currentUser.uid]: {
          name: profile?.name || 'Player',
          gameName: ign,
          gameUID: uid,
          joinedAt: Date.now(),
        },
      };

      try {
        await updateDoc(doc(db, 'tournaments', t.id), {
          filledSlots: newFilled,
          participants,
        });
      } catch {
        // fallback
      }

      setTournaments((prev) => ({
        ...prev,
        [t.id]: {
          ...t,
          filledSlots: newFilled,
          participants,
        },
      }));

      // Add transaction
      if (fee > 0) {
        const tx: Transaction = {
          id: 'tx_' + Date.now(),
          userId: currentUser.uid,
          type: 'tournament_fee',
          amount: fee,
          status: 'approved',
          timestamp: Date.now(),
          description: `Entry Fee: ${t.name}`,
        };
        try {
          await addDoc(collection(db, 'transactions'), tx);
        } catch {
          // fallback
        }
        setTransactions((prev) => [tx, ...prev]);
      }

      // Add notification
      const notif: AppNotification = {
        id: 'notif_' + Date.now(),
        userId: currentUser.uid,
        title: 'Tournament Registration Confirmed',
        message: `You are registered for ${t.name}. Room ID & Password will be available 15 minutes before the match.`,
        read: false,
        timestamp: Date.now(),
      };
      setNotifications((prev) => [notif, ...prev]);

      setJoinModal({ isOpen: false, tournament: null, gameName: '', gameUID: '', loading: false });
      showToast('success', 'Joined match successfully');
      navigateTo('tournamentDetail', t.id);
    } catch (e: any) {
      showToast('error', e.message || 'Error joining match');
      setJoinModal((prev) => ({ ...prev, loading: false }));
    }
  };

  // Deposit Submission
  const handleSubmitDeposit = async (amount: number, utr: string, screenshotUrl?: string) => {
    if (!currentUser) return;
    const tx: Transaction = {
      id: 'tx_dep_' + Date.now(),
      userId: currentUser.uid,
      type: 'deposit',
      amount,
      utr,
      screenshotUrl,
      status: 'pending',
      timestamp: Date.now(),
      description: 'Cash Deposit',
    };

    try {
      await addDoc(collection(db, 'transactions'), tx);
    } catch {
      // fallback
    }
    setTransactions((prev) => [tx, ...prev]);

    // Notification
    const notif: AppNotification = {
      id: 'notif_dep_' + Date.now(),
      userId: currentUser.uid,
      title: 'Deposit Request Submitted',
      message: `Your deposit of ₹${amount} with UTR ${utr} has been submitted for admin verification.`,
      read: false,
      timestamp: Date.now(),
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast('success', 'Deposit request submitted. Balance will be updated after verification.');
  };

  // Withdraw Submission
  const handleSubmitWithdraw = async (amount: number, upiId: string) => {
    if (!currentUser) return;
    const val = await validateWithdraw(amount, wallet?.winning || 0, upiId);
    if (!val.valid) {
      showToast('error', val.message || 'Withdrawal validation failed');
      return;
    }

    // Deduct immediately from winning balance
    const newWin = (wallet?.winning || 0) - amount;
    const newBal = (wallet?.deposit || 0) + newWin;
    const updatedWallet: UserWallet = {
      balance: newBal,
      deposit: wallet?.deposit || 0,
      winning: newWin,
    };

    try {
      await updateDoc(doc(db, 'wallets', currentUser.uid), updatedWallet as any);
    } catch {
      // fallback
    }
    setWallet(updatedWallet);

    const tx: Transaction = {
      id: 'tx_with_' + Date.now(),
      userId: currentUser.uid,
      type: 'withdraw',
      amount,
      upi: upiId,
      status: 'pending',
      timestamp: Date.now(),
      description: `Withdrawal to ${upiId}`,
    };

    try {
      await addDoc(collection(db, 'transactions'), tx);
    } catch {
      // fallback
    }
    setTransactions((prev) => [tx, ...prev]);

    showToast('success', `Withdrawal request for ₹${amount} submitted to ${upiId}`);
  };

  // Promo Code Redemption
  const handleApplyPromo = async (code: string): Promise<boolean> => {
    if (!currentUser) return false;
    const upper = code.trim().toUpperCase();
    const promoValues: Record<string, number> = {
      WELCOME10: 10,
      BZFREE: 20,
      VIP50: 50,
      BATTLE100: 100,
    };

    const bonus = promoValues[upper];
    if (!bonus) {
      showToast('error', 'Invalid or expired promo code');
      return false;
    }

    const newDep = (wallet?.deposit || 0) + bonus;
    const newBal = newDep + (wallet?.winning || 0);
    const updatedWallet: UserWallet = {
      balance: newBal,
      deposit: newDep,
      winning: wallet?.winning || 0,
    };

    try {
      await updateDoc(doc(db, 'wallets', currentUser.uid), updatedWallet as any);
    } catch {
      // fallback
    }
    setWallet(updatedWallet);

    const tx: Transaction = {
      id: 'tx_pr_' + Date.now(),
      userId: currentUser.uid,
      type: 'promo',
      amount: bonus,
      status: 'approved',
      timestamp: Date.now(),
      description: `Promo Code: ${upper}`,
    };
    setTransactions((prev) => [tx, ...prev]);

    showToast('success', `Promo code applied! ₹${bonus} added to your deposit balance`);
    return true;
  };

  // Watch Rewarded Ad & Earn
  const handleWatchAd = async () => {
    if (!currentUser) {
      showToast('warning', 'Please login to earn rewards');
      setCurrentPage('auth');
      return;
    }
    setAdLoading(true);
    showToast('info', 'Loading sponsored reward...');

    // Simulate 3-second short rewarded ad view
    setTimeout(async () => {
      const rewardAmt = 1;
      const newDep = (wallet?.deposit || 0) + rewardAmt;
      const newBal = newDep + (wallet?.winning || 0);
      const updatedWallet: UserWallet = {
        balance: newBal,
        deposit: newDep,
        winning: wallet?.winning || 0,
      };

      try {
        await updateDoc(doc(db, 'wallets', currentUser.uid), updatedWallet as any);
      } catch {
        // fallback
      }
      setWallet(updatedWallet);

      const tx: Transaction = {
        id: 'tx_ad_' + Date.now(),
        userId: currentUser.uid,
        type: 'reward',
        amount: rewardAmt,
        status: 'approved',
        timestamp: Date.now(),
        description: 'Sponsored Video Reward',
      };
      setTransactions((prev) => [tx, ...prev]);

      setAdLoading(false);
      showToast('success', 'Reward credited! ₹1 added to your wallet');
    }, 2500);
  };

  // Buy Premium Plan
  const handleBuyPremium = async (plan: 'weekly' | 'monthly' | 'yearly', price: number, days: number) => {
    if (!currentUser) return;
    const totalBal = wallet?.balance || 0;
    if (totalBal < price) {
      showToast('error', 'Insufficient balance');
      return;
    }

    // Deduct price from wallet
    let newDep = wallet?.deposit || 0;
    let newWin = wallet?.winning || 0;
    if (newDep >= price) {
      newDep -= price;
    } else {
      const rem = price - newDep;
      newDep = 0;
      newWin = Math.max(0, newWin - rem);
    }

    const updatedWallet: UserWallet = {
      balance: newDep + newWin,
      deposit: newDep,
      winning: newWin,
    };
    try {
      await updateDoc(doc(db, 'wallets', currentUser.uid), updatedWallet as any);
    } catch {
      // fallback
    }
    setWallet(updatedWallet);

    // Update premium status
    const expiresAt = Date.now() + days * 86400000;
    const premData: PremiumStatus = {
      active: true,
      plan,
      expiresAt,
    };
    try {
      await setDoc(doc(db, 'premium', currentUser.uid), premData as any);
    } catch {
      // fallback
    }
    setPremium(premData);

    const tx: Transaction = {
      id: 'tx_prem_' + Date.now(),
      userId: currentUser.uid,
      type: 'premium_purchase',
      amount: price,
      status: 'approved',
      timestamp: Date.now(),
      description: `Premium ${plan.toUpperCase()} Pass (${days} Days)`,
    };
    setTransactions((prev) => [tx, ...prev]);

    showToast('success', 'BattleZone VIP Pass activated successfully!');
  };

  // Host Custom Match (Premium)
  const handleCreateMatch = async (tourneyData: Partial<Tournament>) => {
    if (!currentUser) return;
    const id = 'tourney_' + Date.now();
    const newTourney: Tournament = {
      id,
      name: tourneyData.name || 'Custom Match',
      game: 'Free Fire',
      modeId: tourneyData.modeId || 'mode_1',
      modeName: tourneyData.modeName || 'Battle Royale',
      type: tourneyData.type || 'Solo',
      map: tourneyData.map || 'Bermuda',
      maxSlots: tourneyData.maxSlots || 48,
      filledSlots: 0,
      entryFee: tourneyData.entryFee || 0,
      prizePool: tourneyData.prizePool || 0,
      perKillPrize: tourneyData.perKillPrize || 0,
      matchTime: tourneyData.matchTime || Date.now() + 3600000,
      status: 'upcoming',
      visibility: 'public',
      bannerUrl: tourneyData.bannerUrl,
      rules: tourneyData.rules,
      createdAt: Date.now(),
      createdBy: currentUser.uid,
    };

    try {
      await setDoc(doc(db, 'tournaments', id), newTourney);
    } catch {
      // fallback
    }

    setTournaments((prev) => ({ [id]: newTourney, ...prev }));
    showToast('success', 'Custom tournament published successfully!');
    navigateTo('tournamentDetail', id);
  };

  // Submit Result Screenshot
  const handleSubmitResult = async (data: any) => {
    if (!currentUser) return;
    try {
      await addDoc(collection(db, 'match_results'), {
        userId: currentUser.uid,
        userName: profile?.name || 'Player',
        timestamp: Date.now(),
        status: 'pending_review',
        ...data,
      });
    } catch {
      // fallback
    }

    showToast('success', 'Match score submitted for admin verification');
    navigateTo('matchHistory');
  };

  // Submit Report
  const handleSubmitReport = async (data: any) => {
    if (!currentUser) return;
    try {
      await addDoc(collection(db, 'reports'), {
        reporterUid: currentUser.uid,
        reporterName: profile?.name || 'Player',
        timestamp: Date.now(),
        status: 'open',
        ...data,
      });
    } catch {
      // fallback
    }
    showToast('success', 'Report submitted to anti-cheat administration');
    handleBack();
  };

  // Calculate User Stats
  const userMatchesCount = (Object.values(tournaments) as Tournament[]).filter(
    (t) => t.participants && t.participants[currentUser?.uid || '']
  ).length;

  let userWinsCount = 0;
  let userEarningsCount = 0;
  (Object.values(tournaments) as Tournament[]).forEach((t) => {
    const p = t.participants?.[currentUser?.uid || ''];
    if (p) {
      if ((p.rank || 999) === 1) userWinsCount += 1;
      if (p.prize) userEarningsCount += p.prize;
    }
  });

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const isMainPage = currentPage === 'home';
  const getHeaderTitle = () => {
    switch (currentPage) {
      case 'home':
        return 'BattleZone X';
      case 'tournaments':
        return 'Tournaments';
      case 'tournamentDetail':
        return tournaments[selectedTourneyId || '']?.name || 'Match Details';
      case 'stats':
        return 'Player Stats';
      case 'liveStream':
        return 'Live Stream';
      case 'wallet':
        return 'My Wallet';
      case 'deposit':
        return 'Add Cash';
      case 'withdraw':
        return 'Withdraw Cash';
      case 'profile':
        return 'My Profile';
      case 'editProfile':
        return 'Edit Profile';
      case 'premium':
        return 'Premium Pass';
      case 'createMatch':
        return 'Host Tournament';
      case 'screenshotSubmit':
        return 'Submit Score';
      case 'matchHistory':
        return 'Match History';
      case 'leaderboard':
        return 'Leaderboard';
      case 'referral':
        return 'Refer & Earn';
      case 'promoCode':
        return 'Redeem Promo';
      case 'reportPlayer':
        return 'Report Violation';
      case 'settings':
        return 'Settings';
      case 'notifications':
        return 'Notifications';
      default:
        return 'BattleZone X';
    }
  };

  return (
    <div className="app-container min-h-screen bg-[#0b0e1e] text-white">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <Header
        title={getHeaderTitle()}
        isMainPage={isMainPage}
        onBack={handleBack}
        balance={wallet?.balance || 0}
        unreadNotifs={unreadNotifsCount}
        onNavigate={(p) => navigateTo(p)}
        onToggleAi={() => setAiChatOpen(true)}
      />

      {/* Main Pages Router */}
      <main className="pt-[58px] pb-24 max-w-[480px] mx-auto min-h-screen">
        {!currentUser && currentPage === 'auth' ? (
          <Auth onLogin={handleLogin} onSignupStart={handleSignupStart} />
        ) : (
          <>
            {currentPage === 'home' && (
              <Home
                banners={banners}
                announcements={announcements}
                modes={modes}
                tournaments={tournaments}
                currentUid={currentUser?.uid || ''}
                onNavigate={(p, d) => navigateTo(p, d)}
                onSelectMode={(mId) => {
                  setSelectedModeId(mId);
                  navigateTo('tournaments');
                }}
                onJoinMatch={handleOpenJoinModal}
                onWatchAd={handleWatchAd}
                adLoading={adLoading}
              />
            )}

            {currentPage === 'tournaments' && (
              <Tournaments
                tournaments={tournaments}
                modes={modes}
                selectedModeId={selectedModeId}
                onClearMode={() => setSelectedModeId(null)}
                currentUid={currentUser?.uid || ''}
                onNavigate={(p, d) => navigateTo(p, d)}
                onJoinMatch={handleOpenJoinModal}
              />
            )}

            {currentPage === 'tournamentDetail' && selectedTourneyId && tournaments[selectedTourneyId] && (
              <TournamentDetail
                tournament={tournaments[selectedTourneyId]}
                currentUid={currentUser?.uid || ''}
                onJoinMatch={handleOpenJoinModal}
                onCopyText={handleCopyText}
              />
            )}

            {currentPage === 'stats' && (
              <Stats
                profile={profile}
                wallet={wallet}
                transactions={transactions}
                rank={profile?.rank || 12}
                stats={{
                  matches: userMatchesCount,
                  wins: userWinsCount,
                  earnings: userEarningsCount,
                }}
              />
            )}

            {currentPage === 'liveStream' && (
              <LiveStream settings={liveSettings} />
            )}

            {currentPage === 'wallet' && (
              <Wallet
                wallet={wallet}
                transactions={transactions}
                onNavigate={(p) => navigateTo(p)}
              />
            )}

            {currentPage === 'deposit' && (
              <Deposit
                adminUPI={adminUPI}
                transactions={transactions}
                onSubmitDeposit={handleSubmitDeposit}
                onCopyText={handleCopyText}
              />
            )}

            {currentPage === 'withdraw' && (
              <Withdraw
                wallet={wallet}
                transactions={transactions}
                onSubmitWithdraw={handleSubmitWithdraw}
              />
            )}

            {currentPage === 'profile' && (
              <Profile
                profile={profile}
                wallet={wallet}
                premium={premium}
                stats={{
                  matches: userMatchesCount,
                  wins: userWinsCount,
                  earnings: userEarningsCount,
                }}
                onNavigate={(p) => navigateTo(p)}
                onUpdateAvatar={handleUpdateAvatar}
                onLogout={handleLogout}
              />
            )}

            {currentPage === 'editProfile' && (
              <EditProfile
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                onChangePassword={handleChangePassword}
              />
            )}

            {currentPage === 'premium' && (
              <Premium
                premium={premium}
                wallet={wallet}
                onBuyPlan={handleBuyPremium}
              />
            )}

            {currentPage === 'createMatch' && (
              <CreateMatch
                premium={premium}
                modes={modes}
                onNavigate={(p) => navigateTo(p)}
                onCreateMatch={handleCreateMatch}
              />
            )}

            {currentPage === 'screenshotSubmit' && (
              <ScreenshotSubmit
                tournaments={tournaments}
                currentUid={currentUser?.uid || ''}
                onSubmitResult={handleSubmitResult}
              />
            )}

            {currentPage === 'matchHistory' && (
              <MatchHistory
                tournaments={tournaments}
                currentUid={currentUser?.uid || ''}
                onNavigate={(p, d) => navigateTo(p, d)}
              />
            )}

            {currentPage === 'leaderboard' && (
              <Leaderboard
                globalPlayers={leaderboard}
                tournaments={tournaments}
                currentUid={currentUser?.uid || ''}
              />
            )}

            {currentPage === 'referral' && (
              <Referral
                profile={profile}
                wallet={wallet}
                onCopyText={handleCopyText}
              />
            )}

            {currentPage === 'promoCode' && (
              <PromoCode onApplyPromo={handleApplyPromo} />
            )}

            {currentPage === 'reportPlayer' && (
              <ReportPlayer onSubmitReport={handleSubmitReport} />
            )}

            {currentPage === 'settings' && (
              <Settings
                theme={theme}
                onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
                language={language}
                onChangeLanguage={setLanguage}
              />
            )}

            {currentPage === 'notifications' && (
              <Notifications
                notifications={notifications}
                onMarkAllRead={() => {
                  setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                  showToast('info', 'All notifications marked as read');
                }}
                onNotificationClick={(n) => {
                  setNotifications((prev) =>
                    prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
                  );
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        currentPage={currentPage}
        isLiveActive={liveSettings.enabled}
        onNavigate={(p) => {
          if (!currentUser && (p === 'wallet' || p === 'profile')) {
            navigateTo('auth');
          } else {
            navigateTo(p);
          }
        }}
      />

      {/* AI Chat Panel */}
      <AIChatPanel
        isOpen={aiChatOpen}
        onClose={() => setAiChatOpen(false)}
        uid={currentUser?.uid}
        userName={profile?.name}
      />

      {/* OTP Modal */}
      {otpModal.isOpen && (
        <Modal isOpen={otpModal.isOpen} onClose={() => setOtpModal({ isOpen: false, email: '' })}>
          <OTPModal
            email={otpModal.email}
            onVerify={handleVerifyOtp}
            onResend={handleResendOtp}
            onClose={() => setOtpModal({ isOpen: false, email: '' })}
          />
        </Modal>
      )}

      {/* Join Tournament Modal */}
      {joinModal.isOpen && joinModal.tournament && (
        <Modal
          isOpen={joinModal.isOpen}
          onClose={() => setJoinModal({ isOpen: false, tournament: null, gameName: '', gameUID: '', loading: false })}
        >
          <div className="p-2">
            <h3 className="font-extrabold text-lg text-white mb-1">Confirm Registration</h3>
            <p className="text-xs text-gray-400 mb-4">
              {joinModal.tournament.name} • Entry Fee: {joinModal.tournament.entryFee > 0 ? `₹${joinModal.tournament.entryFee}` : 'FREE'}
            </p>

            <div className="form-group mb-3">
              <label className="text-xs font-semibold text-gray-300 mb-1 block">In-Game Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Exact in-game character name"
                value={joinModal.gameName}
                onChange={(e) => setJoinModal((prev) => ({ ...prev, gameName: e.target.value }))}
                required
              />
            </div>

            <div className="form-group mb-4">
              <label className="text-xs font-semibold text-gray-300 mb-1 block">Game UID</label>
              <input
                type="text"
                className="form-input"
                placeholder="Game UID"
                value={joinModal.gameUID}
                onChange={(e) => setJoinModal((prev) => ({ ...prev, gameUID: e.target.value }))}
                required
              />
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 mb-4 text-xs text-gray-400 flex justify-between">
              <span>Your Balance: ₹{wallet?.balance || 0}</span>
              <span>Deduction: ₹{joinModal.tournament.entryFee || 0}</span>
            </div>

            <button
              className="btn btn-primary"
              onClick={handleConfirmJoinMatch}
              disabled={joinModal.loading}
            >
              {joinModal.loading ? <div className="spinner" /> : <span>Confirm & Join Match</span>}
            </button>
          </div>
        </Modal>
      )}

      {/* App Update Modal */}
      {showUpdateModal && appUpdate && (
        <Modal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
          <UpdateModal
            title={appUpdate.title}
            message={appUpdate.message}
            link={appUpdate.link}
            onClose={() => setShowUpdateModal(false)}
          />
        </Modal>
      )}
    </div>
  );
}
export default App;
