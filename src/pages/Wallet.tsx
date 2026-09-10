import React from 'react';
import {
  Wallet as WalletIcon,
  ArrowDownCircle,
  ArrowUpCircle,
  PlusCircle,
  MinusCircle,
} from 'lucide-react';
import { UserWallet, Transaction } from '../types';
import { EmptyState } from '../components/EmptyState';

interface WalletProps {
  wallet: UserWallet | null;
  transactions: Transaction[];
  onNavigate: (page: string) => void;
}

export const Wallet: React.FC<WalletProps> = ({ wallet, transactions, onNavigate }) => {
  const total = wallet?.balance || 0;
  const dep = wallet?.deposit || 0;
  const win = wallet?.winning || 0;

  const formatDate = (ts: number) => {
    if (!ts) return '';
    return new Date(ts).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="page active" id="walletPage">
      <div className="wallet-card" id="walletCard">
        <div className="wallet-header">
          <span className="wallet-label">Total Balance</span>
          <WalletIcon className="w-5 h-5 text-gray-400" />
        </div>
        <div className="wallet-amount" id="walletTotalBalance">
          ₹{total}
        </div>

        <div className="wallet-sub-balances">
          <div className="sub-bal-box">
            <span className="sub-label">Deposit Cash</span>
            <span className="sub-val" id="walletDepositBalance">
              ₹{dep}
            </span>
          </div>
          <div className="sub-bal-box">
            <span className="sub-label">Winning Cash</span>
            <span className="sub-val text-warning" id="walletWinningBalance">
              ₹{win}
            </span>
          </div>
        </div>

        <div className="wallet-actions">
          <button className="wallet-btn deposit" onClick={() => onNavigate('deposit')}>
            <PlusCircle className="w-4 h-4 mr-1.5" />
            <span>Add Cash</span>
          </button>
          <button className="wallet-btn withdraw" onClick={() => onNavigate('withdraw')}>
            <MinusCircle className="w-4 h-4 mr-1.5" />
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      <div className="section-title">
        <span>Transaction History</span>
      </div>

      <div id="walletTransactions">
        {transactions.length === 0 ? (
          <EmptyState
            icon="history"
            title="No transactions yet"
            message="Your deposits, withdrawals, and match prize credits will show up here."
          />
        ) : (
          transactions.map((tx) => {
            const isCredit =
              tx.type === 'deposit' ||
              tx.type === 'reward' ||
              tx.type === 'winning' ||
              tx.type === 'referral_bonus' ||
              tx.type === 'promo';

            const getTitle = () => {
              switch (tx.type) {
                case 'deposit':
                  return 'Deposit Cash';
                case 'withdraw':
                  return 'Withdrawal Request';
                case 'tournament_fee':
                  return tx.description || 'Tournament Entry Fee';
                case 'winning':
                  return tx.description || 'Match Winning Prize';
                case 'referral_bonus':
                  return 'Referral Bonus';
                case 'promo':
                  return 'Promo Code Credit';
                case 'reward':
                  return 'Sponsored Ad Reward';
                case 'premium_purchase':
                  return 'Premium Pass Activation';
                default:
                  return tx.description || 'Transaction';
              }
            };

            return (
              <div key={tx.id} className="tx-item">
                <div className="tx-left">
                  <div className={`tx-icon ${isCredit ? 'credit' : 'debit'}`}>
                    {isCredit ? (
                      <ArrowDownCircle className="w-5 h-5 text-success" />
                    ) : (
                      <ArrowUpCircle className="w-5 h-5 text-danger" />
                    )}
                  </div>
                  <div>
                    <div className="tx-title">{getTitle()}</div>
                    <div className="tx-date">{formatDate(tx.timestamp)}</div>
                  </div>
                </div>
                <div className="tx-right">
                  <div className={`tx-amount ${isCredit ? 'credit' : 'debit'}`}>
                    {isCredit ? '+' : '-'}₹{tx.amount}
                  </div>
                  <span className={`tx-status ${tx.status || 'approved'}`}>
                    {tx.status || 'approved'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
