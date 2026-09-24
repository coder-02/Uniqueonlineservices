import { createContext, useContext, useState, useCallback } from 'react'
import { translations } from '../data/translations.js'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('uos-lang') || 'en')

  const changeLang = useCallback((l) => {
    setLang(l)
    localStorage.setItem('uos-lang', l)
  }, [])

  // t('key') returns the string for the current language, falling back to English then the key itself
  const t = useCallback(
    (key) => {
      const dict = translations[lang] || translations.en
      return dict[key] ?? translations.en[key] ?? key
    },
    [lang]
  )

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
