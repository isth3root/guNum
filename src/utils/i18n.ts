// ========== PACKAGES ========== \\
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// ========== JSON ========== \\
import enTranslation from '../locales/en/translation.json'
import faTranslation from '../locales/fa/translation.json'


const storedLanguage = localStorage.getItem('language') || 'en'


i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: enTranslation
            },
            fa: {
                translation: faTranslation
            }
        },
        lng: storedLanguage,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    })
    .catch(error => {
        console.error('i18next initialization failed:', error);
    });

export default i18n;