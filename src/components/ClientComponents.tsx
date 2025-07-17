"use client";

import dynamic from "next/dynamic";

export const DynamicModals = dynamic(() => import("./modals/Modals"), {
  loading: () => <div />,
  ssr: false,
});

export const DynamicTrackList = dynamic(() => import("./TrackList"), {
  loading: () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-18 w-18 border-b-2 border-primary"></div>
    </div>
  ),
  ssr: true,
});

export const DynamicHeader = dynamic(() => import("./Header"), {
  loading: () => (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="h-12 bg-gray-200 rounded animate-pulse w-64"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="h-10 bg-gray-200 rounded animate-pulse flex-grow"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse w-48"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse w-48"></div>
      </div>
    </div>
  ),
  ssr: false,
}); 