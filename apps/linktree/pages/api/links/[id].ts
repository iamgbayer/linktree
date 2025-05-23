import { NextApiRequest, NextApiResponse } from 'next';
import { readLinks, writeLinks, readCategories } from '../../../utils/db';
import { Link } from '../../../types/link';
import { UpdateLinkRequest } from '../../../types/api';

// Hardcoded username for this take-home project
const FIXED_USERNAME = "iamgbayer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const linkId = Array.isArray(id) ? id[0] : id;

  if (!linkId) {
    return res.status(400).json({ error: 'Link ID is required' });
  }

  // PUT /api/links/[id] - update link by id
  if (req.method === 'PUT') {
    const { categoryId, ...dataFromRequest } = req.body as Omit<UpdateLinkRequest, 'id'> & { categoryId?: string | null };
    
    if (categoryId) { 
      const categories = await readCategories(FIXED_USERNAME);
      if (!categories.find(cat => cat.id === categoryId)) {
        return res.status(400).json({ error: 'Invalid categoryId' });
      }
    }

    const links = await readLinks(FIXED_USERNAME);
    let linkFound = false;
    const updatedLinks = links.map((link) => {
      if (link.id === linkId) {
        linkFound = true;
        const updatedLink: Link = {
          ...link,
          ...dataFromRequest,
          is_visible: dataFromRequest.is_visible === undefined ? link.is_visible : Boolean(dataFromRequest.is_visible),
        };
        if (categoryId === null) {
          delete updatedLink.categoryId;
        } else if (categoryId !== undefined) {
          updatedLink.categoryId = categoryId;
        }
        return updatedLink;
      }
      return link;
    });
    
    if (!linkFound) {
      return res.status(404).json({ error: 'Link not found' });
    }
        
    await writeLinks(FIXED_USERNAME, updatedLinks);
    const responseLink = updatedLinks.find(link => link.id === linkId);
    return res.status(200).json({ data: responseLink });
  }

  // DELETE /api/links/[id]
  if (req.method === 'DELETE') {
    const links = await readLinks(FIXED_USERNAME);
    const filteredLinks = links.filter((link) => link.id !== linkId);
    
    if (links.length === filteredLinks.length) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    await writeLinks(FIXED_USERNAME, filteredLinks);
    return res.status(200).json({ data: { success: true } });
  }

  return res.status(405).json({ error: 'Method not allowed' });
} 