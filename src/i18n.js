import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Resources from "../locales/index";

// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: false,
    resources: Resources,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
