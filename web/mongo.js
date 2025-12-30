import mongoose from 'mongoose';

let isConnected = false;

export async function connectMongo() {
  if (isConnected) return;

  const uri = process.env.MONGO_URI || 'mongodb+srv://mohdafsal1049_db_user:euMWSBPbRZ2F4hOp@cluster0.aavty1f.mongodb.net/?appName=Cluster0';
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