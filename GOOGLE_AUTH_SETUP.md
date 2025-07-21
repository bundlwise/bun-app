# Google OAuth Configuration Guide

## Fix for "Access blocked: authorisation error" and "Error 400: redirect_uri_mismatch"

If you're encountering the "Access blocked" error or "redirect_uri_mismatch" with Google authentication, follow these steps to resolve the issue:

## 1. Find the Exact Redirect URI

First, run the app and check your console logs. The authentication service now logs the exact redirect URI being used:
```
REDIRECT URI: [your-actual-redirect-uri]
```

Make note of this URI - you need to register it in Google Cloud Console.

## 2. Configure Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to "APIs & Services" > "Credentials"
4. Find and edit your OAuth 2.0 Client ID
5. Add the following redirect URIs:
   - The exact URI from your console logs
   - `https://auth.expo.io/@arpit_maurya/Bundlwise`
   - `bundlwise://`
   - `bundlwise://redirect`
   - For local development also add:
     - `http://localhost:19000/`
     - `http://localhost:19006/`
     - `exp://localhost:19000/redirect`
     - `exp://localhost:19000/--/redirect`

## 3. Check Your OAuth Consent Screen

1. Go to "OAuth consent screen" section
2. Make sure your app has the required info completed
3. If in "Testing" status, ensure your email is added as a test user
4. If you're using sensitive scopes, you may need to submit for verification

## 4. Testing the Authentication

After making these changes:

1. Restart your Expo development server
2. Clear your app cache or reinstall the app
3. Try signing in again

## 5. Additional Troubleshooting

If you're still encountering issues:

- Ensure you're using the correct Google OAuth Client ID in your code
- For iOS simulator testing, use `npx expo run:ios` instead of Expo Go
- For Android, create a development build with `npx expo run:android`
- For web, check for CORS issues and ensure your origin is allowed

## 6. Current Configuration

This project is set up with:
- Client ID: `87247158210-pu6ddk3hu3gqc7l4uihfc0gj7rli98je.apps.googleusercontent.com`
- Redirect URI format: `bundlwise://redirect` (native) and `https://auth.expo.io/@arpit_maurya/Bundlwise` (Expo Go)
- App scheme: `bundlwise`

Remember to log into Expo CLI (`npx expo login`) if using the Expo authentication proxy. 