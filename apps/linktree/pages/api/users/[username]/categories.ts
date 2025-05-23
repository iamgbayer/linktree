import type { NextApiRequest, NextApiResponse } from 'next';
import { Category } from '../../../../types/category';
import { readCategories } from '../../../../utils/db';

interface ApiError {
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Category[] | ApiError>
) {
  const { username } = req.query;

  if (typeof username !== 'string') {
    return res.status(400).json({ message: 'Username must be a string' });
  }

  const userId = username;

  if (req.method === 'GET') {
    try {
      const categories = await readCategories(userId);
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json({ message: error instanceof Error ? error.message : 'Failed to read categories' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
} 