const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Peringatan: SUPABASE_URL atau SUPABASE_ANON_KEY tidak ditemukan di environment variables.");
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

module.exports = supabase;
