import React from 'react';

export const SkeletonCard: React.FC = () => (
  <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-slate-700" />
      <div className="flex-1">
        <div className="h-4 bg-slate-700 rounded w-3/4 mb-2" />
        <div className="h-3 bg-slate-700/60 rounded w-1/2" />
      </div>
    </div>
    <div className="h-2 bg-slate-700 rounded-full mb-3" />
    <div className="h-3 bg-slate-700/60 rounded w-1/3" />
  </div>
);

export const SkeletonRow: React.FC = () => (
  <div className="flex items-center gap-4 py-3 animate-pulse">
    <div className="h-4 bg-slate-700 rounded w-1/4" />
    <div className="h-4 bg-slate-700/60 rounded w-1/3" />
    <div className="h-4 bg-slate-700/40 rounded w-1/5" />
    <div className="h-6 bg-slate-700 rounded-full w-16 ml-auto" />
  </div>
);

export const PageSkeleton: React.FC = () => (
  <div className="space-y-4 animate-fadeIn">
    <div className="h-8 bg-slate-700 rounded-xl w-1/3 animate-pulse" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
    </div>
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 animate-pulse">
      <div className="h-5 bg-slate-700 rounded w-1/4 mb-4" />
      {[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}
    </div>
  </div>
);
