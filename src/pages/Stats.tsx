import React from 'react';
import {
  Gamepad2,
  Trophy,
  Percent,
  Medal,
  ArrowDownCircle,
  ArrowUpCircle,
  TrendingUp,
  Coins,
  Calendar,
} from 'lucide-react';
import { UserProfile, UserWallet, Transaction } from '../types';

interface StatsProps {
  profile: UserProfile | null;
  wallet: UserWallet | null;
  transactions: Transaction[];
  rank: number | string;
  stats: { matches: number; wins: number; earnings: number };
}

export const Stats: React.FC<StatsProps> = ({
  wallet,
  transactions,
  rank,
  stats,
}) => {
  const m = stats?.matches || 0;
  const w = stats?.wins || 0;
  const winRate = m > 0 ? ((w / m) * 100).toFixed(1) : '0';

  // Approved deposit and withdrawal totals
  let totalDeposits = 0;
  let totalWithdrawals = 0;

  transactions.forEach((tx) => {
    if (tx.status === 'approved') {
      if (tx.type === 'deposit') totalDeposits += tx.amount || 0;
      if (tx.type === 'withdraw') totalWithdrawals += tx.amount || 0;
    }
  });

  const netProfit = (stats?.earnings || 0) - totalDeposits;
  const isProfit = netProfit >= 0;

  return (
    <div className="page active" id="statsPage">
      <div
        className="welcome-banner mb-5 rounded-2xl p-5"
        style={{ background: 'var(--gradient2)', color: '#16213e' }}
      >
        <h2 className="font-extrabold text-lg mb-1">Performance Dashboard</h2>
        <p className="text-xs opacity-90">Real-time tracking of your competitive gaming career</p>
      </div>

      <div className="section-title">
        <span className="flex items-center gap-2">
          <Gamepad2 className="w-4 h-4 text-primary" />
          <span>Match Performance</span>
        </span>
      </div>
      <div className="stats-container">
        <div className="stat-card-premium">
          <Gamepad2 className="w-5 h-5 text-gray-400 mb-2" />
          <span className="s-val" id="stat_totalMatches">{m}</span>
          <span className="s-label">Matches Played</span>
        </div>
        <div className="stat-card-premium win">
          <Trophy className="w-5 h-5 text-success mb-2" />
          <span className="s-val" id="stat_totalWins">{w}</span>
          <span className="s-label">Matches Won</span>
        </div>
        <div className="stat-card-premium">
          <Percent className="w-5 h-5 text-gray-400 mb-2" />
          <span className="s-val" id="stat_winRate">{winRate}%</span>
          <span className="s-label">Win Rate</span>
        </div>
        <div className="stat-card-premium">
          <Medal className="w-5 h-5 text-warning mb-2" />
          <span className="s-val" id="stat_lbRank">#{rank || '--'}</span>
          <span className="s-label">Leaderboard Rank</span>
        </div>
      </div>

      <div className="section-title">
        <span className="flex items-center gap-2">
          <Coins className="w-4 h-4 text-warning" />
          <span>Financial Summary</span>
        </span>
      </div>
      <div className="stats-container">
        <div className="stat-card-premium">
          <ArrowDownCircle className="w-5 h-5 text-success mb-2" />
          <span className="s-val" id="stat_totalDeposits">₹{totalDeposits}</span>
          <span className="s-label">Total Deposits</span>
        </div>
        <div className="stat-card-premium">
          <ArrowUpCircle className="w-5 h-5 text-danger mb-2" />
          <span className="s-val" id="stat_totalWithdrawals">₹{totalWithdrawals}</span>
          <span className="s-label">Total Withdrawals</span>
        </div>
        <div className={`stat-card-premium ${isProfit ? 'win' : 'loss'}`} id="stat_plCard">
          <TrendingUp className="w-5 h-5 mb-2" />
          <span className="s-val" id="stat_netProfit">
            {isProfit ? '+' : ''}₹{netProfit}
          </span>
          <span className="s-label">Net Profit/Loss</span>
        </div>
        <div className="stat-card-premium">
          <Coins className="w-5 h-5 text-primary mb-2" />
          <span className="s-val" id="stat_currentBal">₹{wallet?.balance || 0}</span>
          <span className="s-label">Wallet Balance</span>
        </div>
      </div>

      <div className="stat-card-premium" style={{ marginTop: '10px', padding: '15px' }}>
        <div className="flex justify-between items-center">
          <div className="s-label flex items-center gap-2" style={{ fontSize: '0.75rem' }}>
            <Calendar className="w-4 h-4 text-primary" />
            <span>Last Activity</span>
          </div>
          <div id="stat_lastMatch" className="font-semibold text-sm">
            {transactions[0]?.timestamp
              ? new Date(transactions[0].timestamp).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Active Today'}
          </div>
        </div>
      </div>
    </div>
  );
};
