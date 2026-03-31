export type CartItem = {
  imageUrl?: string;
  name: string;
  price: number;
  productId: string;
  quantity: number;
  storeId: string;
  unit?: string;
};

export type CartItemInput = Omit<CartItem, 'quantity'> & {
  quantity?: number;
};

export type CartState = {
  items: CartItem[];
  updatedAt: string | null;
};

export type CartMutationMeta = {
  updatedAt?: string | null;
};

export type CartStoreConflict = {
  incomingStoreId: string;
  storeId: string;
};

export type CartAction =
  | {
      type: 'hydrate-cart';
      payload: CartState;
    }
  | {
      type: 'add-item';
      payload: CartMutationMeta & {
        item: CartItemInput;
      };
    }
  | {
      type: 'remove-item';
      payload: CartMutationMeta & {
        productId: string;
      };
    }
  | {
      type: 'set-quantity';
      payload: CartMutationMeta & {
        productId: string;
        quantity: number;
      };
    }
  | {
      type: 'increment-item';
      payload: CartMutationMeta & {
        productId: string;
      };
    }
  | {
      type: 'decrement-item';
      payload: CartMutationMeta & {
        productId: string;
      };
    }
  | {
      type: 'clear-cart';
      payload?: CartMutationMeta;
    };
