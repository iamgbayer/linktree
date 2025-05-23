import React from 'react';
import withAuth from '../src/components/withAuth';
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
import { useCategories } from '../src/hooks/use-categories';
import { useLinkDialog } from '../src/hooks/use-link-dialog';

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

  const { categories, isLoadingCategories, categoriesError } = useCategories();
  
  const {
    isDialogOpen,
    setIsDialogOpen,
    dialogLinkData,
    setDialogLinkData,
    editingId,
    dialogError,
    openDialogForEdit,
    openDialogForAdd,
    handleSubmitDialog,
  } = useLinkDialog({ addLink, updateLink, clearLinksApiError });

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
            onSubmit={handleSubmitDialog}
            error={dialogError}
            categories={categories}
          />

          {(isLoadingLinks || isLoadingCategories) && <p>Loading content...</p>}
          <LinksTable 
            links={links}
            categories={categories}
            onEditLink={openDialogForEdit}
            onDeleteLink={handleDeleteLink}
            onAddNewLink={openDialogForAdd}
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