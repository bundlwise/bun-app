import { StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, View } from '../../components/Themed';
import { useGoogleAuth } from '../../utils/authService';
import { router } from 'expo-router';

export default function LoginScreen() {
  const { signIn, loading, error } = useGoogleAuth();

  const handleSignIn = async () => {
    await signIn();
    if (!error) {
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Bundlwise</Text>
      
      {error && <Text style={styles.error}>{error}</Text>}
      
      <TouchableOpacity
        style={styles.googleButton}
        onPress={handleSignIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign in with Google</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  googleButton: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
}); 