import { Link as LinkType } from '../../types/link';

export const validateUrl = (url: string): boolean => {
  if (!url?.trim()) return false;
  try {
    const normalizedUrl = url.includes('://') ? url : `https://${url}`;
    new URL(normalizedUrl);
    return true;
  } catch {
    return false;
  }
};

export const validateLinkData = (
  link: Partial<LinkType>
): { isValid: boolean; error?: string } => {
  if (!link.title?.trim()) {
    return { isValid: false, error: 'Title is required' };
  }
  if (!link.url?.trim()) {
    return { isValid: false, error: 'URL is required' };
  }
  if (!validateUrl(link.url)) {
    return { isValid: false, error: 'Please enter a valid URL (e.g., https://example.com)' };
  }
  return { isValid: true };
};

export const normalizeUrl = (url: string): string => {
  if (!url) return '';
  const trimmedUrl = url.trim();
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl;
  }
  return `https://${trimmedUrl}`;
}; 