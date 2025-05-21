import { Track, TrackFormData, ApiResponse } from "@/types";

const API_URL = "http://localhost:8000/api";

export const fetchTracks = async (
  page = 1,
  limit = 8,
  sortField?: string,
  sortDirection?: string,
  search?: string,
  filterGenre?: string,
): Promise<ApiResponse<Track>> => {
  try {
    let url = `${API_URL}/tracks?page=${page}&limit=${limit}`;

    if (sortField && sortDirection) {
      url += `&sort=${sortField}&direction=${sortDirection}`;
    }

    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    if (filterGenre) {
      url += `&genre=${encodeURIComponent(filterGenre)}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch tracks: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const fetchGenres = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_URL}/genres`);

    if (!response.ok) {
      throw new Error(`Failed to fetch genres: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const createTrack = async (trackData: TrackFormData): Promise<Track> => {
  try {
    const response = await fetch(`${API_URL}/tracks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(trackData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create track: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const updateTrack = async (
  id: string,
  trackData: TrackFormData,
): Promise<Track> => {
  try {
    const response = await fetch(`${API_URL}/tracks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(trackData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update track: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const deleteTrack = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/tracks/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete track: ${response.statusText}`);
    }
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const deleteTracks = async (
  ids: string[],
): Promise<{ success: string[]; failed: string[] }> => {
  try {
    const response = await fetch(`${API_URL}/tracks/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete tracks: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const uploadTrackFile = async (
  id: string,
  file: File,
): Promise<Track> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/tracks/${id}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage =
          errorData.message ||
          errorData.error ||
          `Failed to upload file: ${response.statusText}`;
        console.error("Server error details:", errorData);
      } catch {
        try {
          const textError = await response.text();
          errorMessage =
            textError || `Failed to upload file: ${response.statusText}`;
          console.error("Server text error:", textError);
        } catch {
          errorMessage = `Failed to upload file: ${response.statusText}`;
          console.error("Response couldn't be parsed:", response.statusText);
        }
      }

      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const deleteTrackFile = async (id: string): Promise<Track> => {
  try {
    const response = await fetch(`${API_URL}/tracks/${id}/file`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete track file: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const fetchTrackBySlug = async (slug: string): Promise<Track> => {
  try {
    const response = await fetch(`${API_URL}/tracks/${slug}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch track: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
