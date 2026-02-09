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
    components: {
      expenseQueue: {
        titleWithCount: "Expense Queue (%{count})",
        syncQueue: "Sync Queue",
        syncing: "Syncing...",
        subtitle: "Showing expense sync status",
        emptyQueue: "No expenses in queue",
        clearAlertTitle: "Clear Expense Queue",
        clearAlertMessage:
          "Are you sure you want to clear all %{count} expenses from the queue? This action cannot be undone.",
        cancelAction: "Cancel",
        clearAction: "Clear",
        typeLabel: "Type:",
        priceLabel: "Price:",
        quantityLabel: "Quantity:",
        markupLabel: "Markup:",
        totalLabel: "Total:",
        projectIdLabel: "Project ID:",
        rateIdLabel: "Rate ID:",
        createdLabel: "Created:",
        syncAttemptsLabel: "Sync Attempts:",
        lastSyncLabel: "Last Sync:",
        errorLabel: "Error:",
        idLabel: "ID:",
        markupYes: "Yes",
        markupNo: "No",
        clearing: "Clearing...",
        clearAll: "Clear All",
        statusPending: "PENDING",
        statusSyncing: "SYNCING",
        statusSynced: "SYNCED",
        statusFailed: "FAILED",
      },
      projectsList: {
        searchPlaceholder: "Search project IDs or PIs...",
        loadingProjects: "Loading projects...",
        clearSearchAccessibilityLabel: "Clear search",
        resultsFoundSingular: "%{count} result found",
        resultsFoundPlural: "%{count} results found",
        noProjectsFound: "No projects found",
        adjustSearchTerms: "Try adjusting your search terms",
        noProjectsYet: "No projects yet",
        addRecentProjectsHint:
          "You can add recent projects by submitting an expense",
      },
      ratesList: {
        recentsHeader: "Recents",
        allHeader: "All",
        searchPlaceholder: "Search rates, types, or units...",
        clearSearchAccessibilityLabel: "Clear search",
        hideFiltersAccessibilityLabel: "Hide filters",
        showFiltersAccessibilityLabel: "Show filters",
        clearFilterAccessibilityLabel: "Clear filter",
        clearFilter: "Clear",
        loadingRates: "Loading rates...",
        failedToLoadRates: "Failed to load rates",
        retry: "Retry",
        resultsFoundSingular: "%{count} result found",
        resultsFoundPlural: "%{count} results found",
        filteredBy: "filtered by %{type}",
        noRatesFound: "No rates found",
        adjustSearchOrFilters: "Try adjusting your search terms or filters",
        noRatesAvailable: "No rates available",
        contactAdministrator: "Contact your administrator",
      },
      ui: {
        closeAboutAccessibilityLabel: "Close About",
        editProjectAccessibilityLabel: "Edit project",
        qrScanAccessibilityLabel: "QR Scan",
        teamLabel: "Team: %{team}",
        piLabel: "PI: %{pi}",
        collapsibleExpand: "expand",
        collapsibleCollapse: "collapse",
      },
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
      loginWithUCDavis: "Iniciar sesión con UC Davis",
      aboutThisAppAccessibilityLabel: "Acerca de esta aplicación",
    },
    navigation: {
      newActivity: "Nueva actividad",
      selectRate: "Seleccionar tarifa",
      scanQrCode: "Escanear código QR",
      about: "Acerca de",
      notFoundOops: "¡Vaya!",
    },
    tabs: {
      recentProjects: "Proyectos recientes",
      allProjects: "Todos los proyectos",
      settings: "Configuración",
    },
    notFound: {
      screenDoesNotExist: "Esta pantalla no existe.",
      goHomeScreen: "Ir a la pantalla principal",
    },
    about: {
      defaultAppName: "Harvest Mobile",
      unknownVersion: "Versión desconocida",
      accessibilityLabel: "Acerca de Harvest Mobile",
      title: "Acerca de",
      description:
        "Registra gastos de proyectos de forma rápida y sencilla con Harvest Mobile, la aplicación oficial del sistema Harvest de UC Davis. Registra tus horas, envía gastos y mantente conectado mientras te desplazas.",
      versionLabel: "Versión",
      supportLabel: "Soporte",
      supportLinkAccessibilityLabel:
        "Abrir el sitio de soporte en el navegador",
      troubleshootingTitle: "Solución de problemas",
      troubleshootingDescription:
        "Si algo no se ve bien, restablecer los datos locales puede ayudar a limpiar la caché y forzar una nueva sincronización.",
      resetButtonAccessibilityLabel: "Restablecer datos de la aplicación",
      resetButtonAccessibilityHint:
        "Borra la caché local, la autenticación y la base de datos sin conexión",
      resettingLabel: "Restableciendo...",
      resetButtonLabel: "Restablecer datos de la aplicación",
      resetButtonDescription:
        "Borra datos en caché y autenticación local; útil si no puedes iniciar sesión.",
      alerts: {
        resetTitle: "Restablecer datos de la aplicación",
        resetMessage:
          "Esto borrará los datos en caché, la autenticación local y la base de datos sin conexión. ¿Deseas continuar?",
        cancel: "Cancelar",
        resetAction: "Restablecer",
        resetCompleteTitle: "Restablecimiento completado",
        resetCompleteMessage:
          "Datos locales borrados. Cierra la página de información e inicia sesión para continuar.",
        resetFailedTitle: "Falló el restablecimiento",
        resetFailedMessage:
          "No pudimos borrar los datos locales. Inténtalo de nuevo.",
        unableToOpenLinkTitle: "No se puede abrir el enlace",
        unableToOpenLinkMessage:
          "Inténtalo de nuevo o copia la URL.",
      },
    },
    settings: {
      userDetailsTitle: "Detalles del usuario",
      currentUserLabel: "Usuario actual:",
      loadingUser: "Cargando usuario",
      unknownTeam: "Equipo desconocido",
      currentUserTeamLine: "%{email} en el equipo %{team}",
      logoutAccessibilityLabel: "Cerrar sesión",
      logoutButton: "Cerrar sesión de Harvest",
    },
    addExpenses: {
      notesTitle: "Notas",
      activityPlaceholder: "Agregar actividad del gasto...",
      expensesTitle: "Gastos",
      noExpensesYet: "Aún no hay gastos ingresados.",
      addExpenseButton: "Agregar gasto",
      submitButton: "Enviar",
      savedToast: "Gasto(s) guardado(s).",
    },
    appLink: {
      authenticating: "Autenticando...",
      missingCodeOrBaseUrl: "Falta code o baseUrl.",
      alreadyAuthenticatedRedirecting: "Ya autenticado. Redirigiendo...",
      linkingDevice: "Vinculando tu dispositivo...",
      linkedSuccessfullyRedirecting: "Vinculación exitosa. Redirigiendo...",
      authenticationFailed: "Falló la autenticación.",
      authenticationFailedTitle: "Falló la autenticación",
      unknownError: "Error desconocido",
      goBack: "Volver",
      invalidBaseUrl: "baseUrl debe usar http(s)",
      responseMissingApiKeyOrTeam:
        "La respuesta no incluye apiKey o team.",
      linkFailedWithStatus: "Falló la vinculación (%{status}). %{details}",
    },
    expenseDetails: {
      invalidQuantityTitle: "Cantidad inválida",
      invalidQuantityMessage:
        "Ingresa una cantidad válida mayor que 0.",
      errorTitle: "Error",
      missingRateInfo: "Falta la información de la tarifa.",
      descriptionRequiredTitle: "Descripción requerida",
      descriptionRequiredMessage:
        "Ingresa una descripción para este gasto (requerida para passthrough).",
      missingRateInline: "Falta la información de la tarifa",
      goBack: "Volver",
      cancel: "Cancelar",
      headerTitle: "Detalles del gasto",
      quantityLabel: "Cantidad (%{unit})",
      quantityPlaceholder: "0.00",
      descriptionLabel: "Descripción (requerida para passthrough)",
      descriptionPlaceholder: "Ingresa una descripción (requerida)",
      markupAccessibilityLabel: "Recargo",
      markupLabel: "Recargo",
      addExpenseButton: "Agregar gasto",
    },
    qrScan: {
      cameraAccessRequiredTitle: "Se requiere acceso a la cámara",
      cameraAccessRequiredBody:
        "Para escanear códigos QR, necesitamos permiso para usar tu cámara",
      privacyProtectedTitle: "Privacidad protegida",
      privacyProtectedBody:
        "Tu cámara solo se usa para escanear códigos QR",
      continueButton: "Continuar",
      wrongQrCodeTypeTitle: "Tipo de código QR incorrecto",
      wrongQrCodeTypeRateMessage:
        "Este código QR no es de una tarifa. Escanea un código QR de tarifa.",
      wrongQrCodeTypeProjectMessage:
        "Este código QR no es de un proyecto. Escanea un código QR de proyecto.",
      wrongTeamTitle: "Equipo incorrecto",
      wrongTeamMessage:
        'Este código QR pertenece al equipo "%{teamInUrl}", pero actualmente estás trabajando con el equipo "%{currentTeam}". Escanea un código QR de tu equipo actual.',
      invalidQrCodeTitle: "Código QR inválido",
      invalidQrCodeMessage:
        "El código QR escaneado no es válido. Inténtalo de nuevo.",
      testingButtonsTitle: "Botones de prueba",
      devRateScan32: "Escaneo de tarifa (ID: 32)",
      devProjectScan66: "Escaneo de proyecto (ID: 66)",
      devRateScanBad999: "Escaneo de tarifa (ID incorrecto: 999)",
    },
    rateSelect: {
      rateNotFoundTitle: "Tarifa no encontrada",
      rateNotFoundMessage:
        "La tarifa escaneada (ID: %{rateId}) no es válida. Escanea un código QR de tarifa válido o selecciona una tarifa de la lista.",
    },
    components: {
      expenseQueue: {
        titleWithCount: "Cola de gastos (%{count})",
        syncQueue: "Sincronizar cola",
        syncing: "Sincronizando...",
        subtitle: "Mostrando estado de sincronización de gastos",
        emptyQueue: "No hay gastos en cola",
        clearAlertTitle: "Limpiar cola de gastos",
        clearAlertMessage:
          "¿Seguro que quieres eliminar %{count} gastos de la cola? Esta acción no se puede deshacer.",
        cancelAction: "Cancelar",
        clearAction: "Limpiar",
        typeLabel: "Tipo:",
        priceLabel: "Precio:",
        quantityLabel: "Cantidad:",
        markupLabel: "Recargo:",
        totalLabel: "Total:",
        projectIdLabel: "ID de proyecto:",
        rateIdLabel: "ID de tarifa:",
        createdLabel: "Creado:",
        syncAttemptsLabel: "Intentos de sincronización:",
        lastSyncLabel: "Última sincronización:",
        errorLabel: "Error:",
        idLabel: "ID:",
        markupYes: "Sí",
        markupNo: "No",
        clearing: "Limpiando...",
        clearAll: "Limpiar todo",
        statusPending: "PENDIENTE",
        statusSyncing: "SINCRONIZANDO",
        statusSynced: "SINCRONIZADO",
        statusFailed: "FALLIDO",
      },
      projectsList: {
        searchPlaceholder: "Buscar IDs de proyecto o PI...",
        loadingProjects: "Cargando proyectos...",
        clearSearchAccessibilityLabel: "Limpiar búsqueda",
        resultsFoundSingular: "%{count} resultado encontrado",
        resultsFoundPlural: "%{count} resultados encontrados",
        noProjectsFound: "No se encontraron proyectos",
        adjustSearchTerms: "Intenta ajustar tus términos de búsqueda",
        noProjectsYet: "Aún no hay proyectos",
        addRecentProjectsHint:
          "Puedes agregar proyectos recientes enviando un gasto",
      },
      ratesList: {
        recentsHeader: "Recientes",
        allHeader: "Todos",
        searchPlaceholder: "Buscar tarifas, tipos o unidades...",
        clearSearchAccessibilityLabel: "Limpiar búsqueda",
        hideFiltersAccessibilityLabel: "Ocultar filtros",
        showFiltersAccessibilityLabel: "Mostrar filtros",
        clearFilterAccessibilityLabel: "Limpiar filtro",
        clearFilter: "Limpiar",
        loadingRates: "Cargando tarifas...",
        failedToLoadRates: "No se pudieron cargar las tarifas",
        retry: "Reintentar",
        resultsFoundSingular: "%{count} resultado encontrado",
        resultsFoundPlural: "%{count} resultados encontrados",
        filteredBy: "filtrado por %{type}",
        noRatesFound: "No se encontraron tarifas",
        adjustSearchOrFilters:
          "Intenta ajustar tus términos de búsqueda o filtros",
        noRatesAvailable: "No hay tarifas disponibles",
        contactAdministrator: "Contacta a tu administrador",
      },
      ui: {
        closeAboutAccessibilityLabel: "Cerrar Acerca de",
        editProjectAccessibilityLabel: "Editar proyecto",
        qrScanAccessibilityLabel: "Escaneo QR",
        teamLabel: "Equipo: %{team}",
        piLabel: "PI: %{pi}",
        collapsibleExpand: "expandir",
        collapsibleCollapse: "contraer",
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

export function tx(scope: string, options?: Record<string, unknown>): string {
  return i18n.t(scope, options) as string;
}
