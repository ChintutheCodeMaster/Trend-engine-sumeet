require('dotenv').config();
const Stripe = require('stripe');

const PRODUCT_PRICE_CENTS = 1000; // $10.00

function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables.');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

async function createStripeProduct(stripe, trend) {
  console.log(`[stripeAgent] Creating Stripe product for: "${trend.keyword}"`);

  const product = await stripe.products.create({
    name: `${trend.keyword} - Complete Guide`,
    description: `A comprehensive $10 digital guide covering everything you need to know about ${trend.keyword}. Instant download.`,
    metadata: {
      category: trend.category,
      trend_score: String(trend.score),
      generated_at: new Date().toISOString()
    }
  });

  console.log(`[stripeAgent] Stripe product created: ${product.id}`);
  return product;
}

async function createStripePrice(stripe, productId) {
  console.log(`[stripeAgent] Creating Stripe price ($10.00) for product: ${productId}`);

  const price = await stripe.prices.create({
    product: productId,
    unit_amount: PRODUCT_PRICE_CENTS,
    currency: 'usd'
  });

  console.log(`[stripeAgent] Stripe price created: ${price.id}`);
  return price;
}

async function createStripePaymentLink(stripe, priceId) {
  console.log(`[stripeAgent] Creating Stripe payment link for price: ${priceId}`);

  const paymentLink = await stripe.paymentLinks.create({
    line_items: [{ price: priceId, quantity: 1 }],
    after_completion: {
      type: 'hosted_confirmation',
      hosted_confirmation: {
        custom_message: 'Thank you for your purchase! Your guide download will appear below.'
      }
    }
  });

  console.log(`[stripeAgent] Payment link created: ${paymentLink.url}`);
  return paymentLink.url;
}

async function createPaymentLink(trend) {
  console.log(`[stripeAgent] Starting Stripe setup for: "${trend.keyword}"`);

  try {
    const stripe = getStripeClient();

    const product = await createStripeProduct(stripe, trend);
    const price = await createStripePrice(stripe, product.id);
    const paymentUrl = await createStripePaymentLink(stripe, price.id);

    console.log(`[stripeAgent] Done. Payment URL: ${paymentUrl}`);
    return paymentUrl;
  } catch (err) {
    console.error(`[stripeAgent] Error creating payment link for "${trend.keyword}": ${err.message}`);
    throw err;
  }
}

module.exports = { createPaymentLink };
