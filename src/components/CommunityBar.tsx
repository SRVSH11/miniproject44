import { Plus, Compass, Sparkles } from 'lucide-react';
import { Community } from '../types';

interface CommunityBarProps {
  communities: Community[];
  selectedCommunityId: string | null;
  onSelectCommunity: (communityId: string | null) => void;
  onOpenCreateCommunity: () => void;
}

export const CommunityBar = ({
  communities,
  selectedCommunityId,
  onSelectCommunity,
  onOpenCreateCommunity,
}: CommunityBarProps) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-xs mb-5">
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
          <Compass className="w-3.5 h-3.5 text-indigo-600" />
          <span>Subject Communities & Circles</span>
        </div>
        <button
          type="button"
          id="bar-create-community-btn"
          onClick={onOpenCreateCommunity}
          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer border border-indigo-200/60"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Community</span>
        </button>
      </div>

      {/* Horizontally scrollable community pills */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-slate-200">
        {/* All Communities Pill */}
        <button
          type="button"
          id="bar-community-all"
          onClick={() => onSelectCommunity(null)}
          className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            selectedCommunityId === null
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <span className="text-sm">🌐</span>
          <span>All ({communities.length})</span>
        </button>

        {/* Individual Communities */}
        {communities.map((comm) => {
          const isSelected = selectedCommunityId === comm.id;
          return (
            <button
              key={comm.id}
              id={`bar-comm-${comm.id}`}
              onClick={() => onSelectCommunity(comm.id)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <span className="text-sm shrink-0">{comm.icon}</span>
              <span className="whitespace-nowrap">{comm.name}</span>
              {comm.isCustom && (
                <span
                  className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                    isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  custom
                </span>
              )}
            </button>
          );
        })}

        {/* Plus Community End Pill */}
        <button
          type="button"
          id="bar-comm-add-pill"
          onClick={onOpenCreateCommunity}
          className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 border border-dashed border-slate-300 hover:border-indigo-300 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Circle</span>
        </button>
      </div>
    </div>
  );
};
