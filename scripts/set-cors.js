// Run once: node scripts/set-cors.js
// Requires Application Default Credentials:
//   gcloud auth application-default login
//
// Sets CORS on the Firebase Storage bucket so the Vercel app
// can upload photos from the browser.

import { Storage } from '@google-cloud/storage';

const storage = new Storage({ projectId: 'i-tree-you' });
const bucket = storage.bucket('i-tree-you.firebasestorage.app');

const corsConfig = [
  {
    origin: [
      'https://i-tree-you.vercel.app',
      'http://localhost:5173',
      'http://localhost:5174',
    ],
    method: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
    responseHeader: ['Content-Type', 'Authorization', 'Content-Length'],
    maxAgeSeconds: 3600,
  },
];

try {
  await bucket.setCorsConfiguration(corsConfig);
  const [meta] = await bucket.getMetadata();
  console.log('✓ CORS set successfully.');
  console.log('Current CORS config:', JSON.stringify(meta.cors, null, 2));
} catch (err) {
  console.error('✗ Failed to set CORS:', err.message);
  process.exit(1);
}

process.exit(0);
