import { useState, useEffect, useCallback } from 'react';
import { Link as LinkType } from '../link';
import { linkService } from '../services/links';
import { UpdateLinkRequest } from '../api';

export const useLinks = () => {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchLinks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await linkService.getLinks();
      setLinks(data);
      setError('');
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while loading links"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const addLink = useCallback(async (linkData: { title: string; url: string; is_visible?: boolean }) => {
    setIsLoading(true);
    try {
      const payload = { ...linkData, is_visible: linkData.is_visible ?? true };
      const createdLink = await linkService.createLink(payload);
      setLinks(prevLinks => [...prevLinks, createdLink]);
      setError('');
      return true;
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while saving the link"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateLink = useCallback(async (linkData: UpdateLinkRequest) => {
    setIsLoading(true);
    try {
      const updatedServiceLink = await linkService.updateLink(linkData);
      setLinks(prevLinks => prevLinks.map(l => (l.id === linkData.id ? updatedServiceLink : l)));
      setError('');
      return true;
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while updating the link"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeLink = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await linkService.deleteLink(id);
      setLinks(prevLinks => prevLinks.filter(link => link.id !== id));
      setError('');
      return true;
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while deleting the link"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  return { links, error, isLoading, fetchLinks, addLink, updateLink, removeLink, clearError };
}; 