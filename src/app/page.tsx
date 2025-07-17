import { Suspense } from "react";
import { DynamicTrackList, DynamicModals } from "@/components/ClientComponents";
import Loader from "@/components/Loader";

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <Suspense fallback={<Loader />}>
        <DynamicTrackList />
      </Suspense>
      <DynamicModals />
    </main>
  );
}
