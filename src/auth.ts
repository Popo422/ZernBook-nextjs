import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { compare } from "bcrypt";
import { db } from "@/db/drizzle/db";
import { users } from "@/db/drizzle/schema/users";
import { eq } from "drizzle-orm";
import Credentials from "next-auth/providers/credentials";

type User = {
  email: string;
  password: string;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials: User) => {
        const { email, password } = credentials;
        // Add logic here to look up the user from the credentials supplied
        const userExists = (
          await db.select().from(users).where(eq(users.email, email))
        )[0];
        if (!userExists) {
          console.error("Something went wrong logging in");
        }
        const isPasswordValid = await compare(
          password || "",
          userExists.password
        );
        if (!isPasswordValid) {
          console.error("Invalid Credentials");
        }
        return { id: userExists.id, email: userExists.email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, session }) {
      return { ...token, ...user };
    },
  },
});
