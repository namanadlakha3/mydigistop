import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const isPlaceholder =
  !supabaseUrl ||
  supabaseUrl === 'your_supabase_project_url' ||
  !supabaseUrl.startsWith('https://');

if (isPlaceholder) {
  console.warn(
    '[MyDigiStop] Supabase credentials not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.local file. Backend features will be unavailable until configured.'
  );
}

// Use a valid placeholder URL to prevent Supabase SDK from throwing
const effectiveUrl = isPlaceholder ? 'https://placeholder.supabase.co' : supabaseUrl;
const effectiveKey = isPlaceholder || !supabaseAnonKey || supabaseAnonKey === 'your_supabase_anon_key'
  ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'
  : supabaseAnonKey;

export const supabase = createClient(effectiveUrl, effectiveKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export const isSupabaseConfigured = !isPlaceholder;
export type SupabaseClient = typeof supabase;
