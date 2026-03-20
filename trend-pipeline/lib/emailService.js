const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL || 'Hidden Library <noreply@hiddenlibrary.com>';

/**
 * Send purchase confirmation with PDF download link.
 * Called after a successful Stripe payment.
 *
 * @param {string} toEmail    - Customer's email address
 * @param {string} productTitle - e.g. "How to Pay Yourself from an LLC"
 * @param {string} downloadUrl  - Full URL to /api/download/[slug]
 */
async function sendPurchaseConfirmation(toEmail, productTitle, downloadUrl) {
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: toEmail,
    subject: `Your guide is ready — ${productTitle}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #1e1e1e;border-radius:16px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e1b4b,#312e81);padding:36px 40px;text-align:center;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#818cf8;">Hidden Library</p>
              <h1 style="margin:0;font-size:22px;font-weight:800;color:#fff;line-height:1.3;">Your guide is ready</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 20px;font-size:15px;color:#ccc;line-height:1.7;">
                Thank you for your purchase. Your guide has been prepared and is ready to download.
              </p>

              <!-- Guide title box -->
              <div style="background:#161616;border:1px solid #2a2a2a;border-radius:10px;padding:20px 24px;margin-bottom:28px;">
                <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#4f46e5;">Your Guide</p>
                <p style="margin:0;font-size:16px;font-weight:700;color:#f0f0f0;line-height:1.4;">${productTitle}</p>
              </div>

              <!-- Download button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${downloadUrl}"
                       style="display:inline-block;background:#4f46e5;color:#fff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:10px;letter-spacing:0.3px;">
                      Download your PDF →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:28px 0 0;font-size:13px;color:#555;line-height:1.7;text-align:center;">
                This link is for personal use only. If you have any issues, reply to this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #1a1a1a;text-align:center;">
              <p style="margin:0;font-size:12px;color:#333;">
                &copy; ${new Date().getFullYear()} Hidden Library &mdash; All rights reserved
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  });

  if (error) {
    console.error('[emailService] Failed to send purchase confirmation:', error);
    throw new Error(`Email send failed: ${error.message}`);
  }

  console.log(`[emailService] Purchase confirmation sent to ${toEmail}. id=${data.id}`);
  return data;
}

module.exports = { sendPurchaseConfirmation };
