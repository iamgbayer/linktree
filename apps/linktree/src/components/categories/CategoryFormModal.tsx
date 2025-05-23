import React, { useState, useEffect } from 'react';
import { Category } from '../../../types/category';
import { CreateCategoryRequest, UpdateCategoryRequest } from '../../services/category';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCategoryRequest | Omit<UpdateCategoryRequest, 'id'>) => Promise<void>;
  initialData?: Category | null;
  isLoading?: boolean;
  error?: string | null;
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
  error,
}) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
      } else {
        setName('');
      }
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Category name cannot be empty.');
      return;
    }
    await onSubmit({ name });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" data-cy="category-form-dialog">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Category' : 'Create New Category'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Make changes to your category here.' : 'Enter the name for your new category.'} Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="categoryName" className="text-right">
              Name
            </Label>
            <Input 
              id="categoryName" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Enter category name" 
              className="col-span-3"
              data-cy="category-name-input"
              disabled={isLoading}
            />
          </div>
          {error && <p className="col-span-4 text-red-500 text-sm text-center" data-cy="category-form-error">{error}</p>}
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} data-cy="cancel-category-button">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="category-form" onClick={handleSubmit} disabled={isLoading} data-cy="save-category-button">
            {isLoading ? 'Saving...' : 'Save Category'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 