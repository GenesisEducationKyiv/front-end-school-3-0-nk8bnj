import { z } from "zod";

export const TrackSchema = z.object({
  id: z.string(),
  title: z.string(),
  artist: z.string(),
  album: z.string().optional(),
  genres: z.array(z.string()),
  slug: z.string(),
  coverImage: z.string().optional(),
  audioFile: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const TrackFormDataSchema = z.object({
  title: z.string().min(1, "Title is required"),
  artist: z.string().min(1, "Artist is required"),
  album: z.string().optional(),
  genres: z.array(z.string()),
  coverImage: z
    .string()
    .url("Cover image must be a valid URL")
    .optional()
    .or(z.literal("")),
});

export const ApiResponseSchema = z.object({
  data: z.array(TrackSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
});

export const GenresSchema = z.array(z.string());

export const BulkDeleteResponseSchema = z.object({
  success: z.array(z.string()),
  failed: z.array(z.string()),
});

export type Track = z.infer<typeof TrackSchema>;
export type TrackFormData = z.infer<typeof TrackFormDataSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;
