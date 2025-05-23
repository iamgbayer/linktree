import { useState, useEffect } from 'react';
import { Category } from '../../types/category';
import { categoryService } from '../services/category';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

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
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  return { categories, isLoadingCategories, categoriesError };
}; 