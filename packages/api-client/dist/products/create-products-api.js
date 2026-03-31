import { getProductById } from './get-product-by-id';
import { getProducts } from './get-products';
export const createProductsApi = (config) => ({
    getProducts: (query) => getProducts(config, query),
    getProductById: (productId) => getProductById(config, productId)
});
//# sourceMappingURL=create-products-api.js.map