import { NextApiRequest, NextApiResponse } from 'next';
import { resetPassword } from '@/services/forgot-password';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    });
  }

  try {
    const { email, otpCode, newPassword } = req.body;

    if (!email || !otpCode || !newPassword) {
      return res.status(400).json({ 
        success: false,
        message: 'Email, OTP, dan password baru diperlukan' 
      });
    }

    const result = await resetPassword(email, otpCode, newPassword);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Reset Password Error:', error);
    return res.status(400).json({ 
      success: false,
      message: error.message || 'Gagal mereset password'
    });
  }
}