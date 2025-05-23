import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link as LinkType } from '../../../types/link';
import { Category } from '../../../types/category';

interface LinkDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  editingId: string | null;
  linkData: Partial<LinkType>;
  onLinkDataChange: (data: Partial<LinkType>) => void;
  onSubmit: () => void;
  error: string;
  onTriggerClick?: () => void;
  categories: Category[];
}

const LinkDialog: React.FC<LinkDialogProps> = ({
  isOpen,
  onOpenChange,
  editingId,
  linkData,
  onLinkDataChange,
  onSubmit,
  error,
  categories,
}) => {
  const currentSelectValue = linkData.categoryId ?? "";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" data-cy="link-dialog">
        <DialogHeader>
          <DialogTitle>{editingId ? 'Edit Link' : 'Add New Link'}</DialogTitle>
          <DialogDescription>
            {editingId ? 'Make changes to your link here.' : 'Add a new link to your profile.'} Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={linkData.title || ''}
              onChange={(e) => onLinkDataChange({ ...linkData, title: e.target.value })}
              className="col-span-3"
              placeholder="e.g., My Website"
              data-cy="link-title-input"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              URL
            </Label>
            <Input
              id="url"
              value={linkData.url || ''}
              onChange={(e) => onLinkDataChange({ ...linkData, url: e.target.value })}
              className="col-span-3"
              placeholder="e.g., https://example.com"
              data-cy="link-url-input"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select 
              value={currentSelectValue}
              onValueChange={(valueFromSelect: string) => {
                const newCategoryIdState = valueFromSelect === "" ? null : valueFromSelect;
                onLinkDataChange({ ...linkData, categoryId: newCategoryIdState });
              }}
            >
              <SelectTrigger className="col-span-3" data-cy="link-category-select">
                <SelectValue placeholder="Select a category (optional)" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id} data-cy={`category-option-${category.id}`}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="is_visible" className="text-right">
              Visible
            </Label>
            <Switch
              id="is_visible"
              checked={linkData.is_visible ?? true}
              onCheckedChange={(checked) => onLinkDataChange({ ...linkData, is_visible: checked })}
              data-cy="link-visible-switch"
            />
          </div>
          {error && <p className="col-span-4 text-red-500 text-sm text-center" data-cy="link-form-error">{error}</p>}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} data-cy="cancel-link-button">Cancel</Button>
          <Button type="submit" onClick={onSubmit} data-cy="save-link-button">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LinkDialog; 