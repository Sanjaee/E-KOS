import { NextApiRequest, NextApiResponse } from 'next';
import { resendOTP } from '../../../../services/forgot-password';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method tidak diizinkan' 
    });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email harus diisi'
      });
    }

    const result = await resendOTP(email);
    return res.status(200).json(result);
    
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Terjadi kesalahan saat mengirim ulang OTP'
    });
  }
}