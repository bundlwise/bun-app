// types/navigation.ts
import { UserInfo } from "../utils/authService";

export type RootStackParamList = {
  Welcome: { user?: UserInfo } | undefined;
  BundlwiseGetStartedScreen: undefined;
  Profile: { user?: UserInfo } | undefined;
  PaymentHistoryScreen: undefined;
};
  