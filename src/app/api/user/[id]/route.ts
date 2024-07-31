import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle/db";
import { users } from "@/db/drizzle/schema/users";

import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    //get queryString
    const { id } = params;
    const existingusers = await db.select().from(users).where(eq(users.id, id));
    const user = existingusers[0];
    return NextResponse.json(user);
  } catch (e) {
    console.log({ e });
    return NextResponse.json({
      message: "Something went wrong",
      status: 500,
      error: e,
    });
  }
}
