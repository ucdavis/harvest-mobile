## Get started (on Mac with Xcode for iOS setup)

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo run:ios
   ```

More info about setup [using ios Simulator plus local build](https://docs.expo.dev/get-started/set-up-your-environment/?platform=ios&device=simulated&mode=development-build&buildEnv=local).

## Testing

We don't have any testing setup yet. There are some placeholders in the package.json and azure-pipelines.yml for running tests, but no actual tests yet.

Eventually we can add following https://docs.expo.dev/develop/unit-testing/.

## Logs and Errors

We are using Sentry w/ the 'harvest-mobile' project. The `ios/sentry.properties` file is not checked into git, so you will need to set it up yourself. It looks like this but you'll need to bring your own auth token:

```

auth.token=<YOUR_AUTH_TOKEN>

defaults.org=ucdavis
defaults.project=harvest-mobile

defaults.url=https://sentry.io/

```

You also need an `.env.local` if you want to log to Sentry in development mode. It should look like this:

```
SENTRY_AUTH_TOKEN=<YOUR_AUTH_TOKEN>
```

I'm not sure if you need the auth token in both places or just one. Guessing maybe just `.env.local` is enough but TBD.

## Deployment

We use [Azure Pipelines](https://dev.azure.com/ucdavis/Harvest%20Mobile/_build) to build and deploy the app. The pipeline is defined in `azure-pipelines.yml`.

The pipeline basically just does some linting and testing. We aren't going to do automatic deployment.

## Deployment

### Prerequisites

Need the xcode tools, which you probably already have if you are doing iOS development. But if not:

```bash
xcode-select --install
```

Then install the Fastlane tools:

```bash
brew install fastlane
```

Then install the Mac app "Transporter" [from the App Store](https://apps.apple.com/us/app/transporter/id1450874784?mt=12). You don't really need it, but it makes it easier to upload the app to App Store Connect. Otherwise you can use Xcode or any other way to upload the finished .ipa file.

## Build and deploy

### Prebuild

If core assets have been changed, like the loading screen or app icon, then you need to run the prebuild step to regenerate the native iOS project files.

```bash
npx expo prebuild -p ios
```

### Build

Run the deployment build locally:

```bash
npm run build:ios
```

This might require some local setup the first time, like logging into your Apple Developer account.

This will create an .ipa file in `build/*.ipa`. You can then upload this to App Store Connect using Transporter or Xcode or any other way you like.
