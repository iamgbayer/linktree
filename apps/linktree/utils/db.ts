import fs from 'fs/promises';
import path from 'path';
import { Link } from '../types/link';
import { Category } from '../types/category';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

interface UserData {
  links: Link[];
  categories: Category[];
}

interface DB {
  [username: string]: UserData;
}

export const initDB = async (): Promise<void> => {
  try {
    await fs.access(DB_PATH);
  } catch {
    const initialData: DB = {
      iamgbayer: {
        links: [
          { id: '1', title: 'GitHub', url: 'https://github.com', userId: 'iamgbayer', is_visible: true, categoryId: 'cat1' },
          { id: '2', title: 'LinkedIn', url: 'https://linkedin.com', userId: 'iamgbayer', is_visible: true, categoryId: 'cat1' },
          { id: '3', title: 'Personal Site', url: 'https://gbayer.com', userId: 'iamgbayer', is_visible: true, categoryId: 'cat2' },
        ],
        categories: [
          { id: 'cat1', name: 'Social' },
          { id: 'cat2', name: 'Work' },
          { id: 'cat3', name: 'Projects' },
        ]
      },
      anotheruser: {
        links: [],
        categories: []
      }
    };
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2));
  }
};

const readDB = async (): Promise<DB> => {
  await initDB();
  const data = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(data) as DB;
};

const writeDB = async (db: DB): Promise<void> => {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
};

export const readLinks = async (username: string): Promise<Link[]> => {
  const db = await readDB();
  if (!db[username]) {
    db[username] = { links: [], categories: [] };
  }
  return db[username]?.links || [];
};

export const writeLinks = async (username: string, links: Link[]): Promise<void> => {
  const db = await readDB();
  if (!db[username]) {
    db[username] = { links: [], categories: [] };
  }
  db[username].links = links;
  await writeDB(db);
};

export const readCategories = async (username: string): Promise<Category[]> => {
  const db = await readDB();
  if (!db[username]) {
    db[username] = { links: [], categories: [] };
  }
  return db[username]?.categories || [];
};

export const writeCategories = async (username: string, categories: Category[]): Promise<void> => {
  const db = await readDB();
  if (!db[username]) {
    db[username] = { links: [], categories: [] };
  }
  db[username].categories = categories;
  await writeDB(db);
}; 