import { useState, useEffect } from 'react';
import {
  X,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  FileText,
  HelpCircle,
  MessageSquare,
  Sparkles,
  ArrowUp,
  Calendar,
  Mail,
  Edit3,
  Check,
  LogOut,
  ExternalLink,
  Image as ImageIcon,
} from 'lucide-react';
import { User, Post, Comment } from '../types';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  currentUser: User | null;
  posts: Post[];
  comments: Comment[];
  onUpdateUser?: (updatedUser: User) => void;
  onSelectPost?: (post: Post) => void;
  onLogout?: () => void;
}

export const StudentProfileModal = ({
  isOpen,
  onClose,
  user,
  currentUser,
  posts,
  comments,
  onUpdateUser,
  onSelectPost,
  onLogout,
}: StudentProfileModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editCourse, setEditCourse] = useState(user?.course || '');
  const [editSemester, setEditSemester] = useState(user?.semester || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [activeTab, setActiveTab] = useState<'all' | 'doubts' | 'notes' | 'discussions'>('all');

  // Synchronize form fields whenever user or modal open state changes
  useEffect(() => {
    if (user) {
      setEditCourse(user.course || '');
      setEditSemester(user.semester || '');
      setEditBio(user.bio || '');
    }
    if (!isOpen) {
      setIsEditing(false);
    }
  }, [user, isOpen]);

  // Support closing modal or canceling edit mode with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (isEditing) {
          setIsEditing(false);
          if (user) {
            setEditCourse(user.course || '');
            setEditSemester(user.semester || '');
            setEditBio(user.bio || '');
          }
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isEditing, user, onClose]);

  if (!isOpen || !user) return null;

  const isSelf = currentUser ? currentUser.email.toLowerCase() === user.email.toLowerCase() : false;

  // Calculate dynamic stats
  const studentPosts = posts.filter(
    (p) => p.authorEmail.toLowerCase() === user.email.toLowerCase()
  );
  const postsCount = studentPosts.length;

  const doubtsAskedCount = studentPosts.filter((p) => p.type === 'doubt').length;
  const notesSharedCount = studentPosts.filter((p) => p.type === 'notes').length;
  const discussionsCount = studentPosts.filter((p) => p.type === 'discussion').length;

  // Calculate doubts solved:
  // Comments authored by this student that are marked isSolution or are the post's solvedCommentId
  const solvedDoubtsCount = comments.filter((c) => {
    if (c.authorEmail.toLowerCase() !== user.email.toLowerCase()) return false;
    if (c.isSolution) return true;
    const relatedPost = posts.find((p) => p.id === c.postId);
    return relatedPost?.isSolved && relatedPost?.solvedCommentId === c.id;
  }).length;

  // Total upvotes received on posts
  const totalPostUpvotes = studentPosts.reduce((acc, p) => acc + (p.upvotes || 0), 0);

  // Filtered posts for the list
  const filteredPosts = studentPosts.filter((p) => {
    if (activeTab === 'doubts') return p.type === 'doubt';
    if (activeTab === 'notes') return p.type === 'notes';
    if (activeTab === 'discussions') return p.type === 'discussion';
    return true;
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateUser) return;
    const updated: User = {
      ...user,
      course: editCourse.trim() || user.course,
      semester: editSemester.trim() || user.semester,
      bio: editBio.trim() || user.bio,
    };
    onUpdateUser(updated);
    setIsEditing(false);
  };

  const handleCancelEditing = () => {
    if (user) {
      setEditCourse(user.course || '');
      setEditSemester(user.semester || '');
      setEditBio(user.bio || '');
    }
    setIsEditing(false);
  };

  const startEditing = () => {
    setEditCourse(user.course || '');
    setEditSemester(user.semester || '');
    setEditBio(user.bio || '');
    setIsEditing(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner with gradient */}
        <div className="h-28 bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-800 relative px-6 flex items-start justify-end pt-4">
          <button
            type="button"
            id="close-profile-modal-btn"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-full bg-black/20 hover:bg-black/40 transition-colors cursor-pointer"
            title="Close Profile"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info Header */}
        <div className="px-6 pb-4 border-b border-slate-100 relative bg-white">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 gap-4 mb-4">
            <div className="flex items-end gap-3.5">
              <div
                className={`w-20 h-20 rounded-2xl ${user.avatarColor} text-white font-black text-2xl flex items-center justify-center ring-4 ring-white shadow-md`}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                  {solvedDoubtsCount > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      Doubt Solver
                    </span>
                  )}
                  {doubtsAskedCount > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      <HelpCircle className="w-3 h-3 text-indigo-600" />
                      Doubt Asker
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {user.email}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Joined {user.joinedDate}
                  </span>
                </div>
              </div>
            </div>

            {isSelf && !isEditing && (
              <button
                type="button"
                id="edit-profile-btn"
                onClick={startEditing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors self-start sm:self-auto cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit Academic Info</span>
              </button>
            )}
          </div>

          {/* Academic Info & Bio */}
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Update Academic Details
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Course Studying
                  </label>
                  <input
                    type="text"
                    value={editCourse}
                    onChange={(e) => setEditCourse(e.target.value)}
                    placeholder="e.g. B.Tech Computer Science"
                    className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Semester
                  </label>
                  <select
                    value={editSemester}
                    onChange={(e) => setEditSemester(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white"
                  >
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                    <option value="Semester 3">Semester 3</option>
                    <option value="Semester 4">Semester 4</option>
                    <option value="Semester 5">Semester 5</option>
                    <option value="Semester 6">Semester 6</option>
                    <option value="Semester 7">Semester 7</option>
                    <option value="Semester 8">Semester 8</option>
                    <option value="Postgraduate Year 1">Postgraduate Year 1</option>
                    <option value="Postgraduate Year 2">Postgraduate Year 2</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Study Focus / Bio
                </label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Subjects you are studying, topics you can help with..."
                  className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  id="cancel-edit-profile-btn"
                  onClick={handleCancelEditing}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="save-profile-btn"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save Academic Details
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-2 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-900 text-xs font-semibold border border-indigo-200/80">
                  <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{user.course || 'Undergraduate Degree'}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200">
                  <BookOpen className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span>{user.semester || 'Semester 1'}</span>
                </div>
              </div>
              {user.bio && (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                  {user.bio}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Dynamic Metrics Row */}
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs text-center">
            <span className="block text-2xl font-black text-slate-900">{postsCount}</span>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Posts Made
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-emerald-200/80 shadow-2xs text-center">
            <div className="flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-2xl font-black text-emerald-700">{solvedDoubtsCount}</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
              Doubts Solved
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs text-center">
            <div className="flex items-center justify-center gap-1">
              <ArrowUp className="w-4 h-4 text-indigo-600" />
              <span className="text-2xl font-black text-slate-900">{totalPostUpvotes}</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Upvotes Received
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs text-center">
            <span className="block text-2xl font-black text-slate-900">{notesSharedCount}</span>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Notes Shared
            </span>
          </div>
        </div>

        {/* Contributed Posts List */}
        <div className="flex-1 overflow-y-auto p-6 min-h-[160px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Activity & Contributions ({studentPosts.length})
            </h3>
            {studentPosts.length > 0 && (
              <div className="flex rounded-lg bg-slate-100 p-0.5 text-[11px] font-medium">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    activeTab === 'all' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  All ({studentPosts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('doubts')}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    activeTab === 'doubts' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Doubts ({doubtsAskedCount})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('notes')}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    activeTab === 'notes' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Notes ({notesSharedCount})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('discussions')}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    activeTab === 'discussions' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Discussions ({discussionsCount})
                </button>
              </div>
            )}
          </div>

          {filteredPosts.length === 0 ? (
            <div className="py-10 text-center text-slate-400">
              <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
              <p className="text-xs">No posts found in this category for this student yet.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => {
                    if (onSelectPost) {
                      onSelectPost(post);
                      onClose();
                    }
                  }}
                  className="p-3.5 bg-slate-50 hover:bg-indigo-50/40 border border-slate-200/80 rounded-xl transition-all cursor-pointer group flex items-start justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold text-slate-500">
                        c/{post.communityName}
                      </span>
                      <span>•</span>
                      {post.type === 'doubt' && (
                        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded-md ${
                          post.isSolved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          <HelpCircle className="w-2.5 h-2.5" />
                          {post.isSolved ? 'Solved' : 'Doubt'}
                        </span>
                      )}
                      {post.type === 'notes' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-700">
                          <FileText className="w-2.5 h-2.5" />
                          Notes
                        </span>
                      )}
                      {post.type === 'discussion' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-indigo-50 text-indigo-700">
                          <MessageSquare className="w-2.5 h-2.5" />
                          Discussion
                        </span>
                      )}
                      {post.images && post.images.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-purple-50 text-purple-700 border border-purple-200/60">
                          <ImageIcon className="w-2.5 h-2.5" />
                          {post.images.length} {post.images.length === 1 ? 'photo' : 'photos'}
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400">{post.createdAt}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {post.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                      {post.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0 pt-1">
                    <span>+{post.upvotes}</span>
                    <span>•</span>
                    <span>{post.commentCount} replies</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500 ml-1 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with working Cancel button */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            {isSelf ? `Signed in as ${user.email}` : `Student Profile: ${user.name}`}
          </span>
          <div className="flex items-center gap-2">
            {isSelf && onLogout && (
              <button
                type="button"
                id="profile-sign-out-btn"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
            <button
              type="button"
              id="cancel-profile-btn"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-200/70 text-xs font-semibold text-slate-700 transition-colors cursor-pointer shadow-2xs"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
