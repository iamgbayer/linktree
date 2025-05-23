import { Link } from '../../types/link';
import { ApiResponse, CreateLinkRequest, UpdateLinkRequest } from '../../types/api';

const handleResponse = async <T>(response: Response): Promise<T> => {
  const data: ApiResponse<T> = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'An error occurred');
  }

  return data.data as T;
};

export const linkService = {
  getLinks: async (): Promise<Link[]> => {
    const response = await fetch('/api/links');
    return handleResponse<Link[]>(response);
  },

  getLinksByUsername: async (username: string): Promise<Link[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${username}/links`);
    return handleResponse<Link[]>(response);
  },

  createLink: async (link: CreateLinkRequest): Promise<Link> => {
    const response = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(link),
    });
    return handleResponse<Link>(response);
  },

  updateLink: async (link: UpdateLinkRequest): Promise<Link> => {
    const response = await fetch(`/api/links/${link.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(link),
    });
    return handleResponse<Link>(response);
  },

  deleteLink: async (id: string): Promise<{ success: boolean }> => {
    const response = await fetch(`/api/links/${id}`, {
      method: 'DELETE',
    });
    const data = await handleResponse<{ success: boolean }>(response);
    return data;
  },
}; 