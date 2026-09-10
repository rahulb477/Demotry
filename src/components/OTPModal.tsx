import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck } from 'lucide-react';

interface OTPModalProps {
  email: string;
  onVerify: (otp: string) => Promise<boolean>;
  onResend: () => Promise<boolean>;
  onClose: () => void;
}

export const OTPModal: React.FC<OTPModalProps> = ({
  email,
  onVerify,
  onResend,
  onClose,
}) => {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const newDigits = [...digits];
    newDigits[index] = val;
    setDigits(newDigits);

    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const otp = digits.join('');
    if (otp.length < 6) return;
    setLoading(true);
    await onVerify(otp);
    setLoading(false);
  };

  const handleResendClick = async () => {
    if (timer > 0) return;
    const ok = await onResend();
    if (ok) {
      setTimer(60);
    }
  };

  return (
    <div className="otp-container">
      <div className="update-icon-glow">
        <ShieldCheck className="w-16 h-16 text-primary" />
      </div>
      <div className="update-title-premium">Verify Email Address</div>
      <p style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>
        Enter the 6-digit verification code sent to
        <br />
        <strong className="text-white">{email}</strong>
      </p>

      <div className="otp-input-wrap">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            pattern="[0-9]*"
            inputMode="numeric"
            maxLength={1}
            className="otp-box"
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
          />
        ))}
      </div>

      <span className="otp-timer">
        {timer > 0 ? `Resend code in ${timer}s` : "Didn't receive the code?"}
      </span>

      <button
        type="button"
        className={`btn resend-link ${timer > 0 ? 'disabled' : ''}`}
        onClick={handleResendClick}
        disabled={timer > 0}
        style={{ background: 'transparent', padding: '6px' }}
      >
        Resend Code
      </button>

      <button
        type="button"
        className="btn btn-primary"
        style={{ marginTop: '16px' }}
        onClick={handleSubmit}
        disabled={loading || digits.some((d) => !d)}
      >
        {loading ? <div className="spinner" /> : <span>Verify and Proceed</span>}
      </button>
    </div>
  );
};
