

import { Platform } from 'react-native';
import { setupURLPolyfill } from 'react-native-url-polyfill';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Same as react-native-url-polyfill/auto, which Snack cannot resolve as a subpath.
if (Platform.OS !== 'web') setupURLPolyfill();

const supabaseUrl = 'https://tlutjfbonxfqzqjfmjnk.supabase.co/';
const supabaseKey = 'sb_publishable_yBkZfgRLrIELkSwjF3XYeQ_X7CO1BMs';

export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
