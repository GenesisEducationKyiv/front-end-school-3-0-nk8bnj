"use client";

import { useEffect, useState } from "react";
import { Music, Plus, Search, Trash2, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { O } from "@mobily/ts-belt";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useTracksStore from "@/store/useTracksStore";
import TrackCard from "./TrackCard";
import { useDebounce } from "@/hooks/useDebounce";
import Pagination from "./Pagination";
import { Checkbox } from "./ui/checkbox";
import { SortDirection, SortField, SortValue } from "@/types/types";

const TrackList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    tracks,
    genres,
    isLoading,
    currentPage,
    totalPages,
    fetchAllGenres,
    setPage,
    setSort,
    setFilter,
    openCreateModal,
    openBulkDeleteModal,
    selectedTrackIds,
    toggleAllTracksSelection,
  } = useTracksStore();

  const getParam = (key: string) => O.fromNullable(searchParams.get(key));
  const initialSearch = O.getWithDefault(getParam("search"), "");

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    const currentSearch = O.getWithDefault(getParam("search"), "");
    const currentGenre = O.getWithDefault(getParam("genre"), "all");
    const currentSort = O.getWithDefault(getParam("sort"), "title-asc");
    const currentPage = O.getWithDefault(
      O.map(getParam("page"), (p) => parseInt(p, 10)),
      1
    );

    setSearchTerm(currentSearch);

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

  useEffect(() => {
    updateQueryParams({ search: debouncedSearch });
  }, [debouncedSearch]);

  useEffect(() => {
    void fetchAllGenres();
  }, [fetchAllGenres]);

  const updateQueryParams = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "all" && !(key === "sort" && value === "title-asc")) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    const page = newParams.get("page");
    if (page === "1") {
      newParams.delete("page");
    }

    const newUrl = `${window.location.pathname}${newParams.toString() ? `?${newParams.toString()}` : ""
      }`;

    router.push(newUrl);
  };

  const handleSortChange = (value: SortValue) => {
    updateQueryParams({ sort: value, page: "1" });
  };

  const handleGenreChange = (value: string) => {
    updateQueryParams({ genre: value, page: "1" });
  };

  const handlePageChange = (page: number) => {
    updateQueryParams({ page: page.toString() });
  };

  const clearFilters = () => {
    setSearchTerm("");
    updateQueryParams({
      search: "",
      genre: "all",
      sort: "title-asc",
      page: "1",
    });
  };

  const areAllTracksSelected =
    tracks.length > 0 && selectedTrackIds.length === tracks.length;
  const areSomeTracksSelected = selectedTrackIds.length > 0;

  const hasActiveFilters =
    O.isSome(getParam("search")) ||
    O.getWithDefault(O.map(getParam("genre"), genre => genre !== "all"), false) ||
    O.getWithDefault(O.map(getParam("sort"), sort => sort !== "title-asc"), false);

  return (
    <div className="container max-w-7xl py-8 px-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <h1
          className="text-3xl font-bold flex items-center"
          data-testid="tracks-header"
        >
          <Music className="mr-2 h-8 w-8" /> Track Manager
        </h1>

        <div className="flex items-center gap-2">
          <Button onClick={openCreateModal} data-testid="create-track-button">
            <Plus className="mr-2 h-4 w-4" /> Create Track
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
        <div className="relative w-full md:w-auto flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tracks..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="search-input"
          />
        </div>

        <div className="flex gap-4 w-full md:w-auto flex-wrap">
          <Select
            value={O.getWithDefault(getParam("sort"), "title-asc")}
            onValueChange={handleSortChange}
          >
            <SelectTrigger
              className="w-full md:w-[180px]"
              data-testid="sort-select"
            >
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
              <SelectItem value="artist-asc">Artist (A-Z)</SelectItem>
              <SelectItem value="artist-desc">Artist (Z-A)</SelectItem>
              <SelectItem value="createdAt-desc">Newest First</SelectItem>
              <SelectItem value="createdAt-asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={O.getWithDefault(getParam("genre"), "all")}
            onValueChange={handleGenreChange}
          >
            <SelectTrigger
              className="w-full md:w-[180px]"
              data-testid="filter-genre"
            >
              <SelectValue placeholder="Filter by genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="icon"
              onClick={clearFilters}
              className="md:w-[40px] h-10"
              data-testid="clear-filters"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div
          className="flex justify-center items-center h-64"
          data-testid="loading-tracks"
          data-loading="true"
        >
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
            data-testid="loading-indicator"
          ></div>
        </div>
      ) : tracks.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-lg">
          <Music className="h-12 w-12 mx-auto text-muted-foreground" />
          <h2 className="mt-4 text-xl font-medium">No tracks found</h2>
          <p className="mt-2 text-muted-foreground">
            {O.isSome(getParam("search")) || O.isSome(getParam("genre"))
              ? "Try adjusting your search or filters"
              : "Add your first track to get started"}
          </p>
          <Button
            className="mt-4"
            onClick={openCreateModal}
            data-testid="create-track-button"
          >
            <Plus className="mr-2 h-4 w-4" /> Create Track
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-4 min-h-[36px] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={areAllTracksSelected}
                onCheckedChange={toggleAllTracksSelection}
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
