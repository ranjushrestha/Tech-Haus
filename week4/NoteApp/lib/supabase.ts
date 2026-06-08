import "react-native-url-polyfill/auto";
// import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { createClient } from "@supabase/supabase-js";

//secure store inplace of asyncStore for encrypted store
// const secureStoreAdaptor = {
//   getItem: async (key: string): Promise<string | null> => {
//     return await SecureStore.getItemAsync(key);
//   },
//   setItem: async (key: string, value: string): Promise<void> => {
//     await SecureStore.setItemAsync(key, value);
//   },
//   removeItem: async (key: string): Promise<void> => {
//     await SecureStore.deleteItemAsync(key);
//   },
// };

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
