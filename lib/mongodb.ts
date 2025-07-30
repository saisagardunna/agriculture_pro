import mongoose, { Mongoose } from 'mongoose';
import { MongoClient, MongoClientOptions } from 'mongodb';

// Extend global type to include mongoose and _mongoClientPromise
declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Ensure MONGODB_URI is a string
const MONGODB_URI: string = process.env.MONGODB_URI ?? '';
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Mongoose connection caching
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// MongoClient setup
const options: MongoClientOptions = {};
let client = new MongoClient(MONGODB_URI, options);
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV !== 'production') {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = client.connect();
}

// Combined connection function
export async function connectDB(): Promise<{
  mongoose: Mongoose;
  mongoClient: MongoClient;
}> {
  if (cached.conn) {
    return { mongoose: cached.conn, mongoClient: await clientPromise };
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    const mongoClient = await clientPromise;
    return { mongoose: cached.conn, mongoClient };
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}

export { clientPromise };