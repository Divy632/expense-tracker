import { useState } from 'react';
import toast from 'react-hot-toast';
import AppLayout from '../components/AppLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';

const inputClass =
  'w-full rounded-lg bg-ink border border-white/10 px-3 py-2.5 text-sm text-paper placeholder:text-slate-light focus:border-gold/60 focus:outline-none';
const labelClass = 'mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-light';
const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD'];
const AVATAR_COLORS = ['#1F6F5C', '#C9973E', '#B24C3A', '#3B6FA0', '#8B5E83'];

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    currency: user?.currency || 'USD',
    monthlyIncome: user?.monthlyIncome || 0,
    avatarColor: user?.avatarColor || '#1F6F5C',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [savingPw, setSavingPw] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { data } = await api.put('/auth/me', profile);
      updateUser(data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    setSavingPw(true);
    try {
      await api.put('/auth/change-password', pwForm);
      toast.success('Password changed');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <AppLayout title="Settings">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
        <form
          onSubmit={handleProfileSubmit}
          className="rounded-2xl bg-ink-light border border-white/5 p-6 space-y-4"
        >
          <h3 className="font-display text-lg text-paper">Profile</h3>

          <div>
            <label className={labelClass}>Full name</label>
            <input
              className={inputClass}
              value={profile.name}
              onChange={(e) => setProfile((f) => ({ ...f, name: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Currency</label>
              <select
                className={inputClass}
                value={profile.currency}
                onChange={(e) => setProfile((f) => ({ ...f, currency: e.target.value }))}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Monthly income</label>
              <input
                type="number"
                min="0"
                className={`${inputClass} font-mono`}
                value={profile.monthlyIncome}
                onChange={(e) => setProfile((f) => ({ ...f, monthlyIncome: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Avatar color</label>
            <div className="flex gap-2">
              {AVATAR_COLORS.map((color) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => setProfile((f) => ({ ...f, avatarColor: color }))}
                  className="h-8 w-8 rounded-full transition-all"
                  style={{
                    backgroundColor: color,
                    boxShadow: profile.avatarColor === color ? `0 0 0 2px ${color}` : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="rounded-lg bg-gold px-5 py-2 text-sm font-semibold text-ink hover:bg-gold-light transition-colors disabled:opacity-60"
          >
            {savingProfile ? 'Saving...' : 'Save Profile'}
          </button>
        </form>

        <form
          onSubmit={handlePasswordSubmit}
          className="rounded-2xl bg-ink-light border border-white/5 p-6 space-y-4"
        >
          <h3 className="font-display text-lg text-paper">Change Password</h3>

          <div>
            <label className={labelClass}>Current password</label>
            <input
              type="password"
              className={inputClass}
              value={pwForm.currentPassword}
              onChange={(e) => setPwForm((f) => ({ ...f, currentPassword: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>New password</label>
            <input
              type="password"
              minLength={8}
              className={inputClass}
              placeholder="At least 8 characters"
              value={pwForm.newPassword}
              onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))}
            />
          </div>

          <button
            type="submit"
            disabled={savingPw}
            className="rounded-lg bg-gold px-5 py-2 text-sm font-semibold text-ink hover:bg-gold-light transition-colors disabled:opacity-60"
          >
            {savingPw ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </AppLayout>
  );
};

export default Settings;
