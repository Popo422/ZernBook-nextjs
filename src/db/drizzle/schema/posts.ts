import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  uuid,
} from "drizzle-orm/pg-core";

import { users } from "./users";
import { sql } from "drizzle-orm";

export const posts = pgTable("posts", {
  postId: uuid("post_id").primaryKey().default(sql`gen_random_uuid()`), // Use UUID as primary key with default generation
  title: text("title").notNull(),
  content: text("content").notNull(),
  image: text("image"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id), // Foreign key referencing Users table
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
