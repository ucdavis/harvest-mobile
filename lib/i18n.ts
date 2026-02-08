import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";

const translations = {
  en: {
    auth: {
      welcomeToHarvest: "Welcome to Harvest",
      loginWithUCDavis: "Login with UC Davis",
    },
  },
  es: {
    auth: {
      welcomeToHarvest: "Bienvenido a Harvest",
      loginWithUCDavis: "Iniciar sesión con UC Davis",
    },
  },
};

export const i18n = new I18n(translations);

i18n.defaultLocale = "en";
i18n.enableFallback = true;
i18n.locale = getLocales().at(0)?.languageCode ?? "en";

export function t(
  scope: string,
  options?: Record<string, unknown>
): string | unknown {
  return i18n.t(scope, options);
}
