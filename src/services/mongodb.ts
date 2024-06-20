import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const url = process.env.MONGODB_URI as string;
const client = new MongoClient(url);

let db: any;

export const connectToDb = async () => {
    if (!db) {
        await client.connect();
        db = client.db(process.env.DB_NAME);
        console.log('Connected to MongoDB');
    }
    return db;
};

export const getDb = () => {
    if (!db) throw new Error('Database not connected');
    return db;
};

export async function closeDatabase() {
    await client.close();
}