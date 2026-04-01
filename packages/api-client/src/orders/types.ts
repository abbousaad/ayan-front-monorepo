export type DeliveryMode = 'instant' | 'scheduled';

export interface GuestInfo {
  name: string;
  phone: string;
  address: string;
  email?: string;
}

export interface CreatePublicOrderItem {
  productId: string;
  quantity: number;
}

export interface CreatePublicOrderRequest {
  guest: GuestInfo;
  deliveryMode: DeliveryMode;
  scheduledAt?: string;
  couponCode?: string;
  items: CreatePublicOrderItem[];
}

export interface PublicOrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface PublicOrder {
  id: string;
  guestName: string;
  guestPhone: string;
  guestAddress: string;
  deliveryMode: DeliveryMode;
  status: string;
  subtotalAmount?: number;
  deliveryFee?: number;
  grandTotal?: number;
  totalAmount?: number;
  items?: PublicOrderItem[];
}

export interface CreatePublicOrderResponse {
  data: PublicOrder;
}
