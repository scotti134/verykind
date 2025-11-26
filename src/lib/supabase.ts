import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ybuiphifavmjgvvtsorm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlidWlwaGlmYXZtamd2dnRzb3JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxODI2NTUsImV4cCI6MjA3OTc1ODY1NX0.e5Nfqco6nlaMn63SBs8vFwuhy3xhn5z6Az5nWdW-DQw';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
