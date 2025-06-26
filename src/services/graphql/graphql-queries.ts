export const GET_TRACKS = `
  query GetTracks(
    $page: Int
    $limit: Int
    $sortField: SortField
    $sortDirection: SortDirection
    $search: String
    $filterGenre: String
  ) {
    tracks(
      page: $page
      limit: $limit
      sortField: $sortField
      sortDirection: $sortDirection
      search: $search
      filterGenre: $filterGenre
    ) {
      data {
        id
        title
        artist
        album
        genres
        slug
        coverImage
        audioFile
        createdAt
        updatedAt
      }
      meta {
        total
        page
        limit
        totalPages
      }
    }
  }
`;

export const GET_GENRES = `
  query GetGenres {
    genres
  }
`;

export const GET_TRACK_BY_SLUG = `
  query GetTrackBySlug($slug: String!) {
    trackBySlug(slug: $slug) {
      id
      title
      artist
      album
      genres
      slug
      coverImage
      audioFile
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_TRACK = `
  mutation CreateTrack($trackData: TrackFormDataInput!) {
    createTrack(trackData: $trackData) {
      id
      title
      artist
      album
      genres
      slug
      coverImage
      audioFile
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_TRACK = `
  mutation UpdateTrack($id: String!, $trackData: TrackFormDataInput!) {
    updateTrack(id: $id, trackData: $trackData) {
      id
      title
      artist
      album
      genres
      slug
      coverImage
      audioFile
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_TRACK = `
  mutation DeleteTrack($id: String!) {
    deleteTrack(id: $id)
  }
`;

export const DELETE_TRACKS = `
  mutation DeleteTracks($input: BulkDeleteInput!) {
    deleteTracks(input: $input) {
      success
      failed
    }
  }
`;

export const UPLOAD_TRACK_FILE = `
  mutation UploadTrackFile($id: String!, $file: Upload!) {
    uploadTrackFile(id: $id, file: $file) {
      id
      title
      artist
      album
      genres
      slug
      coverImage
      audioFile
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_TRACK_FILE = `
  mutation DeleteTrackFile($id: String!) {
    deleteTrackFile(id: $id) {
      id
      title
      artist
      album
      genres
      slug
      coverImage
      audioFile
      createdAt
      updatedAt
    }
  }
`; 
