import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createTrack, fetchTracks, updateTrack, deleteTrack, fetchGenres, bulkDelete } from '../api'
import { TrackFormData } from '@/types/schemas'
import { SortField, SortDirection } from '@/types/types'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001/api'
  })

  describe('createTrack', () => {
    it('should validate input data before making request', async () => {
      const invalidData = {
        title: '',
        artist: '',
        genres: []
      } as TrackFormData

      const result = await createTrack(invalidData)

      expect(result.isErr()).toBe(true)
      expect(mockFetch).not.toHaveBeenCalled()

      if (result.isErr()) {
        expect(result.error.message).toContain('Invalid track data')
      }
    })

    it('should make correct API call with valid data', async () => {
      const validData: TrackFormData = {
        title: 'Test Track',
        artist: 'Test Artist',
        genres: ['rock'],
        album: 'Test Album',
        coverImage: 'https://example.com/image.jpg'
      }

      const mockResponse = {
        id: '123',
        title: 'Test Track',
        artist: 'Test Artist',
        genres: ['rock'],
        slug: 'test-track',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      }

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockResponse)
      })

      const result = await createTrack(validData)

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/tracks',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: expect.stringContaining('Test Track') as string,
        })
      )

      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        expect(result.value.title).toBe('Test Track')
      }
    })

    it('should handle network errors', async () => {
      const validData: TrackFormData = {
        title: 'Test Track',
        artist: 'Test Artist',
        genres: ['rock']
      }

      mockFetch.mockRejectedValue(new Error('Network error'))

      const result = await createTrack(validData)

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.message).toBe('Network error')
      }
    })

    it('should handle invalid JSON response', async () => {
      const validData: TrackFormData = {
        title: 'Test Track',
        artist: 'Test Artist',
        genres: ['rock']
      }

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON'))
      })

      const result = await createTrack(validData)

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.message).toBe('Failed to parse response JSON')
      }
    })

    it('should handle schema validation errors in response', async () => {
      const validData: TrackFormData = {
        title: 'Test Track',
        artist: 'Test Artist',
        genres: ['rock']
      }

      const invalidResponse = {
        title: 'Test Track'
      }

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(invalidResponse)
      })

      const result = await createTrack(validData)

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.message).toContain('Invalid response format')
      }
    })
  })

  describe('fetchTracks', () => {
    it('should construct URL with all query parameters', async () => {
      const mockResponse = {
        data: [],
        meta: { total: 0, page: 1, limit: 8, totalPages: 0 }
      }

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockResponse)
      })

      await fetchTracks(2, 10, SortField.ARTIST, SortDirection.DESC, 'search term', 'rock')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/tracks?page=2&limit=10&sort=artist&order=desc&search=search%20term&genre=rock',
        undefined
      )
    })

    it('should handle minimal parameters', async () => {
      const mockResponse = {
        data: [],
        meta: { total: 0, page: 1, limit: 8, totalPages: 0 }
      }

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockResponse)
      })

      await fetchTracks()

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/tracks?page=1&limit=8',
        undefined
      )
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Connection failed'))

      const result = await fetchTracks()

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.message).toBe('Connection failed')
      }
    })
  })

  describe('updateTrack', () => {
    it('should validate input data before making request', async () => {
      const invalidData = {
        title: '',
        artist: '',
        genres: []
      } as TrackFormData

      const result = await updateTrack('123', invalidData)

      expect(result.isErr()).toBe(true)
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should make correct PUT request', async () => {
      const validData: TrackFormData = {
        title: 'Updated Track',
        artist: 'Updated Artist',
        genres: ['pop']
      }

      const mockResponse = {
        id: '123',
        title: 'Updated Track',
        artist: 'Updated Artist',
        genres: ['pop'],
        slug: 'updated-track',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      }

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockResponse)
      })

      const result = await updateTrack('123', validData)

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/tracks/123',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(validData),
        }
      )

      expect(result.isOk()).toBe(true)
    })
  })

  describe('deleteTrack', () => {
    it('should make correct DELETE request', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 204
      })

      const result = await deleteTrack('123')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/tracks/123',
        { method: 'DELETE' }
      )

      expect(result.isOk()).toBe(true)
    })

    it('should handle deletion errors', async () => {
      mockFetch.mockRejectedValue(new Error('Delete failed'))

      const result = await deleteTrack('123')

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.message).toBe('Delete failed')
      }
    })
  })

  describe('fetchGenres', () => {
    it('should return array of genre strings', async () => {
      const mockGenres = ['rock', 'pop', 'jazz', 'classical']

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockGenres)
      })

      const result = await fetchGenres()

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/genres', undefined)
      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        expect(result.value).toEqual(mockGenres)
      }
    })

    it('should handle invalid genre response format', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue('not an array')
      })

      const result = await fetchGenres()

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.message).toContain('Invalid response format')
      }
    })
  })

  describe('bulkDelete', () => {
    it('should handle empty IDs array', async () => {
      const result = await bulkDelete([])

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.message).toBe('No track IDs provided for deletion')
      }
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should make correct bulk delete request', async () => {
      const ids = ['1', '2', '3']
      const mockResponse = {
        success: ['1', '2'],
        failed: ['3']
      }

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockResponse)
      })

      const result = await bulkDelete(ids)

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/tracks/delete',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids }),
        }
      )

      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        expect(result.value.success).toEqual(['1', '2'])
        expect(result.value.failed).toEqual(['3'])
      }
    })
  })
}) 
