import { NextApiRequest, NextApiResponse } from 'next';
import { readLinks } from '../../../../utils/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username } = req.query;
  const userStr = Array.isArray(username) ? username[0] : username;
  
  const allLinks = await readLinks(userStr as string);
  const visibleLinks = allLinks.filter(link => link.is_visible);
  return res.status(200).json({ data: visibleLinks });
} 