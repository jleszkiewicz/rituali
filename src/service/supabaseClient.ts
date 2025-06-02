import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://ecibunbfqzfbedjmkwww.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjaWJ1bmJmcXpmYmVkam1rd3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2MTAwNDgsImV4cCI6MjA2MTE4NjA0OH0.WKLEpf9l6eZrV1D1Wk6Z8qKq91EJGzt67fScU4pHAGk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});