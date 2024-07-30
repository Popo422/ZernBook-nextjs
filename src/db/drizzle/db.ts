import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { config } from "dotenv";
import { users } from "./schema/users";
import { friends } from "./schema/friends";
import { posts } from "./schema/posts";
import { likes } from "./schema/likes";

config({ path: ".env.local" });
// { schema } is used for relational queries
export const db = drizzle(sql, {
  schema: {
    ...users,
    ...friends,
    ...posts,
    ...likes,
  },
});
