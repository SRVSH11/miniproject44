import { Search, Plus, Users, GraduationCap, UserCircle2 } from 'lucide-react';
import { User } from '../types';
import { DEMO_ASKER_USER, DEMO_SOLVER_USER } from '../data/initialData';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenProfile?: () => void;
  onOpenCreatePost: () => void;
  onOpenCreateCommunity: () => void;
  selectedCommunityName?: string;
  onResetCommunity: () => void;
  onSwitchDemoUser?: (user: User) => void;
}

export const Navbar = ({
  searchQuery,
  onSearchChange,
  currentUser,
  onOpenAuth,
  onOpenProfile,
  onOpenCreatePost,
  onOpenCreateCommunity,
  selectedCommunityName,
  onResetCommunity,
  onSwitchDemoUser,
}: NavbarProps) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand / Title */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onResetCommunity}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:bg-indigo-700 transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                  StudyCircle
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Cloud Sync
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Real-time doubts, notes & peer discussion</p>
            </div>
          </button>

          {selectedCommunityName && (
            <div className="hidden md:flex items-center gap-1.5 pl-3 border-l border-slate-200">
              <span className="text-xs text-slate-400">Viewing:</span>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/80">
                {selectedCommunityName}
              </span>
              <button
                type="button"
                onClick={onResetCommunity}
                className="text-[11px] text-slate-400 hover:text-slate-600 underline ml-1"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-2 sm:mx-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              id="search-posts-input"
              type="text"
              placeholder="Search doubts, notes, concepts..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-full focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Action Buttons & Auth */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Create Community button */}
          <button
            type="button"
            id="nav-create-community-btn"
            onClick={onOpenCreateCommunity}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-indigo-200 hover:border-indigo-300 bg-indigo-50/80 hover:bg-indigo-100 text-xs font-semibold text-indigo-700 transition-colors shadow-2xs shrink-0 cursor-pointer"
            title="Create a new study community"
          >
            <Users className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="hidden sm:inline">New Community</span>
            <span className="sm:hidden text-[11px] font-bold">+ Community</span>
          </button>

          {/* New Post button */}
          <button
            type="button"
            id="nav-create-post-btn"
            onClick={onOpenCreatePost}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Post</span>
            <span className="sm:hidden">Post</span>
          </button>

          {/* Quick Demo Switcher Pill */}
          {onSwitchDemoUser && (
            <div className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-lg border border-slate-200 text-xs">
              <span className="text-[10px] font-bold text-slate-400 px-1 uppercase tracking-wider">Demo:</span>
              <button
                type="button"
                id="nav-switch-asker-btn"
                onClick={() => onSwitchDemoUser(DEMO_ASKER_USER)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  currentUser?.email.toLowerCase() === DEMO_ASKER_USER.email.toLowerCase()
                    ? 'bg-white text-indigo-700 shadow-2xs border border-indigo-200'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-200/50'
                }`}
                title="Switch to Demo Student: Aarav Sharma (Doubt Asker)"
              >
                <span>❓ Asker</span>
              </button>
              <button
                type="button"
                id="nav-switch-solver-btn"
                onClick={() => onSwitchDemoUser(DEMO_SOLVER_USER)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  currentUser?.email.toLowerCase() === DEMO_SOLVER_USER.email.toLowerCase()
                    ? 'bg-white text-emerald-700 shadow-2xs border border-emerald-200'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-200/50'
                }`}
                title="Switch to Demo Student: Priya Verma (Doubt Solver)"
              >
                <span>💡 Solver</span>
              </button>
            </div>
          )}

          {/* User Profile / Sign In */}
          {currentUser ? (
            <button
              type="button"
              id="nav-user-profile-btn"
              onClick={onOpenProfile ? onOpenProfile : onOpenAuth}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
              title="View your student profile"
            >
              <div
                className={`w-6 h-6 rounded-full ${currentUser.avatarColor} text-white font-bold text-[11px] flex items-center justify-center`}
              >
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-slate-800 max-w-[80px] sm:max-w-[120px] truncate hidden sm:inline">
                {currentUser.name}
              </span>
            </button>
          ) : (
            <button
              type="button"
              id="nav-signin-btn"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
            >
              <UserCircle2 className="w-4 h-4 text-slate-500" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
