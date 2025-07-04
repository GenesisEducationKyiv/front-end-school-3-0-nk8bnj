"use client";

import { useEffect } from "react";
import { Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { O, pipe } from "@mobily/ts-belt";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import useTracksStore from "@/store/useTracksStore";
import { useTracksQuery } from "@/hooks/useTracksQueries";
import { Checkbox } from "./ui/checkbox";
import { SortDirection, SortField } from "@/types/types";
import EmptyState from "./EmptyState";
import Loader from "./Loader";

const TrackCard = dynamic(() => import("./TrackCard"), {
  loading: () => (
    <div className="bg-card rounded-lg border p-4 animate-pulse">
      <div className="aspect-square bg-gray-200 rounded mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  ),
  ssr: true,
});

const Pagination = dynamic(() => import("./Pagination"), {
  loading: () => (
    <div className="flex justify-center items-center gap-2 py-4">
      <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
    </div>
  ),
  ssr: false,
});

const TrackList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = useTracksStore((state) => state.currentPage);
  const itemsPerPage = useTracksStore((state) => state.itemsPerPage);
  const sort = useTracksStore((state) => state.sort);
  const filter = useTracksStore((state) => state.filter);
  const setPage = useTracksStore((state) => state.setPage);
  const setSort = useTracksStore((state) => state.setSort);
  const setFilter = useTracksStore((state) => state.setFilter);
  const openCreateModal = useTracksStore((state) => state.openCreateModal);
  const openBulkDeleteModal = useTracksStore((state) => state.openBulkDeleteModal);
  const selectedTrackIds = useTracksStore((state) => state.selectedTrackIds);
  const toggleAllTracksSelection = useTracksStore((state) => state.toggleAllTracksSelection);
  const clearTrackSelection = useTracksStore((state) => state.clearTrackSelection);
  

  const getParam = (key: string) => O.fromNullable(searchParams.get(key));

  const { data: tracksData, isLoading } = useTracksQuery(
    currentPage,
    itemsPerPage,
    sort.field,
    sort.direction,
    filter.search || undefined,
    filter.genres.length > 0 ? filter.genres[0] : undefined
  );

  const tracks = tracksData?.data || [];
  const totalPages = tracksData?.meta?.totalPages || 1;

  useEffect(() => {
    const currentSearch = O.getWithDefault(getParam("search"), "");
    const currentGenre = O.getWithDefault(getParam("genre"), "all");
    const currentSort = O.getWithDefault(getParam("sort"), "title-asc");
    const currentPage = pipe(
      getParam("page"),
      O.map((p) => parseInt(p, 10)),
      O.getWithDefault<number>(1)
    );

    setFilter({
      search: currentSearch,
      genres: currentGenre !== "all" ? [currentGenre] : [],
    });

    const [field, direction] = currentSort.split("-");
    setSort({
      field: field as SortField,
      direction: direction as SortDirection,
    });

    setPage(currentPage);

  }, [searchParams, setFilter, setSort, setPage]);

  const updateQueryParams = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      const isDefaultValue = !value || value === "all" || (key === "sort" && value === "title-asc");

      if (isDefaultValue) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });

    const page = newParams.get("page");
    if (page === "1") {
      newParams.delete("page");
    }

    const newParamsString = newParams.toString() ? `?${newParams.toString()}` : "";
    const newUrl = `${window.location.pathname}${newParamsString}`;

    router.push(newUrl);
  };

  const handlePageChange = (page: number) => {
    clearTrackSelection();
    updateQueryParams({ page: page.toString() });
  };

  const areAllTracksSelected =
    tracks.length > 0 && selectedTrackIds.length === tracks.length;
  const areSomeTracksSelected = selectedTrackIds.length > 0;

  const hasActiveFilters =
    O.isSome(getParam("search")) ||
    O.getWithDefault(O.map(getParam("genre"), genre => genre !== "all"), false) ||
    O.getWithDefault(O.map(getParam("sort"), sort => sort !== "title-asc"), false);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container max-w-7xl">
      {tracks.length === 0 ? (
        <EmptyState
          hasFilters={hasActiveFilters}
          onCreateTrack={openCreateModal}
        />
      ) : (
        <>
          <div className="mb-4 min-h-[36px] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={areAllTracksSelected}
                onCheckedChange={() => toggleAllTracksSelection(tracks)}
                id="select-all"
                data-testid="select-all"
              />
              <label htmlFor="select-all" className="text-sm cursor-pointer">
                {areAllTracksSelected ? "Deselect all" : "Select all"}
              </label>
            </div>
            {areSomeTracksSelected && (
              <Button
                variant="destructive"
                onClick={openBulkDeleteModal}
                size="sm"
                data-testid="bulk-delete-button"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete selected (
                {selectedTrackIds.length})
              </Button>
            )}
          </div>
          <div className="tracks-grid">
            {tracks.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        </>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setPage={handlePageChange}
      />
    </div>
  );
};

export default TrackList;
