import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Category } from '@/types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId?: number;
  onCategoryChange: (categoryId?: number) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategoryId,
  onCategoryChange,
}) => {
  return (
    <Select
      value={selectedCategoryId ? String(selectedCategoryId) : 'all'}
      onValueChange={(value) => {
        onCategoryChange(value === 'all' ? undefined : parseInt(value));
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="All Categories" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category.id} value={String(category.id)}>
            <div className="flex items-center gap-2">
              {category.color && (
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
              )}
              <span>{category.name}</span>
              <span className="text-xs text-gray-500">({category.postCount})</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};