import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xuibwtqlwhyoieammjpt.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1aWJ3dHFsd2h5b2llYW1tanB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzA3NjksImV4cCI6MjA3NDA0Njc2OX0.a6-EQLi_YClRUsKdbCPVHN0LVEPHOclKyq2Od9lzzgM'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)



