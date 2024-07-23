import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { posts } from "./posts";
import { users } from "./users";

// Define the Likes table
export const likes = pgTable(
  "likes",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    postId: text("post_id")
      .notNull()
      .references(() => posts.postId),
    likedAt: timestamp("liked_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      primaryKey: [table.userId, table.postId], // Composite primary key
    };
  }
);
