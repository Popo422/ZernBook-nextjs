import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { compare } from "bcrypt";
import { db } from "@/db/drizzle/db";
import { users } from "@/db/drizzle/schema/users";
import { eq } from "drizzle-orm";
import Credentials from "next-auth/providers/credentials";
import google from "next-auth/providers/google";

type User = {
  id?: string;
  email: string;
  password: string;
  name?: string;
  image?: string;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        password: {},
        email: {},
      },
      authorize: async (credentials) => {
        if (!credentials) return null;
        const email = credentials.email as string;
        const password = credentials.password as string;
        // Add logic here to look up the user from the credentials supplied
        const userExists = (
          await db.select().from(users).where(eq(users.email, email))
        )[0];
        if (!userExists) {
          console.error("Something went wrong logging in");
        }
        if (userExists.password && password) {
          const isPasswordValid = await compare(
            password,
            userExists.password
          );
          if (!isPasswordValid) {
            console.error("Invalid Credentials");
          }
          return { id: userExists.id, email: userExists.email };
        }
        return null;
      },
    }),
    google,
  ],
  callbacks: {
    async signIn({ account, profile }: any) {
      if (account?.provider === "google" && profile) {
        const existingusers = await db
          .select()
          .from(users)
          .where(eq(users.email, profile?.email));
        if (!existingusers || existingusers.length === 0) {
          await db.insert(users).values({
            email: (profile && profile.email) || "",
            name: profile?.name,
            image: profile?.picture,
          });
        }
        return true;
      }
      return true;
    },
    async jwt({ token, user, session }: any) {
      if (user) {
        const dbUser = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email));

        token.id = dbUser[0].id;
      }
      return { ...token, ...session };
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        // Add other fields as necessary
      }
      return session;
    },
  },
});
