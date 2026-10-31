import { Plus, Compass, Sparkles, BookOpen, ChevronRight, ShieldCheck } from 'lucide-react';
import { Community, User } from '../types';

interface SidebarProps {
  communities: Community[];
  selectedCommunityId: string | null;
  onSelectCommunity: (communityId: string | null) => void;
  onOpenCreateCommunity: () => void;
  doubtCount: number;
  notesCount: number;
  discussionCount: number;
  currentUser: User | null;
}

export const Sidebar = ({
  communities,
  selectedCommunityId,
  onSelectCommunity,
  onOpenCreateCommunity,
  doubtCount,
  notesCount,
  discussionCount,
  currentUser,
}: SidebarProps) => {
  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-5">
      {/* Communities Directory Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            <span>Subject Communities</span>
          </div>
          <button
            type="button"
            id="sidebar-create-community-btn"
            onClick={onOpenCreateCommunity}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-md transition-colors cursor-pointer border border-indigo-200/60"
            title="Create a new study community"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Create</span>
          </button>
        </div>

        {/* All feed navigation */}
        <div className="space-y-1 mb-3">
          <button
            type="button"
            id="comm-item-all"
            onClick={() => onSelectCommunity(null)}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              selectedCommunityId === null
                ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200/80 shadow-xs'
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">🌐</span>
              <span>All Communities</span>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 ${selectedCommunityId === null ? 'text-indigo-600' : 'text-slate-300'}`} />
          </button>
        </div>

        {/* Subject communities list */}
        <div className="space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 px-2.5 py-1 uppercase tracking-wider">
            Subjects
          </div>
          {communities.map((comm) => {
            const isSelected = selectedCommunityId === comm.id;
            const isAdmin =
              Boolean(currentUser && comm.creatorEmail && comm.creatorEmail.toLowerCase() === currentUser.email.toLowerCase());
            return (
              <button
                key={comm.id}
                id={`comm-item-${comm.id}`}
                onClick={() => onSelectCommunity(comm.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-all ${
                  isSelected
                    ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200/80 shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base shrink-0">{comm.icon}</span>
                  <span className="truncate">{comm.name}</span>
                  {isAdmin && (
                    <span
                      title="You created & administrate this community"
                      className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold shrink-0 flex items-center gap-0.5 border border-indigo-200"
                    >
                      <ShieldCheck className="w-2.5 h-2.5 text-indigo-600" />
                      Admin
                    </span>
                  )}
                  {comm.isCustom && !isAdmin && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-medium shrink-0">
                      custom
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {comm.memberCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Add custom community button */}
        <button
          type="button"
          id="sidebar-create-community-link"
          onClick={onOpenCreateCommunity}
          className="w-full mt-3 py-2 px-3 border border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/50 hover:bg-indigo-100/70 rounded-lg text-xs font-bold text-indigo-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5 text-indigo-600" />
          Create Community
        </button>
      </div>

      {/* Community Study Activity Snapshot */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 pb-2 border-b border-slate-100">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          <span>Study Activity</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-100">
            <div className="text-base font-extrabold text-amber-900">{doubtCount}</div>
            <div className="text-[10px] font-semibold text-amber-700">Doubts</div>
          </div>
          <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100">
            <div className="text-base font-extrabold text-emerald-900">{notesCount}</div>
            <div className="text-[10px] font-semibold text-emerald-700">Notes</div>
          </div>
          <div className="p-2 rounded-lg bg-indigo-50/70 border border-indigo-100">
            <div className="text-base font-extrabold text-indigo-900">{discussionCount}</div>
            <div className="text-[10px] font-semibold text-indigo-700">Discuss</div>
          </div>
        </div>
      </div>

      {/* Community Rules / Ethos */}
      <div className="bg-slate-50 rounded-xl border border-slate-200/80 p-4 text-xs text-slate-600 space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Study Community Rules
        </div>
        <ul className="space-y-1 text-[11px] text-slate-500 list-disc list-inside">
          <li>Be clear when explaining step-by-step solutions to doubts</li>
          <li>Keep study notes concise, accurate, and properly structured</li>
          <li>Encourage respectful academic debates and inquiry</li>
        </ul>
      </div>
    </aside>
  );
};
