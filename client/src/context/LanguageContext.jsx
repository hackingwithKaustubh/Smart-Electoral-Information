import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LanguageContext = createContext(null);

const COPY = {
  en: {
    product: 'Civora',
    start: 'Start Conversation',
    explore: 'Explore Information',
    login: 'Log in',
    register: 'Create account',
    logout: 'Log out',
    dashboard: 'Dashboard',
    assistant: 'Assistant',
    information: 'Information',
    faqs: 'FAQs',
    sources: 'Sources',
    saved: 'Saved',
    profile: 'Profile',
    search: 'Search',
    admin: 'Admin',
  },
  hi: {
    product: 'सिवोरा',
    start: 'बातचीत शुरू करें',
    explore: 'जानकारी देखें',
    login: 'लॉग इन',
    register: 'खाता बनाएँ',
    logout: 'लॉग आउट',
    dashboard: 'डैशबोर्ड',
    assistant: 'सहायक',
    information: 'जानकारी',
    faqs: 'प्रश्न',
    sources: 'स्रोत',
    saved: 'सहेजा गया',
    profile: 'प्रोफ़ाइल',
    search: 'खोज',
    admin: 'प्रशासन',
  },
};

export function LanguageProvider({ children, initial = 'en' }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('civora_lang') || initial);

  useEffect(() => {
    localStorage.setItem('civora_lang', language);
    document.documentElement.lang = language === 'hi' ? 'hi' : 'en';
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: COPY[language] || COPY.en,
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
