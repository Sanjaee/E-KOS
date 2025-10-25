import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { formatDistance } from "date-fns";
import { toast } from "@/hooks/use-toast";
import {
  Heart,
  MessageCircle,
  MoreVertical,
  Send,
  Trash2,
  UserCircle2,
  Shield,
  Award,
  Star,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface User {
  id: string;
  name: string | null;
  image?: string | undefined;
  role: string;
  loginMethod: string;
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  likes: number;
  hasLiked: boolean;
  user: User;
  replies?: Comment[];
}

interface CommentsProps {
  postId: number;
}

const RoleBadge = ({ role }: { role: string }) => {
  const badges = {
    admin: {
      icon: Shield,
      text: "Admin",
      style: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    },
    moderator: {
      icon: Award,
      text: "Moderator",
      style:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    },
    verified: {
      icon: Star,
      text: "Verified",
      style: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    },
  };

  if (!badges[role as keyof typeof badges]) return null;

  const { icon: Icon, text, style } = badges[role as keyof typeof badges];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style} ml-2`}
    >
      <Icon className="w-3 h-3 mr-1" />
      {text}
    </span>
  );
};

const UserAvatar = ({ user }: { user: User }) => (
  <Avatar className="h-10 w-10">
    {user?.image ? (
      <AvatarImage src={user.image || ""} alt={user.name || "User"} />
    ) : (
      <div className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-white rounded-full">
        <span className=" text-gray-600 dark:text-gray-300">
          {user?.name?.[0]?.toUpperCase()}
        </span>
      </div>
    )}
  </Avatar>
);

export const Comments = ({ postId }: CommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?postId=${postId}`);
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast({
        title: "Error",
        description: "Failed to fetch comments. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleRedirect = () => {
    const currentPath = window.location.pathname + window.location.search;
    router.push(`/auth/login?callbackUrl=${encodeURIComponent(currentPath)}`);
  };

  const handleLike = async (commentId: number) => {
    if (!session) {
      handleRedirect();
      return;
    }

    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to like comment");

      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likes: comment.hasLiked ? comment.likes - 1 : comment.likes + 1,
              hasLiked: !comment.hasLiked,
            };
          }
          return comment;
        })
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like comment. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete comment");

      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      toast({
        title: "Success",
        description: "Comment deleted successfully.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent, parentId?: number) => {
    e.preventDefault();
    if (!session || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          postId,
          parentId,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add comment");
      }

      const newComment = await response.json();

      if (parentId) {
        setComments((prev) =>
          prev.map((comment) => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newComment],
              };
            }
            return comment;
          })
        );
      } else {
        setComments((prev) => [newComment, ...prev]);
      }

      setContent("");
      setReplyingTo(null);
      toast({
        title: "Success",
        description: "Comment posted successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error posting comment:", error);
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: "Failed to post comment. Please try again later.",
          variant: "destructive",
        });
        if (error.message.includes("logged in")) handleRedirect();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const CommentCard = ({
    comment,
    isReply = false,
  }: {
    comment: Comment;
    isReply?: boolean;
  }) => (
    <div
      className={`${
        isReply ? "ml-12 mt-4" : "mb-6"
      } bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700`}
    >
      <div className="flex items-start space-x-3">
        <UserAvatar user={comment.user} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                {comment.user.name || "Anonymous"}
              </h4>
              <RoleBadge role={comment.user.role} />
            </div>
            <div className="flex items-center space-x-2">
              {(session?.user?.id === comment.user.id ||
                session?.user?.role === "admin") && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this comment? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(comment.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
          <p className="mt-1 text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
            {comment.content}
          </p>
          <div className="mt-3 flex items-center justify-between">
            {!isReply && (
              <button
                onClick={() => {
                  setReplyingTo(replyingTo === comment.id ? null : comment.id);
                  setTimeout(() => commentInputRef.current?.focus(), 0);
                }}
                className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Reply</span>
              </button>
            )}
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatDistance(new Date(comment.createdAt), new Date(), {
                addSuffix: true,
              })}
            </span>
          </div>
          {replyingTo === comment.id && (
            <div className="mt-4">
              <form
                onSubmit={(e) => handleSubmit(e, comment.id)}
                className="space-y-4"
              >
                <Textarea
                  ref={commentInputRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Jika text nya panjang bisa tarik di bagian kanan bawah input ini"
                  className="min-h-[100px] border "
                  disabled={isSubmitting}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setReplyingTo(null)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !content.trim()}
                  >
                    {isSubmitting ? "Posting..." : "Reply"}
                  </Button>
                </div>
              </form>
            </div>
          )}
          {comment.replies?.map((reply) => (
            <CommentCard key={reply.id} comment={reply} isReply />
          ))}
        </div>
      </div>
    </div>
  );

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        {session ? (
          <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
            <div className="flex items-start space-x-3">
              <UserAvatar user={session.user} />
              <div className="flex-1">
                <Textarea
                  value={content}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setContent(e.target.value)
                  }
                  placeholder="Jika text nya panjang bisa tarik di bagian kanan bawah input ini"
                  className="min-h-[100px]"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="flex items-center space-x-2"
              >
                <span>{isSubmitting ? "Posting..." : "Send"}</span>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Please login to leave a comment
            </p>
            <Button onClick={handleRedirect}>Login to Comment</Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No comments yet. Be the first to comment!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Comments;
