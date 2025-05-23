export type ApiResponse<T = any> = {
  data?: T;
  error?: string;
};

export type CreateLinkRequest = {
  title: string;
  url: string;
  categoryId?: string;
};

export type UpdateLinkRequest = {
  id: string;
  title?: string;
  url?: string;
  is_visible?: boolean;
  categoryId?: string | null;
}; 