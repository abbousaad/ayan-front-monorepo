export declare const STORE_CATEGORIES: readonly ["fruits", "vegets", "ham", "fish", "ingrediant"];
export type StoreCategory = (typeof STORE_CATEGORIES)[number];
export type Store = {
    id: string;
    name: string;
    category: StoreCategory;
    slug: string;
};
export type StoresResponse = {
    data: Store[];
};
export type StoreResponse = {
    data: Store;
};
//# sourceMappingURL=types.d.ts.map