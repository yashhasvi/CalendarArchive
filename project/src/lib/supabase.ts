import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://abqwiatxokagvchjisdf.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFicXdpYXR4b2thZ3ZjaGppc2RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NjcwMzcsImV4cCI6MjA2ODE0MzAzN30.D6mtGIXqydBKofq0VN97EgWZv0CZejd137n1_1v_5ts'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)