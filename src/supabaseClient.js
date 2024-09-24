// src/supabaseClient.js
const { createClient } = require('@supabase/supabase-js');

// Substitua com as suas credenciais do Supabase
const SUPABASE_URL = 'https://ibfkxhssnttlrjijdbbv.supabase.co'; // Substitua pelo URL do seu projeto
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliZmt4aHNzbnR0bHJqaWpkYmJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY2NTk1NTQsImV4cCI6MjA0MjIzNTU1NH0.ghKoV90o61_2-CSfDlA08emIDUhXHeCmyrTA87LyJqg'; // Substitua pela sua chave de API

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = supabase;
