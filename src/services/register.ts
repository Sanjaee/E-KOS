import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { drizzle } from "drizzle-orm/node-postgres";
import { users } from "../db/schema";
import { sendVerificationEmail } from "../lib/nodemailer";
import { toCamelCase } from "drizzle-orm/casing";
import { registerLimiter, resendOTPLimiter } from "../lib/rateLimiter";

const db = drizzle(process.env.DATABASE_URL!);

interface RegisterData {
  name: string;
  email: string;
  password: string;
  loginMethod: string;
}

interface VerifyOTPData {
  email: string;
  otpCode: string;
}

export async function register(data: RegisterData) {
  try {
    const rateLimitKey = `register:${data.email}`;
    if (registerLimiter.isRateLimited(rateLimitKey)) {
      const remainingTime = Math.ceil(
        registerLimiter.getRemainingTime(rateLimitKey) / (1000 * 60 * 60 * 24)
      );
      throw new Error(
        `Terlalu banyak percobaan. Silakan coba lagi dalam ${remainingTime} hari.`
      );
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .execute();

    if (existingUser.length > 0) {
      const user = existingUser[0];

      // Check if user tries to register with different method
      if (user.loginMethod !== data.loginMethod) {
        throw new Error(
          `Email ini sudah terdaftar menggunakan Login By Google. Silakan masuk menggunakan metode tersebut.`
        );
      }

      if (!user.emailVerified) {
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

        await db
          .update(users)
          .set({
            otpCode,
            otpExpiry,
          })
          .where(eq(users.email, data.email))
          .execute();

        await sendVerificationEmail(data.email, user.name!, otpCode);

        return {
          status: "UNVERIFIED_EMAIL",
          email: data.email,
          message: "Email exists but not verified. New OTP has been sent.",
        };
      }
      throw new Error("Email already registered");
    }

    const hashedPassword = await hash(data.password, 10);
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

    const newUser = {
      id: nanoid(),
      name: data.name,
      email: data.email,
      password: hashedPassword,
      otpCode,
      otpExpiry,
      emailVerified: false,
      role: "member",
      loginMethod: "credentials",
    };

    await db.insert(users).values(newUser).execute();
    await sendVerificationEmail(data.email, data.name, otpCode);

    return {
      success: true,
      email: data.email,
      message: "Registrasi berhasil. Silakan cek email Anda untuk verifikasi.",
    };
  } catch (error) {
    console.error("Error in register:", error);
    throw error;
  }
}

export async function verifyOTP(data: VerifyOTPData) {
  try {
    const rateLimitKey = `verify:${data.email}`;
    if (registerLimiter.isRateLimited(rateLimitKey)) {
      const remainingTime = Math.ceil(
        registerLimiter.getRemainingTime(rateLimitKey) / (1000 * 60 * 60 * 24)
      );
      throw new Error(
        `Terlalu banyak percobaan. Silakan coba lagi dalam ${remainingTime} hari.`
      );
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .execute();

    if (user.length === 0) {
      throw new Error("User not found");
    }

    if (user[0].emailVerified) {
      throw new Error("Email already verified");
    }

    if (user[0].otpCode !== data.otpCode) {
      throw new Error("Invalid OTP code");
    }

    if (new Date() > new Date(user[0].otpExpiry!)) {
      throw new Error("OTP code expired");
    }

    await db
      .update(users)
      .set({
        emailVerified: true,
        otpCode: null,
        otpExpiry: null,
      })
      .where(eq(users.email, data.email))
      .execute();

    return { success: true };
  } catch (error) {
    console.error("Error in verifyOTP:", error);
    throw error;
  }
}

export async function resendOTP(email: string) {
  try {
    const rateLimitKey = `resend:${email}`;
    if (resendOTPLimiter.isRateLimited(rateLimitKey)) {
      const remainingTime = Math.ceil(
        resendOTPLimiter.getRemainingTime(rateLimitKey) / (1000 * 60 * 60 * 24)
      );
      throw new Error(
        `Terlalu banyak percobaan. Silakan coba lagi dalam ${remainingTime} hari.`
      );
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .execute();

    if (user.length === 0) {
      throw new Error("User not found");
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

    await db
      .update(users)
      .set({
        otpCode,
        otpExpiry,
      })
      .where(eq(users.email, email))
      .execute();

    // Resend OTP email using the provided template
    await sendVerificationEmail(email, user[0].name!, otpCode);

    return { success: true };
  } catch (error) {
    console.error("Error in resendOTP:", error);
    throw error;
  }
}
