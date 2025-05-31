import { Track, TrackFormData } from "./schemas";

export interface SortOption {
  field: keyof Track;
  direction: "asc" | "desc";
}

export interface FilterOptions {
  search: string;
  genres: string[];
  artist?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: unknown;
}

export interface TracksState {
  tracks: Track[];
  selectedTrack: Track | null;
  selectedTrackIds: string[];
  genres: string[];
  isLoading: boolean;
  isCreating: boolean;
  isDeleting: boolean;
  isUploading: boolean;
  currentPage: number;
  totalTracks: number;
  totalPages: number;
  itemsPerPage: number;
  sort: SortOption;
  filter: FilterOptions;
  currentlyPlaying: string | null;

  createModalOpen: boolean;
  editModalOpen: boolean;
  deleteModalOpen: boolean;
  uploadModalOpen: boolean;
  bulkDeleteModalOpen: boolean;

  fetchAllTracks: () => Promise<void>;
  fetchAllGenres: () => Promise<void>;
  setPage: (page: number) => void;
  setItemsPerPage: (limit: number) => void;
  setSort: (sort: SortOption) => void;
  setFilter: (filter: FilterOptions) => void;
  setSearch: (search: string) => void;

  createNewTrack: (data: TrackFormData) => Promise<Track | undefined>;
  updateSelectedTrack: (data: TrackFormData) => Promise<Track | undefined>;
  deleteSelectedTrack: () => Promise<void>;
  uploadFile: (file: File) => Promise<Track | undefined>;
  deleteFile: () => Promise<Track | undefined>;

  toggleTrackSelection: (trackId: string) => void;
  toggleAllTracksSelection: () => void;
  clearTrackSelection: () => void;
  deleteSelectedTracks: () => Promise<void>;

  setSelectedTrack: (track: Track | null) => void;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (track: Track) => void;
  closeEditModal: () => void;
  openDeleteModal: (track: Track) => void;
  closeDeleteModal: () => void;
  openUploadModal: (track: Track) => void;
  closeUploadModal: () => void;
  openBulkDeleteModal: () => void;
  closeBulkDeleteModal: () => void;
  setCurrentlyPlaying: (trackId: string | null) => void;
}
