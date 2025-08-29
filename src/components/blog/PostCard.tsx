import React from 'react';
import { Calendar, User, Eye, Heart, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Post } from '@/types';
import { Link } from 'react-router-dom';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getExcerpt = (content: string, maxLength: number = 150) => {
    if (post.excerpt) return post.excerpt;
    
    // Strip markdown and HTML
    const text = content.replace(/[#*`]/g, '').replace(/<[^>]*>/g, '');
    return text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text;
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Featured Image */}
      {post.featuredImage && (
        <div className="relative aspect-video overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {post.isFeatured && (
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-yellow-500 text-white">
                Featured
              </Badge>
            </div>
          )}
        </div>
      )}

      <CardHeader className="pb-3">
        {/* Category & Tags */}
        <div className="flex flex-wrap gap-2 mb-2">
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
          {post.tags.slice(0, 2).map((tag) => (
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
          {post.tags.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{post.tags.length - 2} more
            </Badge>
          )}
        </div>

        {/* Title */}
        <Link to={`/blog/post/${post.id}`}>
          <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h3>
        </Link>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Excerpt */}
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {getExcerpt(post.content)}
        </p>

        {/* Author & Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={post.author.avatarUrl} />
              <AvatarFallback className="text-xs">
                {post.author.fullName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{post.author.fullName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t text-xs text-gray-500">
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
      </CardContent>
    </Card>
  );
};