import { NextApiRequest, NextApiResponse } from 'next';
import { Category } from '../../../types/category';
import { ApiResponse } from '../../../types/api';
import { readCategories, writeCategories } from '../../../utils/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Category[] | Category>>
) {
  const { username = 'iamgbayer' } = req.query;

  try {
    if (req.method === 'GET') {
      const categories = await readCategories(username as string);
      return res.status(200).json({ data: categories });
    }

    if (req.method === 'POST') {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Category name is required' });
      }

      const categories = await readCategories(username as string);
      const newCategory: Category = {
        id: `cat-${Date.now().toString()}`,
        name,
      };
      categories.push(newCategory);

      await writeCategories(username as string, categories);
      return res.status(201).json({ data: newCategory });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
} 