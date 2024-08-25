import mongoose from 'mongoose';

const password = "R19yJzPgRXIwERQx";

const LocalUri = `mongodb://localhost:27017/animehatori`;
const RemoteUri = `mongodb://tamakuz:${password}@cluster0-shard-00-00.onqly.mongodb.net:27017,cluster0-shard-00-01.onqly.mongodb.net:27017,cluster0-shard-00-02.onqly.mongodb.net:27017/animehatori?ssl=true&replicaSet=atlas-8a28iu-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;

if (!LocalUri || !RemoteUri) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

async function dbConnect() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    await mongoose.connect(LocalUri, {
      bufferCommands: false,
    });
    console.log('Connected to MongoDB');
    return mongoose.connection;
  } catch (error) {
    throw error;
  }
}

export default dbConnect;
