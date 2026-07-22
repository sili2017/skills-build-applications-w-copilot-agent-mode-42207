import mongoose from 'mongoose';

export const connectionString =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

let hasConnectionListener = false;

export async function connectDatabase(): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!hasConnectionListener) {
    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });
    hasConnectionListener = true;
  }

  await mongoose.connect(connectionString);
  console.log('Connected to octofit_db');
}

export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
