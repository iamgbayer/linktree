export interface Category {
  id: string;
  name: string;
}

export interface Categories {
  [username: string]: Category[];
} 