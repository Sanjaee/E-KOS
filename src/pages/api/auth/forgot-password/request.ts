import { NextApiRequest, NextApiResponse } from 'next';
import { requestPasswordReset } from '@/services/forgot-password';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Email diperlukan' 
      });
    }

    const result = await requestPasswordReset(email);
    
    if (result.success === false) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
}