# Firebase Setup Instructions

This project uses React Native Firebase for authentication and crashlytics. Follow these steps to set up Firebase for your development environment.

## Prerequisites

1. A Firebase project (create one at [Firebase Console](https://console.firebase.google.com/))
2. React Native development environment set up

## Setup Steps

### 1. Firebase Project Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication and Crashlytics services

### 2. Android Configuration

1. In Firebase Console, go to Project Settings > General
2. Add an Android app with package name: `com.bundlwiseai.app`
3. Download the `google-services.json` file
4. Place it in the root directory of your project (same level as `package.json`)

### 3. iOS Configuration

1. In Firebase Console, go to Project Settings > General
2. Add an iOS app with bundle ID: `com.bundlwiseai.app`
3. Download the `GoogleService-Info.plist` file
4. Place it in the root directory of your project (same level as `package.json`)

### 4. Web Configuration (Optional)

If you plan to use the web version:

1. In Firebase Console, go to Project Settings > General
2. Add a web app
3. Copy the Firebase config object
4. Update the `firebaseConfig` object in `lib/firebase.ts`

### 5. Environment Variables

Create a `.env` file in the root directory with your Firebase configuration:

```env
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

## File Structure

```
bundlwise-ai/
├── google-services.json          # Android Firebase config (gitignored)
├── GoogleService-Info.plist      # iOS Firebase config (gitignored)
├── google-services.json.template # Template for Android config
├── GoogleService-Info.plist.template # Template for iOS config
├── lib/
│   └── firebase.ts              # Firebase initialization
└── app/
    └── _layout.tsx              # Firebase import
```

## Security Notes

- **Never commit** `google-services.json` or `GoogleService-Info.plist` to version control
- These files contain sensitive API keys and should be kept private
- Use the template files to help other developers set up their environment
- Consider using environment variables for web configuration

## Troubleshooting

### Common Issues

1. **"Firebase app not initialized" error**
   - Ensure Firebase config files are in the correct location
   - Check that the package name/bundle ID matches your Firebase project

2. **Build errors on Android**
   - Verify `google-services.json` is in the root directory
   - Check that the package name in the file matches your app

3. **Build errors on iOS**
   - Verify `GoogleService-Info.plist` is in the root directory
   - Check that the bundle ID in the file matches your app

### Getting Help

- [React Native Firebase Documentation](https://rnfirebase.io/)
- [Firebase Console](https://console.firebase.google.com/)
- [Expo Documentation](https://docs.expo.dev/) 