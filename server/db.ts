import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const nodeEnv = process.env.NODE_ENV || 'development';
    const mongoUri = process.env.MONGODB_URI || (nodeEnv !== 'production' ? 'mongodb://localhost:27017/nepa_health' : undefined);

    if (!mongoUri) {
      console.error('✗ MONGODB_URI is not set. In production provide a MongoDB connection string as the environment variable MONGODB_URI (for example, a MongoDB Atlas URI)');
      console.error('✗ On Render: go to Settings → Environment → Add Environment Variable `MONGODB_URI` and redeploy.');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✓ MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✓ MongoDB disconnected');
  } catch (error) {
    console.error('✗ MongoDB disconnection failed:', error);
  }
};
