import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URL;
const client = new MongoClient(uri as string);

export async function POST(request: Request) {
  try {
    const { scannedData, userId } = await request.json();
    await client.connect();
    const database = client.db('startup-week');
    const scansCollection = database.collection('scans');
    
    const result = await scansCollection.insertOne({
      scannedData,
      userId: new ObjectId(userId),
      timestamp: new Date()
    })
    
    return NextResponse.json({ message: 'Scan recorded successfully', id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error('Scan recording error:', error)
    return NextResponse.json({ message: 'Error recording scan' }, { status: 500 })
  } finally {
    await client.close()
  }
}