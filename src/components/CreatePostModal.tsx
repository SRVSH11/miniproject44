import { useState, useEffect } from 'react';
import { X, HelpCircle, FileText, MessageSquare, Tag, Users } from 'lucide-react';
import { Community, Post, PostType, User } from '../types';
import { PhotoUploader } from './PhotoUploader';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (post: Post) => void;
  communities: Community[];
  selectedCommunityId: string | null;
  currentUser: User | null;
  onOpenAuth: () => void;
}

export const CreatePostModal = ({
  isOpen,
  onClose,
  onCreate,
  communities,
  selectedCommunityId,
  currentUser,
  onOpenAuth,
}: CreatePostModalProps) => {
  const [communityId, setCommunityId] = useState<string>('');
  const [type, setType] = useState<PostType>('doubt');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedCommunityId && communities.some((c) => c.id === selectedCommunityId)) {
      setCommunityId(selectedCommunityId);
    } else if (communities.length > 0 && !communityId) {
      setCommunityId(communities[0].id);
    }
  }, [selectedCommunityId, communities, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (!title.trim()) {
      setError('Please provide a post title.');
      return;
    }
    if (!content.trim()) {
      setError('Please provide the content or details for your post.');
      return;
    }
    if (!communityId) {
      setError('Please select a community for this post.');
      return;
    }

    const comm = communities.find((c) => c.id === communityId);
    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const now = Date.now();
    const newPost: Post = {
      id: `post-${now}`,
      timestamp: now,
      title: title.trim(),
      content: content.trim(),
      type,
      communityId,
      communityName: comm ? comm.name : 'General',
      authorName: currentUser.name,
      authorEmail: currentUser.email,
      createdAt: 'Just now',
      upvotes: 1, // author upvotes by default
      downvotes: 0,
      userVote: 'up',
      commentCount: 0,
      isSolved: false,
      ...(parsedTags.length > 0 ? { tags: parsedTags } : {}),
      ...(images.length > 0 ? { images: images.slice(0, 3) } : {}),
    };

    onCreate(newPost);
    onClose();
    setTitle('');
    setContent('');
    setTagsInput('');
    setImages([]);
    setError(null);
  };

  const getPlaceholder = () => {
    switch (type) {
      case 'doubt':
        return 'Explain what you are trying to understand, what you tried, or what specific step confuses you...';
      case 'notes':
        return 'Paste or write your structured study notes, chapter summaries, key dates, formulas, or takeaways...';
      case 'discussion':
        return 'Share your perspective, raise an interesting question, or propose a study topic for the community to discuss...';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Create Study Post</h2>
            <p className="text-xs text-slate-500">Ask a doubt, share notes, or start a discussion</p>
          </div>
          <button
            id="close-create-post-modal-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
              {error}
            </div>
          )}

          {!currentUser && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center justify-between">
              <span>You need to be signed in to submit a post.</span>
              <button
                type="button"
                onClick={onOpenAuth}
                className="underline font-semibold hover:text-amber-900"
              >
                Sign In Now
              </button>
            </div>
          )}

          {/* Post Type Selector (Doubt, Notes, Discussion) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Post Category</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                id="post-type-doubt-btn"
                onClick={() => setType('doubt')}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  type === 'doubt'
                    ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-100'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">Doubt</span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  Ask a doubt for peers to solve with step-by-step solutions
                </p>
              </button>

              <button
                type="button"
                id="post-type-notes-btn"
                onClick={() => setType('notes')}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  type === 'notes'
                    ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-100'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">Notes</span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  Share revision guides, cheat sheets, formulas, or summaries
                </p>
              </button>

              <button
                type="button"
                id="post-type-discussion-btn"
                onClick={() => setType('discussion')}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  type === 'discussion'
                    ? 'border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-100'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-800 flex items-center justify-center">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">Discussion</span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  Initiate academic talk, explore concepts, or debate questions
                </p>
              </button>
            </div>
          </div>

          {/* Community Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Community <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <select
                id="post-community-select"
                value={communityId}
                onChange={(e) => setCommunityId(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 appearance-none cursor-pointer"
                required
              >
                {communities.map((comm) => (
                  <option key={comm.id} value={comm.id}>
                    {comm.icon} {comm.name} ({comm.subject})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Post Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="post-title-input"
              type="text"
              placeholder={
                type === 'doubt'
                  ? 'e.g. How does Dijkstra handle negative edges?'
                  : type === 'notes'
                  ? 'e.g. Summary Notes: French Revolution Timelines'
                  : 'e.g. Discussion: Impact of El Niño on Indian monsoon patterns'
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-medium"
              required
            />
          </div>

          {/* Content / Notes / Doubt detail */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                {type === 'doubt' ? 'Doubt Details & Context' : type === 'notes' ? 'Notes Content & Key Takeaways' : 'Discussion Content'}{' '}
                <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Markdown & bullet points supported</span>
            </div>
            <textarea
              id="post-content-input"
              rows={6}
              placeholder={getPlaceholder()}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-normal leading-relaxed resize-y"
              required
            />
          </div>

          {/* Photo attachments (up to 3 photos limit) */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <PhotoUploader
              images={images}
              onChange={setImages}
              label={
                type === 'doubt'
                  ? 'Attach Doubt Diagrams / Photos'
                  : type === 'notes'
                  ? 'Attach Study Notes Photos / Pages'
                  : 'Attach Discussion Photos'
              }
              helperText="Upload up to 3 photos (textbook pages, handwritten solutions, graphs, slides). Limit: 3 photos."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              Tags (optional, comma-separated)
            </label>
            <input
              id="post-tags-input"
              type="text"
              placeholder="e.g. Algorithms, Graph Theory, Exam Prep"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="text-[11px] text-slate-500">
              Posting as <span className="font-semibold text-slate-800">{currentUser?.name || 'Guest'}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                id="cancel-create-post-btn"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="submit-create-post-btn"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                {type === 'doubt' ? 'Post Doubt' : type === 'notes' ? 'Share Notes' : 'Post Discussion'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
