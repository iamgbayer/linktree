import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { File, PenSquare, Trash2, Plus } from 'lucide-react';
import { Link as LinkType } from '../../../types/link';
import { Category } from '../../../types/category';
import { getCategoryName } from '../../utils/linkUtils';

interface LinksTableProps {
  links: LinkType[];
  categories: Category[];
  onEditLink: (link: LinkType) => void;
  onDeleteLink: (id: string) => void;
  onAddNewLink: () => void;
}

const LinksTable: React.FC<LinksTableProps> = ({ links, categories, onEditLink, onDeleteLink, onAddNewLink }) => {
  const renderCategoryName = (categoryId?: string | null) => {
    if (!categoryId) return <span className="text-xs text-gray-500">Uncategorized</span>;
    const categoryName = getCategoryName(categories, categoryId);
    return categoryName ? categoryName : <span className="text-xs text-gray-500">Unknown Category</span>;
  };

  return (
    <Card data-cy="links-table-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>My Links</CardTitle>
          <CardDescription>Manage your links here. Drag to reorder (feature coming soon!).</CardDescription>
        </div>
        <Button onClick={onAddNewLink} data-cy="add-new-link-button">
          <Plus size={20} className="mr-2" />
          Add New Link
        </Button>
      </CardHeader>
      <CardContent>
        {links.length > 0 ? (
          <Table data-cy="links-table">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Title</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.map((link) => (
                <TableRow key={link.id} data-cy={`link-row-${link.id}`}>
                  <TableCell className="font-medium">
                    <File size={16} className="text-gray-400" />
                  </TableCell>
                  <TableCell data-cy={`link-title-${link.id}`}>{link.title}</TableCell>
                  <TableCell data-cy={`link-url-${link.id}`}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {link.url}
                    </a>
                  </TableCell>
                  <TableCell data-cy={`link-category-${link.id}`}>{renderCategoryName(link.categoryId)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => onEditLink(link)} data-cy={`edit-link-button-${link.id}`}>
                        <PenSquare size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDeleteLink(link.id)} data-cy={`delete-link-button-${link.id}`}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-6 text-center" data-cy="no-links-message">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <File size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-1">No links yet</h3>
            <p className="text-gray-500 mb-4">Click "Add New Link" above to create your first link.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LinksTable; 