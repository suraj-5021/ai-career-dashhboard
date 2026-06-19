import mongoose from 'mongoose';

export let isConnected = false;

export async function connectDB() {
  const mongoURI = process.env.MONGODB_URI;
  
  if (!mongoURI) {
    console.warn('\n[Database Warning] MONGODB_URI is not set in environment variables.');
    console.warn('[Database Fallback] Server will start in in-memory simulation mode. Data will persist in-memory.\n');
    isConnected = false;
    return;
  }

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`\n[Database Connection] MongoDB connected successfully to host: ${conn.connection.host}\n`);
    isConnected = true;
  } catch (error: any) {
    console.error(`\n[Database Error] Mongoose connection failed: ${error.message}`);
    console.warn('[Database Fallback] Falling back to in-memory simulation mode.\n');
    isConnected = false;
  }
}
