import { NextApiRequest, NextApiResponse } from 'next';
import { Category } from '../../../types/category';
import { ApiResponse } from '../../../types/api';
import { readCategories, writeCategories, readLinks, writeLinks } from '../../../utils/db';
import { Link } from '../../../types/link';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Category | void>>
) {
  const { categoryId } = req.query;
  const { username = 'iamgbayer' } = req.query;

  if (!categoryId || typeof categoryId !== 'string') {
    return res.status(400).json({ error: 'Category ID is required' });
  }

  try {
    let categories = await readCategories(username as string);
    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);

    if (categoryIndex === -1) {
      return res.status(404).json({ error: 'Category not found' });
    }

    if (req.method === 'PUT') {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Category name is required for update' });
      }
      categories[categoryIndex] = { ...categories[categoryIndex], name };
      await writeCategories(username as string, categories);
      return res.status(200).json({ data: categories[categoryIndex] });
    }

    if (req.method === 'DELETE') {
      categories.splice(categoryIndex, 1);
      await writeCategories(username as string, categories);

      let links = await readLinks(username as string);
      links = links.map(link => {
        if (link.categoryId === categoryId) {
          const { categoryId: _, ...restOfLink } = link;
          return restOfLink as Link;
        }
        return link;
      });
      await writeLinks(username as string, links);

      return res.status(204).end();
    }

    res.setHeader('Allow', ['PUT', 'DELETE']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
} 