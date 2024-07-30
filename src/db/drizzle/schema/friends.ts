import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const friends = pgTable(
  "friends",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id), // Use UUID as primary key with default generation
    friendId: text("friend_id")
      .notNull()
      .references(() => users.id),
    status: text("status"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    // Foreign key referencing Users table
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.friendId] }),
      pkWithCustomName: primaryKey({
        name: "user_friend_id",
        columns: [table.userId, table.friendId],
      }),
    };
  }
);
