import type { ApiClientConfig } from '../shared/types';
import type { ProductsQuery } from './types';
export declare const createProductsApi: (config: ApiClientConfig) => {
    getProducts: (query?: ProductsQuery) => Promise<import("./types").ProductsResponse>;
    getProductById: (productId: string) => Promise<import("./types").ProductResponse>;
};
//# sourceMappingURL=create-products-api.d.ts.map