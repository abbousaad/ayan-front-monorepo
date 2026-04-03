import { ApiClientError } from '../shared/api-client-error';

import type { CreatePublicOrderResponse, PricingConfig, PublicOrder, PublicOrderItem } from './types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isPublicOrderItem = (value: unknown): value is PublicOrderItem => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.productId === 'string' &&
    typeof value.quantity === 'number' &&
    typeof value.unitPrice === 'number' &&
    typeof value.lineTotal === 'number'
  );
};

const isDeliveryMode = (value: unknown): value is PublicOrder['deliveryMode'] =>
  value === 'instant' || value === 'scheduled';

const isPublicOrder = (value: unknown): value is PublicOrder => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    typeof value.guestName === 'string' &&
    typeof value.guestPhone === 'string' &&
    typeof value.guestAddress === 'string' &&
    isDeliveryMode(value.deliveryMode) &&
    typeof value.status === 'string' &&
    (value.subtotalAmount === undefined || typeof value.subtotalAmount === 'number') &&
    (value.deliveryFee === undefined || typeof value.deliveryFee === 'number') &&
    (value.grandTotal === undefined || typeof value.grandTotal === 'number') &&
    (value.totalAmount === undefined || typeof value.totalAmount === 'number') &&
    (value.items === undefined || (Array.isArray(value.items) && value.items.every(isPublicOrderItem)))
  );
};

const isPricingConfig = (value: unknown): value is PricingConfig => {
  if (!isRecord(value)) {
    return false;
  }

  return typeof value.deliveryFee === 'number' && typeof value.discountRate === 'number';
};

export const parsePublicPricingConfigResponse = (value: unknown): PricingConfig | null => {
  const data = isRecord(value) && 'data' in value ? value.data : value;

  if (!isPricingConfig(data)) {
    return null;
  }

  return data;
};

export const parseCreatePublicOrderResponse = (value: unknown): CreatePublicOrderResponse => {
  if (!isRecord(value) || !isPublicOrder(value.data)) {
    throw new ApiClientError({
      code: 'INVALID_ORDER_RESPONSE',
      message: 'The order response did not match the expected format.'
    });
  }

  return { data: value.data };
};
