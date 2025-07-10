import { Track } from "./schemas";

export enum SortField {
  TITLE = "title",
  ARTIST = "artist",
  DURATION = "duration",
}

export enum SortDirection {
  ASC = "asc",
  DESC = "desc",
}

export type SortValue =
  | "title-asc"
  | "title-desc"
  | "artist-asc"
  | "artist-desc"
  | "createdAt-asc"
  | "createdAt-desc";

export interface ApiError {
  message: string;
  status?: number;
  details?: unknown;
}

export interface ClientState {
  selectedTrack: Track | null;
  selectedTrackIds: string[];
  currentPage: number;
  itemsPerPage: number;
  sort: { field: SortField; direction: SortDirection };
  filter: { search: string; genres: string[] };
  currentlyPlaying: string | null;

  createModalOpen: boolean;
  editModalOpen: boolean;
  deleteModalOpen: boolean;
  uploadModalOpen: boolean;
  bulkDeleteModalOpen: boolean;

  setPage: (page: number) => void;
  setSort: (sort: { field: SortField; direction: SortDirection }) => void;
  setFilter: (filter: { search: string; genres: string[] }) => void;

  toggleTrackSelection: (trackId: string) => void;
  toggleAllTracksSelection: (tracks: Track[]) => void;
  clearTrackSelection: () => void;

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
