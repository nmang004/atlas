import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('=== CATEGORIES ===\n');
  const { data: categories, error: catErr } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (catErr) {
    console.error('Categories error:', catErr);
  } else {
    console.log('Categories count:', categories.length);
    console.table(categories);
  }

  console.log('\n=== PROMPTS WITH CATEGORIES ===\n');
  const { data: prompts, error: promptErr } = await supabase
    .from('prompts')
    .select(`
      id,
      title,
      tags,
      category_id,
      categories (
        id,
        name
      )
    `)
    .order('title');

  if (promptErr) {
    console.error('Prompts error:', promptErr);
  } else {
    console.log('Prompts count:', prompts.length);
    const formatted = prompts.map(p => ({
      id: p.id?.substring(0, 8) + '...',
      title: p.title?.substring(0, 50),
      category: p.categories?.name || 'UNCATEGORIZED',
      tags: p.tags?.join(', ') || ''
    }));
    console.table(formatted);
  }
}

main();
