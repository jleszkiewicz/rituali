interface PricingConfig {
  monthly: {
    amount: number;
    currency: string;
    currencySymbol: string;
  };
  yearly: {
    amount: number;
    currency: string;
    currencySymbol: string;
  };
}

const PRICING: Record<string, PricingConfig> = {
  pl: {
    monthly: {
      amount: 4.99,
      currency: 'PLN',
      currencySymbol: 'zł'
    },
    yearly: {
      amount: 49,
      currency: 'PLN',
      currencySymbol: 'zł'
    }
  },
  en: {
    monthly: {
      amount: 4.99,
      currency: 'USD',
      currencySymbol: '$'
    },
    yearly: {
      amount: 49,
      currency: 'USD',
      currencySymbol: '$'
    }
  },
  de: {
    monthly: {
      amount: 4.99,
      currency: 'EUR',
      currencySymbol: '€'
    },
    yearly: {
      amount: 49,
      currency: 'EUR',
      currencySymbol: '€'
    }
  }
};

export const getPricing = (languageCode: string): PricingConfig => {
  return PRICING[languageCode] || PRICING.en;
};

export const formatPrice = (amount: number, currencySymbol: string): string => {
  const formattedAmount = Number.isInteger(amount) ? amount.toString() : amount.toFixed(2);
  return `${formattedAmount} ${currencySymbol}`;
}; 