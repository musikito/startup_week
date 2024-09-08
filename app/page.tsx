import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import RegistrationForm from '@/components/RegistrationForm';


const events = [
  { id: 1, name: 'Tech Conference', date: '2024-09-15' },
  { id: 2, name: 'Tech Expo', date: '2024-09-01' },
  { id: 3, name: 'Art Exhibition', date: '2024-09-15' },
];
export default async function Home() {
  
  return (
    <div className="flex items-center justify-center h-full">
       <RegistrationForm />
      {/* <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div key={event.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
            <p className="text-gray-600 mb-4">Date: {event.date}</p>
            <Link
              href={`/register/${event.id}`}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Register
            </Link>
          </div>
        ))}
      </div> */}
    </div>
  );
}
