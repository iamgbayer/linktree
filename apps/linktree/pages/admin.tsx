import React, { useState, useEffect } from 'react';
import withAuth from '../src/components/withAuth';
import { Link as LinkType } from '../types/link';
import { Category } from '../types/category';
import Head from 'next/head';
import NextLink from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Button } from '../src/components/ui/button';
import { Card, CardContent } from '../src/components/ui/card';

import ProfileCard from '../src/components/admin/ProfileCard';
import LiveLinkCard from '../src/components/admin/LiveLinkCard';
import LinkDialog from '../src/components/admin/LinkDialog';
import LinksTable from '../src/components/admin/LinksTable';
import { CategoryManager } from '../src/components/categories/CategoryManager';
import { useLinks } from '../src/hooks/use-links';
import { categoryService } from '../src/services/category';
import { validateLinkData, normalizeUrl } from '../src/utils/validation';

const FIXED_USERNAME = "iamgbayer";

const AdminPage = () => {
  const { 
    links, 
    error: linksApiError,
    isLoading: isLoadingLinks,
    addLink, 
    updateLink, 
    removeLink, 
    clearError: clearLinksApiError 
  } = useLinks();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  
  const [dialogLinkData, setDialogLinkData] = useState<Partial<LinkType & { categoryId?: string | null }>>({ title: '', url: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogError, setDialogError] = useState<string>('');

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      setCategoriesError(null);
      try {
        const fetchedCategories = await categoryService.getCategories();
        setCategories(fetchedCategories || []);
      } catch (err) {
        setCategoriesError(err instanceof Error ? err.message : 'Failed to load categories');
        setCategories([]);
      }
      setIsLoadingCategories(false);
    };
    fetchCategories();
  }, []);

  const handleOpenDialogForEdit = (link: LinkType) => {
    setEditingId(link.id);
    setDialogLinkData({ title: link.title, url: link.url, is_visible: link.is_visible, categoryId: link.categoryId });
    setDialogError('');
    clearLinksApiError();
    setIsDialogOpen(true);
  };
  
  const handleOpenDialogForAdd = () => {
    setEditingId(null);
    setDialogLinkData({ title: '', url: '', is_visible: true, categoryId: undefined });
    setDialogError('');
    clearLinksApiError();
    setIsDialogOpen(true);
  }

  const handleDialogSubmit = async () => {
    clearLinksApiError();
    const validationResult = validateLinkData(dialogLinkData);
    if (!validationResult.isValid) {
      setDialogError(validationResult.error || 'Validation failed');
      return;
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
  };

  const handleDeleteLink = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      clearLinksApiError();
      await removeLink(id);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/';
  };

  const initialPageLoad = (isLoadingLinks && links.length === 0) || isLoadingCategories;

  if (initialPageLoad) {
    return <div className="min-h-screen flex items-center justify-center">Loading data...</div>;
  }

  return (
    <>
      <Head>
        <title>Linktree Manager</title>
      </Head>
      <div className="min-h-screen bg-gray-50">
        <Card className="shadow-sm border-b border-gray-200 rounded-none">
          <CardContent className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">My Linktree</h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={handleLogout} className="flex items-center">
                <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <span className="text-sm font-semibold text-blue-800">{FIXED_USERNAME.charAt(0).toUpperCase()}</span>
                </span>
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        <main className="container mx-auto px-4 py-6">
          <LiveLinkCard username={FIXED_USERNAME} fixedUsername={FIXED_USERNAME} />
          
          <ProfileCard username={FIXED_USERNAME} />

          {linksApiError && <p className="text-red-500 text-center my-2">Link Error: {linksApiError}</p>}
          {categoriesError && <p className="text-red-500 text-center my-2">Category Error: {categoriesError}</p>}
          
          <Card className="my-6">
            <CardContent className="pt-6">
              <CategoryManager />
            </CardContent>
          </Card>

          <LinkDialog 
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            editingId={editingId}
            linkData={dialogLinkData}
            onLinkDataChange={setDialogLinkData}
            onSubmit={handleDialogSubmit}
            error={dialogError}
            categories={categories}
          />

          {(isLoadingLinks || isLoadingCategories) && <p>Loading content...</p>}
          <LinksTable 
            links={links}
            categories={categories}
            onEditLink={handleOpenDialogForEdit}
            onDeleteLink={handleDeleteLink}
            onAddNewLink={handleOpenDialogForAdd}
          />

          <div className="mt-6 text-center">
            <NextLink href={`/${FIXED_USERNAME}`} legacyBehavior>
              <a className="text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1">
                View your public profile <ExternalLink size={16} />
              </a>
            </NextLink>
          </div>
        </main>
      </div>
    </>
  );
};

export default withAuth(AdminPage); 