import { API_BASE_URL } from '../client/config';
import { requestJson } from '../shared/request-json';
import { parsePublicPricingConfigResponse } from './validators';
const DEFAULT_PRICING_CONFIG = {
    deliveryFee: 0,
    discountRate: 0
};
export const getPublicPricingConfig = async () => {
    try {
        const response = await requestJson({
            baseUrl: API_BASE_URL
        }, '/orders/pricing-config');
        return parsePublicPricingConfigResponse(response) ?? DEFAULT_PRICING_CONFIG;
    }
    catch {
        return DEFAULT_PRICING_CONFIG;
    }
};
