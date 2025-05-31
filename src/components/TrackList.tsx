"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Music, Plus, Search, Trash2 } from "lucide-react";
import useTracksStore from "@/store/useTracksStore";
import TrackCard from "./TrackCard";
import { useDebounce } from "@/hooks/useDebounce";
import Pagination from "./Pagination";
import { Track } from "@/types/schemas";
import { Checkbox } from "./ui/checkbox";

const TrackList = () => {
  const {
    tracks,
    genres,
    isLoading,
    currentPage,
    totalPages,
    fetchAllTracks,
    fetchAllGenres,
    setPage,
    setSort,
    filter,
    setFilter,
    setSearch,
    openCreateModal,
    openBulkDeleteModal,
    selectedTrackIds,
    toggleAllTracksSelection,
  } = useTracksStore();

  const [searchTerm, setSearchTerm] = useState(filter.search);
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  useEffect(() => {
    void fetchAllTracks();
    void fetchAllGenres();
  }, [fetchAllTracks, fetchAllGenres]);

  const handleSortChange = (value: string) => {
    const [field, direction] = value.split("-");
    setSort({
      field: field as keyof Track,
      direction: direction as "asc" | "desc",
    });
  };

  const handleGenreChange = (value: string) => {
    setFilter({
      ...filter,
      genres: value === "all" ? [] : [value],
    });
  };

  const areAllTracksSelected =
    tracks.length > 0 && selectedTrackIds.length === tracks.length;
  const areSomeTracksSelected = selectedTrackIds.length > 0;

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

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
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
          <Select defaultValue="title-asc" onValueChange={handleSortChange}>
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

          <Select defaultValue="all" onValueChange={handleGenreChange}>
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
            {filter.search || filter.genres.length || filter.artist
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
        setPage={setPage}
      />
    </div>
  );
};

export default TrackList;
