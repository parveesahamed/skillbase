import React from 'react';

// Card Skeleton
export const ProjectCardSkeleton = () => (
  <div className="bg-white rounded-xl p-6 border border-gray-100 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
    <div className="flex gap-2 mb-4">
      <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
      <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
      <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
    </div>
    <div className="flex justify-between items-center mb-4">
      <div className="h-4 w-20 bg-gray-200 rounded"></div>
      <div className="h-4 w-16 bg-gray-200 rounded"></div>
    </div>
    <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
  </div>
);

// Stats Card Skeleton
export const StatsCardSkeleton = () => (
  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
      <div className="h-8 w-16 bg-gray-200 rounded"></div>
    </div>
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  </div>
);

// Application Card Skeleton
export const ApplicationCardSkeleton = () => (
  <div className="bg-white rounded-xl p-6 border border-gray-100 animate-pulse">
    <div className="flex justify-between items-start mb-3">
      <div>
        <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-4/5"></div>
    </div>
    <div className="flex gap-2 mb-4">
      <div className="h-6 w-16 bg-gray-200 rounded"></div>
      <div className="h-6 w-20 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// Dashboard Skeleton
export const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Skeleton */}
      <div className="mb-8 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map(i => <StatsCardSkeleton key={i} />)}
      </div>

      {/* Content Skeleton */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {[1, 2, 3].map(i => <ApplicationCardSkeleton key={i} />)}
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 border border-gray-100 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Browse Page Skeleton
export const BrowseSkeleton = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="bg-white rounded-xl p-6 mb-8 animate-pulse">
        <div className="grid md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-10 bg-gray-200 rounded"></div>)}
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => <ProjectCardSkeleton key={i} />)}
      </div>
    </div>
  </div>
);

export default {
  ProjectCardSkeleton,
  StatsCardSkeleton,
  ApplicationCardSkeleton,
  DashboardSkeleton,
  BrowseSkeleton
};
