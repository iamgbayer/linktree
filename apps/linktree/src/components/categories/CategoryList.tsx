import React from 'react';
import { Category } from '../../../types/category';
import { Button } from '@/components/ui/button';
import { PenSquare, Trash2 } from 'lucide-react';

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export const CategoryList: React.FC<CategoryListProps> = ({ categories, onEdit, onDelete, isLoading }) => {
  if (isLoading && categories.length === 0) {
    return <p className="text-center text-gray-500 py-4">Loading categories...</p>;
  }

  if (categories.length === 0) {
    return (
      <div className="text-center text-gray-500 py-6 border-t border-b dark:border-gray-700">
        <p>No categories created yet.</p>
        <p className="text-sm">Click "Add New Category" to get started.</p>
      </div>
    );
  }

  return (
    <div className="border-t border-b dark:border-gray-700">
      <ul className="divide-y dark:divide-gray-700">
        {categories.map(category => (
          <li 
            key={category.id} 
            className="flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            data-cy={`category-item-${category.id}`}
          >
            <span className="text-md dark:text-white" data-cy={`category-name-${category.id}`}>{category.name}</span>
            <div className="space-x-1">
              <Button variant="ghost" size="icon" onClick={() => onEdit(category)} data-cy={`edit-category-button-${category.id}`}>
                <PenSquare size={16} />
                <span className="sr-only">Edit Category</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(category.id)} data-cy={`delete-category-button-${category.id}`}>
                <Trash2 size={16} className="text-red-500 hover:text-red-700" />
                <span className="sr-only">Delete Category</span>
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}; 