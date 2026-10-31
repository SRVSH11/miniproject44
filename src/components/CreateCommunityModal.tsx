import { useState } from 'react';
import { X, Users, Sparkles, Hash, BookOpen, ShieldCheck } from 'lucide-react';
import { Community, User } from '../types';

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (community: Community) => void;
  currentUser: User | null;
}

const PRESET_ICONS = ['📚', '🔬', '📐', '💻', '🌍', '📜', '📰', '⚖️', '🎨', '🧪', '🧬', '🧠'];

export const CreateCommunityModal = ({
  isOpen,
  onClose,
  onCreate,
  currentUser,
}: CreateCommunityModalProps) => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('📚');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide a community name.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a brief description.');
      return;
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '');

    const newCommunity: Community = {
      id: `comm-custom-${Date.now()}`,
      name: name.trim(),
      slug: slug || `community-${Date.now()}`,
      description: description.trim(),
      icon: icon || '📚',
      subject: subject.trim() || name.trim(),
      memberCount: 1,
      createdAt: new Date().toISOString().split('T')[0],
      isCustom: true,
      creatorEmail: currentUser ? currentUser.email : 'aarav.study@student.edu',
      creatorName: currentUser ? currentUser.name : 'Aarav Sharma',
    };

    onCreate(newCommunity);
    onClose();
    setName('');
    setSubject('');
    setDescription('');
    setIcon('📚');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-sm">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Create Study Community</h2>
              <p className="text-xs text-slate-500">Build a dedicated subject space for doubts, notes & discussion</p>
            </div>
          </div>
          <button
            id="close-create-community-modal-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
              {error}
            </div>
          )}

          {/* Name & Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Community Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  id="community-name-input"
                  type="text"
                  placeholder="e.g. Physics, Literature"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  required
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Will appear as c/{name.toLowerCase().replace(/\s+/g, '') || 'name'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Category</label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  id="community-subject-input"
                  type="text"
                  placeholder="e.g. Natural Sciences"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Community Icon
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              {PRESET_ICONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center border transition-all ${
                    icon === emoji
                      ? 'border-indigo-600 bg-indigo-50 scale-105 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {emoji}
                </button>
              ))}
              <input
                id="community-custom-icon-input"
                type="text"
                placeholder="Or type emoji"
                value={icon}
                maxLength={2}
                onChange={(e) => setIcon(e.target.value)}
                className="w-24 px-2 py-1.5 text-center text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description & Purpose <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="community-description-input"
              rows={3}
              placeholder="What topics are studied here? What kinds of doubts or notes can members share?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none"
              required
            />
          </div>

          {/* Admin Privileges notice */}
          <div className="p-3.5 bg-indigo-50/80 rounded-xl border border-indigo-200/80 text-xs text-indigo-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-indigo-950">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Community Creator = Administrator</span>
            </div>
            <p className="text-[11px] text-indigo-800/90 leading-relaxed">
              As creator, you ({currentUser?.name || 'You'}) will be assigned full <strong>Admin</strong> privileges. You will have the power to moderate discussions and delete unwanted posts and messages.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              id="cancel-create-community-btn"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-create-community-btn"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Create Community
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
