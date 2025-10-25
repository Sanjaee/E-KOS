import { NextApiRequest, NextApiResponse } from 'next';
import { register } from '@/services/register';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const result = await register(req.body);
    
    if (result.status === 'UNVERIFIED_EMAIL') {
      return res.status(200).json({
        status: 'UNVERIFIED_EMAIL',
        email: result.email,
        message: result.message
      });
    }
    
    res.status(200).json({
      status: 'SUCCESS',
      email: result.email,
      message: result.message
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}