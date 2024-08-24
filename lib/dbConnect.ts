import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/animehatori';

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

async function dbConnect() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
    console.log('Connected to MongoDB');
    return mongoose.connection;
  } catch (error) {
    throw error;
  }
}

export default dbConnect;
