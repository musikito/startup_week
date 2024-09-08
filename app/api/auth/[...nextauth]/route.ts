import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URL
const client = new MongoClient(uri as string);

const clientPromise = client.connect();

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: async ({ session, user }: { session: any, user: any }) => {
      session.user.id = user.id
      return session
    },  },
};


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };