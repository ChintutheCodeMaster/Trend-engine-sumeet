/**
 * Recovery script — generates PDF from existing product HTML and uploads to Supabase Storage.
 * Usage: node scripts/generatePDF.js <slug>
 * Example: node scripts/generatePDF.js how-do-i-pay-myself-from-my-llc
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const { createClient } = require('@supabase/supabase-js');
const puppeteer = require('puppeteer');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function run() {
  const slug = process.argv[2];
  if (!slug) {
    console.error('Usage: node scripts/generatePDF.js <slug>');
    process.exit(1);
  }

  console.log(`[generatePDF] Fetching product: "${slug}"`);
  const { data: product, error } = await supabase
    .from('products')
    .select('slug, product_title, product_html')
    .eq('slug', slug)
    .single();

  if (error || !product) {
    console.error('[generatePDF] Product not found:', error?.message);
    process.exit(1);
  }

  if (!product.product_html || product.product_html.length < 200) {
    console.error('[generatePDF] product_html is empty or too short — build may not have completed.');
    process.exit(1);
  }

  console.log(`[generatePDF] Got HTML (${product.product_html.length} chars). Launching puppeteer...`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  let pdfBuffer;
  try {
    const page = await browser.newPage();
    await page.setContent(product.product_html, { waitUntil: 'networkidle0' });
    pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
    });
    console.log(`[generatePDF] PDF generated (${(pdfBuffer.length / 1024).toFixed(1)} KB).`);
  } finally {
    await browser.close();
  }

  console.log(`[generatePDF] Uploading to Supabase Storage...`);
  const filePath = `${slug}.pdf`;
  const { error: uploadError } = await supabase.storage
    .from('pdfs')
    .upload(filePath, pdfBuffer, { contentType: 'application/pdf', upsert: true });

  if (uploadError) {
    console.error('[generatePDF] Upload failed:', uploadError.message);
    process.exit(1);
  }

  const { data: { publicUrl } } = supabase.storage.from('pdfs').getPublicUrl(filePath);
  console.log(`[generatePDF] Uploaded. Public URL: ${publicUrl}`);

  const { error: updateError } = await supabase
    .from('products')
    .update({ pdf_url: publicUrl })
    .eq('slug', slug);

  if (updateError) {
    console.error('[generatePDF] Failed to save pdf_url:', updateError.message);
    process.exit(1);
  }

  console.log(`[generatePDF] Done. pdf_url saved for "${slug}".`);
}

run();
