import { getCurrencySetting, updateCurrencySetting } from '@acme/api-client/admin';
import { useCallback, useEffect, useState } from 'react';

import { useAdminAuth } from './admin-auth';
import { inputClass, labelClass, primaryBtn } from './ui';

const COMMON_CURRENCIES = ['MAD', 'USD', 'EUR', 'GBP', 'SAR', 'AED', 'CAD'];

export function AdminCurrencyPage() {
  const { token, user } = useAdminAuth();
  const [currency, setCurrency] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const isSuperadmin = user?.role === 'superadmin';

  const load = useCallback(async () => {
    if (!token) {
      return;
    }
    setLoading(true);
    try {
      const setting = await getCurrencySetting(token);
      setCurrency(setting.currencyCode);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load currency');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) {
      return;
    }
    setError(null);
    setSaved(false);
    setBusy(true);
    try {
      const setting = await updateCurrencySetting({ currencyCode: currency.trim().toUpperCase() }, token);
      setCurrency(setting.currencyCode);
      setSaved(true);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Save failed';
      setError(/401|403|forbidden|unauthor/i.test(message) ? 'Only a superadmin can change the currency.' : message);
    } finally {
      setBusy(false);
    }
  };

  const options = Array.from(new Set([currency, ...COMMON_CURRENCIES].filter(Boolean)));

  return (
    <div className="mx-auto max-w-md">
      <header className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Currency</h1>
        <p className="mt-1 text-sm text-slate-500">The shop's global currency code (ISO 4217).</p>
      </header>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        {loading ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className={labelClass} htmlFor="currency-select">Currency code</label>
              <select
                className={inputClass}
                disabled={!isSuperadmin}
                id="currency-select"
                onChange={(event) => setCurrency(event.target.value)}
                value={currency}
              >
                {options.map((code) => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>

            {!isSuperadmin && (
              <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                Only a superadmin can change the currency (you are signed in as {user?.role ?? 'unknown'}).
              </p>
            )}
            {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
            {saved && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Currency updated.</p>}

            <button className={primaryBtn} disabled={busy || !isSuperadmin} type="submit">
              {busy ? 'Saving…' : 'Save'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
