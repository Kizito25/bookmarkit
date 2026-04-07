import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;


console.log('Supabase URL:', supabaseUrl ? 'Loaded' : 'Not Loaded');
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Loaded' : 'Not Loaded');

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables:', {
        url: !!supabaseUrl,
        key: !!supabaseAnonKey
    });
}

export const supabase = createClient<Database>(
    supabaseUrl || 'https://placeholder.supabase.co', 
    supabaseAnonKey || 'placeholder-key'
);
