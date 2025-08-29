import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tag } from '@/types';

interface TagFilterProps {
  tags: Tag[];
  selectedTagId?: number;
  onTagChange: (tagId?: number) => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({
  tags,
  selectedTagId,
  onTagChange,
}) => {
  return (
    <Select
      value={selectedTagId ? String(selectedTagId) : 'all'}
      onValueChange={(value) => {
        onTagChange(value === 'all' ? undefined : parseInt(value));
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="All Tags" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Tags</SelectItem>
        {tags.slice(0, 20).map((tag) => (
          <SelectItem key={tag.id} value={String(tag.id)}>
            <div className="flex items-center gap-2">
              {tag.color && (
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
              )}
              <span>{tag.name}</span>
              <span className="text-xs text-gray-500">({tag.postCount})</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};