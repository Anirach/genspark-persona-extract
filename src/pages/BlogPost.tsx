import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Calendar, 
  User, 
  Eye, 
  Heart, 
  MessageSquare, 
  ArrowLeft,
  Share2,
  Bookmark,
  Tag as TagIcon
} from 'lucide-react';
import { postService } from '@/services/postService';
import { commentService } from '@/services/commentService';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CommentSection } from '@/components/blog/CommentSection';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { toast } from 'sonner';

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState(false);

  // Fetch post
  const { 
    data: postData, 
    isLoading: postLoading, 
    error: postError 
  } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postService.getPost(parseInt(id!)),
    enabled: !!id,
  });

  // Check if user is authenticated
  const isAuthenticated = authService.isAuthenticated();

  // Like post mutation
  const likeMutation = useMutation({
    mutationFn: (postId: number) => postService.likePost(postId),
    onSuccess: (data) => {
      setIsLiked(true);
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      toast.success('Post liked!');
    },
    onError: () => {
      toast.error('Failed to like post');
    },
  });

  const post = postData?.data.post;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error('Please login to like posts');
      return;
    }
    
    if (!isLiked && post) {
      likeMutation.mutate(post.id);
    }
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || post.title,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
        toast.success('URL copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('URL copied to clipboard!');
    }
  };

  if (postError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Post Not Found</h2>
          <p className="text-gray-600 mb-4">The blog post you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (postLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Loading skeleton */}
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link to="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <article className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {/* Featured Image */}
            {post.featuredImage && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Article Header */}
            <div className="p-8">
              {/* Category & Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.isFeatured && (
                  <Badge className="bg-yellow-500 text-white">
                    Featured
                  </Badge>
                )}
                {post.category && (
                  <Badge 
                    variant="outline"
                    style={{ 
                      borderColor: post.category.color, 
                      color: post.category.color 
                    }}
                  >
                    {post.category.name}
                  </Badge>
                )}
                {post.tags.map((tag) => (
                  <Badge 
                    key={tag.id} 
                    variant="secondary"
                    style={{ 
                      backgroundColor: tag.color + '20', 
                      color: tag.color 
                    }}
                  >
                    <TagIcon className="w-3 h-3 mr-1" />
                    {tag.name}
                  </Badge>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Author & Meta */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={post.author.avatarUrl} />
                    <AvatarFallback>
                      {post.author.fullName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">{post.author.fullName}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{post.viewCount.toLocaleString()} views</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLike}
                    disabled={isLiked || likeMutation.isPending}
                    className={isLiked ? 'text-red-500 border-red-200' : ''}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                    {post.likeCount + (isLiked ? 1 : 0)}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                {post.content.split('\n\n').map((paragraph, index) => {
                  // Handle different content types
                  if (paragraph.startsWith('##')) {
                    return (
                      <h2 key={index} className="text-2xl font-bold mt-8 mb-4">
                        {paragraph.replace(/^##\s*/, '')}
                      </h2>
                    );
                  }
                  
                  if (paragraph.startsWith('```')) {
                    return (
                      <pre key={index} className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4">
                        <code>{paragraph.replace(/```\w*\n?/, '').replace(/```$/, '')}</code>
                      </pre>
                    );
                  }
                  
                  if (paragraph.startsWith('-')) {
                    const items = paragraph.split('\n').filter(line => line.startsWith('-'));
                    return (
                      <ul key={index} className="list-disc pl-6 my-4">
                        {items.map((item, i) => (
                          <li key={i} className="mb-2">
                            {item.replace(/^-\s*/, '')}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  
                  return (
                    <p key={index} className="mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>
          </article>

          {/* Comments Section */}
          <div className="mt-8">
            <CommentSection postId={post.id} />
          </div>

          {/* Related Posts */}
          <div className="mt-8">
            <RelatedPosts 
              currentPostId={post.id}
              categoryId={post.categoryId}
              tags={post.tags}
            />
          </div>
        </div>
      </div>
    </div>
  );
}