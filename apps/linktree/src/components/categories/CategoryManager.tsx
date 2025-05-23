import React, { useState, useEffect, useCallback } from 'react';
import { Category } from '../../../types/category';
import { categoryService, CreateCategoryRequest, UpdateCategoryRequest } from '../../services/category';
import { CategoryList } from './CategoryList';
import { CategoryFormModal } from './CategoryFormModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedCategories = await categoryService.getCategories();
      setCategories(fetchedCategories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: Category) => {
    setEditingCategory(category);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setModalError(null);
  };

  const handleSaveCategory = async (categoryData: CreateCategoryRequest | Omit<UpdateCategoryRequest, 'id'>) => {
    setIsLoading(true); 
    setModalError(null);
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, categoryData as UpdateCategoryRequest);
      } else {
        await categoryService.createCategory(categoryData as CreateCategoryRequest);
      }
      await fetchCategories();
      handleCloseModal();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save category';
      setModalError(errorMessage);
    }
    setIsLoading(false);
  };

  const handleDeleteCategory = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await categoryService.deleteCategory(id);
      await fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold dark:text-white">My Categories</h3>
        <Button onClick={handleOpenCreateModal} data-cy="add-new-category-button">
          <Plus size={20} className="mr-2" />
          Add New Category
        </Button>
      </div>
      
      {error && <p className="text-red-500 text-sm">Error: {error}</p>}
      
      <CategoryList 
        categories={categories} 
        onEdit={handleOpenEditModal} 
        onDelete={handleDeleteCategory} 
        isLoading={isLoading && categories.length === 0}
      />

      <CategoryFormModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSubmit={handleSaveCategory} 
        initialData={editingCategory}
        isLoading={isLoading} 
        error={modalError}
      />
    </div>
  );
}; 