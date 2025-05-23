import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from '../../../types/link';
import { Category } from '../../../types/category';
import { organizeLinksByCategory, getCategoryName } from '../../utils/linkUtils';

interface LinksListProps {
  links: Link[];
  categories: Category[];
}

const LinksList: React.FC<LinksListProps> = ({ links, categories }) => {
  const { groupedLinks, categoryOrder } = organizeLinksByCategory(links, categories);

  if (links.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400" data-cy="no-public-links-message">
        No links available.
      </p>
    );
  }

  return (
    <div className="w-full space-y-6 mb-8">
      {categoryOrder.map(categoryId => {
        const linksInCategory = groupedLinks[categoryId];
        if (!linksInCategory || linksInCategory.length === 0) {
          return null;
        }

        const categoryName = categoryId === 'uncategorized' ? '' : getCategoryName(categories, categoryId);

        return (
          <div key={categoryId} data-cy={`category-section-${categoryId}`}>
            {categoryName && (
              <h2 className="text-xl font-semibold mb-3 dark:text-gray-200" data-cy={`category-title-${categoryId}`}>
                {categoryName}
              </h2>
            )}
            <div className="space-y-3">
              {linksInCategory.map((link) => (
                <Button
                  key={link.id}
                  variant="outline"
                  className="w-full p-6 text-lg bg-white dark:bg-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm hover:shadow-md transition-all duration-150 h-auto justify-start"
                  asChild
                  data-cy={`public-link-${link.id}`}
                >
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.title}
                  </a>
                </Button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LinksList; 