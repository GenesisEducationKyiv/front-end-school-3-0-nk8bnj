import { create } from "zustand";
import { SortDirection, SortField, TracksState } from "@/types/types";
import {
  fetchTracks,
  fetchGenres,
  createTrack,
  updateTrack,
  deleteTrack,
  uploadTrackFile,
  deleteTrackFile,
  deleteTracks,
} from "@/services/api";

const useTracksStore = create<TracksState>((set, get) => ({
  tracks: [],
  selectedTrack: null,
  selectedTrackIds: [],
  genres: [],
  isLoading: false,
  isCreating: false,
  isDeleting: false,
  isUploading: false,
  currentPage: 1,
  totalTracks: 0,
  totalPages: 0,
  itemsPerPage: 8,
  sort: { field: SortField.TITLE, direction: SortDirection.ASC },
  filter: { search: "", genres: [] },
  currentlyPlaying: null,

  createModalOpen: false,
  editModalOpen: false,
  deleteModalOpen: false,
  uploadModalOpen: false,
  bulkDeleteModalOpen: false,

  fetchAllTracks: async () => {
    const { currentPage, itemsPerPage, sort, filter } = get();
    set({ isLoading: true });

    const result = await fetchTracks(
      currentPage,
      itemsPerPage,
      sort.field,
      sort.direction,
      filter.search,
      filter.genres.length ? filter.genres[0] : undefined
    );

    if (result.isOk()) {
      set({
        tracks: result.value.data,
        totalTracks: result.value.meta.total,
        totalPages: result.value.meta.totalPages,
        isLoading: false,
      });
    } else {
      set({ isLoading: false });
      console.error("Failed to fetch tracks:", result.error);
    }
  },

  fetchAllGenres: async () => {
    const result = await fetchGenres();
    if (result.isOk()) {
      set({ genres: result.value });
    } else {
      console.error("Failed to fetch genres:", result.error);
      set({ genres: [] });
    }
  },

  setPage: page => {
    set({ currentPage: page });
    void get().fetchAllTracks();
  },

  setItemsPerPage: limit => {
    set({ itemsPerPage: limit, currentPage: 1 });
    void get().fetchAllTracks();
  },

  setSort: sort => {
    set({ sort });
    void get().fetchAllTracks();
  },

  setFilter: filter => {
    set({ filter, currentPage: 1 });
    void get().fetchAllTracks();
  },

  setSearch: search => {
    set({ filter: { ...get().filter, search }, currentPage: 1 });
    void get().fetchAllTracks();
  },

  createNewTrack: async data => {
    set({ isCreating: true });

    const result = await createTrack(data);

    if (result.isOk()) {
      set(state => ({
        tracks: [result.value, ...state.tracks].slice(0, state.itemsPerPage),
        isCreating: false,
        createModalOpen: false,
      }));

      void get().fetchAllTracks();
      return result.value;
    } else {
      set({ isCreating: false });
      console.error("Failed to create track:", result.error);
    }
  },

  updateSelectedTrack: async data => {
    const { selectedTrack } = get();

    if (!selectedTrack) return;

    set({ isLoading: true });
    const result = await updateTrack(selectedTrack.id, data);

    if (result.isOk()) {
      set(state => ({
        tracks: state.tracks.map(track =>
          track.id === result.value.id ? result.value : track
        ),
        isLoading: false,
        editModalOpen: false,
        selectedTrack: null,
      }));

      return result.value;
    } else {
      set({ isLoading: false });
      console.error("Failed to update track:", result.error);
    }
  },

  deleteSelectedTrack: async () => {
    const { selectedTrack } = get();

    if (!selectedTrack) return;

    set({ isDeleting: true });
    const result = await deleteTrack(selectedTrack.id);

    if (result.isOk()) {
      set(state => ({
        tracks: state.tracks.filter(track => track.id !== selectedTrack.id),
        isDeleting: false,
        deleteModalOpen: false,
        selectedTrack: null,
      }));
    } else {
      set({ isDeleting: false });
      console.error("Failed to delete track:", result.error);
    }
  },

  uploadFile: async file => {
    const { selectedTrack } = get();

    if (!selectedTrack) return;

    set({ isUploading: true });
    const result = await uploadTrackFile(selectedTrack.id, file);

    if (result.isOk()) {
      set(state => ({
        tracks: state.tracks.map(track =>
          track.id === result.value.id ? result.value : track
        ),
        isUploading: false,
        uploadModalOpen: false,
        selectedTrack: null,
      }));

      return result.value;
    } else {
      set({ isUploading: false });
      console.error("Failed to upload file:", result.error);
    }
  },

  deleteFile: async () => {
    const { selectedTrack } = get();

    if (!selectedTrack) return;

    set({ isUploading: true });
    const result = await deleteTrackFile(selectedTrack.id);

    if (result.isOk()) {
      set(state => ({
        tracks: state.tracks.map(track =>
          track.id === result.value.id ? result.value : track
        ),
        isUploading: false,
        selectedTrack: result.value,
      }));

      return result.value;
    } else {
      set({ isUploading: false });
      console.error("Failed to delete file:", result.error);
    }
  },

  toggleTrackSelection: trackId => {
    set(state => {
      const isSelected = state.selectedTrackIds.includes(trackId);
      return {
        selectedTrackIds: isSelected
          ? state.selectedTrackIds.filter(id => id !== trackId)
          : [...state.selectedTrackIds, trackId],
      };
    });
  },

  toggleAllTracksSelection: () => {
    set(state => {
      if (state.selectedTrackIds.length === state.tracks.length) {
        return { selectedTrackIds: [] };
      }
      return { selectedTrackIds: state.tracks.map(track => track.id) };
    });
  },

  clearTrackSelection: () => {
    set({ selectedTrackIds: [] });
  },

  deleteSelectedTracks: async () => {
    const { selectedTrackIds } = get();
    if (selectedTrackIds.length === 0) return;

    set({ isDeleting: true });
    const result = await deleteTracks(selectedTrackIds);

    if (result.isOk()) {
      set(state => ({
        tracks: state.tracks.filter(
          track => !result.value.success.includes(track.id)
        ),
        selectedTrackIds: [],
        isDeleting: false,
        bulkDeleteModalOpen: false,
      }));

      void get().fetchAllTracks();
    } else {
      set({ isDeleting: false });
      console.error("Failed to delete tracks:", result.error);
    }
  },

  setSelectedTrack: track => set({ selectedTrack: track }),

  openCreateModal: () => set({ createModalOpen: true }),
  closeCreateModal: () => set({ createModalOpen: false }),

  openEditModal: track => set({ editModalOpen: true, selectedTrack: track }),
  closeEditModal: () => set({ editModalOpen: false, selectedTrack: null }),

  openDeleteModal: track =>
    set({ deleteModalOpen: true, selectedTrack: track }),
  closeDeleteModal: () => set({ deleteModalOpen: false, selectedTrack: null }),

  openUploadModal: track =>
    set({ uploadModalOpen: true, selectedTrack: track }),
  closeUploadModal: () => set({ uploadModalOpen: false, selectedTrack: null }),

  openBulkDeleteModal: () => set({ bulkDeleteModalOpen: true }),
  closeBulkDeleteModal: () => set({ bulkDeleteModalOpen: false }),

  setCurrentlyPlaying: trackId => set({ currentlyPlaying: trackId }),
}));

export default useTracksStore;
