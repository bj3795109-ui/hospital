import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';
let client: MongoClient;
let db: Db;

export async function connectDb() {
  if (!client) {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db();
  }
  return db;
}

export function getDb(): Db {
  if (!db) {
    throw new Error('MongoDB not connected. Call connectDb() first.');
  }
  return db;
}
