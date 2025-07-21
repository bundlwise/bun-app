import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Register for the authentication callback
WebBrowser.maybeCompleteAuthSession();

// Constants - your Google OAuth Client ID
const CLIENT_ID = '87247158210-pu6ddk3hu3gqc7l4uihfc0gj7rli98je.apps.googleusercontent.com';

// User profile type
export type UserInfo = {
  id: string;
  email: string;
  name: string;
  picture?: string;
} | null;

// Hook for Google authentication
export function useGoogleAuth() {
  const [userInfo, setUserInfo] = React.useState<UserInfo>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Use the Google provider directly
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: CLIENT_ID,
    // Important: Google expects the same ID to be used for all platforms in Expo
    iosClientId: CLIENT_ID,
    androidClientId: CLIENT_ID,
    webClientId: CLIENT_ID,
  });

  // Log the request details for debugging
  React.useEffect(() => {
    if (request?.redirectUri) {
      console.log('Google Auth Redirect URI:', request.redirectUri);
    }
  }, [request]);

  // Load user from storage on app start
  React.useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const userJSON = await AsyncStorage.getItem('user');
        if (userJSON) {
          setUserInfo(JSON.parse(userJSON));
        }
      } catch (e) {
        console.error('Failed to load user info from storage', e);
      }
    };

    loadStoredUser();
  }, []);

  // Handle auth response
  React.useEffect(() => {
    const handleResponse = async () => {
      if (response?.type === 'success') {
        setLoading(true);
        setError(null);
        
        console.log('Authentication successful:', response);
        
        try {
          const { authentication } = response;
          
          if (!authentication || !authentication.accessToken) {
            throw new Error('No access token received');
          }
          
          // Get user info from Google
          const userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
            headers: { Authorization: `Bearer ${authentication.accessToken}` }
          });
          
          if (!userInfoResponse.ok) {
            throw new Error(`User info request failed: ${userInfoResponse.status}`);
          }
          
          const userData = await userInfoResponse.json();
          console.log('User data retrieved:', userData);
          
          const user = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            picture: userData.picture,
          };
          
          // Store user info
          await AsyncStorage.setItem('user', JSON.stringify(user));
          setUserInfo(user);
        } catch (e) {
          console.error('Error in authentication flow:', e);
          setError(e instanceof Error ? e.message : 'Failed to get user information');
        } finally {
          setLoading(false);
        }
      } else if (response?.type === 'error') {
        console.error('Authentication error:', response.error);
        setError(response.error?.message || 'Authentication failed');
      }
    };

    handleResponse();
  }, [response]);

  const signIn = async () => {
    try {
      setLoading(true);
      console.log('Initiating Google sign-in...');
      const result = await promptAsync();
      console.log('Sign-in result:', result);
      
      if (result.type !== 'success') {
        console.log('Sign-in was not successful');
      }
    } catch (e) {
      console.error('Sign-in error:', e);
      setError(e instanceof Error ? e.message : 'Authentication failed');
    } finally {
      // Don't set loading to false here as the response handler will do it
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUserInfo(null);
      console.log('User signed out successfully');
    } catch (e) {
      console.error('Sign-out error:', e);
      setError('Failed to sign out');
    }
  };

  return {
    userInfo,
    loading,
    error,
    signIn,
    signOut,
    isAuthenticated: !!userInfo,
  };
} 