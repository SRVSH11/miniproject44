import { useState } from 'react';
import {
  X,
  ArrowBigUp,
  ArrowBigDown,
  CheckCircle2,
  HelpCircle,
  FileText,
  MessageSquare,
  Copy,
  Check,
  Send,
  Sparkles,
  Share2,
  Award,
  Trash2,
  ShieldAlert,
} from 'lucide-react';
import { Post, Comment, User } from '../types';
import { PostImageGrid } from './PostImageGrid';
import { PhotoUploader } from './PhotoUploader';

interface PostDetailModalProps {
  post: Post | null;
  comments: Comment[];
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  isCommunityAdmin?: boolean;
  onVotePost: (postId: string, direction: 'up' | 'down') => void;
  onVoteComment: (commentId: string, direction: 'up' | 'down') => void;
  onAddComment: (postId: string, content: string, isSolution?: boolean, images?: string[]) => void;
  onToggleSolved: (postId: string, commentId?: string) => void;
  onDeletePost?: (postId: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onOpenAuth: () => void;
  onViewProfile?: (authorEmail: string, authorName?: string) => void;
}

export const PostDetailModal = ({
  post,
  comments,
  isOpen,
  onClose,
  currentUser,
  isCommunityAdmin = false,
  onVotePost,
  onVoteComment,
  onAddComment,
  onToggleSolved,
  onDeletePost,
  onDeleteComment,
  onOpenAuth,
  onViewProfile,
}: PostDetailModalProps) => {
  const [commentText, setCommentText] = useState('');
  const [commentImages, setCommentImages] = useState<string[]>([]);
  const [copiedNotes, setCopiedNotes] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [confirmDeletePost, setConfirmDeletePost] = useState(false);
  const [confirmDeleteCommentId, setConfirmDeleteCommentId] = useState<string | null>(null);

  if (!isOpen || !post) return null;

  const postComments = comments.filter((c) => c.postId === post.id);
  const isPostAuthor = currentUser ? currentUser.email === post.authorEmail : false;
  const verifiedSolution = postComments.find((c) => c.isSolution || c.id === post.solvedCommentId);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() && commentImages.length === 0) return;

    if (!currentUser) {
      onOpenAuth();
      return;
    }

    onAddComment(
      post.id,
      commentText.trim() || 'Attached solution / photo notes',
      false,
      commentImages.length > 0 ? commentImages.slice(0, 3) : undefined
    );
    setCommentText('');
    setCommentImages([]);
  };

  const handleCopyNotes = () => {
    const textToCopy = `${post.title}\n\n${post.content}\n\nSource: ${post.communityName} Study Community`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedNotes(true);
    setTimeout(() => setCopiedNotes(false), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const netScore = post.upvotes - post.downvotes;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-100 bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900">
              c/{post.communityName.toLowerCase().replace(/\s+/g, '')}
            </span>
            <span className="text-slate-300">•</span>
            {post.type === 'doubt' ? (
              post.isSolved ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  Solved Doubt
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                  <HelpCircle className="w-3 h-3" />
                  Academic Doubt (Open)
                </span>
              )
            ) : post.type === 'notes' ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <FileText className="w-3 h-3" />
                Study Notes
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <MessageSquare className="w-3 h-3" />
                Academic Discussion
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg text-xs flex items-center gap-1 transition-colors"
            >
              {shareCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{shareCopied ? 'Link Copied' : 'Share'}</span>
            </button>
            <button
              type="button"
              id="close-post-detail-modal-btn"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scroll Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Post Content Header */}
          <div className="flex gap-3 sm:gap-4">
            {/* Left vote column */}
            <div className="flex flex-col items-center bg-slate-50 border border-slate-200/80 rounded-lg p-1.5 h-fit shrink-0">
              <button
                type="button"
                onClick={() => onVotePost(post.id, 'up')}
                className={`p-1 rounded-md transition-colors ${
                  post.userVote === 'up'
                    ? 'text-indigo-600 bg-indigo-100'
                    : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-200'
                }`}
              >
                <ArrowBigUp className="w-5 h-5 fill-current" />
              </button>
              <span
                className={`text-xs font-bold py-1 ${
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
                onClick={() => onVotePost(post.id, 'down')}
                className={`p-1 rounded-md transition-colors ${
                  post.userVote === 'down'
                    ? 'text-rose-600 bg-rose-100'
                    : 'text-slate-400 hover:text-rose-600 hover:bg-slate-200'
                }`}
              >
                <ArrowBigDown className="w-5 h-5 fill-current" />
              </button>
            </div>

            {/* Post details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1.5">
                <span>
                  Asked/Shared by{' '}
                  <button
                    type="button"
                    id={`modal-post-author-btn-${post.id}`}
                    onClick={() => {
                      if (onViewProfile) {
                        onViewProfile(post.authorEmail, post.authorName);
                      }
                    }}
                    className="font-semibold text-slate-800 hover:text-indigo-600 hover:underline cursor-pointer"
                    title="View student profile"
                  >
                    {post.authorName}
                  </button>
                </span>
                <span>•</span>
                <span>{post.createdAt}</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 leading-snug">
                {post.title}
              </h1>

              {/* Main Post Body */}
              <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80 text-sm text-slate-800 leading-relaxed whitespace-pre-line font-normal mb-4">
                {post.content}
              </div>

              {/* Attached Photos (up to 3 photos) */}
              {post.images && post.images.length > 0 && (
                <div className="mb-4">
                  <PostImageGrid images={post.images} title={post.title} />
                </div>
              )}

              {/* Tags & Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {post.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {post.type === 'notes' && (
                    <button
                      type="button"
                      id="copy-notes-btn"
                      onClick={handleCopyNotes}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                    >
                      {copiedNotes ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Copied Notes!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy Notes
                        </>
                      )}
                    </button>
                  )}

                  {post.type === 'doubt' && isPostAuthor && (
                    <button
                      type="button"
                      id="toggle-post-solved-btn"
                      onClick={() => onToggleSolved(post.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border ${
                        post.isSolved
                          ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                          : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {post.isSolved ? 'Re-open Doubt' : 'Mark as Solved'}
                    </button>
                  )}

                  {onDeletePost && (isCommunityAdmin || isPostAuthor) && (
                    <button
                      type="button"
                      id="modal-delete-post-btn"
                      onClick={() => {
                        if (confirmDeletePost) {
                          onDeletePost(post.id);
                          onClose();
                        } else {
                          setConfirmDeletePost(true);
                          setTimeout(() => setConfirmDeletePost(false), 4500);
                        }
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border cursor-pointer ${
                        confirmDeletePost
                          ? 'bg-rose-600 text-white border-rose-600 ring-2 ring-rose-300 shadow-xs'
                          : isCommunityAdmin && !isPostAuthor
                          ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
                      }`}
                      title={
                        confirmDeletePost
                          ? 'Click again to permanently delete this post'
                          : isCommunityAdmin && !isPostAuthor
                          ? 'Community Admin: delete unwanted post'
                          : 'Delete post'
                      }
                    >
                      {confirmDeletePost ? (
                        <>
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="font-bold">Confirm Delete Post?</span>
                        </>
                      ) : isCommunityAdmin && !isPostAuthor ? (
                        <>
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                          <span>Delete Post (Admin)</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Post</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Highlighted Verified Solution if Available */}
          {post.type === 'doubt' && verifiedSolution && (
            <div className="bg-emerald-50/80 border-2 border-emerald-300 rounded-xl p-4 sm:p-5 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-2 text-emerald-900">
                <Award className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Accepted Solution to this Doubt
                </span>
              </div>
              <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-line mb-3 font-normal">
                {verifiedSolution.content}
              </div>
              {verifiedSolution.images && verifiedSolution.images.length > 0 && (
                <div className="mb-3">
                  <PostImageGrid
                    images={verifiedSolution.images}
                    title="Accepted Solution Diagrams / Photos"
                  />
                </div>
              )}
              <div className="text-xs text-emerald-800/80 flex items-center justify-between">
                <span>Solved by {verifiedSolution.authorName}</span>
                <span>{verifiedSolution.upvotes} students found this helpful</span>
              </div>
            </div>
          )}

          {/* Comment / Reply Section */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                {post.type === 'doubt'
                  ? 'Solutions & Clarifications'
                  : post.type === 'notes'
                  ? 'Questions & Discussion on Notes'
                  : 'Discussion Replies'}{' '}
                <span className="text-xs font-medium text-slate-500">({postComments.length})</span>
              </h3>
            </div>

            {/* Input form */}
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all bg-white">
                <div className="bg-slate-50 px-3 py-2 border-b border-slate-200/80 text-xs font-medium text-slate-600 flex items-center justify-between">
                  <span>
                    {post.type === 'doubt'
                      ? '✍️ Answer or solve this student’s doubt:'
                      : '💬 Write your response:'}
                  </span>
                  {!currentUser && (
                    <span className="text-[11px] text-amber-700">
                      Sign in required to reply
                    </span>
                  )}
                </div>
                <textarea
                  id="reply-content-input"
                  rows={3}
                  placeholder={
                    post.type === 'doubt'
                      ? 'Type a step-by-step solution, conceptual clarification, or resource link...'
                      : 'Share your perspective or query...'
                  }
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full p-3 text-sm focus:outline-hidden resize-none font-normal"
                />

                {/* Photo uploader for solution / reply (limit 3 photos) */}
                <div className="px-3 py-2 border-t border-slate-100 bg-slate-50/60">
                  <PhotoUploader
                    images={commentImages}
                    onChange={setCommentImages}
                    label="Attach Photos to Solution / Reply"
                    helperText="Post up to 3 photos of handwritten solutions, textbook answers, or diagrams (limit: 3 photos)."
                  />
                </div>

                <div className="flex items-center justify-between px-3 py-2 bg-white border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">
                    {commentImages.length > 0
                      ? `${commentImages.length}/3 photos attached`
                      : 'Be respectful and clear'}
                  </span>
                  <button
                    type="submit"
                    id="submit-reply-btn"
                    disabled={!commentText.trim() && commentImages.length === 0}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {post.type === 'doubt' ? 'Submit Solution' : 'Reply'}
                  </button>
                </div>
              </div>
            </form>

            {/* List of comments */}
            <div className="space-y-3">
              {postComments.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-600">No replies yet</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {post.type === 'doubt'
                      ? 'Be the first student to explain and solve this doubt!'
                      : 'Start the conversation below.'}
                  </p>
                </div>
              ) : (
                postComments.map((comment) => {
                  const isSolution = comment.isSolution || comment.id === post.solvedCommentId;
                  const commentScore = comment.upvotes - comment.downvotes;
                  const isCommentAuthor = currentUser
                    ? currentUser.email.toLowerCase() === comment.authorEmail.toLowerCase()
                    : false;
                  const canDeleteComment = Boolean(onDeleteComment && (isCommunityAdmin || isCommentAuthor));

                  return (
                    <div
                      key={comment.id}
                      id={`comment-item-${comment.id}`}
                      className={`p-4 rounded-xl border transition-all ${
                        isSolution
                          ? 'bg-emerald-50/50 border-emerald-200 ring-1 ring-emerald-200'
                          : 'bg-white border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">
                            {comment.authorName.charAt(0)}
                          </div>
                          <button
                            type="button"
                            id={`comment-author-btn-${comment.id}`}
                            onClick={() => {
                              if (onViewProfile) {
                                onViewProfile(comment.authorEmail, comment.authorName);
                              }
                            }}
                            className="text-xs font-semibold text-slate-800 hover:text-indigo-600 hover:underline cursor-pointer"
                            title="View student profile"
                          >
                            {comment.authorName}
                          </button>
                          <span className="text-[11px] text-slate-400">{comment.createdAt}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {isSolution && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3 h-3" />
                              Solution
                            </span>
                          )}

                          {/* Allow author of doubt to mark or unmark solution */}
                          {post.type === 'doubt' && isPostAuthor && !isSolution && (
                            <button
                              type="button"
                              onClick={() => onToggleSolved(post.id, comment.id)}
                              className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 rounded-md border border-emerald-200 transition-colors"
                              title="Mark as accepted solution for your doubt"
                            >
                              ✓ Accept as Solution
                            </button>
                          )}

                          {/* Delete Comment / Message action */}
                          {canDeleteComment && (
                            <button
                              type="button"
                              id={`delete-comment-btn-${comment.id}`}
                              onClick={() => {
                                if (confirmDeleteCommentId === comment.id) {
                                  onDeleteComment!(comment.id);
                                  setConfirmDeleteCommentId(null);
                                } else {
                                  setConfirmDeleteCommentId(comment.id);
                                  setTimeout(() => setConfirmDeleteCommentId((prev) => (prev === comment.id ? null : prev)), 4500);
                                }
                              }}
                              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                                confirmDeleteCommentId === comment.id
                                  ? 'text-white bg-rose-600 hover:bg-rose-700 shadow-xs'
                                  : isCommunityAdmin && !isCommentAuthor
                                  ? 'text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200'
                                  : 'text-slate-400 hover:text-rose-600 hover:bg-slate-100'
                              }`}
                              title={
                                confirmDeleteCommentId === comment.id
                                  ? 'Click again to permanently delete'
                                  : isCommunityAdmin && !isCommentAuthor
                                  ? 'Community Admin: delete unwanted message'
                                  : 'Delete reply'
                              }
                            >
                              {confirmDeleteCommentId === comment.id ? (
                                <>
                                  <Trash2 className="w-3 h-3" />
                                  <span className="font-bold">Confirm Delete?</span>
                                </>
                              ) : isCommunityAdmin && !isCommentAuthor ? (
                                <>
                                  <ShieldAlert className="w-3 h-3 text-rose-600" />
                                  <span>Delete (Admin)</span>
                                </>
                              ) : (
                                <>
                                  <Trash2 className="w-3 h-3" />
                                  <span>Delete</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Comment text */}
                      <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line mb-3 font-normal">
                        {comment.content}
                      </div>

                      {/* Comment photos (up to 3 photos) */}
                      {comment.images && comment.images.length > 0 && (
                        <div className="mb-3">
                          <PostImageGrid
                            images={comment.images}
                            title={`${comment.authorName}'s solution photo`}
                          />
                        </div>
                      )}

                      {/* Voting and helpful action */}
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <div className="flex items-center gap-1 bg-slate-50 rounded-md px-1.5 py-0.5 border border-slate-200/70">
                          <button
                            type="button"
                            onClick={() => onVoteComment(comment.id, 'up')}
                            className={`p-0.5 rounded-sm hover:text-indigo-600 ${
                              comment.userVote === 'up' ? 'text-indigo-600' : 'text-slate-400'
                            }`}
                            title="Helpful / Upvote"
                          >
                            <ArrowBigUp className="w-4 h-4 fill-current" />
                          </button>
                          <span className="font-semibold text-slate-700 text-xs">{commentScore}</span>
                          <button
                            type="button"
                            onClick={() => onVoteComment(comment.id, 'down')}
                            className={`p-0.5 rounded-sm hover:text-rose-600 ${
                              comment.userVote === 'down' ? 'text-rose-600' : 'text-slate-400'
                            }`}
                            title="Downvote"
                          >
                            <ArrowBigDown className="w-4 h-4 fill-current" />
                          </button>
                        </div>

                        {post.type === 'doubt' && (
                          <span className="text-[11px] text-slate-400">
                            {isSolution ? 'Marked as verified resolution' : 'Peer explanation'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
