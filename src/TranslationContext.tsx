import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import translations from './translations';
import { Translations, Language } from './types';

interface TranslationContextProps {
  translations: Translations[Language];
  setLanguage: (language: Language) => void;
}

const TranslationContext = createContext<TranslationContextProps | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const browserLang = navigator.language.split('-')[0] as Language;
  const [language, setLanguage] = useState<Language>(browserLang || 'en');

  const value = useMemo(() => ({
    translations: translations[language],
    setLanguage,
  }), [language]);

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};