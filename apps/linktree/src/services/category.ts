import { Category } from '../category';
import { ApiResponse } from '../api';

const handleResponse = async <T>(response: Response): Promise<T> => {
  const data: ApiResponse<T> = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'An error occurred while processing categories');
  }
  return data.data as T;
};

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  name: string;
}

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    const response = await fetch('/api/categories');

    return await handleResponse<Category[]>(response);
  },

  getCategoriesByUsername: async (username: string): Promise<Category[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${username}/categories`);
    return await handleResponse<Category[]>(response);
  },

  createCategory: async (createData: CreateCategoryRequest): Promise<Category> => {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createData),
    });
    return await handleResponse<Category>(response);
  },

  updateCategory: async (id: string, updateData: UpdateCategoryRequest): Promise<Category> => {
    const response = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    return await handleResponse<Category>(response);
  },

  deleteCategory: async (id: string): Promise<void> => {
    const response = await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
    });
    return await handleResponse<void>(response);
  },
}; 