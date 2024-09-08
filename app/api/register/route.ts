import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URL;
const client = new MongoClient(uri as string);
export async function POST(request: Request) {
  try {
    const body = await request.json()
    await client.connect()
    const database = client.db('startup-week');
    const collection = database.collection('registrations')
    
    const result = await collection.insertOne(body);
    console.log('Registration successful:', result);
    
    return NextResponse.json({ message: 'Registration successful', id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ message: 'Error registering user' }, { status: 500 })
  } finally {
    await client.close()
  }
};