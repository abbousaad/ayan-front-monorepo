export declare const productsApiDocs: {
    openapi: string;
    info: {
        title: string;
        version: string;
        description: string;
    };
    servers: {
        url: string;
    }[];
    components: {
        securitySchemes: {
            bearerAuth: {
                type: string;
                scheme: string;
                bearerFormat: string;
            };
        };
        schemas: {
            ErrorResponse: {
                type: string;
                properties: {
                    error: {
                        type: string;
                        properties: {
                            code: {
                                type: string;
                            };
                            message: {
                                type: string;
                            };
                            details: {
                                type: string;
                            };
                        };
                        required: string[];
                    };
                };
                required: string[];
            };
            User: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    username: {
                        type: string;
                    };
                    role: {
                        type: string;
                        enum: string[];
                    };
                    mustChangePassword: {
                        type: string;
                    };
                };
                required: string[];
            };
            Store: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    name: {
                        type: string;
                    };
                    category: {
                        type: string;
                        enum: string[];
                    };
                    slug: {
                        type: string;
                    };
                };
                required: string[];
            };
            Product: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    storeId: {
                        type: string;
                    };
                    name: {
                        type: string;
                    };
                    price: {
                        type: string;
                    };
                    stock: {
                        type: string;
                    };
                    description: {
                        type: string;
                        nullable: boolean;
                    };
                    unit: {
                        type: string;
                        enum: string[];
                    };
                };
                required: string[];
            };
            Coupon: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    code: {
                        type: string;
                    };
                    discountType: {
                        type: string;
                        enum: string[];
                    };
                    discountValue: {
                        type: string;
                    };
                    startsAt: {
                        type: string;
                        format: string;
                    };
                    endsAt: {
                        type: string;
                        format: string;
                    };
                    isActive: {
                        type: string;
                    };
                    maxUses: {
                        type: string;
                        nullable: boolean;
                    };
                    usedCount: {
                        type: string;
                    };
                };
                required: string[];
            };
            Location: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    userId: {
                        type: string;
                    };
                    label: {
                        type: string;
                    };
                    address: {
                        type: string;
                        nullable: boolean;
                    };
                    latitude: {
                        type: string;
                        nullable: boolean;
                    };
                    longitude: {
                        type: string;
                        nullable: boolean;
                    };
                };
                required: string[];
            };
            OrderItem: {
                type: string;
                properties: {
                    productId: {
                        type: string;
                    };
                    productName: {
                        type: string;
                    };
                    unit: {
                        type: string;
                    };
                    quantity: {
                        type: string;
                    };
                    unitPrice: {
                        type: string;
                    };
                    lineTotal: {
                        type: string;
                    };
                };
                required: string[];
            };
            Order: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    userId: {
                        type: string;
                    };
                    locationId: {
                        type: string;
                    };
                    deliveryMode: {
                        type: string;
                        enum: string[];
                    };
                    scheduledAt: {
                        type: string;
                        format: string;
                        nullable: boolean;
                    };
                    status: {
                        type: string;
                        enum: string[];
                    };
                    couponId: {
                        type: string;
                        nullable: boolean;
                    };
                    couponCode: {
                        type: string;
                        nullable: boolean;
                    };
                    subtotal: {
                        type: string;
                    };
                    deliveryFee: {
                        type: string;
                    };
                    serviceFee: {
                        type: string;
                    };
                    taxAmount: {
                        type: string;
                    };
                    discountAmount: {
                        type: string;
                    };
                    couponDiscountAmount: {
                        type: string;
                    };
                    grandTotal: {
                        type: string;
                    };
                    items: {
                        type: string;
                        items: {
                            $ref: string;
                        };
                    };
                };
                required: string[];
            };
            PricingConfig: {
                type: string;
                properties: {
                    deliveryFee: {
                        type: string;
                    };
                    serviceFeeRate: {
                        type: string;
                    };
                    taxRate: {
                        type: string;
                    };
                    discountRate: {
                        type: string;
                    };
                };
                required: string[];
            };
        };
    };
    paths: {
        "/public": {
            get: {
                summary: string;
                responses: {
                    "200": {
                        description: string;
                    };
                };
            };
        };
        "/public/db-status": {
            get: {
                summary: string;
                responses: {
                    "200": {
                        description: string;
                    };
                    "503": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        "/protected": {
            get: {
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    "200": {
                        description: string;
                    };
                    "401": {
                        description: string;
                    };
                };
            };
        };
        "/protected/users/{id}": {
            get: {
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    "401": {
                        description: string;
                    };
                    "403": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        "/auth/login": {
            post: {
                summary: string;
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    username: {
                                        type: string;
                                    };
                                    password: {
                                        type: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        data: {
                                            type: string;
                                            properties: {
                                                token: {
                                                    type: string;
                                                };
                                                user: {
                                                    $ref: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                    "400": {
                        description: string;
                    };
                    "401": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        "/auth/register": {
            post: {
                summary: string;
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    username: {
                                        type: string;
                                    };
                                    password: {
                                        type: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    "201": {
                        description: string;
                    };
                    "400": {
                        description: string;
                    };
                    "409": {
                        description: string;
                    };
                    "422": {
                        description: string;
                    };
                };
            };
        };
        "/auth/change-password": {
            patch: {
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    currentPassword: {
                                        type: string;
                                    };
                                    newPassword: {
                                        type: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    "200": {
                        description: string;
                    };
                    "400": {
                        description: string;
                    };
                    "401": {
                        description: string;
                    };
                    "422": {
                        description: string;
                    };
                };
            };
        };
        "/products": {
            get: {
                summary: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    "200": {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        data: {
                                            type: string;
                                            items: {
                                                $ref: string;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            post: {
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    storeId: {
                                        type: string;
                                    };
                                    name: {
                                        type: string;
                                    };
                                    price: {
                                        type: string;
                                    };
                                    stock: {
                                        type: string;
                                    };
                                    description: {
                                        type: string;
                                    };
                                    unit: {
                                        type: string;
                                        enum: string[];
                                        default: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    "201": {
                        description: string;
                    };
                    "400": {
                        description: string;
                    };
                    "401": {
                        description: string;
                    };
                    "403": {
                        description: string;
                    };
                    "404": {
                        description: string;
                    };
                    "422": {
                        description: string;
                    };
                };
            };
        };
        "/products/{id}": {
            get: {
                summary: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    "200": {
                        description: string;
                    };
                    "404": {
                        description: string;
                    };
                };
            };
            patch: {
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                properties: {
                                    storeId: {
                                        type: string;
                                    };
                                    name: {
                                        type: string;
                                    };
                                    price: {
                                        type: string;
                                    };
                                    stock: {
                                        type: string;
                                    };
                                    description: {
                                        type: string;
                                    };
                                    unit: {
                                        type: string;
                                        enum: string[];
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    "200": {
                        description: string;
                    };
                    "401": {
                        description: string;
                    };
                    "403": {
                        description: string;
                    };
                    "404": {
                        description: string;
                    };
                    "422": {
                        description: string;
                    };
                };
            };
            delete: {
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    "200": {
                        description: string;
                    };
                    "401": {
                        description: string;
                    };
                    "403": {
                        description: string;
                    };
                    "404": {
                        description: string;
                    };
                };
            };
        };
        "/stores": {
            get: {
                summary: string;
                responses: {
                    "200": {
                        description: string;
                    };
                };
            };
            post: {
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    name: {
                                        type: string;
                                    };
                                    category: {
                                        type: string;
                                        enum: string[];
                                    };
                                    slug: {
                                        type: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    "201": {
                        description: string;
                    };
                    "400": {
                        description: string;
                    };
                    "401": {
                        description: string;
                    };
                    "403": {
                        description: string;
                    };
                    "422": {
                        description: string;
                    };
                };
            };
        };
        "/stores/{id}": {
            get: {
                summary: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    "200": {
                        description: string;
                    };
                    "404": {
                        description: string;
                    };
                };
            };
            patch: {
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                properties: {
                                    name: {
                                        type: string;
                                    };
                                    category: {
                                        type: string;
                                        enum: string[];
                                    };
                                    slug: {
                                        type: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    "200": {
                        description: string;
                    };
                    "401": {
                        description: string;
                    };
                    "403": {
                        description: string;
                    };
                    "404": {
                        description: string;
                    };
                    "422": {
                        description: string;
                    };
                };
            };
            delete: {
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    "200": {
                        description: string;
                    };
                    "401": {
                        description: string;
                    };
                    "403": {
                        description: string;
                    };
                    "404": {
                        description: string;
                    };
                };
            };
        };
        "/stores/{id}/products": {
            get: {
                summary: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    "200": {
                        description: string;
                    };
                    "404": {
                        description: string;
                    };
                };
            };
        };
        "/coupons": {
            get: {
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    "200": {
                        description: string;
                    };
                    "401": {
                        description: string;
                    };
                    "403": {
                        description: string;
                    };
                };
            };
            post: {
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    code: {
                                        type: string;
                                    };
                                    discountType: {
                                        type: string;
                                        enum: string[];
                                    };
                                    discountValue: {
                                        type: string;
                                    };
                                    startsAt: {
                                        type: string;
                                        format: string;
                                    };
                                    endsAt: {
                                        type: string;
                                        format: string;
                                    };
                                    isActive: {
                                        type: string;
                                    };
                                    maxUses: {
                                        type: string;
                                        nullable: boolean;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    "201": {
                        description: string;
                    };
                    "401": {
                        description: string;
                    };
                    "403": {
                        description: string;
                    };
                    "409": {
                        description: string;
                    };
                    "422": {
                        description: string;
                    };
                };
            };
        };
        "/coupons/{id}": {
            patch: {
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                properties: {
                                    code: {
                                        type: string;
                                    };
                                    discountType: {
                                        type: string;
                                        enum: string[];
                                    };
                                    discountValue: {
                                        type: string;
                                    };
                                    startsAt: {
                                        type: string;
                                        format: string;
                                    };
                                    endsAt: {
                                        type: string;
                                        format: string;
                                    };
                                    isActive: {
                                        type: string;
                                    };
                                    maxUses: {
                                        type: string;
                                        nullable: boolean;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    "200": {
                        description: string;
                    };
                    "401": {
                        description: string;
                    };
                    "403": {
                        description: string;
                    };
                    "404": {
                        description: string;
                    };
                    "422": {
                        description: string;
                    };
                };
            };
            delete: {
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    "200": {
                        description: string;
                    };
                    "401": {
                        description: string;
                    };
                    "403": {
                        description: string;
                    };
                    "404": {
                        description: string;
                    };
                };
            };
        };
        "/me/locations": {
            get: {
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    "200": {
                        description: string;
                    };
                    "401": {
                        description: string;
                    };
                };
            };
            post: {
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    label: {
                                        type: string;
                                    };
                                    address: {
                                        type: string;
                                    };
                                    latitude: {
                                        type: string;
                                    };
                                    longitude: {
                                        type: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    "201": {
                        description: string;
                    };
                    "400": {
                        description: string;
                    };
                    "401": {
                        description: string;
                    };
                };
            };
        };
        "/me/orders": {
            get: {
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    "200": {
                        description: string;
                    };
                    "401": {
                        description: string;
                    };
                };
            };
        };
        "/orders": {
            post: {
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    locationId: {
                                        type: string;
                                    };
                                    deliveryMode: {
                                        type: string;
                                        enum: string[];
                                    };
                                    scheduledAt: {
                                        type: string;
                                        format: string;
                                    };
                                    couponCode: {
                                        type: string;
                                    };
                                    items: {
                                        type: string;
                                        minItems: number;
                                        items: {
                                            type: string;
                                            required: string[];
                                            properties: {
                                                productId: {
                                                    type: string;
                                                };
                                                quantity: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    "201": {
                        description: string;
                    };
                    "400": {
                        description: string;
                    };
                    "401": {
                        description: string;
                    };
                    "404": {
                        description: string;
                    };
                    "422": {
                        description: string;
                    };
                };
            };
        };
        "/orders/pricing-config": {
            get: {
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    "200": {
                        description: string;
                    };
                    "401": {
                        description: string;
                    };
                    "403": {
                        description: string;
                    };
                };
            };
            patch: {
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                properties: {
                                    deliveryFee: {
                                        type: string;
                                    };
                                    serviceFeeRate: {
                                        type: string;
                                    };
                                    taxRate: {
                                        type: string;
                                    };
                                    discountRate: {
                                        type: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    "200": {
                        description: string;
                    };
                    "401": {
                        description: string;
                    };
                    "403": {
                        description: string;
                    };
                    "422": {
                        description: string;
                    };
                };
            };
        };
        "/orders/{id}/confirm": {
            patch: {
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    "200": {
                        description: string;
                    };
                    "401": {
                        description: string;
                    };
                    "403": {
                        description: string;
                    };
                    "404": {
                        description: string;
                    };
                    "409": {
                        description: string;
                    };
                };
            };
        };
        "/orders/{id}/accept-delivery": {
            patch: {
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    "200": {
                        description: string;
                    };
                    "401": {
                        description: string;
                    };
                    "403": {
                        description: string;
                    };
                    "404": {
                        description: string;
                    };
                    "409": {
                        description: string;
                    };
                };
            };
        };
        "/orders/{id}/mark-paid": {
            patch: {
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    "200": {
                        description: string;
                    };
                    "401": {
                        description: string;
                    };
                    "403": {
                        description: string;
                    };
                    "404": {
                        description: string;
                    };
                    "409": {
                        description: string;
                    };
                };
            };
        };
    };
    tags: never[];
};
//# sourceMappingURL=products-docs.d.ts.map