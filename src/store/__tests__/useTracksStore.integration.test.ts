import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useTracksStore from '../useTracksStore'
import * as api from '@/services/api'
import { ok, err } from 'neverthrow'
import { SortField, SortDirection } from '@/types/types'

vi.mock('@/services/api')

const mockApi = vi.mocked(api)

describe('useTracksStore Integration', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    act(() => {
      useTracksStore.setState({
        tracks: [],
        isLoading: false,
        isCreating: false,
        isDeleting: false,
        selectedTrack: null,
        selectedTrackIds: [],
        currentPage: 1,
        totalTracks: 0,
        totalPages: 0,
        itemsPerPage: 8,
        sort: { field: SortField.TITLE, direction: SortDirection.ASC },
        filter: { search: '', genres: [] },
        createModalOpen: false,
        editModalOpen: false,
        deleteModalOpen: false,
        uploadModalOpen: false,
        bulkDeleteModalOpen: false
      })
    })
  })

  describe('fetchAllTracks integration', () => {
    it('should fetch tracks and update state correctly', async () => {
      const mockTracksResponse = {
        data: [
          {
            id: '1',
            title: 'Test Track 1',
            artist: 'Artist 1',
            genres: ['rock'],
            slug: 'test-track-1',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z'
          }
        ],
        meta: { total: 1, page: 1, limit: 8, totalPages: 1 }
      }

      mockApi.fetchTracks.mockResolvedValue(ok(mockTracksResponse))

      const { result } = renderHook(() => useTracksStore())

      expect(result.current.tracks).toEqual([])

      await act(async () => {
        await result.current.fetchAllTracks()
      })

      expect(result.current.tracks).toEqual(mockTracksResponse.data)
      expect(result.current.totalTracks).toBe(1)
      expect(result.current.isLoading).toBe(false)
    })

    it('should handle API errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

      mockApi.fetchTracks.mockResolvedValue(err({ message: 'Network error' }))

      const { result } = renderHook(() => useTracksStore())

      await act(async () => {
        await result.current.fetchAllTracks()
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.tracks).toEqual([])
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch tracks:', { message: 'Network error' })

      consoleErrorSpy.mockRestore()
    })

    it('should apply filters and sorting when fetching', async () => {
      const mockResponse = {
        data: [],
        meta: { total: 0, page: 1, limit: 8, totalPages: 0 }
      }

      mockApi.fetchTracks.mockResolvedValue(ok(mockResponse))

      const { result } = renderHook(() => useTracksStore())

      act(() => {
        result.current.setSort({ field: SortField.ARTIST, direction: SortDirection.DESC })
        result.current.setFilter({ search: 'rock music', genres: ['rock'] })
      })

      await act(async () => {
        await result.current.fetchAllTracks()
      })

      expect(mockApi.fetchTracks).toHaveBeenCalledWith(
        1,
        8,
        'artist',
        'desc',
        'rock music',
        'rock'
      )
    })
  })

  describe('createNewTrack integration', () => {
    it('should create track and refresh data', async () => {
      const newTrackData = {
        title: 'New Track',
        artist: 'New Artist',
        genres: ['jazz']
      }

      const createdTrack = {
        id: '3',
        title: 'New Track',
        artist: 'New Artist',
        genres: ['jazz'],
        slug: 'new-track',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      }

      mockApi.createTrack.mockResolvedValue(ok(createdTrack))
      mockApi.fetchTracks.mockResolvedValue(ok({ data: [createdTrack], meta: { total: 1, page: 1, limit: 8, totalPages: 1 } }))

      const { result } = renderHook(() => useTracksStore())

      await act(async () => {
        const created = await result.current.createNewTrack(newTrackData)
        expect(created).toEqual(createdTrack)
      })

      expect(mockApi.createTrack).toHaveBeenCalledWith(newTrackData)
      expect(mockApi.fetchTracks).toHaveBeenCalled()
    })

    it('should handle creation errors', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

      mockApi.createTrack.mockResolvedValue(err({ message: 'Creation failed' }))

      const { result } = renderHook(() => useTracksStore())

      await act(async () => {
        const created = await result.current.createNewTrack({ title: 'Test', artist: 'Test', genres: [] })
        expect(created).toBeUndefined()
      })

      expect(result.current.isCreating).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to create track:', { message: 'Creation failed' })

      consoleErrorSpy.mockRestore()
    })
  })

  describe('updateSelectedTrack integration', () => {
    it('should update track and refresh state', async () => {
      const selectedTrack = {
        id: '1',
        title: 'Original Track',
        artist: 'Original Artist',
        genres: ['rock'],
        slug: 'original-track',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      }

      const updatedTrack = {
        ...selectedTrack,
        title: 'Updated Track',
        artist: 'Updated Artist'
      }

      mockApi.updateTrack.mockResolvedValue(ok(updatedTrack))

      const { result } = renderHook(() => useTracksStore())

      act(() => {
        useTracksStore.setState({
          selectedTrack,
          tracks: [selectedTrack],
          isLoading: false
        })
      })

      await act(async () => {
        const updated = await result.current.updateSelectedTrack({
          title: 'Updated Track',
          artist: 'Updated Artist',
          genres: ['rock']
        })
        expect(updated).toEqual(updatedTrack)
      })

      expect(mockApi.updateTrack).toHaveBeenCalledWith('1', {
        title: 'Updated Track',
        artist: 'Updated Artist',
        genres: ['rock']
      })

      expect(result.current.tracks[0]).toEqual(updatedTrack)
      expect(result.current.selectedTrack).toBe(null)
      expect(result.current.editModalOpen).toBe(false)
    })

    it('should handle update when no track is selected', async () => {
      const { result } = renderHook(() => useTracksStore())

      await act(async () => {
        const updated = await result.current.updateSelectedTrack({
          title: 'Test',
          artist: 'Test',
          genres: []
        })
        expect(updated).toBeUndefined()
      })

      expect(mockApi.updateTrack).not.toHaveBeenCalled()
    })
  })

  describe('deleteSelectedTrack integration', () => {
    it('should delete track and update state', async () => {
      const trackToDelete = {
        id: '1',
        title: 'Track to Delete',
        artist: 'Artist',
        genres: ['rock'],
        slug: 'track-to-delete',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      }

      const otherTrack = {
        id: '2',
        title: 'Other Track',
        artist: 'Other Artist',
        genres: ['pop'],
        slug: 'other-track',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      }

      mockApi.deleteTrack.mockResolvedValue(ok(undefined))

      const { result } = renderHook(() => useTracksStore())

      act(() => {
        useTracksStore.setState({
          selectedTrack: trackToDelete,
          tracks: [trackToDelete, otherTrack],
          isDeleting: false
        })
      })

      await act(async () => {
        await result.current.deleteSelectedTrack()
      })

      expect(mockApi.deleteTrack).toHaveBeenCalledWith('1')

      expect(result.current.tracks).toEqual([otherTrack])
      expect(result.current.selectedTrack).toBe(null)
      expect(result.current.deleteModalOpen).toBe(false)
      expect(result.current.isDeleting).toBe(false)
    })
  })

  describe('pagination integration', () => {
    it('should change page and fetch new data', () => {
      const mockResponse = {
        data: [],
        meta: { total: 20, page: 2, limit: 8, totalPages: 3 }
      }

      mockApi.fetchTracks.mockResolvedValue(ok(mockResponse))

      const { result } = renderHook(() => useTracksStore())

      act(() => {
        result.current.setPage(2)
      })

      expect(result.current.currentPage).toBe(2)
      expect(mockApi.fetchTracks).toHaveBeenCalledWith(
        2, 8, SortField.TITLE, SortDirection.ASC, '', undefined
      )
    })

    it('should change items per page and reset to page 1', () => {
      const mockResponse = {
        data: [],
        meta: { total: 20, page: 1, limit: 16, totalPages: 2 }
      }

      mockApi.fetchTracks.mockResolvedValue(ok(mockResponse))

      const { result } = renderHook(() => useTracksStore())

      act(() => {
        result.current.setPage(2)
      })

      expect(result.current.currentPage).toBe(2)

      act(() => {
        result.current.setItemsPerPage(16)
      })

      expect(result.current.currentPage).toBe(1)
      expect(result.current.itemsPerPage).toBe(16)
      expect(mockApi.fetchTracks).toHaveBeenLastCalledWith(
        1, 16, SortField.TITLE, SortDirection.ASC, '', undefined
      )
    })
  })
}) 
