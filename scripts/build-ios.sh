#!/usr/bin/env bash
set -euo pipefail

mkdir -p build

APP_NAME="harvestmobile"
# Read version from app.json (adjust if you store it elsewhere)
APP_VERSION=$(node -p "require('./app.json').expo.version")
STAMP=$(date +%Y%m%d%H%M)

OUT="build/${APP_NAME}-${APP_VERSION}-${STAMP}.ipa"

echo "Building → $OUT"
eas build -p ios --profile production --local --output "$OUT"
echo "✅ Wrote $OUT"
echo "You can now upload this to App Store Connect using Transporter or Xcode or any other way you like."