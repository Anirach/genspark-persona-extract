import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, ThumbsUp, Reply, MoreVertical } from 'lucide-react';
import { commentService } from '@/services/commentService';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Comment } from '@/types';
import { toast } from 'sonner';

interface CommentSectionProps {
  postId: number;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const queryClient = useQueryClient();
  const isAuthenticated = authService.isAuthenticated();
  
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  
  // Guest comment fields
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  // Fetch comments for the post
  const { 
    data: commentsData, 
    isLoading: commentsLoading 
  } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => commentService.getPostComments(postId, { 
      isApproved: true,
      sortBy: 'createdAt',
      order: 'desc',
      limit: 50
    }),
  });

  // Create comment mutation
  const createCommentMutation = useMutation({
    mutationFn: commentService.createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setNewComment('');
      setGuestName('');
      setGuestEmail('');
      toast.success('Comment posted successfully!');
    },
    onError: () => {
      toast.error('Failed to post comment');
    },
  });

  // Create reply mutation
  const createReplyMutation = useMutation({
    mutationFn: commentService.createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setReplyContent('');
      setReplyingTo(null);
      toast.success('Reply posted successfully!');
    },
    onError: () => {
      toast.error('Failed to post reply');
    },
  });

  // Like comment mutation
  const likeCommentMutation = useMutation({
    mutationFn: commentService.likeComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
    onError: () => {
      toast.error('Failed to like comment');
    },
  });

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const commentData = {
      content: newComment,
      postId,
      ...(isAuthenticated ? {} : {
        authorName: guestName,
        authorEmail: guestEmail,
      })
    };

    createCommentMutation.mutate(commentData);
  };

  const handleSubmitReply = (parentId: number) => {
    if (!replyContent.trim()) return;

    const replyData = {
      content: replyContent,
      postId,
      parentId,
      ...(isAuthenticated ? {} : {
        authorName: guestName,
        authorEmail: guestEmail,
      })
    };

    createReplyMutation.mutate(replyData);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const comments = commentsData?.data.comments || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment Form */}
        <div className="space-y-4">
          <h3 className="font-semibold">Leave a Comment</h3>
          
          {/* Guest fields */}
          {!isAuthenticated && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guestName">Name *</Label>
                <Input
                  id="guestName"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="guestEmail">Email *</Label>
                <Input
                  id="guestEmail"
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="Your email"
                  required
                />
              </div>
            </div>
          )}

          <Textarea
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={4}
          />
          
          <Button
            onClick={handleSubmitComment}
            disabled={
              createCommentMutation.isPending || 
              !newComment.trim() ||
              (!isAuthenticated && (!guestName.trim() || !guestEmail.trim()))
            }
          >
            Post Comment
          </Button>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {commentsLoading ? (
            <div className="text-center py-4">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={(parentId) => setReplyingTo(parentId)}
                onLike={(commentId) => likeCommentMutation.mutate(commentId)}
                isReplying={replyingTo === comment.id}
                replyContent={replyContent}
                setReplyContent={setReplyContent}
                onSubmitReply={() => handleSubmitReply(comment.id)}
                onCancelReply={() => setReplyingTo(null)}
                formatDate={formatDate}
                isAuthenticated={isAuthenticated}
                guestName={guestName}
                setGuestName={setGuestName}
                guestEmail={guestEmail}
                setGuestEmail={setGuestEmail}
                createReplyMutation={createReplyMutation}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface CommentItemProps {
  comment: Comment;
  onReply: (parentId: number) => void;
  onLike: (commentId: number) => void;
  isReplying: boolean;
  replyContent: string;
  setReplyContent: (content: string) => void;
  onSubmitReply: () => void;
  onCancelReply: () => void;
  formatDate: (date: string) => string;
  isAuthenticated: boolean;
  guestName: string;
  setGuestName: (name: string) => void;
  guestEmail: string;
  setGuestEmail: (email: string) => void;
  createReplyMutation: any;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onReply,
  onLike,
  isReplying,
  replyContent,
  setReplyContent,
  onSubmitReply,
  onCancelReply,
  formatDate,
  isAuthenticated,
  guestName,
  setGuestName,
  guestEmail,
  setGuestEmail,
  createReplyMutation,
}) => {
  return (
    <div className="border rounded-lg p-4">
      {/* Comment Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={comment.author?.avatarUrl} />
            <AvatarFallback className="text-xs">
              {comment.author?.fullName 
                ? comment.author.fullName.split(' ').map(n => n[0]).join('')
                : comment.authorName
                ? comment.authorName.split(' ').map(n => n[0]).join('')
                : '?'
              }
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">
              {comment.author?.fullName || comment.authorName || 'Anonymous'}
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(comment.createdAt)}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onReply(comment.id)}>
              <Reply className="w-4 h-4 mr-2" />
              Reply
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Comment Content */}
      <div className="mb-3">
        <p className="text-gray-700">{comment.content}</p>
      </div>

      {/* Comment Actions */}
      <div className="flex items-center gap-4 text-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onLike(comment.id)}
          className="text-gray-500 hover:text-blue-600"
        >
          <ThumbsUp className="w-4 h-4 mr-1" />
          {comment.likeCount}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onReply(comment.id)}
          className="text-gray-500 hover:text-blue-600"
        >
          <Reply className="w-4 h-4 mr-1" />
          Reply
        </Button>
      </div>

      {/* Reply Form */}
      {isReplying && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
          {!isAuthenticated && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Your name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
              />
              <Input
                type="email"
                placeholder="Your email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
              />
            </div>
          )}
          
          <Textarea
            placeholder="Write your reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows={3}
          />
          
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={onSubmitReply}
              disabled={
                createReplyMutation.isPending || 
                !replyContent.trim() ||
                (!isAuthenticated && (!guestName.trim() || !guestEmail.trim()))
              }
            >
              Post Reply
            </Button>
            <Button variant="outline" size="sm" onClick={onCancelReply}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 ml-8 space-y-3">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="border-l-2 border-gray-200 pl-4">
              <CommentItem
                comment={reply}
                onReply={() => {}}
                onLike={onLike}
                isReplying={false}
                replyContent=""
                setReplyContent={() => {}}
                onSubmitReply={() => {}}
                onCancelReply={() => {}}
                formatDate={formatDate}
                isAuthenticated={isAuthenticated}
                guestName={guestName}
                setGuestName={setGuestName}
                guestEmail={guestEmail}
                setGuestEmail={setGuestEmail}
                createReplyMutation={createReplyMutation}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};