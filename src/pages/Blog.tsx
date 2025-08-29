import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Grid, List } from 'lucide-react';
import { postService } from '@/services/postService';
import { categoryService } from '@/services/categoryService';
import { tagService } from '@/services/tagService';
import { PostCard } from '@/components/blog/PostCard';
import { PostList } from '@/components/blog/PostList';
import { CategoryFilter } from '@/components/blog/CategoryFilter';
import { TagFilter } from '@/components/blog/TagFilter';
import { Pagination } from '@/components/blog/Pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PostFilters } from '@/types';

export default function Blog() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<PostFilters>({
    page: 1,
    limit: 12,
    isPublished: true,
    sortBy: 'createdAt',
    order: 'desc'
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch posts
  const { data: postsData, isLoading: postsLoading, error: postsError } = useQuery({
    queryKey: ['posts', filters],
    queryFn: () => postService.getPosts(filters),
  });

  // Fetch categories for filter
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getActiveCategories(),
  });

  // Fetch tags for filter
  const { data: tagsData } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagService.getActiveTags(),
  });

  const handleFilterChange = (newFilters: Partial<PostFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleSearch = () => {
    handleFilterChange({ search: searchTerm || undefined });
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const posts = postsData?.data.posts || [];
  const pagination = postsData?.data.pagination;
  const categories = categoriesData?.data.categories || [];
  const tags = tagsData?.data.tags || [];

  if (postsError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Posts</h2>
          <p className="text-gray-600">Failed to load blog posts. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-xl text-gray-600">
            Discover insights, tutorials, and stories from our community
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="flex-1">
              <div className="flex gap-2">
                <Input
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Sort */}
            <Select
              value={`${filters.sortBy}-${filters.order}`}
              onValueChange={(value) => {
                const [sortBy, order] = value.split('-') as [string, 'asc' | 'desc'];
                handleFilterChange({ sortBy: sortBy as any, order });
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Latest</SelectItem>
                <SelectItem value="createdAt-asc">Oldest</SelectItem>
                <SelectItem value="title-asc">Title A-Z</SelectItem>
                <SelectItem value="title-desc">Title Z-A</SelectItem>
                <SelectItem value="viewCount-desc">Most Views</SelectItem>
                <SelectItem value="likeCount-desc">Most Liked</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <CategoryFilter
              categories={categories}
              selectedCategoryId={filters.categoryId}
              onCategoryChange={(categoryId) => handleFilterChange({ categoryId })}
            />
            <TagFilter
              tags={tags}
              selectedTagId={filters.tagId}
              onTagChange={(tagId) => handleFilterChange({ tagId })}
            />
            
            {/* Featured Filter */}
            <Select
              value={filters.isFeatured === undefined ? 'all' : filters.isFeatured ? 'featured' : 'normal'}
              onValueChange={(value) => {
                const isFeatured = value === 'all' ? undefined : value === 'featured';
                handleFilterChange({ isFeatured });
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Featured" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          {(filters.search || filters.categoryId || filters.tagId || filters.isFeatured !== undefined) && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Filter className="w-4 h-4" />
                <span>Active filters:</span>
                {filters.search && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    Search: {filters.search}
                  </span>
                )}
                {filters.categoryId && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                    Category: {categories.find(c => c.id === filters.categoryId)?.name}
                  </span>
                )}
                {filters.tagId && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                    Tag: {tags.find(t => t.id === filters.tagId)?.name}
                  </span>
                )}
                {filters.isFeatured !== undefined && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                    {filters.isFeatured ? 'Featured' : 'Normal'}
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters({
                    page: 1,
                    limit: 12,
                    isPublished: true,
                    sortBy: 'createdAt',
                    order: 'desc'
                  })}
                >
                  Clear all
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Posts */}
        {postsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="space-y-6 mb-8">
                {posts.map((post) => (
                  <PostList key={post.id} post={post} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}