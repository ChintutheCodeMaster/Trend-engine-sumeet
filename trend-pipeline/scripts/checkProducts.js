require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

s.from('products')
  .select('slug, headline, landing_html, evergreen, content_type')
  .order('created_at', { ascending: false })
  .limit(5)
  .then(({ data, error }) => {
    if (error) { console.error('ERROR:', error.message); return; }
    data.forEach(p => {
      console.log('slug        :', p.slug);
      console.log('headline    :', p.headline);
      console.log('has_html    :', !!p.landing_html);
      console.log('evergreen   :', p.evergreen);
      console.log('content_type:', p.content_type);
      console.log('---');
    });
  });
