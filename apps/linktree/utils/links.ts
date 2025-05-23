import fs from 'fs';
import path from 'path';
import { Link, Links } from '../types/link';

const linksFilePath = path.join(process.cwd(), 'data', 'links.json');

export const getLinks = async (username: string): Promise<Link[]> => {
  try {
    const data = await fs.promises.readFile(linksFilePath, 'utf8');
    const links: Links = JSON.parse(data);
    return links[username] || [];
  } catch (error) {
    return [];
  }
};

export const saveLinks = async (username: string, links: Link[]): Promise<boolean> => {
  try {
    const data = await fs.promises.readFile(linksFilePath, 'utf8');
    const allLinks: Links = JSON.parse(data);
    allLinks[username] = links;
    await fs.promises.writeFile(linksFilePath, JSON.stringify(allLinks, null, 2));
    return true;
  } catch (error) {
    return false;
  }
}; 