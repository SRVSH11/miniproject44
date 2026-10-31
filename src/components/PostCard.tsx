import { ArrowBigUp, ArrowBigDown, MessageSquare, CheckCircle2, HelpCircle, FileText, Tag, Share2, Check, Trash2, ShieldAlert, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { Post } from '../types';
import { PostImageGrid } from './PostImageGrid';

interface PostCardProps {
  post: Post;
  onVote: (postId: string, direction: 'up' | 'down') => void;
  onSelectPost: (post: Post) => void;
  onSelectCommunity: (communityId: string) => void;
  isAuthor: boolean;
  isCommunityAdmin?: boolean;
  onDeletePost?: (postId: string) => void;
  onViewProfile?: (authorEmail: string, authorName: string) => void;
}

export const PostCard = ({
  post,
  onVote,
  onSelectPost,
  onSelectCommunity,
  isAuthor,
  isCommunityAdmin = false,
  onDeletePost,
  onViewProfile,
}: PostCardProps) => {
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}#${post.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTypeBadge = () => {
    switch (post.type) {
      case 'doubt':
        return post.isSolved ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Solved Doubt
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <HelpCircle className="w-3 h-3" />
            Doubt (Unsolved)
          </span>
        );
      case 'notes':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <FileText className="w-3 h-3" />
            Study Notes
          </span>
        );
      case 'discussion':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <MessageSquare className="w-3 h-3" />
            Discussion
          </span>
        );
    }
  };

  const netScore = post.upvotes - post.downvotes;

  return (
    <article
      id={`post-card-${post.id}`}
      onClick={() => onSelectPost(post)}
      className="group bg-white rounded-xl border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-150 cursor-pointer overflow-hidden flex flex-col"
    >
      <div className="flex">
        {/* Left Voting Column (Reddit inspired) */}
        <div
          className="w-12 sm:w-14 shrink-0 bg-slate-50/60 p-2 border-r border-slate-100 flex flex-col items-center justify-start gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            id={`vote-up-btn-${post.id}`}
            onClick={() => onVote(post.id, 'up')}
            className={`p-1 rounded-md transition-colors ${
              post.userVote === 'up'
                ? 'text-indigo-600 bg-indigo-100'
                : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100'
            }`}
            title="Upvote"
          >
            <ArrowBigUp className="w-5 h-5 fill-current" />
          </button>

          <span
            className={`text-xs font-bold ${
              post.userVote === 'up'
                ? 'text-indigo-600'
                : post.userVote === 'down'
                ? 'text-rose-600'
                : 'text-slate-700'
            }`}
          >
            {netScore}
          </span>

          <button
            type="button"
            id={`vote-down-btn-${post.id}`}
            onClick={() => onVote(post.id, 'down')}
            className={`p-1 rounded-md transition-colors ${
              post.userVote === 'down'
                ? 'text-rose-600 bg-rose-100'
                : 'text-slate-400 hover:text-rose-600 hover:bg-slate-100'
            }`}
            title="Downvote"
          >
            <ArrowBigDown className="w-5 h-5 fill-current" />
          </button>
        </div>

        {/* Post Main Body */}
        <div className="p-4 sm:p-5 flex-1 min-w-0">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <button
              type="button"
              id={`post-community-badge-${post.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectCommunity(post.communityId);
              }}
              className="text-xs font-bold text-slate-800 hover:text-indigo-600 hover:underline inline-flex items-center gap-1"
            >
              c/{post.communityName.toLowerCase().replace(/\s+/g, '')}
            </button>
            <span className="text-slate-300">•</span>
            {getTypeBadge()}
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">
              Posted by{' '}
              <button
                type="button"
                id={`post-author-btn-${post.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onViewProfile) {
                    onViewProfile(post.authorEmail, post.authorName);
                  }
                }}
                className="font-medium text-slate-700 hover:text-indigo-600 hover:underline cursor-pointer"
                title="View student profile"
              >
                {post.authorName}
              </button>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-400">{post.createdAt}</span>
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2 leading-snug">
            {post.title}
          </h3>

          {/* Content snippet */}
          <div className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-3 whitespace-pre-line font-normal">
            {post.content}
          </div>

          {/* Attached Photos (up to 3 photos preview) */}
          {post.images && post.images.length > 0 && (
            <PostImageGrid images={post.images} title={post.title} isCompact />
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <Tag className="w-2.5 h-2.5 text-slate-400" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                id={`post-comment-count-${post.id}`}
                onClick={() => onSelectPost(post)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors font-medium"
              >
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <span>
                  {post.commentCount} {post.commentCount === 1 ? 'reply' : 'replies'}
                </span>
              </button>

              {post.type === 'doubt' && (
                <span className="text-[11px] font-medium px-2 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200/60 hidden sm:inline-flex items-center gap-1">
                  💡 {post.isSolved ? 'Solution provided' : 'Help solve this doubt'}
                </span>
              )}

              {post.type === 'notes' && (
                <span className="text-[11px] font-medium px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 hidden sm:inline-flex items-center gap-1">
                  📖 Study Material
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {onDeletePost && (isCommunityAdmin || isAuthor) && (
                <button
                  type="button"
                  id={`post-delete-btn-${post.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirmDelete) {
                      onDeletePost(post.id);
                      setConfirmDelete(false);
                    } else {
                      setConfirmDelete(true);
                      setTimeout(() => setConfirmDelete(false), 4500);
                    }
                  }}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    confirmDelete
                      ? 'text-white bg-rose-600 hover:bg-rose-700 shadow-xs ring-2 ring-rose-300'
                      : isCommunityAdmin && !isAuthor
                      ? 'text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/80'
                      : 'text-slate-400 hover:text-rose-600 hover:bg-slate-100'
                  }`}
                  title={
                    confirmDelete
                      ? 'Click again to permanently delete'
                      : isCommunityAdmin && !isAuthor
                      ? 'Delete this post (Community Admin Moderation)'
                      : 'Delete your post'
                  }
                >
                  {confirmDelete ? (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-bold">Confirm Delete?</span>
                    </>
                  ) : isCommunityAdmin && !isAuthor ? (
                    <>
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                      <span className="text-[11px]">Delete (Admin)</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-[11px]">Delete</span>
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                id={`post-share-btn-${post.id}`}
                onClick={handleShare}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                title="Share link"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Share</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
