"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Currency = "NGN" | "AUD";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (amountInUsd: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Approximate static exchange rates relative to 1 USD
const EXCHANGE_RATES: Record<Currency, number> = {
  NGN: 1500,
  AUD: 1.5,
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("NGN");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedCurrency = localStorage.getItem("afro_essence_currency") as Currency;
    if (savedCurrency && (savedCurrency === "NGN" || savedCurrency === "AUD")) {
      setCurrencyState(savedCurrency);
    }
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    if (typeof window !== "undefined") {
      localStorage.setItem("afro_essence_currency", newCurrency);
    }
  };

  const formatPrice = (amountInUsd: number) => {
    const activeCurrency = isClient ? currency : "NGN"; // Default to NGN during SSR
    
    // Ensure amount is a valid number
    const safeAmount = Number(amountInUsd) || 0;
    const convertedAmount = safeAmount * EXCHANGE_RATES[activeCurrency];

    if (activeCurrency === "NGN") {
      // NGN usually formatted without cents
      return '₦' + convertedAmount.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    } else {
      // AUD
      return 'A$' + convertedAmount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
