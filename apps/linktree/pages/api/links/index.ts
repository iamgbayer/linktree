import { NextApiRequest, NextApiResponse } from 'next';
import { Link } from '../../../types/link';
import { ApiResponse, CreateLinkRequest } from '../../../types/api';
import { readLinks, writeLinks, readCategories } from '../../../utils/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Link[] | Link>>
) {
  try {
    const { username = 'iamgbayer' } = req.query;

    if (req.method === 'GET') {
      const links = await readLinks(username as string);
      return res.status(200).json({ data: links });
    }

    // POST /api/links - Create a new link
    if (req.method === 'POST') {
      const { title, url, categoryId } = req.body as CreateLinkRequest & { categoryId?: string };

      if (!title || !url) {
        return res.status(400).json({ error: 'Title and URL are required' });
      }

      if (categoryId) {
        const categories = await readCategories(username as string);
        if (!categories.find(cat => cat.id === categoryId)) {
          return res.status(400).json({ error: 'Invalid categoryId' });
        }
      }

      const links = await readLinks(username as string);
      const newLink: Link = {
        id: Date.now().toString(),
        userId: username as string,
        title,
        url: url.startsWith('http') ? url : `https://${url}`,
        is_visible: true,
        ...(categoryId && { categoryId }),
      };
      links.push(newLink);

      await writeLinks(username as string, links);
      return res.status(201).json({ data: newLink });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
} 