import { useState } from 'react';
import { Link as LinkType } from '../../types/link';
import { validateLinkData, normalizeUrl } from '../utils/validation';

interface UseLinkDialogProps {
  addLink: (linkData: Omit<LinkType, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<boolean>;
  updateLink: (linkData: Omit<LinkType, 'createdAt' | 'updatedAt' | 'userId'>) => Promise<boolean>;
  clearLinksApiError: () => void;
}

export const useLinkDialog = ({ addLink, updateLink, clearLinksApiError }: UseLinkDialogProps) => {
  const [dialogLinkData, setDialogLinkData] = useState<Partial<LinkType & { categoryId?: string | null }>>({ title: '', url: '', is_visible: true });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogError, setDialogError] = useState<string>('');

  const openDialogForEdit = (link: LinkType) => {
    setEditingId(link.id);
    setDialogLinkData({ title: link.title, url: link.url, is_visible: link.is_visible, categoryId: link.categoryId });
    setDialogError('');
    clearLinksApiError();
    setIsDialogOpen(true);
  };

  const openDialogForAdd = () => {
    setEditingId(null);
    setDialogLinkData({ title: '', url: '', is_visible: true, categoryId: undefined });
    setDialogError('');
    clearLinksApiError();
    setIsDialogOpen(true);
  };

  const handleSubmitDialog = async () => {
    clearLinksApiError();
    const validationResult = validateLinkData(dialogLinkData);
    if (!validationResult.isValid) {
      setDialogError(validationResult.error || 'Validation failed');
      return false;
    }
    setDialogError('');

    const linkDataToSubmit: { title: string; url: string; is_visible: boolean; categoryId?: string | null } = {
      title: dialogLinkData.title!,
      url: normalizeUrl(dialogLinkData.url!),
      is_visible: dialogLinkData.is_visible ?? true,
    };

    if (dialogLinkData.categoryId !== undefined) {
      linkDataToSubmit.categoryId = dialogLinkData.categoryId;
    }

    let success = false;
    if (editingId) {
      success = await updateLink({ id: editingId, ...linkDataToSubmit });
    } else {
      success = await addLink(linkDataToSubmit);
    }

    if (success) {
      setIsDialogOpen(false);
      setDialogLinkData({ title: '', url: '', is_visible: true, categoryId: undefined });
      setEditingId(null);
    } 
    return success;
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    dialogLinkData,
    setDialogLinkData,
    editingId,
    dialogError,
    openDialogForEdit,
    openDialogForAdd,
    handleSubmitDialog,
  };
}; 