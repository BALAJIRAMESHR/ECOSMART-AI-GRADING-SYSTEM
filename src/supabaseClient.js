// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = 'https://jvxnzpuffsbahookvwtl.supabase.co';
const supabaseKey  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2eG56cHVmZnNiYWhvb2t2d3RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwMDQxNDAsImV4cCI6MjA0MDU4MDE0MH0.lhrQxWZCC_KzVRheG-bN7lazTgDbla2n8VisVu-HMy0';

export const supabase = createClient(supabaseUrl, supabaseKey)


