# Harvest Mobile - GitHub Copilot Instructions

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

Bootstrap, build, and test the repository:

```bash
# Prerequisites: Node.js v20.x required
npm install  # Takes ~40 seconds, installs 1057 packages. NEVER CANCEL.
```

Validate setup:

```bash
npm run typecheck  # Takes ~3 seconds
npm run lint       # Takes ~3 seconds
```

**NEVER CANCEL BUILDS OR LONG-RUNNING COMMANDS** - Some operations may take 30-60+ minutes.

**CRITICAL TIMEOUT REQUIREMENTS**:
- Metro bundler: Set timeout to 3+ minutes
- iOS builds: Set timeout to 90+ minutes  
- npm install: Set timeout to 2+ minutes

## Development Setup

Start development server:

```bash
# For localhost development (recommended)
npx expo start --localhost  # Metro bundler starts in ~75 seconds. NEVER CANCEL.

# For iOS development (requires Xcode and iOS Simulator)
npx expo run:ios  # Requires iOS development environment

# For web development (limited functionality due to SQLite)
npx expo start --web  # Metro bundler starts, limited by SQLite WASM issues
```

**Development Server Timing**: Metro bundler takes ~75 seconds to fully initialize. Set timeout to 2+ minutes.

**WARNING**: Metro bundler export fails for web due to SQLite WASM dependencies. This is expected - the app is designed for mobile platforms.

**CI Mode**: In CI environments, Metro runs without reloads. Remove `CI=true` environment variable to enable watch mode during development.

## Build & Deployment

### Prerequisites for iOS Builds

```bash
# Install Xcode command line tools (if on macOS)
xcode-select --install

# Install EAS CLI globally
npm install -g eas-cli  # Takes ~30 seconds

# Install Fastlane (on macOS)
brew install fastlane
```

### Production Build

```bash
# iOS Production Build - NEVER CANCEL: Takes 30-60+ minutes
npm run build:ios  # Runs ./scripts/build-ios.sh
# Equivalent to: eas build -p ios --profile production --local --output build/harvestmobile-1.0.0-[timestamp].ipa
```

**CRITICAL**: Set timeout to 90+ minutes for iOS builds. Build times can vary significantly based on dependencies and system resources.

### Build Process Details

The build script:
1. Creates `build/` directory
2. Generates timestamped IPA filename
3. Uses EAS CLI with production profile
4. Outputs to `build/harvestmobile-[version]-[timestamp].ipa`
5. Requires Expo account authentication on first run

## Testing

**No automated tests currently implemented**. Package.json includes Jest configuration but no test files exist.

```bash
# Jest is configured but no tests written yet
npm run test     # Will fail: "jest: not found"
npm run test:ci  # Configured for CI with JUnit output
```

Future testing setup will follow: https://docs.expo.dev/develop/unit-testing/

## Code Quality Checks

Always run before committing:

```bash
npm run typecheck  # TypeScript validation - takes ~3 seconds
npm run lint       # ESLint validation - takes ~3 seconds
```

CI Pipeline validation (from azure-pipelines.yml):

```bash
npx expo-doctor        # Environment validation (network dependent)
npx expo export        # Bundle smoke test (will fail due to SQLite WASM)
```

## Project Architecture

- **Framework**: React Native with Expo SDK 53
- **Router**: Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: React Context + TanStack Query
- **Database**: Expo SQLite (local persistence)
- **Authentication**: Expo Auth Session + Secure Store
- **Build System**: EAS Build (local and cloud builds)

### Key File Structure

```
/app/                 # File-based routing (Expo Router)
  ├── (tabs)/         # Tab navigation
  ├── _layout.tsx     # Root layout with auth/context providers
  └── [screens].tsx   # Individual screens
/components/          # Reusable UI components
  ├── context/        # React Context providers
  ├── ui/            # Pure UI components
  └── [feature]/     # Feature-specific components
/lib/                 # Business logic and database operations
  ├── db/client.ts    # SQLite database client
  ├── auth.ts         # Authentication logic
  ├── expense.ts      # Expense management
  └── project.ts      # Project management
/services/            # API clients and external integrations
  ├── api.ts          # Generic API client
  └── queries/        # TanStack Query definitions
/hooks/               # Custom React hooks
/scripts/             # Build and utility scripts
  └── build-ios.sh    # Production iOS build script
```

### Database Schema

SQLite database (`harvest.db`) with key table:

```sql
expenses_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  projectId INTEGER NOT NULL,
  rateId TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  quantity REAL NOT NULL,
  price REAL NOT NULL,
  uniqueId TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  createdDate TEXT NOT NULL,
  syncAttempts INTEGER NOT NULL DEFAULT 0,
  lastSyncAttempt TEXT,
  errorMessage TEXT
)
```

## Brand & Design System

Brand colors (defined in `tailwind.config.js`):

- Primary: `#266041` (harvest green)
- Secondary Background: `#F7F7F7`
- Text: `#1F1F1F` 
- Borders: `#DFDFDF`
- Danger: `#79242F`

Typography: Proxima Nova font (loaded via expo-font)

## Key Dependencies

Core framework:
- `expo` (~53.0.20) - Expo SDK
- `react-native` (0.79.5) - React Native framework
- `expo-router` (~5.1.4) - File-based routing

UI & Styling:
- `nativewind` (^4.1.23) - Tailwind CSS for React Native
- `tailwindcss` (^3.4.17) - CSS framework
- `react-native-heroicons` (^4.0.0) - Icon library

State & Data:
- `@tanstack/react-query` (^5.85.5) - Server state management
- `expo-sqlite` (~15.2.14) - Local database
- `expo-secure-store` (~14.2.3) - Secure storage

Authentication:
- `expo-auth-session` (~6.2.1) - OAuth authentication
- `expo-crypto` (~14.1.5) - Cryptographic functions

## Common Validation Tasks

After making changes, always:

1. **Typecheck**: `npm run typecheck`
2. **Lint**: `npm run lint`
3. **Build validation**: `npx expo export` (expect SQLite WASM error - this is normal)
4. **Manual testing**: Start development server and test functionality

## Troubleshooting

**Metro bundler fails with SQLite WASM error**: Expected behavior. The app is mobile-first and SQLite web support has limitations.

**EAS build requires authentication**: Run `eas login` on first build.

**iOS build fails**: Ensure Xcode tools are installed and you have valid Apple Developer credentials.

**Development server won't start**: Check Node.js version (requires v20.x) and ensure all dependencies are installed.

## CI/CD Pipeline

Azure Pipelines configuration (azure-pipelines.yml):
- Runs on Node.js 20.x
- Validates with expo-doctor
- Runs TypeScript compilation
- Runs ESLint
- Attempts bundle export (fails due to SQLite - this is acceptable)

## Validation Scenarios

When testing changes:

1. **Authentication Flow**: Test login/logout functionality
2. **Expense Management**: Create, edit, and sync expenses
3. **Project Navigation**: Navigate between project screens
4. **Offline Functionality**: Test with network disabled
5. **Database Operations**: Verify SQLite operations work correctly

## Performance Notes

- npm install: ~40 seconds
- TypeScript compilation: ~3 seconds  
- ESLint: ~3 seconds
- Metro bundler startup: ~75 seconds (requires patience - NEVER CANCEL)
- **iOS production build: 30-60+ minutes - NEVER CANCEL**

Always use appropriate timeouts:
- Build commands: 90+ minutes
- Development server: 3+ minutes
- Type/lint checks: 1 minute

## Configuration Files

Key configuration files and their purposes:

- `app.json`: Expo app configuration
- `eas.json`: EAS Build profiles (development, preview, production)
- `package.json`: Dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `tailwind.config.js`: Tailwind CSS configuration
- `metro.config.js`: Metro bundler configuration (includes NativeWind and SVG support)
- `global.css`: Global Tailwind styles and custom CSS classes

Bundle identifier: `com.ucdavis.harvest-mobile`