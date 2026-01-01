import mongoose from 'mongoose';

let isConnected = false;

export async function connectMongo() {
  if (isConnected) return;

  const uri = process.env.MONGO_URI || 'http://localhost:27017/shopify-app';
  console.log('uri', uri);
  if (!uri) {
    throw new Error('MONGO_URI is not set in environment variables');
  }

  await mongoose.connect(uri, {
    dbName: 'shopify_app',
  });

  isConnected = true;
  console.log('✅ MongoDB connected');
}