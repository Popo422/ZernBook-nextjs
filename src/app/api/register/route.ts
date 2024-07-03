import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { db } from "@/db/drizzle/db";
import { users } from "@/db/drizzle/schema/users";

import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName } = await request.json();
    // validate email and password
    const hashedPassword = await hash(password, 10);
    const existingusers = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingusers[0]) {
      throw new Error("users with this email or employee ID already exists.");
    }
    const resp = await db.insert(users).values({
      // Set to null if lastName is undefined
      name: `${firstName} ${lastName || ""}`,
      email,
      password: hashedPassword,
    });
    return NextResponse.json({ email, password });
  } catch (e) {
    console.log({ e });
  }
}
