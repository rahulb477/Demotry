import React, { useState } from 'react';
import {
  Trophy,
  ArrowUpCircle,
} from 'lucide-react';
import { UserWallet, Transaction } from '../types';

interface WithdrawProps {
  wallet: UserWallet | null;
  transactions: Transaction[];
  onSubmitWithdraw: (amount: number, upiId: string) => Promise<void>;
}

export const Withdraw: React.FC<WithdrawProps> = ({
  wallet,
  transactions,
  onSubmitWithdraw,
}) => {
  const [amount, setAmount] = useState<number>(50);
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);

  const winningBal = wallet?.winning || 0;
  const withdrawTransactions = transactions.filter((t) => t.type === 'withdraw');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount < 10) {
      alert('Minimum withdrawal amount is ₹10');
      return;
    }
    if (amount > winningBal) {
      alert('Withdrawal amount exceeds your winning balance');
      return;
    }
    if (!upiId || !upiId.includes('@')) {
      alert('Please enter a valid UPI ID (e.g., player@oksbi)');
      return;
    }

    setLoading(true);
    try {
      await onSubmitWithdraw(amount, upiId.trim());
      setAmount(50);
      setUpiId('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page active" id="withdrawPage">
      <div className="section-title">
        <span>Withdraw Cash</span>
      </div>

      <div
        className="p-4 rounded-2xl mb-6"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <div className="p-4 rounded-xl mb-4 flex items-center justify-between" style={{ background: 'var(--card2)' }}>
          <div>
            <span className="text-xs text-gray-400 block mb-0.5">Withdrawable Winning Cash</span>
            <span className="text-2xl font-extrabold text-warning">₹{winningBal}</span>
          </div>
          <Trophy className="w-8 h-8 text-warning opacity-70" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Withdrawal Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-gray-400 font-bold">₹</span>
              <input
                type="number"
                className="form-input pl-8 font-mono font-bold text-lg"
                placeholder="Enter amount"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={10}
                max={winningBal}
                required
              />
            </div>
            <span className="text-[11px] text-gray-500 mt-1 block">Minimum withdrawal: ₹10</span>
          </div>

          <div className="form-group mb-4">
            <label className="text-xs font-semibold text-gray-300 mb-1.5 block">UPI ID for Payout</label>
            <input
              type="text"
              className="form-input font-mono"
              placeholder="e.g. mobile@upi or name@okaxis"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || winningBal < 10 || amount > winningBal}
          >
            {loading ? <div className="spinner" /> : <span>Submit Withdrawal Request</span>}
          </button>
        </form>
      </div>

      <div className="section-title">
        <span>Withdrawal Requests</span>
      </div>
      <div id="withdrawHistoryList">
        {withdrawTransactions.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">No withdrawal requests found.</p>
        ) : (
          withdrawTransactions.map((tx) => (
            <div key={tx.id} className="tx-item">
              <div className="tx-left">
                <div className="tx-icon debit">
                  <ArrowUpCircle className="w-5 h-5 text-danger" />
                </div>
                <div>
                  <div className="tx-title">Withdrawal to {tx.upi || 'UPI'}</div>
                  <div className="tx-date">
                    {new Date(tx.timestamp).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
              <div className="tx-right">
                <div className="tx-amount debit">-₹{tx.amount}</div>
                <span className={`tx-status ${tx.status || 'pending'}`}>{tx.status}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
