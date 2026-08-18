import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { useAdminAuth } from './admin-auth';
import { inputClass, labelClass, primaryBtn } from './ui';

export function AdminLoginPage() {
  const { token, signIn } = useAdminAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (token) {
    return <Navigate replace to="/admin/products" />;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await signIn(username.trim(), password);
      navigate('/admin/products');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Sign in failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4" dir="ltr">
      <form className="w-full max-w-sm space-y-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm" onSubmit={handleSubmit}>
        <div className="text-center">
          <p className="font-display text-2xl font-semibold text-slate-900">Dar Benchekroun</p>
          <p className="mt-1 text-sm text-slate-500">Admin sign in</p>
        </div>

        <div className="space-y-1">
          <label className={labelClass} htmlFor="admin-username">Username</label>
          <input
            autoComplete="username"
            className={inputClass}
            id="admin-username"
            onChange={(event) => setUsername(event.target.value)}
            required
            value={username}
          />
        </div>

        <div className="space-y-1">
          <label className={labelClass} htmlFor="admin-password">Password</label>
          <input
            autoComplete="current-password"
            className={inputClass}
            id="admin-password"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </div>

        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

        <button className={`${primaryBtn} w-full`} disabled={busy} type="submit">
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
