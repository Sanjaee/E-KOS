// src/services/auth.service.ts
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { drizzle } from "drizzle-orm/node-postgres";
import { users } from "../db/schema";

interface GoogleAuthData {
  username: string;
  email: string;
  image?: string;
}

const db = drizzle(process.env.DATABASE_URL!);

export async function loginWithGoogle(data: GoogleAuthData) {
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .execute();

    if (existingUser.length > 0) {
      // Check if user previously registered with credentials
      if (existingUser[0].loginMethod === "credentials") {
        throw new Error(
          "This email is registered using email/password. Please login with your password."
        );
      }

      // Update existing user
      await db
        .update(users)
        .set({
          name: data.username,
          image: data.image,
        })
        .where(eq(users.email, data.email))
        .execute();

      return existingUser[0];
    }

    // Create new user
    const newUser = {
      id: nanoid(),
      name: data.username,
      email: data.email,
      image: data.image,
      emailVerified: true,
      role: "member",
      loginMethod: "google",
    };

    await db.insert(users).values(newUser).execute();

    return newUser;
  } catch (error) {
    console.error("Error in loginWithGoogle:", error);
    throw error;
  }
}
