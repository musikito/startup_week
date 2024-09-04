/**
 * Indicates that this file is a client-side React component.
 * This directive tells Next.js to render this component on the client-side instead of the server-side.
 */
"use client";
import { useUser } from "@clerk/nextjs";
import React from "react";

const events = [
  { id: 1, name: 'Tech Conference', date: '2024-09-15' },
  { id: 2, name: 'Tech Expo', date: '2024-09-01' },
  { id: 3, name: 'Art Exhibition', date: '2024-09-15' },
];

const ClientPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  // In a real app, you'd fetch the user's registered events from a database
  const registeredEvents = events.slice(0, 2); // Simulating 2 registered events

  if (!isLoaded || !isSignedIn) {
    return null;
  }
  return (
    <div className="h-full flex flex-col items-center justify-center text-2xl">
      <h1 className="text-3xl font-bold mb-6">Hello, {user.firstName} welcome to StartUp Week</h1>
      <h2 className="text-2xl font-semibold mb-4">Your Registered Events</h2>
      {registeredEvents.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {registeredEvents.map((event) => (
            <div key={event.id} className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
              <p className="text-gray-600">Date: {event.date}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>You haven`t registered for any events yet.</p>
      )}
      
    </div>
  );
};

export default ClientPage;
