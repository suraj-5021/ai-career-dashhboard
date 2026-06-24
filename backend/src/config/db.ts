import mongoose from 'mongoose';

export let isConnected = false;

export async function connectDB() {
  const mongoURI = process.env.MONGODB_URI;
  
  if (!mongoURI) {
    throw new Error('MONGODB_URI is not set in environment variables. Database connection is required.');
  }

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`\n[Database Connection] MongoDB connected successfully to host: ${conn.connection.host}\n`);
    isConnected = true;
  } catch (error: any) {
    console.error(`\n[Database Error] Mongoose connection failed: ${error.message}`);
    throw error;
  }
}
