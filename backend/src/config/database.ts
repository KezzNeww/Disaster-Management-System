import mongoose from 'mongoose';

export async function connectDatabase(): Promise<void> {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/disaster_db';

  try {
    const conn = await mongoose.connect(uri);
    console.log(`[DATABASE] MongoDB Atlas connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('[DATABASE] Connection error:', error);
    // Graceful error handling for skeleton
  }
}
