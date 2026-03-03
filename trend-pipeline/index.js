require('dotenv').config();
const cron = require('node-cron');
const { runPipeline } = require('./orchestrator');

const RUN_NOW_FLAG = process.argv.includes('--run-now');

function logHeader(label) {
  const line = '─'.repeat(44);
  console.log(`\n${line}`);
  console.log(` ${label}`);
  console.log(`${line}`);
}

async function executePipeline() {
  const startTime = Date.now();
  logHeader(`Pipeline run started: ${new Date().toISOString()}`);

  try {
    const results = await runPipeline();

    const endTime = Date.now();
    const elapsedSec = ((endTime - startTime) / 1000).toFixed(1);
    const successCount = results.filter(r => !r.error).length;

    logHeader(`Pipeline run finished`);
    console.log(` Duration:  ${elapsedSec}s`);
    console.log(` Products:  ${successCount} created`);
    console.log(`─`.repeat(44));
  } catch (err) {
    const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
    logHeader(`Pipeline run FAILED after ${elapsedSec}s`);
    console.error(` Error: ${err.message}`);
    console.error(err.stack);
  }
}

if (RUN_NOW_FLAG) {
  // Manual run: node index.js --run-now
  console.log('[index] Manual run triggered via --run-now flag.');
  executePipeline().then(() => {
    console.log('\n[index] Manual run complete. Exiting.');
    process.exit(0);
  }).catch(err => {
    console.error('\n[index] Unhandled error during manual run:', err.message);
    process.exit(1);
  });
} else {
  // Scheduled mode: runs daily at 6:00 AM
  console.log('[index] Scheduled mode active. Pipeline will run every day at 6:00 AM.');
  console.log('[index] Tip: Run with --run-now flag to trigger immediately.\n');

  cron.schedule('0 6 * * *', () => {
    console.log('\n[index] Cron triggered: 6:00 AM daily run starting...');
    executePipeline();
  }, {
    scheduled: true,
    timezone: 'America/New_York'
  });

  // Keep the process alive
  console.log('[index] Waiting for next scheduled run... (Ctrl+C to stop)');
}
