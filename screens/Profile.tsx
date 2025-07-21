import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { useGoogleAuth } from '../utils/authService';

type ProfileScreenProps = {
  route: RouteProp<RootStackParamList, 'Profile'>;
  navigation: any;
};

const ProfileScreen = ({ route, navigation }: ProfileScreenProps) => {
  const { userInfo, signOut } = useGoogleAuth();
  const scrollY = useRef(new Animated.Value(0)).current;

  // Get user from navigation params or from auth state
  const user = route.params?.user || userInfo;

  const logoOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const logoScale = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0.7],
    extrapolate: 'clamp',
  });

  const handleSignOut = async () => {
    await signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: 'BundlwiseGetStartedScreen' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* User Profile Section */}
        <Animated.View
          style={[
            styles.logoSection,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          {user && user.picture ? (
            <Image 
              source={{ uri: user.picture }} 
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.logoBox}>
              <Svg width={32} height={32} viewBox="0 0 16 18">
                <Path
                  d="M11.0386 7.65363C11.2415 7.61853 11.4372 7.56993 11.6243 7.50873L11.6235 7.50783C12.9702 7.06323 13.8606 5.93913 13.8606 4.16253C13.8606 2.91604 13.2007 1.89184 12.2306 1.37704C11.4325 0.954042 10.5658 0.729043 9.69587 0.599443C7.62218 0.289844 5.5398 0.0126446 3.44479 4.46082e-05C2.12731 -0.00805537 1.56843 1.08814 1.29373 2.31034C0.955877 3.82054 0.722221 5.64483 0.759321 7.19823C0.783792 8.22872 1.15559 9.37082 2.40991 9.19172C4.26732 8.92712 6.02842 8.59142 7.81163 8.25122C8.87176 8.04873 9.939 7.84532 11.0386 7.65363ZM2.42491 17.9991H11.442L11.4428 18C13.788 18 15.2365 15.723 14.9681 13.1913C14.8055 11.6496 14.1756 9.99452 12.7871 9.46802C11.6788 9.04682 10.4584 9.23042 9.31145 9.40232C9.18593 9.42122 9.06121 9.44012 8.93728 9.45722C7.64428 9.64262 6.3568 9.87212 5.07012 10.1016C4.87593 10.1367 4.68174 10.1709 4.48834 10.206C4.42598 10.2168 4.36283 10.2276 4.29968 10.2393C3.39663 10.3986 2.39097 10.5768 1.53765 10.8774C0.6717 11.1825 0.370158 12.0753 0.22807 12.9852C0.167288 13.3749 0.130976 13.7691 0.0946648 14.1624C0.0836135 14.2785 0.0733516 14.3946 0.0623003 14.5107C-0.0308464 15.4476 -0.108995 16.4214 0.528033 17.1747C1.00798 17.7444 1.75157 17.9991 2.42491 17.9991Z"
                  fill="white"
                />
              </Svg>
            </View>
          )}
          {user && (
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          )}
        </Animated.View>

        {/* Pro Card */}
        <View style={styles.proCard}>
          <View style={styles.proContent}>
            <Text style={styles.proTitle}> Bundlwise</Text>
            <Text style={styles.proSubtitle}>
              Unlock AI models, sync & more
            </Text>
          </View>
          <TouchableOpacity style={styles.tryFreeButton}>
            <Ionicons name="gift-outline" size={16} color="#fff" style={styles.trashIcon} />
            <Text style={styles.tryFreeText}>Try Free</Text>
          </TouchableOpacity>
        </View>

        {/* Message Limit */}
        <View style={styles.messagePillContainer}>
          <View style={styles.messageProgressBar}>
            <View style={styles.messageProgressFill} />
            <Text style={styles.messagePillText}>50 AI Messages Left</Text>
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <View style={styles.sectionGroup}>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="document-text-outline" size={20} color="#fff" />
              <Text style={styles.menuText}>Changelog</Text>
              <Ionicons name="chevron-forward" size={16} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Account + Subscription Group */}
          <View style={styles.sectionGroup}>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="person-outline" size={20} color="#fff" />
              <Text style={styles.menuText}>Account</Text>
              <Ionicons name="chevron-forward" size={16} color="#666" />
            </TouchableOpacity>
            <View style={styles.itemDivider} />
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="card-outline" size={20} color="#fff" />
              <Text style={styles.menuText}>Subscription</Text>
              <Text style={styles.subscriptionFree}>Free</Text>
              <Ionicons name="chevron-forward" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Customize */}
        <View style={styles.customizeSection}>
          <Text style={styles.sectionTitle}>CUSTOMIZE</Text>
          <View style={styles.sectionGroup}>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="color-palette-outline" size={20} color="#fff" />
              <Text style={styles.menuText}>Theme</Text>
              <Text style={styles.themeValue}>System</Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Discover Section */}
        <View style={styles.discoverSection}>
          <Text style={styles.sectionTitle}>DISCOVER</Text>
          <View style={styles.sectionGroup}>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="share-social-outline" size={20} color="#fff" />
              <Text style={styles.menuText}>Share Extension</Text>
              <Ionicons name="chevron-forward" size={16} color="#666" />
            </TouchableOpacity>
            <View style={styles.itemDivider} />
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="add-circle-outline" size={20} color="#fff" />
              <Text style={styles.menuText}>Share Actions</Text>
              <Ionicons name="chevron-forward" size={16} color="#666" />
            </TouchableOpacity>
            <View style={styles.itemDivider} />
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="rocket-outline" size={20} color="#fff" />
              <Text style={styles.menuText}>Shortcuts</Text>
              <Ionicons name="chevron-forward" size={16} color="#666" />
            </TouchableOpacity>
            <View style={styles.itemDivider} />
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="grid-outline" size={20} color="#fff" />
              <Text style={styles.menuText}>Widgets</Text>
              <Ionicons name="chevron-forward" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* More Section */}
        <View style={styles.moreSection}>
          <Text style={styles.sectionTitle}>MORE</Text>
          <View style={styles.sectionGroup}>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="help-circle-outline" size={20} color="#fff" />
              <Text style={styles.menuText}>Support</Text>
              <Ionicons name="chevron-forward" size={16} color="#666" />
            </TouchableOpacity>
            <View style={styles.itemDivider} />
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="information-circle-outline" size={20} color="#fff" />
              <Text style={styles.menuText}>About</Text>
              <Ionicons name="chevron-forward" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color="red" />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    position: 'relative',
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#fff' },
  closeButton: { position: 'absolute', right: 20, padding: 5 },
  content: { flex: 1, paddingHorizontal: 20 },
  logoSection: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  logoBox: {
    width: 64,
    height: 64,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#333',
  },
  userInfo: {
    alignItems: 'center',
    marginTop: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#aaa',
  },
  proCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 20,
  },
  proContent: { flex: 1, paddingRight: 10 },
  proTitle: { fontSize: 18, fontWeight: '600', color: '#fff', marginBottom: 6 },
  proSubtitle: { fontSize: 13.5, color: '#aaa', lineHeight: 20 },
  tryFreeButton: {
    backgroundColor: '#333',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  trashIcon: { marginRight: 6 },
  tryFreeText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  messagePillContainer: {
    marginBottom: 30,
    paddingHorizontal: 4,
  },
  messageProgressBar: {
    height: 46,
    backgroundColor: '#1c1c1e',
    borderRadius: 20,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  messageProgressFill: {
    position: 'absolute',
    left: 14,
    top: 16,
    bottom: 6,
    width: '45%',
    backgroundColor: '#2e2e2f',
    borderRadius: 20,
    height: 16,
  },
  messagePillText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'right',
    paddingRight: 12,
  },
  menuSection: { marginBottom: 30 },
  sectionGroup: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#2c2c2e',
    marginHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuText: { color: '#fff', fontSize: 16, marginLeft: 12, flex: 1 },
  subscriptionFree: { color: '#888', fontSize: 14, marginRight: 8 },
  customizeSection: { marginBottom: 30 },
  sectionTitle: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  themeValue: { color: '#888', fontSize: 14, marginRight: 8 },
  discoverSection: { marginBottom: 30 },
  moreSection: { marginBottom: 30 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginBottom: 40,
  },
  logoutText: {
    color: 'red',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProfileScreen;
