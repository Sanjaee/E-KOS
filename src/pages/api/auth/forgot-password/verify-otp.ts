import { NextApiRequest, NextApiResponse } from 'next';
import { verifyResetPasswordOTP } from '@/services/forgot-password';

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
      const { email, otpCode } = req.body;
  
      if (!email || !otpCode) {
        return res.status(400).json({
          success: false,
          message: 'Email dan kode OTP diperlukan'
        });
      }
  
      const result = await verifyResetPasswordOTP(email, otpCode);
      
      if (!result.success) {
        return res.status(400).json(result);
      }
  
      return res.status(200).json({
        success: true,
        message: 'Verifikasi OTP berhasil',
        data: {
          email,
          isVerified: true
        }
      });
    } catch (error: any) {
      console.error('Error in verify-otp API:', error);
      return res.status(400).json({ 
        success: false,
        message: error.message || 'Gagal memverifikasi OTP'
      });
    }
  }