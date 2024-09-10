/**
 * The `RegistrationForm` component is a React functional component that renders a form for user registration. It manages the form state using the `useState` hook and handles form submission using the `handleSubmit` function. The form includes fields for name, email, phone, and affiliation, all of which are required except for affiliation. When the form is submitted, the component sends a POST request to the `/api/register` endpoint with the form data. If the registration is successful, an alert is shown to the user. If there is an error, an error message is displayed.
 */
'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';
import { log } from 'console';

export default function RegistrationForm() {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    affiliation: ''
  });

  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  /**
   * Retrieves the user's ID from local storage and sets the `userId` state if it exists.
   * This effect runs once when the component is mounted.
   */
  useEffect(() => {
    const storeUserId = localStorage.getItem('userId');
    // console.log("storeUserId", storeUserId);
    if (storeUserId) {
      setUserId(storeUserId);
    }
  }, []);


  /**
   * Handles changes to the form data by updating the `formData` state with the new values.
   * @param e - The `React.ChangeEvent<HTMLInputElement>` object representing the input field that was changed.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        alert('Registration successful!');
        const { userId } = await response.json();
        localStorage.setItem('userId', userId);
        setUserId(userId);
        // const data = await response.json();
        // router.push(`/qr/${data.id}`);
        //  redirect("/components/QRScanner");
        // router.push("/qrscanner");
      } else {
        alert('Registration failed. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred. Please try again.')
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      { !userId ? ( 
      
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
          <div>
            <Label htmlFor="name">Name (Required)</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email address (Required)</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone number (Required)</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="affiliation">Affiliation</Label>
            <Input
              id="affiliation"
              name="affiliation"
              value={formData.affiliation}
              onChange={handleChange}
            />
          </div>
          <Button type="submit" className="w-full">Register</Button>
        </form>
      ) : (
        <Link href="/qrscanner" >
          <Button type="submit" className="w-full">Scan your event</Button>
        </Link>
       
      )} 
    </main>

  );
};
