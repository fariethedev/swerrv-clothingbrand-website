import { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState(() => {
        return localStorage.getItem('swerrv_currency') || 'PLN';
    });

    const exchangeRates = {
        PLN: 1,
        EUR: 0.23,
        GBP: 0.20,
        CAD: 0.35,
        USD: 0.25
    };

    const currencySymbols = {
        PLN: 'PLN',
        EUR: '€',
        GBP: '£',
        CAD: '$',
        USD: '$'
    };

    useEffect(() => {
        localStorage.setItem('swerrv_currency', currency);
    }, [currency]);

    const formatPrice = (priceInPLN) => {
        const converted = priceInPLN * (exchangeRates[currency] || 1);

        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(converted).replace(currency, currencySymbols[currency]); // Just in case Intl drops full tags
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, currencySymbols }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => useContext(CurrencyContext);
