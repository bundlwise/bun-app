import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const DEFAULT_IMAGE = 'https://placehold.co/100x100/png?text=No+Photo';

export default function ProfileInfoScreen() {
  const [profileImage, setProfileImage] = useState(DEFAULT_IMAGE);
  const [firstName, setFirstName] = useState('Arian');
  const [lastName, setLastName] = useState('Zesan');
  const [email] = useState('arianzesan@gmail.com');
  const [phone, setPhone] = useState('+91 ');
  const navigation = useNavigation<any>();


  const showInfo = (field: 'email' | 'phone') => {
    const titles = {
      email: 'Email Info',
      phone: 'Phone Info',
    };
    const messages = {
      email: 'This is your registered email address.',
      phone: 'This is your registered phone number.',
    };
    Alert.alert(titles[field], messages[field]);
  };

  const handleUpload = () => {
    Alert.alert(
      'Select Option',
      'Choose a method to set your profile photo',
      [
        {
          text: 'Take a Photo',
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission Denied', 'Camera access is required to take a photo.');
              return;
            }

            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.7,
            });

            if (!result.canceled && result.assets?.length > 0) {
              setProfileImage(result.assets[0].uri);
            }
          },
        },
        {
          text: 'Choose from Gallery',
          onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission Denied', 'Gallery access is required to select a photo.');
              return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.7,
            });

            if (!result.canceled && result.assets?.length > 0) {
              setProfileImage(result.assets[0].uri);
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const handleDeletePhoto = () => {
    setProfileImage(DEFAULT_IMAGE);
    Alert.alert('Picture Deleted', 'Your profile picture was removed.');
  };

  const handleSave = () => {
    Keyboard.dismiss();
    Alert.alert('Saved', 'Profile info has been saved.');
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Redirecting to change password screen.');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action is irreversible.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => Alert.alert('Account Deleted', 'Your account has been deleted.'),
        },
      ]
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={['#292734', '#1E1B23', '#121118', '#000000']}
        locations={[0, 0.5, 0.6, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.container}
      >
        <KeyboardAwareScrollView
          enableOnAndroid
          extraScrollHeight={40}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <SafeAreaView style={{ flex: 1 }}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Profile Info</Text>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('WalletScreen')}>

                <Text style={styles.backArrow}>←</Text>
              </TouchableOpacity>
            </View>

            {/* Profile Photo */}
            <View style={styles.photoSection}>
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
                onError={() => setProfileImage(DEFAULT_IMAGE)}
              />
              <View style={styles.photoInfo}>
                <Text style={styles.photoTitle}>Update your Picture</Text>
                <Text style={styles.photoSubtitle}>Upload a photo under 2 MB</Text>
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
                    <Text style={styles.uploadText}>Upload</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleDeletePhoto}>
                    <Text style={styles.deleteText}>Delete Current Picture</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Form & Actions */}
            <View style={styles.contentWrapper}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>First Name</Text>
                <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />
              </View>

              <View style={styles.inputRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>E-mail</Text>
                  <TextInput
                    style={[styles.input, { color: '#999' }]}
                    value={email}
                    editable={false}
                  />
                </View>
                <TouchableOpacity style={styles.infoCircle} onPress={() => showInfo('email')}>
                  <Text style={styles.infoText}>i</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputRow}>
  <View style={{ flex: 1 }}>
    <Text style={styles.label}>Phone Number</Text>
    <TextInput
  style={styles.input}
  value={phone}
  onChangeText={(text) => {
    // Always ensure text starts with "+91 "
    if (!text.startsWith('+91 ')) {
      text = '+91 ';
    }

    // Extract digits after +91
    const raw = text.replace('+91 ', '').replace(/[^\d]/g, '');

    // Limit to 10 digits
    const limited = raw.slice(0, 10);

    // Final formatted text
    setPhone('+91 ' + limited);
  }}
  placeholder="Enter your number"
  placeholderTextColor="#888"
  keyboardType="number-pad"
  selection={{
    start: phone.length,
    end: phone.length,
  }}
  autoCorrect={false}
  autoComplete="tel"
  textContentType="telephoneNumber"
/>

  </View>
  <TouchableOpacity style={styles.infoCircle} onPress={() => showInfo('phone')}>
    <Text style={styles.infoText}>i</Text>
  </TouchableOpacity>
</View>


              <TouchableOpacity style={styles.primaryButton} onPress={handleChangePassword}>
                <Text style={styles.primaryButtonText}>Change your Password</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
                <Text style={styles.deleteButtonText}>Delete your Account</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </KeyboardAwareScrollView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 25,
  },
  saveButton: {
    backgroundColor: '#48934f',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
    color: 'white',
    left: -18,
  },
  backButton: {
    backgroundColor: '#3b3b3b',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 20,
    color: '#fff',
  },
  photoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginLeft: 24,
  },
  profileImage: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#444',
  },
  photoInfo: {
    marginLeft: 16,
  },
  photoTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 3,
    color: '#fff',
  },
  photoSubtitle: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: '#4e9e9e',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    marginRight: 15,
  },
  uploadText: {
    color: '#fff',
    fontWeight: '500',
  },
  deleteText: {
    color: '#f66',
    fontWeight: '500',
    fontSize: 14,
  },
  contentWrapper: {
    marginTop: 30,
    marginHorizontal: 24,
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  label: {
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 6,
    color: '#fff',
  },
  input: {
    borderRadius: 12,
    backgroundColor: '#2d2b33',
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 16,
    color: '#fff',
  },
  infoCircle: {
    marginTop:20,
    marginLeft: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontWeight: '700',
    color: '#fff',
  },
  primaryButton: {
    backgroundColor: '#111',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 25,
    alignSelf: 'center',
    width: '70%',
  },
  primaryButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#f6f0f020',
    borderRadius: 20,
    paddingVertical: 14,
    marginTop: 20,
    alignSelf: 'center',
    width: '70%',
  },
  deleteButtonText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
    color: '#f66',
  },
});

