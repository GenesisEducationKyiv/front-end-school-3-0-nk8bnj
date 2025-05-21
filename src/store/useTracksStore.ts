import { create } from "zustand";
import { TracksState } from "@/types";
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
  sort: { field: "title", direction: "asc" },
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

    try {
      const response = await fetchTracks(
        currentPage,
        itemsPerPage,
        sort.field as string,
        sort.direction,
        filter.search,
        filter.genres.length ? filter.genres[0] : undefined,
      );

      set({
        tracks: response.data,
        totalTracks: response.meta.total,
        totalPages: response.meta.totalPages,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      console.error("Failed to fetch tracks:", error);
    }
  },

  fetchAllGenres: async () => {
    try {
      const genres = await fetchGenres();
      set({ genres });
    } catch (error) {
      console.error("Failed to fetch genres:", error);
    }
  },

  setPage: (page) => {
    set({ currentPage: page });
    get().fetchAllTracks();
  },

  setItemsPerPage: (limit) => {
    set({ itemsPerPage: limit, currentPage: 1 });
    get().fetchAllTracks();
  },

  setSort: (sort) => {
    set({ sort });
    get().fetchAllTracks();
  },

  setFilter: (filter) => {
    set({ filter, currentPage: 1 });
    get().fetchAllTracks();
  },

  setSearch: (search) => {
    set({ filter: { ...get().filter, search }, currentPage: 1 });
    get().fetchAllTracks();
  },

  createNewTrack: async (data) => {
    set({ isCreating: true });

    try {
      const newTrack = await createTrack(data);
      set((state) => ({
        tracks: [newTrack, ...state.tracks].slice(0, state.itemsPerPage),
        isCreating: false,
        createModalOpen: false,
      }));

      get().fetchAllTracks();
      return newTrack;
    } catch (error) {
      set({ isCreating: false });
      console.error("Failed to create track:", error);
    }
  },

  updateSelectedTrack: async (data) => {
    const { selectedTrack } = get();
    if (!selectedTrack) return;

    set({ isLoading: true });

    try {
      const updatedTrack = await updateTrack(selectedTrack.id, data);
      set((state) => ({
        tracks: state.tracks.map((track) =>
          track.id === updatedTrack.id ? updatedTrack : track,
        ),
        isLoading: false,
        editModalOpen: false,
        selectedTrack: null,
      }));

      return updatedTrack;
    } catch (error) {
      set({ isLoading: false });
      console.error("Failed to update track:", error);
    }
  },

  deleteSelectedTrack: async () => {
    const { selectedTrack } = get();
    if (!selectedTrack) return;

    set({ isDeleting: true });

    try {
      await deleteTrack(selectedTrack.id);
      set((state) => ({
        tracks: state.tracks.filter((track) => track.id !== selectedTrack.id),
        isDeleting: false,
        deleteModalOpen: false,
        selectedTrack: null,
      }));
    } catch (error) {
      set({ isDeleting: false });
      console.error("Failed to delete track:", error);
    }
  },

  uploadFile: async (file) => {
    const { selectedTrack } = get();
    if (!selectedTrack) return;

    set({ isUploading: true });

    try {
      const updatedTrack = await uploadTrackFile(selectedTrack.id, file);
      set((state) => ({
        tracks: state.tracks.map((track) =>
          track.id === updatedTrack.id ? updatedTrack : track,
        ),
        isUploading: false,
        uploadModalOpen: false,
        selectedTrack: null,
      }));

      return updatedTrack;
    } catch (error) {
      set({ isUploading: false });
      console.error("Failed to upload file:", error);
      throw error;
    }
  },

  deleteFile: async () => {
    const { selectedTrack } = get();
    if (!selectedTrack) return;

    set({ isUploading: true });

    try {
      const updatedTrack = await deleteTrackFile(selectedTrack.id);
      set((state) => ({
        tracks: state.tracks.map((track) =>
          track.id === updatedTrack.id ? updatedTrack : track,
        ),
        isUploading: false,
        selectedTrack: updatedTrack,
      }));

      return updatedTrack;
    } catch (error) {
      set({ isUploading: false });
      console.error("Failed to delete file:", error);
    }
  },

  toggleTrackSelection: (trackId) => {
    set((state) => {
      const isSelected = state.selectedTrackIds.includes(trackId);
      return {
        selectedTrackIds: isSelected
          ? state.selectedTrackIds.filter((id) => id !== trackId)
          : [...state.selectedTrackIds, trackId],
      };
    });
  },

  toggleAllTracksSelection: () => {
    set((state) => {
      if (state.selectedTrackIds.length === state.tracks.length) {
        return { selectedTrackIds: [] };
      }
      return { selectedTrackIds: state.tracks.map((track) => track.id) };
    });
  },

  clearTrackSelection: () => {
    set({ selectedTrackIds: [] });
  },

  deleteSelectedTracks: async () => {
    const { selectedTrackIds } = get();
    if (selectedTrackIds.length === 0) return;

    set({ isDeleting: true });

    try {
      const result = await deleteTracks(selectedTrackIds);

      set((state) => ({
        tracks: state.tracks.filter(
          (track) => !result.success.includes(track.id),
        ),
        selectedTrackIds: [],
        isDeleting: false,
        bulkDeleteModalOpen: false,
      }));

      get().fetchAllTracks();
    } catch (error) {
      set({ isDeleting: false });
      console.error("Failed to delete tracks:", error);
    }
  },

  setSelectedTrack: (track) => set({ selectedTrack: track }),

  openCreateModal: () => set({ createModalOpen: true }),
  closeCreateModal: () => set({ createModalOpen: false }),

  openEditModal: (track) => set({ editModalOpen: true, selectedTrack: track }),
  closeEditModal: () => set({ editModalOpen: false, selectedTrack: null }),

  openDeleteModal: (track) =>
    set({ deleteModalOpen: true, selectedTrack: track }),
  closeDeleteModal: () => set({ deleteModalOpen: false, selectedTrack: null }),

  openUploadModal: (track) =>
    set({ uploadModalOpen: true, selectedTrack: track }),
  closeUploadModal: () => set({ uploadModalOpen: false, selectedTrack: null }),

  openBulkDeleteModal: () => set({ bulkDeleteModalOpen: true }),
  closeBulkDeleteModal: () => set({ bulkDeleteModalOpen: false }),

  setCurrentlyPlaying: (trackId) => set({ currentlyPlaying: trackId }),
}));

export default useTracksStore;
