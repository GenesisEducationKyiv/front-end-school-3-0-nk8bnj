import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchTracks,
  fetchGenres,
  createTrack,
  updateTrack,
  deleteTrack,
  uploadTrackFile,
  deleteTrackFile,
  bulkDelete,
} from "@/services/api";
import { SortDirection, SortField } from "@/types/types";

export const tracksKeys = {
  all: ["tracks"] as const,
  lists: () => [...tracksKeys.all, "list"] as const,
  list: (
    page: number,
    limit: number,
    sort: string,
    direction: string,
    search?: string,
    genre?: string
  ) =>
    [
      ...tracksKeys.lists(),
      { page, limit, sort, direction, search, genre },
    ] as const,
  genres: ["genres"] as const,
};

export const useTracksQuery = (
  page: number,
  itemsPerPage: number,
  sortField: SortField,
  sortDirection: SortDirection,
  search?: string,
  genre?: string
) => {
  return useQuery({
    queryKey: tracksKeys.list(
      page,
      itemsPerPage,
      sortField,
      sortDirection,
      search,
      genre
    ),
    queryFn: async () => {
      const result = await fetchTracks(
        page,
        itemsPerPage,
        sortField,
        sortDirection,
        search,
        genre
      );
      if (result.isOk()) {
        return result.value;
      }
      throw new Error(result.error.message);
    },
  });
};

export const useGenresQuery = () => {
  return useQuery({
    queryKey: tracksKeys.genres,
    queryFn: async () => {
      const result = await fetchGenres();
      if (result.isOk()) {
        return result.value;
      }
      throw new Error(result.error.message);
    },
  });
};

export const useCreateTrackMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      artist: string;
      genres: string[];
      album?: string;
      coverImage?: string;
    }) => {
      const result = await createTrack(data);
      if (result.isOk()) {
        return result.value;
      }
      throw new Error(result.error.message);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tracksKeys.lists() });
    },
  });
};

export const useUpdateTrackMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        title: string;
        artist: string;
        genres: string[];
        album?: string;
        coverImage?: string;
      };
    }) => {
      const result = await updateTrack(id, data);
      if (result.isOk()) {
        return result.value;
      }
      throw new Error(result.error.message);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tracksKeys.lists() });
    },
  });
};

export const useDeleteTrackMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteTrack(id);
      if (result.isOk()) {
        return result.value;
      }
      throw new Error(result.error.message);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tracksKeys.lists() });
    },
  });
};

export const useUploadTrackFileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const result = await uploadTrackFile(id, file);
      if (result.isOk()) {
        return result.value;
      }
      throw new Error(result.error.message);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tracksKeys.lists() });
    },
  });
};

export const useDeleteTrackFileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteTrackFile(id);
      if (result.isOk()) {
        return result.value;
      }
      throw new Error(result.error.message);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tracksKeys.lists() });
    },
  });
};

export const useBulkDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const result = await bulkDelete(ids);
      if (result.isOk()) {
        return result.value;
      }
      throw new Error(result.error.message);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tracksKeys.lists() });
    },
  });
};
