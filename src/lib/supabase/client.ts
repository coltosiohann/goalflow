import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Use fallback values during build if env vars not set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

  if (typeof window !== 'undefined' && (supabaseUrl.includes('placeholder') || supabaseKey.includes('placeholder'))) {
    console.warn(
      '⚠️ Supabase Client is using placeholder credentials. Please check your .env file.\n' +
      'Required: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}
