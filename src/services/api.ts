import { z } from "zod";
import { ResultAsync, ok, err } from "neverthrow";
import {
  TrackSchema,
  TrackFormDataSchema,
  ApiResponseSchema,
  GenresSchema,
  BulkDeleteResponseSchema,
  Track,
  TrackFormData,
  ApiResponse,
} from "@/types/schemas";
import { ApiError, SortDirection, SortField } from "@/types/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const safeJsonParse = <T>(
  response: Response,
  schema: z.ZodSchema<T>
): ResultAsync<T, ApiError> => {
  return ResultAsync.fromPromise(response.json(), error => ({
    message: "Failed to parse response JSON",
    status: response.status,
    details: error,
  })).andThen((json: unknown) => {
    const parsed = schema.safeParse(json);

    if (!parsed.success) {
      return err({
        message: `Invalid response format: ${parsed.error.message}`,
        status: response.status,
        details: parsed.error.errors,
      });
    }

    return ok(parsed.data);
  });
};

const safeFetch = (
  url: string,
  options?: RequestInit
): ResultAsync<Response, ApiError> => {
  return ResultAsync.fromPromise(fetch(url, options), error => ({
    message: error instanceof Error ? error.message : "Network error",
    details: error,
  }));
};

export const fetchTracks = async (
  page = 1,
  limit = 8,
  sortField?: SortField,
  sortDirection?: SortDirection,
  search?: string,
  filterGenre?: string
): Promise<ResultAsync<ApiResponse, ApiError>> => {
  let url = `${API_URL}/tracks?page=${page}&limit=${limit}`;

  if (sortField && sortDirection) {
    url += `&sort=${sortField}&order=${sortDirection}`;
  }

  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }

  if (filterGenre) {
    url += `&genre=${encodeURIComponent(filterGenre)}`;
  }

  const response = await safeFetch(url);

  if (response.isErr()) {
    return err(response.error);
  }

  return safeJsonParse(response.value, ApiResponseSchema);
};

export const fetchGenres = async (): Promise<
  ResultAsync<string[], ApiError>
> => {
  const response = await safeFetch(`${API_URL}/genres`);

  if (response.isErr()) {
    return err(response.error);
  }

  return safeJsonParse(response.value, GenresSchema);
};

export const createTrack = async (
  trackData: TrackFormData
): Promise<ResultAsync<Track, ApiError>> => {
  const validationResult = TrackFormDataSchema.safeParse(trackData);

  if (!validationResult.success) {
    return err({
      message: `Invalid track data: ${validationResult.error.message}`,
      details: validationResult.error.errors,
    });
  }

  const response = await safeFetch(`${API_URL}/tracks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validationResult.data),
  });

  if (response.isErr()) {
    return err(response.error);
  }

  return safeJsonParse(response.value, TrackSchema);
};

export const updateTrack = async (
  id: string,
  trackData: TrackFormData
): Promise<ResultAsync<Track, ApiError>> => {
  const validationResult = TrackFormDataSchema.safeParse(trackData);

  if (!validationResult.success) {
    return err({
      message: `Invalid track data: ${validationResult.error.message}`,
      details: validationResult.error.errors,
    });
  }

  const response = await safeFetch(`${API_URL}/tracks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validationResult.data),
  });

  if (response.isErr()) {
    return err(response.error);
  }

  return safeJsonParse(response.value, TrackSchema);
};

export const deleteTrack = async (
  id: string
): Promise<ResultAsync<void, ApiError>> => {
  const response = await safeFetch(`${API_URL}/tracks/${id}`, {
    method: "DELETE",
  });

  if (response.isErr()) {
    return err(response.error);
  }

  return ok(undefined);
};

export const deleteTracks = async (
  ids: string[]
): Promise<ResultAsync<{ success: string[]; failed: string[] }, ApiError>> => {
  if (ids.length === 0) {
    return err({
      message: "No track IDs provided for deletion",
    });
  }

  const response = await safeFetch(`${API_URL}/tracks/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids }),
  });

  if (response.isErr()) {
    return err(response.error);
  }

  return safeJsonParse(response.value, BulkDeleteResponseSchema);
};

export const uploadTrackFile = async (
  id: string,
  file: File
): Promise<ResultAsync<Track, ApiError>> => {
  if (!file) {
    return err({
      message: "No file provided for upload",
    });
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await safeFetch(`${API_URL}/tracks/${id}/upload`, {
    method: "POST",
    body: formData,
  });

  if (response.isErr()) {
    return err(response.error);
  }

  return safeJsonParse(response.value, TrackSchema);
};

export const deleteTrackFile = async (
  id: string
): Promise<ResultAsync<Track, ApiError>> => {
  const response = await safeFetch(`${API_URL}/tracks/${id}/file`, {
    method: "DELETE",
  });

  if (response.isErr()) {
    return err(response.error);
  }

  return safeJsonParse(response.value, TrackSchema);
};

export const fetchTrackBySlug = async (
  slug: string
): Promise<ResultAsync<Track, ApiError>> => {
  if (!slug) {
    return err({
      message: "Slug is required",
    });
  }

  const response = await safeFetch(`${API_URL}/tracks/${slug}`);
  if (response.isErr()) {
    return err(response.error);
  }

  return safeJsonParse(response.value, TrackSchema);
};
