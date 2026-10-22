import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

/**
 * Chuẩn hóa URL Supabase: tự động loại bỏ /rest/v1 hoặc dấu gạch chéo cuối nếu người dùng dán vào
 */
export const normalizeSupabaseUrl = (url: string): string => {
  if (!url) return '';
  let cleaned = url.trim();
  // Loại bỏ hậu tố /rest/v1 hoặc /rest/v1/
  cleaned = cleaned.replace(/\/rest\/v1\/?$/i, '');
  // Loại bỏ dấu gạch chéo thừa ở cuối
  cleaned = cleaned.replace(/\/+$/, '');
  return cleaned;
};

export const getSupabaseConfig = () => {
  // Check environment variables first
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (envUrl && envKey && envUrl !== 'https://your-project.supabase.co' && !envUrl.includes('placeholder')) {
    return { url: normalizeSupabaseUrl(envUrl), key: envKey.trim(), source: 'env' as const };
  }

  // Check saved settings in localStorage
  try {
    const saved = localStorage.getItem('xv6_hub_supabase_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.key) {
        return { url: normalizeSupabaseUrl(parsed.url), key: parsed.key.trim(), source: 'settings' as const };
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

export const testSupabaseConnection = async (
  url: string, 
  key: string
): Promise<{ success: boolean; error?: string; needsMigration?: boolean }> => {
  try {
    const cleanUrl = normalizeSupabaseUrl(url);
    const cleanKey = key.trim();

    if (!cleanUrl.startsWith('https://') && !cleanUrl.startsWith('http://')) {
      return { success: false, error: 'URL Supabase phải bắt đầu bằng https://' };
    }

    const testClient = createClient(cleanUrl, cleanKey);
    const { error } = await testClient.from('members').select('id').limit(1);

    if (error) {
      // Trường hợp kết nối API Key và URL đúng nhưng chưa chạy migration tạo bảng
      if (error.code === 'PGRST205' || error.message?.includes("Could not find the table 'public.members'")) {
        return { 
          success: true, 
          needsMigration: true,
          error: 'Kết nối Supabase thành công! Tuy nhiên database chưa có bảng dữ liệu (cần chạy schema.sql trong SQL Editor).' 
        };
      }
      if (error.code !== 'PGRST116') {
        return { success: false, error: error.message };
      }
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Không thể kết nối tới Supabase URL này.' };
  }
};
