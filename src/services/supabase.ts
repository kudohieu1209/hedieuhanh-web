import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export const getSupabaseConfig = () => {
  // Check environment variables first
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (envUrl && envKey && envUrl !== 'https://your-project.supabase.co' && !envUrl.includes('placeholder')) {
    return { url: envUrl, key: envKey, source: 'env' as const };
  }

  // Check saved settings in localStorage
  try {
    const saved = localStorage.getItem('xv6_hub_supabase_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.key) {
        return { url: parsed.url, key: parsed.key, source: 'settings' as const };
      }
    }
  } catch (e) {
    console.error('Error reading saved Supabase config:', e);
  }

  return null;
};

export const isSupabaseConfigured = (): boolean => {
  return getSupabaseConfig() !== null;
};

export const getSupabaseClient = (): SupabaseClient | null => {
  const config = getSupabaseConfig();
  if (!config) return null;

  if (!supabaseClient) {
    try {
      supabaseClient = createClient(config.url, config.key);
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return supabaseClient;
};

export const resetSupabaseClient = () => {
  supabaseClient = null;
};

export const testSupabaseConnection = async (url: string, key: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const testClient = createClient(url, key);
    const { error } = await testClient.from('members').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Không thể kết nối tới Supabase URL này.' };
  }
};
