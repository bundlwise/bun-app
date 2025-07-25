// store/authStore.ts
import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createJSONStorage, persist } from 'zustand/middleware'
import auth from '@react-native-firebase/auth'

interface AuthState {
  userName: string
  userEmail: string
  isSignedIn: boolean
  setUser: (user: any) => void
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userName: '',
      userEmail: '',
      isSignedIn: false,
      setUser: (user) => set({ 
        userName: user?.displayName || user?.name || '',
        userEmail: user?.email || '',
        isSignedIn: !!user 
      }),
      signOut: async () => {
        await auth().signOut()
        set({ 
          userName: '',
          userEmail: '',
          isSignedIn: false 
        })
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)