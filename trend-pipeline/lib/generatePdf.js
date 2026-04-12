require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

function getSupabase() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  return createClient(process.env.SUPABASE_URL, key);
}

async function launchBrowser() {
  // Vercel / Lambda: use sparticuz chromium
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const chromium = require('@sparticuz/chromium');
    const puppeteer = require('puppeteer-core');
    return puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      defaultViewport: chromium.defaultViewport,
    });
  }

  // Local dev: use bundled puppeteer
  const puppeteer = require('puppeteer');
  return puppeteer.launch({ headless: true });
}

/**
 * Renders an HTML string to a PDF Buffer using headless Chromium.
 * Targets A4 at ~15 pages.
 */
async function generatePdfFromHtml(html) {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 60_000 });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '32px', right: '48px', bottom: '48px', left: '48px' },
    });
    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

/**
 * Uploads a PDF buffer to Supabase Storage (bucket: 'pdfs').
 * Returns the public URL.
 */
async function uploadPdfToStorage(pdfBuffer, slug) {
  const supabase = getSupabase();
  const filePath = `${slug}.pdf`;

  const { error } = await supabase.storage
    .from('pdfs')
    .upload(filePath, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const { data } = supabase.storage.from('pdfs').getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Full pipeline: generate PDF from product_html → upload → return public URL.
 * Also updates products.pdf_url in Supabase.
 */
async function buildAndStorePdf(slug) {
  const supabase = getSupabase();

  const { data: product, error } = await supabase
    .from('products')
    .select('product_html, product_title')
    .eq('slug', slug)
    .single();

  if (error || !product?.product_html) {
    throw new Error(`No product HTML found for slug="${slug}"`);
  }

  console.log(`[generatePdf] Rendering PDF for "${slug}"...`);
  const pdfBuffer = await generatePdfFromHtml(product.product_html);
  console.log(`[generatePdf] PDF rendered (${Math.round(pdfBuffer.length / 1024)} KB). Uploading...`);

  const pdfUrl = await uploadPdfToStorage(pdfBuffer, slug);
  console.log(`[generatePdf] Uploaded: ${pdfUrl}`);

  await supabase.from('products').update({ pdf_url: pdfUrl }).eq('slug', slug);
  console.log(`[generatePdf] pdf_url saved for "${slug}"`);

  return pdfUrl;
}

module.exports = { buildAndStorePdf };
