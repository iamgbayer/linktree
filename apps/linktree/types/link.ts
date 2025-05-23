export interface Link {
  id: string;
  title: string;
  url: string;
  userId: string;
  is_visible?: boolean;
  order?: number;
  categoryId?: string | null;
}

export interface Links {
  [username: string]: Link[];
} 