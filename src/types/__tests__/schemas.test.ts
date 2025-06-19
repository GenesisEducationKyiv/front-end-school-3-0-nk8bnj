import { describe, it, expect } from 'vitest'
import {
  TrackFormDataSchema,
  TrackSchema,
  ApiResponseSchema,
  GenresSchema,
  BulkDeleteResponseSchema
} from '../schemas'

describe('TrackFormDataSchema', () => {
  it('should validate valid track form data', () => {
    const validData = {
      title: 'Test Track',
      artist: 'Test Artist',
      album: 'Test Album',
      genres: ['rock', 'pop'],
      coverImage: 'https://example.com/image.jpg'
    }

    const result = TrackFormDataSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(validData)
    }
  })

  it('should validate minimal valid data', () => {
    const validData = {
      title: 'Test Track',
      artist: 'Test Artist',
      genres: []
    }

    const result = TrackFormDataSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should accept empty string for coverImage', () => {
    const validData = {
      title: 'Test Track',
      artist: 'Test Artist',
      genres: ['rock'],
      coverImage: ''
    }

    const result = TrackFormDataSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject empty title', () => {
    const invalidData = {
      title: '',
      artist: 'Test Artist',
      genres: ['rock']
    }

    const result = TrackFormDataSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Title is required')
    }
  })

  it('should reject empty artist', () => {
    const invalidData = {
      title: 'Test Track',
      artist: '',
      genres: ['rock']
    }

    const result = TrackFormDataSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Artist is required')
    }
  })

  it('should reject invalid URL for coverImage', () => {
    const invalidData = {
      title: 'Test Track',
      artist: 'Test Artist',
      genres: ['rock'],
      coverImage: 'not-a-url'
    }

    const result = TrackFormDataSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Cover image must be a valid URL')
    }
  })

  it('should reject missing required fields', () => {
    const invalidData = {
      title: 'Test Track'
    }

    const result = TrackFormDataSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should handle optional album field', () => {
    const dataWithAlbum = {
      title: 'Test Track',
      artist: 'Test Artist',
      album: 'Test Album',
      genres: ['rock']
    }

    const dataWithoutAlbum = {
      title: 'Test Track',
      artist: 'Test Artist',
      genres: ['rock']
    }

    expect(TrackFormDataSchema.safeParse(dataWithAlbum).success).toBe(true)
    expect(TrackFormDataSchema.safeParse(dataWithoutAlbum).success).toBe(true)
  })
})

describe('TrackSchema', () => {
  it('should validate complete track data', () => {
    const validTrack = {
      id: '123',
      title: 'Test Track',
      artist: 'Test Artist',
      album: 'Test Album',
      genres: ['rock'],
      slug: 'test-track',
      coverImage: 'https://example.com/image.jpg',
      audioFile: 'https://example.com/audio.mp3',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    }

    const result = TrackSchema.safeParse(validTrack)
    expect(result.success).toBe(true)
  })

  it('should validate track with optional fields missing', () => {
    const validTrack = {
      id: '123',
      title: 'Test Track',
      artist: 'Test Artist',
      genres: ['rock'],
      slug: 'test-track',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    }

    const result = TrackSchema.safeParse(validTrack)
    expect(result.success).toBe(true)
  })

  it('should reject missing required fields', () => {
    const invalidTrack = {
      title: 'Test Track'
    }

    const result = TrackSchema.safeParse(invalidTrack)
    expect(result.success).toBe(false)
  })
})

describe('ApiResponseSchema', () => {
  it('should validate proper API response', () => {
    const validResponse = {
      data: [
        {
          id: '1',
          title: 'Track 1',
          artist: 'Artist 1',
          genres: ['rock'],
          slug: 'track-1',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z'
        }
      ],
      meta: {
        total: 1,
        page: 1,
        limit: 8,
        totalPages: 1
      }
    }

    const result = ApiResponseSchema.safeParse(validResponse)
    expect(result.success).toBe(true)
  })

  it('should reject invalid meta structure', () => {
    const invalidResponse = {
      data: [],
      meta: {
        total: 1
      }
    }

    const result = ApiResponseSchema.safeParse(invalidResponse)
    expect(result.success).toBe(false)
  })
})

describe('GenresSchema', () => {
  it('should validate array of strings', () => {
    const genres = ['rock', 'pop', 'jazz', 'classical']
    const result = GenresSchema.safeParse(genres)
    expect(result.success).toBe(true)
  })

  it('should validate empty array', () => {
    const genres: string[] = []
    const result = GenresSchema.safeParse(genres)
    expect(result.success).toBe(true)
  })

  it('should reject non-array values', () => {
    const notAnArray = 'rock'
    const result = GenresSchema.safeParse(notAnArray)
    expect(result.success).toBe(false)
  })

  it('should reject array with non-string values', () => {
    const invalidGenres = ['rock', 123, 'pop']
    const result = GenresSchema.safeParse(invalidGenres)
    expect(result.success).toBe(false)
  })
})

describe('BulkDeleteResponseSchema', () => {
  it('should validate bulk delete response', () => {
    const validResponse = {
      success: ['1', '2', '3'],
      failed: ['4', '5']
    }

    const result = BulkDeleteResponseSchema.safeParse(validResponse)
    expect(result.success).toBe(true)
  })

  it('should validate response with empty arrays', () => {
    const validResponse = {
      success: [],
      failed: []
    }

    const result = BulkDeleteResponseSchema.safeParse(validResponse)
    expect(result.success).toBe(true)
  })

  it('should reject missing fields', () => {
    const invalidResponse = {
      success: ['1', '2']
    }

    const result = BulkDeleteResponseSchema.safeParse(invalidResponse)
    expect(result.success).toBe(false)
  })
}) 
