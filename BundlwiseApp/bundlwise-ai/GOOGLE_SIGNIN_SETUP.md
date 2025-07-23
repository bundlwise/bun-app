# Google Sign-In Setup Instructions

This project now includes Google Sign-In with Firebase authentication. Follow these steps to complete the setup.

## Prerequisites

1. Firebase project configured (see `FIREBASE_SETUP.md`)
2. Google Cloud Console access
3. Android/iOS development environment

## Setup Steps

### 1. Firebase Console Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`bundlwise-ai`)
3. Go to **Authentication** > **Sign-in method**
4. Enable **Google** as a sign-in provider
5. Add your support email
6. Save the changes

### 2. Google Cloud Console Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project (`bundlwise-ai`)
3. Go to **APIs & Services** > **Credentials**
4. Find your **Web client ID** (it should look like `637563703297-YOUR_WEB_CLIENT_ID.apps.googleusercontent.com`)
5. Copy this Web client ID

### 3. Update the Web Client ID

1. Open `lib/auth.tsx`
2. Replace `'637563703297-YOUR_WEB_CLIENT_ID.apps.googleusercontent.com'` with your actual Web client ID
3. Save the file

### 4. Android Configuration

1. In Firebase Console, go to **Project Settings** > **General**
2. Under **Your apps**, find your Android app
3. Download the `google-services.json` file if you haven't already
4. Place it in the root directory of your project

### 5. iOS Configuration

1. In Firebase Console, go to **Project Settings** > **General**
2. Under **Your apps**, find your iOS app
3. Download the `GoogleService-Info.plist` file if you haven't already
4. Place it in the root directory of your project

### 6. SHA-1 Certificate Fingerprint (Android)

For Android, you need to add your app's SHA-1 fingerprint to Firebase:

1. Get your debug SHA-1:
   ```bash
   cd android && ./gradlew signingReport
   ```
2. Copy the SHA-1 from the debug variant
3. In Firebase Console, go to **Project Settings** > **General**
4. Under your Android app, click **Add fingerprint**
5. Paste the SHA-1 and save

### 7. Build and Test

1. Clean and rebuild your project:
   ```bash
   npm run reset-project
   npx expo run:android  # or npx expo run:ios
   ```

2. Test the Google Sign-In flow:
   - App should show sign-in screen when not authenticated
   - Tap Google Sign-In button
   - Should redirect to Google account selection
   - After successful sign-in, should show main app with user profile

## Troubleshooting

### Common Issues

1. **"Google Sign-In failed" error**
   - Check that Google Sign-In is enabled in Firebase Console
   - Verify the Web client ID is correct in `lib/auth.tsx`
   - Ensure SHA-1 fingerprint is added to Firebase (Android)

2. **"Play services not available" error (Android)**
   - Make sure Google Play Services is installed on the device/emulator
   - Use a Google Play Services enabled emulator

3. **"Sign-in cancelled" error**
   - User cancelled the sign-in process
   - This is normal behavior, not an error

4. **Build errors**
   - Clean and rebuild the project
   - Check that all Firebase config files are in place
   - Verify plugin configuration in `app.json`

### Getting Help

- [React Native Google Sign-In Documentation](https://github.com/react-native-google-signin/google-signin)
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Google Cloud Console](https://console.cloud.google.com/)

## Security Notes

- Never commit the actual Web client ID to version control
- Use environment variables for sensitive configuration in production
- Keep Firebase config files secure and don't share them publicly 