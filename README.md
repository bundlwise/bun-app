# Bundlwise App - Google SSO Implementation

This project implements Google Single Sign-On (SSO) authentication for the Bundlwise app across web, iOS, and Android platforms.

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- Expo CLI installed (`npm install -g expo-cli`)
- For iOS testing: iOS Simulator or physical iOS device with Expo Go app
- For Android testing: Android Emulator or physical Android device with Expo Go app
- For Web testing: Modern web browser

### Installation

1. Clone the repository and navigate to the project directory
2. Install dependencies:
```bash
npm install
```

### Google SSO Configuration

The app is pre-configured with the Google OAuth client ID:
- Web/iOS Client ID: `87247158210-pu6ddk3hu3gqc7l4uihfc0gj7rli98je.apps.googleusercontent.com`

For Android, you may need to create a separate client ID in the Google Cloud Console and update it in the `authService.ts` file.

### Running the App

#### For Web:
```bash
npm run web
```

#### For iOS Simulator:
```bash
npm run ios
```

#### For Android Emulator:
```bash
npm run android
```

### Testing the Authentication

1. Launch the app on your desired platform
2. On the welcome screen, tap either "Log in" or "Create Account"
3. The Google Sign-In flow should appear
4. After successful authentication, you'll be redirected to the Welcome screen
5. You can navigate to the Profile screen to see your user information and sign out

## Implementation Details

- Authentication service: `utils/authService.ts`
- Google Sign-In button component: `components/GoogleSignInButton.tsx`
- Authentication-aware screens:
  - `BundlwiseGetStartedScreen.tsx` (login screen)
  - `Welcome.tsx` (post-login screen)
  - `Profile.tsx` (user profile with sign-out)

## Troubleshooting

- If you encounter issues with the OAuth redirect, ensure the bundle identifier and URL scheme are correctly set in `app.json`
- For iOS and Android, you may need to register the app in the Google Cloud Console with the correct package name/bundle identifier
- Check the Expo documentation for platform-specific authentication setup details: https://docs.expo.dev/guides/authentication/ 