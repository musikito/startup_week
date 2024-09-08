// import { NextRequest, NextResponse } from 'next/server'
// import { MongoClient } from 'mongodb'

// // MongoDB connection string
// const uri = process.env.MONGODB_URL as string;
// const client = new MongoClient(uri);

// export async function POST(req: NextRequest) {
//   try {
//     // Parse the request body (assuming JSON)
//     const body = await req.json();

//     // Connect to MongoDB
//     await client.connect();
//     const database = client.db('startup-week');
//     const collection = database.collection('scans');

//     // Insert the scanned data into MongoDB
//     const result = await collection.insertOne({
//       scannedData: body.scannedData,
//       timestamp: new Date(),
//     });

//     // Return a success response
//     return NextResponse.json(
//       { message: 'Scan recorded successfully', id: result.insertedId },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error('Error recording scan:', error);

//     // Return an error response
//     return NextResponse.json(
//       { message: 'Error recording scan' },
//       { status: 500 }
//     );
//   } finally {
//     // Ensure the client connection is closed
//     await client.close();
//   }
// }

// export function GET() {
//   return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
// }
import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
// import { authOptions } from '@/app/api/auth/[...nextauth]';
const uri = process.env.MONGODB_URL
const client = new MongoClient(uri as string)

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    await client.connect()
    const database = client.db('startup-week')
    const collection = database.collection('registrations')
    
    const result = await collection.insertOne({
      ...body,
      userId: session.user.id,
      createdAt: new Date()
    })
    
    return NextResponse.json({ message: 'Registration successful', id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ message: 'Error registering user' }, { status: 500 })
  } finally {
    await client.close()
  }
}