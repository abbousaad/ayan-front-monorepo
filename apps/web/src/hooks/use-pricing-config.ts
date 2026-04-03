import { getPublicPricingConfig } from '@acme/api-client/orders';
import type { PricingConfig } from '@acme/api-client/orders';
import { useEffect, useState } from 'react';

const DEFAULT_PRICING_CONFIG: PricingConfig = {
  deliveryFee: 0,
  discountRate: 0
};

type PricingConfigState = {
  pricingConfig: PricingConfig;
  isLoading: boolean;
  error: string | null;
};

export const usePricingConfig = (): PricingConfigState => {
  const [pricingConfig, setPricingConfig] = useState<PricingConfig>(DEFAULT_PRICING_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPricingConfig = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const config = await getPublicPricingConfig();
        if (isMounted) {
          setPricingConfig(config);
        }
      } catch {
        if (isMounted) {
          setPricingConfig(DEFAULT_PRICING_CONFIG);
          setError('Unable to load pricing configuration.');
        }
      } finally {
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
