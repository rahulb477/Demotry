import React, { useState } from 'react';
import {
  QrCode,
  Copy,
  Check,
  Upload,
  ArrowDownCircle,
} from 'lucide-react';
import { Transaction } from '../types';
import { uploadImage } from '../services/api';

interface DepositProps {
  adminUPI: string;
  transactions: Transaction[];
  onSubmitDeposit: (amount: number, utr: string, screenshotUrl?: string) => Promise<void>;
  onCopyText: (text: string, label: string) => void;
}

export const Deposit: React.FC<DepositProps> = ({
  adminUPI,
  transactions,
  onSubmitDeposit,
  onCopyText,
}) => {
  const [amount, setAmount] = useState<number>(100);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [utr, setUtr] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [copiedUPI, setCopiedUPI] = useState(false);

  const depositTransactions = transactions.filter((t) => t.type === 'deposit');

  const handleGenerateQR = () => {
    if (!amount || amount < 10) {
      alert('Minimum deposit amount is ₹10');
      return;
    }
    setQrGenerated(true);
  };

  const handleCopyUPI = () => {
    onCopyText(adminUPI, 'UPI ID');
    setCopiedUPI(true);
    setTimeout(() => setCopiedUPI(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotFile(file);
      const reader = new FileReader();
      reader.onload = () => setScreenshotPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utr || utr.trim().length < 8) {
      alert('Please enter a valid 12-digit UTR / Reference Number');
      return;
    }
    setLoading(true);
    try {
      let shotUrl = '';
      if (screenshotFile) {
        shotUrl = await uploadImage(screenshotFile, (pct) => setUploadProgress(pct));
      }
      await onSubmitDeposit(amount, utr.trim(), shotUrl);
      // Reset form
      setQrGenerated(false);
      setUtr('');
      setScreenshotFile(null);
      setScreenshotPreview(null);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const upiUrl = `upi://pay?pa=${encodeURIComponent(adminUPI)}&pn=BattleZone&am=${amount}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiUrl)}`;

  return (
    <div className="page active" id="depositPage">
      <div className="section-title">
        <span>Deposit Cash</span>
      </div>

      <div className="deposit-box p-4 rounded-2xl mb-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="form-group mb-4">
          <label className="text-xs font-semibold text-gray-300 mb-2 block">Select Deposit Amount</label>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[50, 100, 200, 500].map((preset) => (
              <button
                key={preset}
                type="button"
                className={`py-2 rounded-xl text-sm font-bold border transition-all ${
                  amount === preset
                    ? 'border-primary bg-primary/20 text-primary'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
                onClick={() => {
                  setAmount(preset);
                  setQrGenerated(false);
                }}
              >
                ₹{preset}
              </button>
            ))}
          </div>
          <div className="relative">
            <span className="absolute left-3 top-3.5 text-gray-400 font-bold">₹</span>
            <input
              type="number"
              className="form-input pl-8 font-mono font-bold text-lg"
              placeholder="Custom Amount"
              value={amount || ''}
              onChange={(e) => {
                setAmount(Number(e.target.value));
                setQrGenerated(false);
              }}
              min={10}
            />
          </div>
        </div>

        {!qrGenerated ? (
          <button className="btn btn-primary" onClick={handleGenerateQR}>
            <QrCode className="w-5 h-5 mr-2" />
            <span>Generate Payment QR</span>
          </button>
        ) : (
          <div id="qrPaymentSection" className="mt-4 pt-4 border-t border-white/10">
            <div className="text-center mb-4">
              <div className="inline-block p-3 bg-white rounded-2xl shadow-xl mb-3">
                <img src={qrCodeUrl} alt="UPI Payment QR Code" className="w-48 h-48 mx-auto" />
              </div>
              <p className="text-xs text-gray-300 font-medium">Scan with Google Pay, PhonePe, Paytm or any UPI App</p>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 mb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase text-gray-400 tracking-wider block">Official UPI ID</span>
                <span className="font-mono text-sm font-bold text-white">{adminUPI}</span>
              </div>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-xs font-semibold hover:bg-primary/30 flex items-center gap-1"
                onClick={handleCopyUPI}
              >
                {copiedUPI ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedUPI ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label className="text-xs font-semibold text-gray-300 mb-1.5 block">
                  12-Digit UTR / UPI Reference Number
                </label>
                <input
                  type="text"
                  className="form-input font-mono"
                  placeholder="e.g. 408291839281"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mb-4">
                <label className="text-xs font-semibold text-gray-300 mb-1.5 block">
                  Payment Screenshot (Optional but recommended)
                </label>
                <label className="border-2 border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                  <Upload className="w-6 h-6 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-400">
                    {screenshotFile ? screenshotFile.name : 'Click to select payment screenshot'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                {screenshotPreview && (
                  <img
                    src={screenshotPreview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg mt-2 border border-white/10"
                  />
                )}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-2">
                    <div className="bg-primary h-full transition-all" style={{ width: `${uploadProgress}%` }} />
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <div className="spinner" /> : <span>Submit Deposit Request</span>}
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="section-title">
        <span>Deposit History</span>
      </div>
      <div id="depositHistoryList">
        {depositTransactions.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">No deposit requests yet.</p>
        ) : (
          depositTransactions.map((tx) => (
            <div key={tx.id} className="tx-item">
              <div className="tx-left">
                <div className="tx-icon credit">
                  <ArrowDownCircle className="w-5 h-5 text-success" />
                </div>
                <div>
                  <div className="tx-title">Deposit (UTR: {tx.utr || '--'})</div>
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
                <div className="tx-amount credit">+₹{tx.amount}</div>
                <span className={`tx-status ${tx.status || 'pending'}`}>{tx.status}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
