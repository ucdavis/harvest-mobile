import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";

const translations = {
  en: {
    auth: {
      welcomeToHarvest: "Welcome to Harvest",
      loginWithUCDavis: "Login with UC Davis",
    },
    about: {
      defaultAppName: "Harvest Mobile",
      unknownVersion: "Unknown version",
      accessibilityLabel: "About Harvest Mobile",
      title: "About",
      description:
        "Track project expenses quickly and easily with Harvest Mobile, the official app for UC Davis Harvest system. Log your hours, submit expenses, and stay connected on the go.",
      versionLabel: "Version",
      supportLabel: "Support",
      supportLinkAccessibilityLabel: "Open support site in browser",
      troubleshootingTitle: "Troubleshooting",
      troubleshootingDescription:
        "If things look off, resetting local data can help clear cached info and force a fresh sync.",
      resetButtonAccessibilityLabel: "Reset app data",
      resetButtonAccessibilityHint:
        "Clears local cache, auth, and offline database",
      resettingLabel: "Resetting...",
      resetButtonLabel: "Reset App Data",
      resetButtonDescription:
        "Clears cached data and local auth - useful if you can't login.",
      alerts: {
        resetTitle: "Reset app data",
        resetMessage:
          "This will erase cached data, local auth, and the offline database. Continue?",
        cancel: "Cancel",
        resetAction: "Reset",
        resetCompleteTitle: "Reset complete",
        resetCompleteMessage:
          "Local data cleared. Close the about page and sign in to continue.",
        resetFailedTitle: "Reset failed",
        resetFailedMessage:
          "We couldn't clear local data. Please try again.",
        unableToOpenLinkTitle: "Unable to open link",
        unableToOpenLinkMessage: "Please try again or copy the URL.",
      },
    },
  },
  es: {
    auth: {
      welcomeToHarvest: "Bienvenido a Harvest",
      loginWithUCDavis: "Iniciar sesión con UC Davis",
    },
    about: {
      defaultAppName: "Harvest Mobile",
      unknownVersion: "Version desconocida",
      accessibilityLabel: "Acerca de Harvest Mobile",
      title: "Acerca de",
      description:
        "Registra gastos de proyectos de forma rapida y sencilla con Harvest Mobile, la aplicacion oficial del sistema Harvest de UC Davis. Registra tus horas, envia gastos y mantente conectado mientras te desplazas.",
      versionLabel: "Version",
      supportLabel: "Soporte",
      supportLinkAccessibilityLabel:
        "Abrir el sitio de soporte en el navegador",
      troubleshootingTitle: "Solucion de problemas",
      troubleshootingDescription:
        "Si algo no se ve bien, restablecer los datos locales puede ayudar a limpiar la cache y forzar una sincronizacion nueva.",
      resetButtonAccessibilityLabel: "Restablecer datos de la aplicacion",
      resetButtonAccessibilityHint:
        "Borra cache local, autenticacion y base de datos sin conexion",
      resettingLabel: "Restableciendo...",
      resetButtonLabel: "Restablecer datos de la aplicacion",
      resetButtonDescription:
        "Borra datos en cache y autenticacion local; util si no puedes iniciar sesion.",
      alerts: {
        resetTitle: "Restablecer datos de la aplicacion",
        resetMessage:
          "Esto borrara los datos en cache, la autenticacion local y la base de datos sin conexion. Deseas continuar?",
        cancel: "Cancelar",
        resetAction: "Restablecer",
        resetCompleteTitle: "Restablecimiento completado",
        resetCompleteMessage:
          "Datos locales borrados. Cierra la pagina de informacion e inicia sesion para continuar.",
        resetFailedTitle: "Fallo el restablecimiento",
        resetFailedMessage:
          "No pudimos borrar los datos locales. Intentalo de nuevo.",
        unableToOpenLinkTitle: "No se puede abrir el enlace",
        unableToOpenLinkMessage:
          "Intentalo de nuevo o copia la URL.",
      },
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
