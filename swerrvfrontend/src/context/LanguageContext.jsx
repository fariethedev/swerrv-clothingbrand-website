import React, { createContext, useContext, useState, useEffect } from 'react';

// Very basic dictionary for core Navigation and Home Hero elements.
// This can be expanded later by moving to a dedicated translations file or using react-i18next.
const translations = {
    en: {
        'nav.tshirts': 'T-Shirts',
        'nav.hoodies': 'Hoodies',
        'nav.tracksuits': 'Tracksuits',
        'nav.all': 'All',
        'nav.about': 'About',
        'nav.contact': 'Contact'
    },
    pl: {
        'nav.tshirts': 'T-shirty',
        'nav.hoodies': 'Bluzy',
        'nav.tracksuits': 'Dresy',
        'nav.all': 'Wszystko',
        'nav.about': 'O nas',
        'nav.contact': 'Kontakt'
    }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('swerrv_language') || 'en';
    });

    useEffect(() => {
        localStorage.setItem('swerrv_language', language);
        document.documentElement.lang = language;
    }, [language]);

    // Simple translation function
    const t = (key) => {
        if (!translations[language] || !translations[language][key]) {
            // fallback to english
            return translations['en'][key] || key;
        }
        return translations[language][key];
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
