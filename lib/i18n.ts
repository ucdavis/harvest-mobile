import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";

const translations = {
  en: {
    common: {
      ok: "OK",
      tryAgain: "Try Again",
      markupSuffix: " (+20%)",
    },
    auth: {
      welcomeToHarvest: "Welcome to Harvest",
      loginWithUCDavis: "Login with UC Davis",
      aboutThisAppAccessibilityLabel: "About this app",
    },
    navigation: {
      newActivity: "New Activity",
      selectRate: "Select Rate",
      scanQrCode: "Scan QR Code",
      about: "About",
      notFoundOops: "Oops!",
    },
    tabs: {
      recentProjects: "Recent Projects",
      allProjects: "All Projects",
      settings: "Settings",
    },
    notFound: {
      screenDoesNotExist: "This screen does not exist.",
      goHomeScreen: "Go to home screen!",
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
    settings: {
      userDetailsTitle: "User Details",
      currentUserLabel: "Current User:",
      loadingUser: "Loading User",
      unknownTeam: "Unknown Team",
      currentUserTeamLine: "%{email} in team %{team}",
      logoutAccessibilityLabel: "Logout",
      logoutButton: "Log out of Harvest",
    },
    addExpenses: {
      notesTitle: "Notes",
      activityPlaceholder: "Add expense activity...",
      expensesTitle: "Expenses",
      noExpensesYet: "No expenses entered yet.",
      addExpenseButton: "Add expense",
      submitButton: "Submit",
      savedToast: "Expense(s) saved.",
    },
    appLink: {
      authenticating: "Authenticating...",
      missingCodeOrBaseUrl: "Missing code or baseUrl.",
      alreadyAuthenticatedRedirecting: "Already authenticated. Redirecting...",
      linkingDevice: "Linking your device...",
      linkedSuccessfullyRedirecting: "Linked successfully. Redirecting...",
      authenticationFailed: "Authentication failed.",
      authenticationFailedTitle: "Authentication failed",
      unknownError: "Unknown error",
      goBack: "Go Back",
      invalidBaseUrl: "baseUrl must be http(s)",
      responseMissingApiKeyOrTeam: "Response missing apiKey or team.",
      linkFailedWithStatus: "Link failed (%{status}). %{details}",
    },
    expenseDetails: {
      invalidQuantityTitle: "Invalid Quantity",
      invalidQuantityMessage: "Please enter a valid quantity greater than 0.",
      errorTitle: "Error",
      missingRateInfo: "Rate information is missing.",
      descriptionRequiredTitle: "Description Required",
      descriptionRequiredMessage:
        "Please enter a description for this expense (required for passthrough).",
      missingRateInline: "Rate information is missing",
      goBack: "Go Back",
      cancel: "Cancel",
      headerTitle: "Expense Details",
      quantityLabel: "Quantity (%{unit})",
      quantityPlaceholder: "0.00",
      descriptionLabel: "Description (required for passthrough)",
      descriptionPlaceholder: "Enter description (required)",
      markupAccessibilityLabel: "Markup",
      markupLabel: "Markup",
      addExpenseButton: "Add Expense",
    },
    qrScan: {
      cameraAccessRequiredTitle: "Camera Access Required",
      cameraAccessRequiredBody:
        "To scan QR codes, we need permission to access your camera",
      privacyProtectedTitle: "Privacy Protected",
      privacyProtectedBody: "Your camera is only used for scanning QR codes",
      continueButton: "Continue",
      wrongQrCodeTypeTitle: "Wrong QR Code Type",
      wrongQrCodeTypeRateMessage:
        "This QR code is not for a rate. Please scan a rate QR code.",
      wrongQrCodeTypeProjectMessage:
        "This QR code is not for a project. Please scan a project QR code.",
      wrongTeamTitle: "Wrong Team",
      wrongTeamMessage:
        'This QR code belongs to team "%{teamInUrl}" but you are currently working with team "%{currentTeam}". Please scan a QR code for your current team.',
      invalidQrCodeTitle: "Invalid QR Code",
      invalidQrCodeMessage:
        "The scanned QR code is not valid. Please try again.",
      testingButtonsTitle: "Testing Buttons",
      devRateScan32: "Rate Scan (ID: 32)",
      devProjectScan66: "Project Scan (ID: 66)",
      devRateScanBad999: "Rate Scan (Bad ID: 999)",
    },
    rateSelect: {
      rateNotFoundTitle: "Rate Not Found",
      rateNotFoundMessage:
        "The scanned rate (ID: %{rateId}) is not valid. Please scan a valid rate QR code or select a rate from the list.",
    },
  },
  es: {
    common: {
      ok: "Aceptar",
      tryAgain: "Intentar de nuevo",
      markupSuffix: " (+20%)",
    },
    auth: {
      welcomeToHarvest: "Bienvenido a Harvest",
      loginWithUCDavis: "Iniciar sesion con UC Davis",
      aboutThisAppAccessibilityLabel: "Acerca de esta aplicacion",
    },
    navigation: {
      newActivity: "Nueva actividad",
      selectRate: "Seleccionar tarifa",
      scanQrCode: "Escanear codigo QR",
      about: "Acerca de",
      notFoundOops: "Vaya!",
    },
    tabs: {
      recentProjects: "Proyectos recientes",
      allProjects: "Todos los proyectos",
      settings: "Configuracion",
    },
    notFound: {
      screenDoesNotExist: "Esta pantalla no existe.",
      goHomeScreen: "Ir a la pantalla principal!",
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
    settings: {
      userDetailsTitle: "Detalles del usuario",
      currentUserLabel: "Usuario actual:",
      loadingUser: "Cargando usuario",
      unknownTeam: "Equipo desconocido",
      currentUserTeamLine: "%{email} en el equipo %{team}",
      logoutAccessibilityLabel: "Cerrar sesion",
      logoutButton: "Cerrar sesion de Harvest",
    },
    addExpenses: {
      notesTitle: "Notas",
      activityPlaceholder: "Agregar actividad del gasto...",
      expensesTitle: "Gastos",
      noExpensesYet: "Aun no hay gastos ingresados.",
      addExpenseButton: "Agregar gasto",
      submitButton: "Enviar",
      savedToast: "Gasto(s) guardado(s).",
    },
    appLink: {
      authenticating: "Autenticando...",
      missingCodeOrBaseUrl: "Falta code o baseUrl.",
      alreadyAuthenticatedRedirecting: "Ya autenticado. Redirigiendo...",
      linkingDevice: "Vinculando tu dispositivo...",
      linkedSuccessfullyRedirecting: "Vinculacion exitosa. Redirigiendo...",
      authenticationFailed: "Fallo la autenticacion.",
      authenticationFailedTitle: "Fallo la autenticacion",
      unknownError: "Error desconocido",
      goBack: "Volver",
      invalidBaseUrl: "baseUrl debe usar http(s)",
      responseMissingApiKeyOrTeam:
        "La respuesta no incluye apiKey o team.",
      linkFailedWithStatus: "Fallo la vinculacion (%{status}). %{details}",
    },
    expenseDetails: {
      invalidQuantityTitle: "Cantidad invalida",
      invalidQuantityMessage:
        "Ingresa una cantidad valida mayor que 0.",
      errorTitle: "Error",
      missingRateInfo: "Falta la informacion de la tarifa.",
      descriptionRequiredTitle: "Descripcion requerida",
      descriptionRequiredMessage:
        "Ingresa una descripcion para este gasto (requerida para passthrough).",
      missingRateInline: "Falta la informacion de la tarifa",
      goBack: "Volver",
      cancel: "Cancelar",
      headerTitle: "Detalles del gasto",
      quantityLabel: "Cantidad (%{unit})",
      quantityPlaceholder: "0.00",
      descriptionLabel: "Descripcion (requerida para passthrough)",
      descriptionPlaceholder: "Ingresa una descripcion (requerida)",
      markupAccessibilityLabel: "Recargo",
      markupLabel: "Recargo",
      addExpenseButton: "Agregar gasto",
    },
    qrScan: {
      cameraAccessRequiredTitle: "Se requiere acceso a la camara",
      cameraAccessRequiredBody:
        "Para escanear codigos QR, necesitamos permiso para usar tu camara",
      privacyProtectedTitle: "Privacidad protegida",
      privacyProtectedBody:
        "Tu camara solo se usa para escanear codigos QR",
      continueButton: "Continuar",
      wrongQrCodeTypeTitle: "Tipo de codigo QR incorrecto",
      wrongQrCodeTypeRateMessage:
        "Este codigo QR no es de una tarifa. Escanea un codigo QR de tarifa.",
      wrongQrCodeTypeProjectMessage:
        "Este codigo QR no es de un proyecto. Escanea un codigo QR de proyecto.",
      wrongTeamTitle: "Equipo incorrecto",
      wrongTeamMessage:
        'Este codigo QR pertenece al equipo "%{teamInUrl}", pero actualmente estas trabajando con el equipo "%{currentTeam}". Escanea un codigo QR de tu equipo actual.',
      invalidQrCodeTitle: "Codigo QR invalido",
      invalidQrCodeMessage:
        "El codigo QR escaneado no es valido. Intentalo de nuevo.",
      testingButtonsTitle: "Botones de prueba",
      devRateScan32: "Escaneo de tarifa (ID: 32)",
      devProjectScan66: "Escaneo de proyecto (ID: 66)",
      devRateScanBad999: "Escaneo de tarifa (ID incorrecto: 999)",
    },
    rateSelect: {
      rateNotFoundTitle: "Tarifa no encontrada",
      rateNotFoundMessage:
        "La tarifa escaneada (ID: %{rateId}) no es valida. Escanea un codigo QR de tarifa valido o selecciona una tarifa de la lista.",
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

export function tx(scope: string, options?: Record<string, unknown>): string {
  return i18n.t(scope, options) as string;
}
