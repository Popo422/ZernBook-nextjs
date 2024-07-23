import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { compare } from "bcrypt";
import { db } from "@/db/drizzle/db";
import { users } from "@/db/drizzle/schema/users";
import { eq } from "drizzle-orm";
import Credentials from "next-auth/providers/credentials";
import google from "next-auth/providers/google";

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
    google,
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
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
    async jwt({ token, user, session }) {
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
      session.user.id  = token && token.id ;
      // Add other fields as necessary
      session.user.role = token.role;
      return session;
    },
  },
});
