import { getPublicPricingConfig } from '@acme/api-client/orders';
import { useEffect, useState } from 'react';
const DEFAULT_PRICING_CONFIG = {
    deliveryFee: 0,
    discountRate: 0
};
export const usePricingConfig = () => {
    const [pricingConfig, setPricingConfig] = useState(DEFAULT_PRICING_CONFIG);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        let isMounted = true;
        const fetchPricingConfig = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const config = await getPublicPricingConfig();
                if (isMounted) {
                    setPricingConfig(config);
                }
            }
            catch {
                if (isMounted) {
                    setPricingConfig(DEFAULT_PRICING_CONFIG);
                    setError('Unable to load pricing configuration.');
                }
            }
            finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };
        void fetchPricingConfig();
        return () => {
            isMounted = false;
        };
    }, []);
    return { pricingConfig, isLoading, error };
};
