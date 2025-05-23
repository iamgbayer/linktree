import { Link } from '../../types/link';
import { Category } from '../../types/category';

export const organizeLinksByCategory = (links: Link[], categories: Category[]) => {
  const groupedLinks: { [key: string]: Link[] } = links.reduce((acc, link) => {
    const categoryId = link.categoryId || 'uncategorized';
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(link);
    return acc;
  }, {} as { [key: string]: Link[] });

  const categoryOrder = [
    ...categories.map(cat => cat.id),
    'uncategorized'
  ];

  return { groupedLinks, categoryOrder };
};

export const getCategoryName = (categories: Category[], categoryId: string): string | null => {
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.name : null;
}; 