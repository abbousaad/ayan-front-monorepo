export declare const PRODUCT_UNITS: readonly ["g", "kg", "ml", "l", "unit"];
export type ProductUnit = (typeof PRODUCT_UNITS)[number];
export type Product = {
    id: string;
    storeId: string;
    name: string;
    price: number;
    currencyCode: string;
    stock: number;
    description: string | null;
    imageUrl: string;
    unit: ProductUnit;
};
export type ProductsQuery = {
    storeId?: string;
};
export type ProductsResponse = {
    data: Product[];
};
export type ProductResponse = {
    data: Product;
};
//# sourceMappingURL=types.d.ts.map