import React, { useState } from 'react';
import { Eye, EyeOff, Swords } from 'lucide-react';

interface AuthProps {
  onLogin: (email: string, pass: string) => Promise<void>;
  onSignupStart: (formData: any) => Promise<void>;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, onSignupStart }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupGameName, setSignupGameName] = useState('');
  const [signupGameUID, setSignupGameUID] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupReferral, setSignupReferral] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onLogin(loginEmail.trim(), loginPassword);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSignupStart({
        name: signupName.trim(),
        email: signupEmail.trim(),
        phone: signupPhone.trim(),
        gameName: signupGameName.trim(),
        gameUID: signupGameUID.trim(),
        password: signupPassword,
        ref: signupReferral.trim().toUpperCase(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="authContainer">
      <div className="auth-wrapper">
        <div className="auth-header">
          <h1>
            <Swords className="w-8 h-8 text-primary inline" />
            <span>BattleZone X</span>
          </h1>
          <p>Battle Royale Tournament Platform</p>
        </div>

        <div className="auth-tabs">
          <div
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </div>
          <div
            className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </div>
        </div>

        {activeTab === 'login' && (
          <form className="auth-form active" onSubmit={handleLoginSubmit} id="loginForm">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="form-input"
                id="loginEmail"
                placeholder="Enter email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="password-toggle">
                <input
                  type={showLoginPass ? 'text' : 'password'}
                  className="form-input"
                  id="loginPassword"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => setShowLoginPass(!showLoginPass)}
                >
                  {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" id="loginBtn" disabled={loading}>
              {loading ? <div className="spinner" /> : <span>Login</span>}
            </button>
            <div className="auth-divider">
              <span>OR</span>
            </div>
            <p className="auth-footer">
              Don't have an account?{' '}
              <a onClick={() => setActiveTab('signup')}>Sign Up</a>
            </p>
          </form>
        )}

        {activeTab === 'signup' && (
          <form className="auth-form active" onSubmit={handleSignupSubmit} id="signupForm">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                className="form-input"
                id="signupName"
                placeholder="Your name"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="form-input"
                id="signupEmail"
                placeholder="Email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number (Optional)</label>
              <input
                type="tel"
                className="form-input"
                id="signupPhone"
                placeholder="Enter phone number"
                value={signupPhone}
                onChange={(e) => setSignupPhone(e.target.value)}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Game Name</label>
                <input
                  type="text"
                  className="form-input"
                  id="signupGameName"
                  placeholder="In-game name"
                  value={signupGameName}
                  onChange={(e) => setSignupGameName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Game UID</label>
                <input
                  type="text"
                  className="form-input"
                  id="signupGameUID"
                  placeholder="Game UID"
                  value={signupGameUID}
                  onChange={(e) => setSignupGameUID(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Password (Min 6 chars)</label>
              <div className="password-toggle">
                <input
                  type={showSignupPass ? 'text' : 'password'}
                  className="form-input"
                  id="signupPassword"
                  placeholder="Min 6 chars"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => setShowSignupPass(!showSignupPass)}
                >
                  {showSignupPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Referral Code (Optional)</label>
              <input
                type="text"
                className="form-input"
                id="signupReferral"
                placeholder="Referral code"
                value={signupReferral}
                onChange={(e) => setSignupReferral(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" id="signupBtn" disabled={loading}>
              {loading ? <div className="spinner" /> : <span>Sign Up</span>}
            </button>
            <div className="auth-divider">
              <span>OR</span>
            </div>
            <p className="auth-footer">
              Already have an account?{' '}
              <a onClick={() => setActiveTab('login')}>Login</a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
