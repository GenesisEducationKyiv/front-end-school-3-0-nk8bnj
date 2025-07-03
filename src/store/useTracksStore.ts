import { create } from "zustand";
import { SortDirection, SortField, ClientState } from "@/types/types";
import { Track } from "@/types/schemas";

const useTracksStore = create<ClientState>(set => ({
  selectedTrack: null,
  selectedTrackIds: [],
  currentPage: 1,
  itemsPerPage: 8,
  sort: { field: SortField.TITLE, direction: SortDirection.ASC },
  filter: { search: "", genres: [] },
  currentlyPlaying: null,

  createModalOpen: false,
  editModalOpen: false,
  deleteModalOpen: false,
  uploadModalOpen: false,
  bulkDeleteModalOpen: false,

  setPage: page => {
    set({ currentPage: page });
  },

  setSort: sort => {
    set({ sort });
  },

  setFilter: filter => {
    set({ filter, currentPage: 1 });
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

  toggleAllTracksSelection: (tracks: Track[]) => {
    set(state => {
      if (state.selectedTrackIds.length === tracks.length) {
        return { selectedTrackIds: [] };
      }
      return { selectedTrackIds: tracks.map(track => track.id) };
    });
  },

  clearTrackSelection: () => {
    set({ selectedTrackIds: [] });
  },

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
