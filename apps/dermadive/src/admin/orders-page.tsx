import {
  acceptPublicOrderDelivery,
  confirmPublicOrder,
  listPublicOrders,
  markPublicOrderPaid
} from '@acme/api-client/admin';
import type { PublicOrderStatus } from '@acme/api-client/admin';
import { useCallback, useEffect, useState } from 'react';

import { useAdminAuth } from './admin-auth';
import { ghostBtn, primaryBtn } from './ui';

type AdminOrder = {
  id: string;
  status: PublicOrderStatus;
  guestName?: string;
  guestPhone?: string;
  guestAddress?: string;
  totalAmount?: number;
  grandTotal?: number;
  createdAt?: string;
};

const STATUS_META: Record<PublicOrderStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-amber-100 text-amber-800' },
  onpreparation: { label: 'Preparing', className: 'bg-blue-100 text-blue-800' },
  ondelivery: { label: 'Out for delivery', className: 'bg-indigo-100 text-indigo-800' },
  paid: { label: 'Paid', className: 'bg-emerald-100 text-emerald-800' }
};

// Each status advances to the next via one action.
const NEXT_ACTION: Partial<
  Record<PublicOrderStatus, { label: string; run: (id: string, token: string) => Promise<void> }>
> = {
  pending: { label: 'Confirm', run: confirmPublicOrder },
  onpreparation: { label: 'Send for delivery', run: acceptPublicOrderDelivery },
  ondelivery: { label: 'Mark paid', run: markPublicOrderPaid }
};

export function AdminOrdersPage() {
  const { token } = useAdminAuth();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) {
      return;
    }
    setLoading(true);
    try {
      const response = (await listPublicOrders(token)) as { data?: AdminOrder[] } | AdminOrder[];
      const data = Array.isArray(response) ? response : (response.data ?? []);
      setOrders(data);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const advance = async (order: AdminOrder) => {
    const action = NEXT_ACTION[order.status];
    if (!action || !token) {
      return;
    }
    setBusyId(order.id);
    try {
      await action.run(order.id, token);
      await load();
    } finally {
      setBusyId(null);
    }
  };

  const money = (order: AdminOrder) => {
    const total = order.grandTotal ?? order.totalAmount;
    return total === undefined ? '—' : Number(total).toFixed(2);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Orders</h1>
        <button className={ghostBtn} onClick={() => void load()} type="button">Refresh</button>
      </header>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td className="px-4 py-6 text-slate-400" colSpan={5}>Loading…</td></tr>
            ) : orders.length === 0 ? (
              <tr><td className="px-4 py-6 text-slate-400" colSpan={5}>No orders yet.</td></tr>
            ) : (
              orders.map((order) => {
                const meta = STATUS_META[order.status] ?? { label: order.status, className: 'bg-slate-100 text-slate-700' };
                const action = NEXT_ACTION[order.status];
                return (
                  <tr key={order.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{order.guestName ?? '—'}</p>
                      {order.guestAddress && <p className="text-xs text-slate-500">{order.guestAddress}</p>}
                    </td>
                    <td className="px-4 py-3 text-slate-600" dir="ltr">{order.guestPhone ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{money(order)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${meta.className}`}>{meta.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        {action ? (
                          <button className={primaryBtn} disabled={busyId === order.id} onClick={() => void advance(order)} type="button">
                            {busyId === order.id ? '…' : action.label}
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">Complete</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
