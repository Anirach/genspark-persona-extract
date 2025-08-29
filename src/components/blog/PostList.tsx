import React from 'react';
import { Calendar, User, Eye, Heart, MessageSquare, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Post } from '@/types';
import { Link } from 'react-router-dom';

interface PostListProps {
  post: Post;
}

export const PostList: React.FC<PostListProps> = ({ post }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getExcerpt = (content: string, maxLength: number = 300) => {
    if (post.excerpt) return post.excerpt;
    
    // Strip markdown and HTML
    const text = content.replace(/[#*`]/g, '').replace(/<[^>]*>/g, '');
    return text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Featured Image */}
          {post.featuredImage && (
            <div className="md:w-1/3 lg:w-1/4">
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {post.isFeatured && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="bg-yellow-500 text-white text-xs">
                      Featured
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1">
            {/* Category & Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {post.category && (
                <Badge 
                  variant="outline" 
                  className="text-xs"
                  style={{ 
                    borderColor: post.category.color, 
                    color: post.category.color 
                  }}
                >
                  {post.category.name}
                </Badge>
              )}
              {post.tags.slice(0, 3).map((tag) => (
                <Badge 
                  key={tag.id} 
                  variant="secondary" 
                  className="text-xs"
                  style={{ 
                    backgroundColor: tag.color + '20', 
                    color: tag.color 
                  }}
                >
                  {tag.name}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{post.tags.length - 3} more
                </Badge>
              )}
            </div>

            {/* Title */}
            <Link to={`/blog/post/${post.id}`}>
              <h2 className="text-2xl font-bold mb-3 hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
            </Link>

            {/* Excerpt */}
            <p className="text-gray-600 mb-4 leading-relaxed">
              {getExcerpt(post.content)}
            </p>

            {/* Author & Meta Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Author & Date */}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={post.author.avatarUrl} />
                    <AvatarFallback className="text-xs">
                      {post.author.fullName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-gray-900">{post.author.fullName}</div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats & Read More */}
              <div className="flex items-center justify-between sm:justify-end gap-4">
                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{post.viewCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    <span>{post.likeCount.toLocaleString()}</span>
                  </div>
                  {post.commentCount !== undefined && (
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{post.commentCount.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Read More Button */}
                <Button asChild variant="outline" size="sm">
                  <Link to={`/blog/post/${post.id}`}>
                    Read More
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};