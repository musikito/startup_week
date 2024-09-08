import { ObjectId } from 'mongodb';
import QRCodeComponent from '@/components/QRCode';
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation';
import { MongoClient } from 'mongodb';

async function getRegistration(id: string) {
  const uri = process.env.MONGODB_URL
  const client = new MongoClient(uri as string)
  
  try {
    await client.connect()
    const database = client.db('startup-week')
    const collection = database.collection('registrations')
    
    return await collection.findOne({ _id: new ObjectId(id) })
  } finally {
    await client.close()
  }
}

export default async function QRPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
//   if (!session) {
//     redirect('/api/auth/signin')
//   }

  const registration = await getRegistration(params.id)
  
  if (!registration) {
    return <div>Registration not found</div>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">Your QR Code</h1>
      <QRCodeComponent value={params.id} />
      <p className="mt-4">Scan this code to check in</p>
    </div>
  )
}