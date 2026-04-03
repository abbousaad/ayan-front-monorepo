import { useEffect, useState } from 'react';
import { ApiClientError } from '@acme/api-client';
import { listPublicOrders, listCoupons, type PublicOrder, type Coupon } from '@acme/api-client/admin';
import { getProducts } from '@acme/api-client/products';
import type { Product } from '@acme/api-client/products';
import { useAdminAuth } from '../../admin/use-admin-auth';
import { StatTile } from '../../components/admin/shared/stat-tile';

type DashboardStats = {
  pendingOrders: number;
  inProgressOrders: number;
  todayRevenue: number;
  totalRevenue: number;
  activeCoupons: number;
  expiringSoonCoupons: number;
  lowStockProducts: number;
};

const extractOrders = (value: unknown): PublicOrder[] => {
  if (Array.isArray(value)) return value as PublicOrder[];
  if (value && typeof value === 'object') {
    const data = (value as { data?: unknown }).data;
    if (Array.isArray(data)) return data as PublicOrder[];
  }
  return [];
};

const formatCurrency = (n: number): string =>
  `${n.toLocaleString('fr-DZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD`;

const deriveStats = (orders: PublicOrder[], coupons: Coupon[], products: Product[]): DashboardStats => {
  const todayStr = new Date().toDateString();
  const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const inProgressOrders = orders.filter(
    (o) => o.status === 'onpreparation' || o.status === 'ondelivery'
  ).length;

  const orderRecord = (o: PublicOrder) => o as Record<string, unknown>;
  const resolveTotal = (o: PublicOrder): number => {
    const rec = orderRecord(o);
    const v = rec['grandTotal'] ?? rec['totalAmount'] ?? rec['total'];
    return typeof v === 'number' ? v : 0;
  };
  const resolveDate = (o: PublicOrder): string => {
    const rec = orderRecord(o);
    const v = rec['createdAt'] ?? rec['created_at'] ?? rec['created'];
    return typeof v === 'string' ? v : '';
  };

  const todayRevenue = orders
    .filter((o) => new Date(resolveDate(o)).toDateString() === todayStr)
    .reduce((sum, o) => sum + resolveTotal(o), 0);

  const totalRevenue = orders
    .filter((o) => o.status === 'paid')
    .reduce((sum, o) => sum + resolveTotal(o), 0);

  const activeCoupons = coupons.filter((c) => c.isActive).length;
  const expiringSoonCoupons = coupons.filter(
    (c) => c.isActive && new Date(c.endsAt) <= sevenDaysFromNow
  ).length;

  const lowStockProducts = products.filter((p) => p.stock < 10).length;

  return {
    pendingOrders,
    inProgressOrders,
    todayRevenue,
    totalRevenue,
    activeCoupons,
    expiringSoonCoupons,
    lowStockProducts
  };
};

export function AdminDashboardPage(): React.JSX.Element {
  const { token, handleUnauthorized } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchStats = async (): Promise<void> => {
      setIsLoading(true);

      const [ordersResult, couponsResult, productsResult] = await Promise.allSettled([
        listPublicOrders(token),
        listCoupons(token),
        getProducts()
      ]);

      // Check for 401 in any result
      for (const result of [ordersResult, couponsResult, productsResult]) {
        if (result.status === 'rejected') {
          const err = result.reason;
          if (err instanceof ApiClientError && err.status === 401) {
            handleUnauthorized();
            return;
          }
        }
      }

      const orders = ordersResult.status === 'fulfilled' ? extractOrders(ordersResult.value) : [];
      const coupons = couponsResult.status === 'fulfilled' ? (couponsResult.value as Coupon[]) : [];
      const products =
        productsResult.status === 'fulfilled'
          ? ((productsResult.value as { data?: unknown }).data as Product[] ?? [])
          : [];

      setStats(deriveStats(orders, coupons, products));
      setIsLoading(false);
    };

    void fetchStats();
  }, [token]);

  const loading = '…';

  const tiles = [
    {
      label: 'Pending Orders',
      value: isLoading ? loading : String(stats?.pendingOrders ?? 0),
      helper: 'need confirmation',
      accentColor: '#dc2626'
    },
    {
      label: 'In Progress',
      value: isLoading ? loading : String(stats?.inProgressOrders ?? 0),
      helper: 'on prep or delivery',
      accentColor: '#1d4ed8'
    },
    {
      label: "Today's Revenue",
      value: isLoading ? loading : formatCurrency(stats?.todayRevenue ?? 0),
      helper: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      accentColor: '#1f6446'
    },
    {
      label: 'Total Revenue',
      value: isLoading ? loading : formatCurrency(stats?.totalRevenue ?? 0),
      helper: 'lifetime paid orders',
      accentColor: '#0f766e'
    },
    {
      label: 'Active Coupons',
      value: isLoading ? loading : String(stats?.activeCoupons ?? 0),
      helper: isLoading
        ? undefined
        : stats && stats.expiringSoonCoupons > 0
          ? `${stats.expiringSoonCoupons} expiring within 7 days`
          : 'none expiring soon',
      accentColor: '#b45309'
    },
    {
      label: 'Low Stock Products',
      value: isLoading ? loading : String(stats?.lowStockProducts ?? 0),
      helper: 'items below 10 units',
      accentColor: '#7c3aed'
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#1c1917', margin: '0 0 6px' }}>
          Dashboard
        </h1>
        <p style={{ fontSize: '14px', color: '#78716c', margin: 0 }}>
          Overview of today&apos;s activity and revenue signals.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}
      >
        {tiles.map((tile) => (
          <StatTile
            key={tile.label}
            label={tile.label}
            value={tile.value}
            helper={tile.helper}
            accentColor={tile.accentColor}
          />
        ))}
      </div>
    </div>
  );
}
