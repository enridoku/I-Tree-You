// Run once: node scripts/set-cors.js
// Requires: gcloud auth application-default login

import { Storage } from '@google-cloud/storage';

const storage = new Storage({ projectId: 'i-tree-you' });

// Discover which bucket(s) exist in the project
console.log('Listing all buckets in project i-tree-you…');
const [allBuckets] = await storage.getBuckets();

if (allBuckets.length === 0) {
  console.error(
    '\n✗ No buckets found in project i-tree-you.\n' +
    '  Firebase Storage may not be initialised yet.\n' +
    '  Go to: https://console.firebase.google.com/project/i-tree-you/storage\n' +
    '  Click "Get started" to create the default bucket, then re-run this script.'
  );
  process.exit(1);
}

console.log('Found buckets:');
allBuckets.forEach(b => console.log(' •', b.name));

// Try the known name first, fall back to any bucket in the project
const target =
  allBuckets.find(b => b.name === 'i-tree-you.firebasestorage.app') ||
  allBuckets.find(b => b.name === 'i-tree-you.appspot.com') ||
  allBuckets[0];

console.log(`\nSetting CORS on: ${target.name}`);

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

await target.setCorsConfiguration(corsConfig);
const [meta] = await target.getMetadata();
console.log('✓ CORS set successfully.');
console.log('Current CORS config:', JSON.stringify(meta.cors, null, 2));

// If the bucket name differs from config, tell the user to update firebase.js
if (target.name !== 'i-tree-you.firebasestorage.app') {
  console.log(
    `\n⚠️  Update storageBucket in src/firebase.js to: '${target.name}'`
  );
}

process.exit(0);
