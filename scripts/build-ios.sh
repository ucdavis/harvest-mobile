#!/usr/bin/env bash
set -euo pipefail

# Accept profile as first argument, default to production
PROFILE="${1:-production}"

# Validate profile
if [[ "$PROFILE" != "production" && "$PROFILE" != "preview" ]]; then
  echo "❌ Error: Profile must be 'production' or 'preview'"
  echo "Usage: $0 [production|preview]"
  exit 1
fi

mkdir -p build

APP_NAME="harvestmobile"
# Read version from app.json (adjust if you store it elsewhere)
BASE_VERSION=$(node -p "require('./app.json').expo.version")

# Add profile suffix to version
if [[ "$PROFILE" == "production" ]]; then
  APP_VERSION="${BASE_VERSION}-prod"
else
  APP_VERSION="${BASE_VERSION}-preview"
fi

STAMP=$(date +%Y%m%d%H%M)

OUT="build/${APP_NAME}-${APP_VERSION}-${STAMP}.ipa"

echo "Building with profile: $PROFILE"
echo "Building → $OUT"
eas build -p ios --profile "$PROFILE" --local --output "$OUT"
echo "✅ Wrote $OUT"
if [[ "$PROFILE" == "production" ]]; then
  echo "You can now upload this to App Store Connect using Transporter or Xcode or any other way you like."
fi