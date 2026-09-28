import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'YOUR_SUPABASE_URL' && 
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY'
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local storage persistent fallback helpers
export const localStore = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(`studyload_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`studyload_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(`studyload_${key}`);
    } catch (e) {
      console.error('LocalStorage remove error:', e);
    }
  }
};
