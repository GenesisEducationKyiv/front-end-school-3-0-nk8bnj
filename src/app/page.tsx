import { Suspense } from "react";
import TrackList from "@/components/TrackList";
import Modals from "@/components/modals/Modals";

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <Suspense fallback={<div>Loading tracks...</div>}>
        <TrackList />
      </Suspense>
      <Modals />
    </main>
  );
}
