import React, { useState } from 'react';
import { UserProfile } from '../types';

interface EditProfileProps {
  profile: UserProfile | null;
  onUpdateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  onChangePassword: (newPass: string) => Promise<void>;
}

export const EditProfile: React.FC<EditProfileProps> = ({
  profile,
  onUpdateProfile,
  onChangePassword,
}) => {
  const [firstName, setFirstName] = useState(profile?.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(profile?.name?.split(' ').slice(1).join(' ') || '');
  const [gameName, setGameName] = useState(profile?.gameName || '');
  const [gameUID, setGameUID] = useState(profile?.gameUID || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [dob, setDob] = useState(profile?.dob || '');
  const [gender, setGender] = useState(profile?.gender || 'male');
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Password reset fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingPass, setLoadingPass] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      await onUpdateProfile({
        name: fullName,
        gameName,
        gameUID,
        phone,
        dob,
        gender,
      });
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setLoadingPass(true);
    try {
      await onChangePassword(newPassword);
      setNewPassword('');
      setConfirmPassword('');
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <div className="page active" id="editProfilePage">
      <div className="section-title">
        <span>Personal Details</span>
      </div>

      <div className="p-4 rounded-2xl mb-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <form onSubmit={handleProfileSubmit}>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="form-group">
              <label className="text-xs font-semibold text-gray-300 mb-1 block">First Name</label>
              <input
                type="text"
                className="form-input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="text-xs font-semibold text-gray-300 mb-1 block">Last Name</label>
              <input
                type="text"
                className="form-input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="form-group">
              <label className="text-xs font-semibold text-gray-300 mb-1 block">In-Game Name</label>
              <input
                type="text"
                className="form-input"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="text-xs font-semibold text-gray-300 mb-1 block">Game UID</label>
              <input
                type="text"
                className="form-input"
                value={gameUID}
                onChange={(e) => setGameUID(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group mb-3">
            <label className="text-xs font-semibold text-gray-300 mb-1 block">Email Address (Read-only)</label>
            <input
              type="email"
              className="form-input opacity-60"
              value={profile?.email || ''}
              readOnly
            />
          </div>

          <div className="form-group mb-3">
            <label className="text-xs font-semibold text-gray-300 mb-1 block">Mobile Number</label>
            <input
              type="tel"
              className="form-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 9876543210"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="form-group">
              <label className="text-xs font-semibold text-gray-300 mb-1 block">Date of Birth</label>
              <input
                type="date"
                className="form-input"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="text-xs font-semibold text-gray-300 mb-1 block">Gender</label>
              <select
                className="form-input"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loadingProfile}>
            {loadingProfile ? <div className="spinner" /> : <span>Update Profile</span>}
          </button>
        </form>
      </div>

      <div className="section-title">
        <span>Change Password</span>
      </div>

      <div className="p-4 rounded-2xl mb-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <form onSubmit={handlePassSubmit}>
          <div className="form-group mb-3">
            <label className="text-xs font-semibold text-gray-300 mb-1 block">New Password</label>
            <input
              type="password"
              className="form-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              minLength={6}
              required
            />
          </div>
          <div className="form-group mb-4">
            <label className="text-xs font-semibold text-gray-300 mb-1 block">Confirm Password</label>
            <input
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              minLength={6}
              required
            />
          </div>
          <button type="submit" className="btn btn-secondary" disabled={loadingPass}>
            {loadingPass ? <div className="spinner" /> : <span>Update Password</span>}
          </button>
        </form>
      </div>
    </div>
  );
};
