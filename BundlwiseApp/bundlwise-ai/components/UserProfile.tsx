import { useAuth } from '@/lib/auth';
import React from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

export const UserProfile: React.FC = () => {
  const { user, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error: any) {
      console.error('Sign-out error:', error);
      Alert.alert(
        'Sign-Out Error',
        error.message || 'An error occurred during sign-out. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  if (!user) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.profileSection}>
        {user.photoURL && (
          <Image
            source={{ uri: user.photoURL }}
            style={styles.profileImage}
          />
        )}
        <View style={styles.userInfo}>
          <ThemedText type="title" style={styles.displayName}>
            {user.displayName || 'User'}
          </ThemedText>
          <ThemedText style={styles.email}>
            {user.email}
          </ThemedText>
        </View>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <ThemedText style={styles.signOutText}>
            {loading ? 'Signing out...' : 'Sign Out'}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  displayName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    opacity: 0.7,
  },
  actions: {
    alignItems: 'center',
  },
  signOutButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  signOutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 