import React, { createContext, useContext, useEffect, useState } from 'react';

export interface TenantConfig {
  centerName: string;
  centerDescription: string | null;
  currency: string;
  locale: string;
  openingTime: string;
  closingTime: string;
  logoUrl: string | null;
}

const defaultConfig: TenantConfig = {
  centerName: 'Anaros',
  centerDescription: 'Centre de Beauté - Gestion',
  currency: 'DA',
  locale: 'fr-DZ',
  openingTime: '09:00',
  closingTime: '20:00',
  logoUrl: null,
};

interface TenantContextValue extends TenantConfig {
  formatCurrency: (amount: number) => string;
  isLoaded: boolean;
}

const TenantContext = createContext<TenantContextValue>({
  ...defaultConfig,
  formatCurrency: (amount: number) => `${amount} DA`,
  isLoaded: false,
});

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<TenantConfig>(defaultConfig);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/tenants/config')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data) setConfig(data);
      })
      .catch(() => {/* utilise les valeurs par défaut */})
      .finally(() => setIsLoaded(true));
  }, []);

  const formatCurrency = (amount: number): string => {
    try {
      return new Intl.NumberFormat(config.locale, {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount) + ' ' + config.currency;
    } catch {
      return `${amount} ${config.currency}`;
    }
  };

  return (
    <TenantContext.Provider value={{ ...config, formatCurrency, isLoaded }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  return useContext(TenantContext);
}
