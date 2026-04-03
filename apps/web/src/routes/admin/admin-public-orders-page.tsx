import { ApiClientError } from '@acme/api-client';
import {
  acceptPublicOrderDelivery,
  confirmPublicOrder,
  listPublicOrders,
  markPublicOrderPaid,
  type PublicOrder,
  type PublicOrderStatus
} from '@acme/api-client/admin';
import { useEffect, useMemo, useState } from 'react';

import { useAdminAuth } from '../../admin/use-admin-auth';
import { AdminTable, type Column } from '../../components/admin/shared/admin-table';

type StatusFilter = 'all' | PublicOrderStatus;

type StatusBadgeStyle = {
  backgroundColor: string;
  color: string;
};

const STATUS_BADGE_STYLES: Record<PublicOrderStatus, StatusBadgeStyle> = {
  pending: { backgroundColor: '#fef9c3', color: '#713f12' },
  onpreparation: { backgroundColor: '#dbeafe', color: '#1e3a5f' },
  ondelivery: { backgroundColor: '#ffedd5', color: '#7c2d12' },
  paid: { backgroundColor: '#dcfce7', color: '#166534' }
};

const STATUS_LABELS: Record<PublicOrderStatus, string> = {
  pending: 'Pending',
  onpreparation: 'On Preparation',
  ondelivery: 'On Delivery',
  paid: 'Paid'
};

const CREATED_AT_KEYS = ['createdAt', 'created_at', 'created'] as const;
const TOTAL_KEYS = ['total', 'totalAmount', 'total_amount', 'amount', 'grandTotal', 'grand_total'] as const;

const isPublicOrderArray = (value: unknown): value is PublicOrder[] => Array.isArray(value);

const extractOrders = (value: unknown): PublicOrder[] => {
  if (isPublicOrderArray(value)) return value;

  if (value && typeof value === 'object') {
    const data = (value as { data?: unknown }).data;
    if (isPublicOrderArray(data)) return data;
  }

  return [];
};

const resolveOrderId = (order: PublicOrder): string => {
  if (typeof order.id === 'string') return order.id;
  const fallbackId = (order as { _id?: unknown })._id;
  return typeof fallbackId === 'string' ? fallbackId : '';
};

const resolveRowKey = (order: PublicOrder): string => {
  const rowKey = (order as { __rowKey?: unknown }).__rowKey;
  if (typeof rowKey === 'string') return rowKey;
  return resolveOrderId(order) || 'public-order';
};

const truncateId = (value: string): string => {
  if (value.length <= 12) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
};

const resolveKey = (order: PublicOrder, keys: readonly string[]): string | null => {
  const orderRecord = order as Record<string, unknown>;
  const match = keys.find((key) => Object.prototype.hasOwnProperty.call(orderRecord, key));
  return match ?? null;
};

const formatDate = (value: unknown): string => {
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleString();
    }
  }
  return '-';
};

const formatTotal = (value: unknown): string => {
  if (typeof value === 'number') {
    return value.toFixed(2);
  }
  if (typeof value === 'string') {
    return value;
  }
  return '-';
};

export function AdminPublicOrdersPage(): React.JSX.Element {
  const { token, handleUnauthorized } = useAdminAuth();
  const [orders, setOrders] = useState<PublicOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [actionOrderId, setActionOrderId] = useState<string | null>(null);

  const fetchOrders = async (filter: StatusFilter): Promise<void> => {
    if (!token) {
      setErrorMessage('You must be signed in to view public orders.');
      setOrders([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const status = filter === 'all' ? undefined : filter;
      const response = await listPublicOrders(token, status);
      const extracted = extractOrders(response);
      setOrders(
        extracted.map((order, index) => ({
          ...order,
          __rowKey: resolveOrderId(order) || `public-order-${index}`
        }))
      );
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 401) {
        handleUnauthorized();
        return;
      }
      if (err instanceof ApiClientError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchOrders(statusFilter);
  }, [statusFilter, token]);

  const handleAction = async (
    orderId: string,
    status: PublicOrderStatus
  ): Promise<void> => {
    if (!token) {
      setErrorMessage('You must be signed in to update public orders.');
      return;
    }

    setActionOrderId(orderId);
    setErrorMessage(null);

    try {
      if (status === 'pending') {
        await confirmPublicOrder(orderId, token);
      } else if (status === 'onpreparation') {
        await acceptPublicOrderDelivery(orderId, token);
      } else if (status === 'ondelivery') {
        await markPublicOrderPaid(orderId, token);
      }
      await fetchOrders(statusFilter);
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 401) {
        handleUnauthorized();
        return;
      }
      if (err instanceof ApiClientError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    } finally {
      setActionOrderId(null);
    }
  };

  const sampleOrder = orders[0];
  const createdKey = sampleOrder ? resolveKey(sampleOrder, CREATED_AT_KEYS) : null;
  const totalKey = sampleOrder ? resolveKey(sampleOrder, TOTAL_KEYS) : null;

  const columns = useMemo<Column<PublicOrder>[]>(() => {
    const baseColumns: Column<PublicOrder>[] = [
      {
        header: 'ID',
        render: (order) => {
          const id = resolveOrderId(order);
          return id ? truncateId(id) : '-';
        }
      },
      {
        header: 'Status',
        render: (order) => {
          const status = order.status;
          const badgeStyle = STATUS_BADGE_STYLES[status];
          return (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: badgeStyle.backgroundColor,
                color: badgeStyle.color
              }}
            >
              {STATUS_LABELS[status]}
            </span>
          );
        }
      }
    ];

    if (createdKey) {
      baseColumns.push({
        header: 'Created',
        render: (order) => {
          const createdValue = (order as Record<string, unknown>)[createdKey];
          return formatDate(createdValue);
        }
      });
    }

    if (totalKey) {
      baseColumns.push({
        header: 'Total',
        render: (order) => {
          const totalValue = (order as Record<string, unknown>)[totalKey];
          return formatTotal(totalValue);
        }
      });
    }

    baseColumns.push({
      header: 'Actions',
      width: '180px',
      render: (order) => {
        const orderId = resolveOrderId(order);
        const isActing = actionOrderId === orderId;

        if (!orderId) return '-';

        if (order.status === 'paid') {
          return '-';
        }

        const label =
          order.status === 'pending'
            ? 'Confirm'
            : order.status === 'onpreparation'
              ? 'Accept Delivery'
              : 'Mark Paid';

        return (
          <button
            type="button"
            onClick={() => { void handleAction(orderId, order.status); }}
            disabled={isActing}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #d6d3d1',
              backgroundColor: '#ffffff',
              color: '#1c1917',
              fontSize: '13px',
              fontWeight: '600',
              cursor: isActing ? 'not-allowed' : 'pointer'
            }}
          >
            {isActing ? 'Processing...' : label}
          </button>
        );
      }
    });

    return baseColumns;
  }, [actionOrderId, createdKey, totalKey]);

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1c1917', margin: 0 }}>
          Public Orders
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="public-orders-status" style={{ fontSize: '14px', fontWeight: '500', color: '#1c1917' }}>
            Status
          </label>
          <select
            id="public-orders-status"
            value={statusFilter}
            onChange={(event) => { setStatusFilter(event.target.value as StatusFilter); }}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #d6d3d1',
              fontSize: '14px',
              color: '#1c1917',
              backgroundColor: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="onpreparation">On Preparation</option>
            <option value="ondelivery">On Delivery</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      {errorMessage && (
        <div
          role="alert"
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            fontSize: '14px'
          }}
        >
          {errorMessage}
        </div>
      )}

      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <AdminTable<PublicOrder>
          columns={columns}
          data={orders}
          keyExtractor={resolveRowKey}
          isLoading={isLoading}
          emptyMessage="No public orders found."
        />
      </div>
    </div>
  );
}
