import { useEffect, useState } from 'react';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { ApiClientError } from '@acme/api-client';
import { listCoupons, createCoupon, updateCoupon, deleteCoupon } from '@acme/api-client/admin';
import type { Coupon, CouponInput, UpdateCouponInput, DiscountType } from '@acme/api-client/admin';
import { useAdminAuth } from '../../admin/use-admin-auth';
import { AdminTable, type Column } from '../../components/admin/shared/admin-table';
import { ConfirmDialog } from '../../components/admin/shared/confirm-dialog';
import { CouponForm } from '../../components/admin/coupons/coupon-form';

export function AdminCouponsPage(): React.JSX.Element {
  const { token, handleUnauthorized } = useAdminAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deletingCoupon, setDeletingCoupon] = useState<Coupon | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingCouponId, setTogglingCouponId] = useState<string | null>(null);

  const fetchCoupons = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const data = await listCoupons(token!);
      setCoupons(data);
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) {
        handleUnauthorized();
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchCoupons();
  }, []);

  const handleCreate = async (values: {
    code: string;
    discountType: DiscountType;
    discountValue: number;
    startsAt: string;
    endsAt: string;
    isActive: boolean;
    maxUses: string;
  }): Promise<void> => {
    const input: CouponInput = {
      code: values.code,
      discountType: values.discountType,
      discountValue: values.discountValue,
      startsAt: values.startsAt,
      endsAt: values.endsAt,
      isActive: values.isActive,
      maxUses: values.maxUses !== '' ? parseInt(values.maxUses, 10) : null
    };
    try {
      await createCoupon(input, token!);
      setShowForm(false);
      await fetchCoupons();
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) {
        handleUnauthorized();
        return;
      }
      throw error;
    }
  };

  const handleUpdate = async (values: {
    code: string;
    discountType: DiscountType;
    discountValue: number;
    startsAt: string;
    endsAt: string;
    isActive: boolean;
    maxUses: string;
  }): Promise<void> => {
    if (editingCoupon === null) return;
    const input: UpdateCouponInput = {
      code: values.code,
      discountType: values.discountType,
      discountValue: values.discountValue,
      startsAt: values.startsAt,
      endsAt: values.endsAt,
      isActive: values.isActive,
      maxUses: values.maxUses !== '' ? parseInt(values.maxUses, 10) : null
    };
    try {
      await updateCoupon(editingCoupon.id, input, token!);
      setShowForm(false);
      setEditingCoupon(null);
      await fetchCoupons();
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) {
        handleUnauthorized();
        return;
      }
      throw error;
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (deletingCoupon === null) return;
    setIsDeleting(true);
    try {
      await deleteCoupon(deletingCoupon.id, token!);
      setDeletingCoupon(null);
      await fetchCoupons();
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) {
        handleUnauthorized();
        return;
      }
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (coupon: Coupon): Promise<void> => {
    setTogglingCouponId(coupon.id);
    try {
      await updateCoupon(coupon.id, { isActive: !coupon.isActive }, token!);
      await fetchCoupons();
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) {
        handleUnauthorized();
        return;
      }
      throw error;
    } finally {
      setTogglingCouponId(null);
    }
  };

  const openCreateForm = (): void => {
    setEditingCoupon(null);
    setShowForm(true);
  };

  const openEditForm = (coupon: Coupon): void => {
    setEditingCoupon(coupon);
    setShowForm(true);
  };

  const closeForm = (): void => {
    setShowForm(false);
    setEditingCoupon(null);
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatDiscountValue = (coupon: Coupon): string => {
    if (coupon.discountType === 'fixed') {
      return `${coupon.discountValue.toFixed(2)} MAD`;
    }
    return `${coupon.discountValue}%`;
  };

  const columns: Column<Coupon>[] = [
    {
      header: 'Code',
      render: (coupon) => (
        <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>{coupon.code}</span>
      )
    },
    {
      header: 'Type',
      render: (coupon) => coupon.discountType === 'fixed' ? 'Fixed' : 'Percentage'
    },
    {
      header: 'Value',
      render: (coupon) => formatDiscountValue(coupon)
    },
    {
      header: 'Active',
      render: (coupon) => (
        <button
          type="button"
          onClick={() => { void handleToggleActive(coupon); }}
          disabled={togglingCouponId === coupon.id}
          style={{
            position: 'relative',
            width: '44px',
            height: '24px',
            borderRadius: '12px',
            border: 'none',
            backgroundColor: coupon.isActive ? '#1f6446' : '#d6d3d1',
            cursor: togglingCouponId === coupon.id ? 'wait' : 'pointer',
            transition: 'background-color 0.2s',
            padding: 0
          }}
          aria-label={coupon.isActive ? 'Deactivate coupon' : 'Activate coupon'}
        >
          <span
            style={{
              position: 'absolute',
              top: '2px',
              left: coupon.isActive ? '22px' : '2px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              transition: 'left 0.2s'
            }}
          />
        </button>
      )
    },
    {
      header: 'Starts',
      render: (coupon) => formatDate(coupon.startsAt)
    },
    {
      header: 'Ends',
      render: (coupon) => formatDate(coupon.endsAt)
    },
    {
      header: 'Uses',
      render: (coupon) => (
        <span>
          {coupon.usedCount} / {coupon.maxUses !== null ? coupon.maxUses : '∞'}
        </span>
      )
    },
    {
      header: 'Actions',
      width: '120px',
      render: (coupon) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => { openEditForm(coupon); }}
            style={{
              padding: '6px 10px',
              borderRadius: '4px',
              border: '1px solid #d6d3d1',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <FiEdit2 size={14} />
          </button>
          <button
            type="button"
            onClick={() => { setDeletingCoupon(coupon); }}
            style={{
              padding: '6px 10px',
              borderRadius: '4px',
              border: '1px solid #d6d3d1',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  const dateToFormValue = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1c1917', margin: 0 }}>
          Coupons
        </h1>
        <button
          type="button"
          onClick={openCreateForm}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#1f6446',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <FiPlus size={16} />
          New Coupon
        </button>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <AdminTable<Coupon>
          columns={columns}
          data={coupons}
          keyExtractor={(c) => c.id}
          isLoading={isLoading}
          emptyMessage="No coupons found."
        />
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.4)'
          }}
          role="dialog"
          aria-modal="true"
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
              padding: '24px',
              width: '100%',
              maxWidth: '480px',
              maxHeight: '90vh',
              overflowY: 'auto' as const
            }}
            onClick={(e) => { e.stopPropagation(); }}
          >
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1c1917', margin: '0 0 20px' }}>
              {editingCoupon !== null ? 'Edit Coupon' : 'New Coupon'}
            </h2>
            <CouponForm
              initialValues={editingCoupon !== null ? {
                code: editingCoupon.code,
                discountType: editingCoupon.discountType,
                discountValue: editingCoupon.discountValue,
                startsAt: dateToFormValue(editingCoupon.startsAt),
                endsAt: dateToFormValue(editingCoupon.endsAt),
                isActive: editingCoupon.isActive,
                maxUses: editingCoupon.maxUses !== null ? String(editingCoupon.maxUses) : ''
              } : undefined}
              onSubmit={editingCoupon !== null ? handleUpdate : handleCreate}
              onCancel={closeForm}
              submitLabel={editingCoupon !== null ? 'Update' : 'Create'}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deletingCoupon !== null}
        title="Delete Coupon"
        message={`Are you sure you want to delete coupon "${deletingCoupon?.code}"?`}
        isConfirming={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => { setDeletingCoupon(null); }}
      />
    </div>
  );
}
