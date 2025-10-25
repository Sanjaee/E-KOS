import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check apakah user sudah authenticated
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Return session data to popup window
    return res.status(200).json({
      success: true,
      user: session.user,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Callback error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}