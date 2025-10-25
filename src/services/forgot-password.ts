import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { hash } from 'bcrypt';
import { users } from '../db/schema';
import { sendVerificationEmailResetPassword } from '../lib/sendForgotPassword';

const db = drizzle(process.env.DATABASE_URL!);

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  data?: {
    email?: string;
    isVerified?: boolean;
  };
}

// Generate OTP
const generateOTP = (length: number = 6): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Request OTP untuk reset password
export async function requestPasswordReset(email: string): Promise<ForgotPasswordResponse> {
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .execute();

    if (existingUser.length === 0) {
      throw new Error('Email tidak terdaftar dalam sistem');
    }

    const user = existingUser[0];

    // Ganti pengecekan provider dengan loginMethod
    if (user.loginMethod === 'google') {
      throw new Error('Akun ini menggunakan login Google. Silakan gunakan opsi "Login with Google" untuk masuk.');
    }

    // Periksa apakah ada kode reset yang masih aktif
    if (
      user.resetPasswordExpiry && 
      new Date(user.resetPasswordExpiry) > new Date()
    ) {
      await sendVerificationEmailResetPassword(
        email, 
        user.name || 'User', 
        user.resetPasswordCode!
      );

      return {
        success: true,
        message: 'Kode OTP masih aktif dan telah dikirim ulang ke email Anda',
        data: { email }
      };
    }

    const otp = generateOTP();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 15);

    await db
      .update(users)
      .set({
        resetPasswordCode: otp,
        resetPasswordExpiry: otpExpiry,
      })
      .where(eq(users.email, email))
      .execute();

    await sendVerificationEmailResetPassword(email, user.name || 'User', otp);

    return {
      success: true,
      message: 'Kode OTP telah dikirim ke email Anda',
      data: { email }
    };
  } catch (error: any) {
    console.error('Error in requestPasswordReset:', error);
    return {
      success: false,
      message: error.message || 'Gagal memproses permintaan reset password'
    };
  }
}


// Verifikasi OTP
export async function verifyResetPasswordOTP(
  email: string,
  otp: string
): Promise<ForgotPasswordResponse> {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .execute();

    if (user.length === 0) {
      throw new Error('Email tidak ditemukan');
    }

    const userData = user[0];

    // Validasi OTP
    if (!userData.resetPasswordCode || !userData.resetPasswordExpiry) {
      throw new Error('Tidak ada permintaan reset password yang aktif');
    }

    if (userData.resetPasswordCode !== otp) {
      throw new Error('Kode OTP tidak valid');
    }

    if (new Date() > new Date(userData.resetPasswordExpiry)) {
      throw new Error('Kode OTP sudah kadaluarsa');
    }

    return {
      success: true,
      message: 'Verifikasi OTP berhasil',
      data: {
        email,
        isVerified: true
      }
    };
  } catch (error: any) {
    console.error('Error in verifyResetPasswordOTP:', error);
    throw new Error(error.message || 'Gagal memverifikasi OTP');
  }
}

// Reset Password setelah verifikasi OTP
export async function resetPassword(
  email: string,
  otp: string,
  newPassword: string
): Promise<ForgotPasswordResponse> {
  try {
    // Verifikasi OTP terlebih dahulu
    const verificationResult = await verifyResetPasswordOTP(email, otp);
    
    if (!verificationResult.success) {
      throw new Error('Verifikasi OTP gagal');
    }

    // Validasi password baru
    if (!newPassword || newPassword.length < 8) {
      throw new Error('Password baru harus minimal 8 karakter');
    }

    // Hash password baru
    const hashedPassword = await hash(newPassword, 10);

    // Update password dan hapus data reset password
    await db
      .update(users)
      .set({
        password: hashedPassword,
        resetPasswordCode: null,
        resetPasswordExpiry: null,
      })
      .where(eq(users.email, email))
      .execute();

    return {
      success: true,
      message: 'Password berhasil direset'
    };
  } catch (error: any) {
    console.error('Error in resetPassword:', error);
    throw new Error(error.message || 'Gagal mereset password');
  }
}
export async function resendOTP(email: string): Promise<ForgotPasswordResponse> {
  try {
    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .execute();

    if (existingUser.length === 0) {
      throw new Error('Email tidak terdaftar dalam sistem');
    }

    const user = existingUser[0];

    // Check if there's an active reset password request
    if (!user.resetPasswordExpiry || new Date() > new Date(user.resetPasswordExpiry)) {
      throw new Error('Tidak ada permintaan reset password yang aktif');
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 15); // Valid for 15 minutes

    // Update user with new OTP
    await db
      .update(users)
      .set({
        resetPasswordCode: otp,
        resetPasswordExpiry: otpExpiry,
      })
      .where(eq(users.email, email))
      .execute();

    // Send email with new OTP
    await sendVerificationEmailResetPassword(email, user.name || 'User', otp);

    return {
      success: true,
      message: 'Kode OTP baru telah dikirim ke email Anda',
      data: { email }
    };
  } catch (error: any) {
    console.error('Error in resendOTP:', error);
    throw new Error(error.message || 'Gagal mengirim ulang kode OTP');
  }
}