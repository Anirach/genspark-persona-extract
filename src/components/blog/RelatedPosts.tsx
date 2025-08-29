import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { postService } from '@/services/postService';
import { PostCard } from './PostCard';
import { Tag } from '@/types';

interface RelatedPostsProps {
  currentPostId: number;
  categoryId?: number;
  tags: Tag[];
}

export const RelatedPosts: React.FC<RelatedPostsProps> = ({
  currentPostId,
  categoryId,
  tags,
}) => {
  // Fetch related posts by category
  const { data: categoryPostsData } = useQuery({
    queryKey: ['relatedPosts', 'category', categoryId, currentPostId],
    queryFn: () => categoryId 
      ? postService.getPostsByCategory(categoryId, { 
          limit: 6, 
          isPublished: true 
        })
      : Promise.resolve(null),
    enabled: !!categoryId,
  });

  // Fetch related posts by most common tag
  const mostCommonTag = tags.length > 0 ? tags[0] : null;
  const { data: tagPostsData } = useQuery({
    queryKey: ['relatedPosts', 'tag', mostCommonTag?.id, currentPostId],
    queryFn: () => mostCommonTag
      ? postService.getPostsByTag(mostCommonTag.id, { 
          limit: 6, 
          isPublished: true 
        })
      : Promise.resolve(null),
    enabled: !!mostCommonTag,
  });

  // Combine and filter related posts
  const categoryPosts = categoryPostsData?.data.posts || [];
  const tagPosts = tagPostsData?.data.posts || [];
  
  // Combine posts and remove duplicates and current post
  const allRelatedPosts = [...categoryPosts, ...tagPosts];
  const uniquePosts = allRelatedPosts.filter((post, index, self) => 
    post.id !== currentPostId && 
    index === self.findIndex(p => p.id === post.id)
  );
  
  // Limit to 3 posts
  const relatedPosts = uniquePosts.slice(0, 3);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};