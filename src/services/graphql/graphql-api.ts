import { ResultAsync, ok, err, errAsync } from "neverthrow";
import {
  TrackFormDataSchema,
  Track,
  TrackFormData,
  ApiResponse,
} from "@/types/schemas";
import { ApiError, SortDirection, SortField } from "@/types/types";
import {
  GET_TRACKS,
  GET_GENRES,
  GET_TRACK_BY_SLUG,
  CREATE_TRACK,
  UPDATE_TRACK,
  DELETE_TRACK,
  DELETE_TRACKS,
  DELETE_TRACK_FILE,
} from "./graphql-queries";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class SimpleGraphQLClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  query<T>(
    queryString: string,
    variables?: Record<string, unknown>
  ): ResultAsync<T, ApiError> {
    return ResultAsync.fromPromise(
      fetch(`${this.baseUrl}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: queryString,
          variables,
        }),
      }),
      error => ({
        message:
          error instanceof Error ? error.message : "Network request failed",
        details: error,
      })
    )
      .andThen(response => {
        if (!response.ok) {
          return err({
            message: `GraphQL request failed: ${response.statusText}`,
            details: response,
          });
        }
        return ok(response);
      })
      .andThen(response =>
        ResultAsync.fromPromise(
          response.json() as Promise<{
            data?: T;
            errors?: Array<{ message: string }>;
          }>,
          error => ({
            message:
              error instanceof Error
                ? error.message
                : "Failed to parse JSON response",
            details: error,
          })
        )
      )
      .andThen(result => {
        if (result.errors) {
          return err({
            message: `GraphQL errors: ${result.errors
              .map(e => e.message)
              .join(", ")}`,
            details: result.errors,
          });
        }
        if (!result.data) {
          return err({
            message: "No data returned from GraphQL query",
            details: result,
          });
        }
        return ok(result.data);
      });
  }

  mutate<T>(
    mutationString: string,
    variables?: Record<string, unknown>
  ): ResultAsync<T, ApiError> {
    return this.query<T>(mutationString, variables);
  }
}

const client = new SimpleGraphQLClient(API_URL || "");

const convertSortFieldToGraphQL = (field?: SortField): string | undefined => {
  switch (field) {
    case SortField.TITLE:
      return "TITLE";
    case SortField.ARTIST:
      return "ARTIST";
    case SortField.DURATION:
      return "DURATION";
    default:
      return undefined;
  }
};

const convertSortDirectionToGraphQL = (
  direction?: SortDirection
): string | undefined => {
  switch (direction) {
    case SortDirection.ASC:
      return "ASC";
    case SortDirection.DESC:
      return "DESC";
    default:
      return undefined;
  }
};

export const fetchTracksGraphQL = (
  page = 1,
  limit = 8,
  sortField?: SortField,
  sortDirection?: SortDirection,
  search?: string,
  filterGenre?: string
): ResultAsync<ApiResponse, ApiError> => {
  return client
    .query<{ tracks: ApiResponse }>(GET_TRACKS, {
      page,
      limit,
      sortField: convertSortFieldToGraphQL(sortField),
      sortDirection: convertSortDirectionToGraphQL(sortDirection),
      search,
      filterGenre,
    })
    .map(result => result.tracks);
};

export const fetchGenresGraphQL = (): ResultAsync<string[], ApiError> => {
  return client
    .query<{ genres: string[] }>(GET_GENRES)
    .map(result => result.genres);
};

export const createTrackGraphQL = (
  trackData: TrackFormData
): ResultAsync<Track, ApiError> => {
  const validationResult = TrackFormDataSchema.safeParse(trackData);

  if (!validationResult.success) {
    return errAsync({
      message: `Invalid track data: ${validationResult.error.message}`,
      details: validationResult.error.errors,
    });
  }

  return client
    .mutate<{ createTrack: Track }>(CREATE_TRACK, {
      trackData: validationResult.data,
    })
    .map(result => result.createTrack);
};

export const updateTrackGraphQL = (
  id: string,
  trackData: TrackFormData
): ResultAsync<Track, ApiError> => {
  const validationResult = TrackFormDataSchema.safeParse(trackData);

  if (!validationResult.success) {
    return errAsync({
      message: `Invalid track data: ${validationResult.error.message}`,
      details: validationResult.error.errors,
    });
  }

  return client
    .mutate<{ updateTrack: Track }>(UPDATE_TRACK, {
      id,
      trackData: validationResult.data,
    })
    .map(result => result.updateTrack);
};

export const deleteTrackGraphQL = (id: string): ResultAsync<void, ApiError> => {
  return client
    .mutate<{ deleteTrack: boolean }>(DELETE_TRACK, { id })
    .map(() => undefined);
};

export const deleteTracksGraphQL = (
  ids: string[]
): ResultAsync<{ success: string[]; failed: string[] }, ApiError> => {
  if (ids.length === 0) {
    return errAsync({
      message: "No track IDs provided for deletion",
    });
  }

  return client
    .mutate<{ deleteTracks: { success: string[]; failed: string[] } }>(
      DELETE_TRACKS,
      { input: { ids } }
    )
    .map(result => result.deleteTracks);
};

export const uploadTrackFileGraphQL = (
  id: string,
  file: File
): ResultAsync<Track, ApiError> => {
  if (!file) {
    return errAsync({
      message: "No file provided for upload",
    });
  }

  const formData = new FormData();
  formData.append("file", file);

  return ResultAsync.fromPromise(
    fetch(`${API_URL}/tracks/${id}/upload`, {
      method: "POST",
      body: formData,
    }),
    error => ({
      message:
        error instanceof Error ? error.message : "Network request failed",
      details: error,
    })
  )
    .andThen(response => {
      if (!response.ok) {
        return err({
          message: `Upload failed: ${response.statusText}`,
          details: response,
        });
      }
      return ok(response);
    })
    .andThen(response =>
      ResultAsync.fromPromise(response.json() as Promise<Track>, error => ({
        message:
          error instanceof Error
            ? error.message
            : "Failed to parse JSON response",
        details: error,
      }))
    );
};

export const deleteTrackFileGraphQL = (
  id: string
): ResultAsync<Track, ApiError> => {
  return client
    .mutate<{ deleteTrackFile: Track }>(DELETE_TRACK_FILE, { id })
    .map(result => result.deleteTrackFile);
};

export const fetchTrackBySlugGraphQL = (
  slug: string
): ResultAsync<Track, ApiError> => {
  if (!slug) {
    return errAsync({
      message: "Slug is required",
    });
  }

  return client
    .query<{ trackBySlug: Track }>(GET_TRACK_BY_SLUG, { slug })
    .map(result => result.trackBySlug);
};

export { client as graphqlClient };