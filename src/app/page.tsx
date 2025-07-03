import { Suspense } from "react";
import TrackList from "@/components/TrackList";
import Modals from "@/components/modals/Modals";

function TrackListFallback() {
  return (
    <div className="container max-w-7xl py-8 px-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          Track Manager
        </h1>
      </div>
      <div className="text-center py-8">Loading tracks...</div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <Suspense fallback={<TrackListFallback />}>
        <TrackList />
      </Suspense>
      <Modals />
    </main>
  );
}