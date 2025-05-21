"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import useTracksStore from "@/store/useTracksStore";
import { TrackFormData } from "@/types";

const EditTrackModal = () => {
  const {
    editModalOpen,
    closeEditModal,
    updateSelectedTrack,
    genres,
    selectedTrack,
    isLoading,
  } = useTracksStore();

  const [formData, setFormData] = useState<TrackFormData>({
    title: "",
    artist: "",
    album: "",
    genres: [],
    coverImage: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedGenre, setSelectedGenre] = useState<string>("");

  useEffect(() => {
    if (selectedTrack) {
      setFormData({
        title: selectedTrack.title,
        artist: selectedTrack.artist,
        album: selectedTrack.album,
        genres: [...selectedTrack.genres],
        coverImage: selectedTrack.coverImage,
      });
    }
  }, [selectedTrack]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.artist.trim()) {
      newErrors.artist = "Artist is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleAddGenre = () => {
    if (!selectedGenre || formData.genres.includes(selectedGenre)) return;

    setFormData({
      ...formData,
      genres: [...formData.genres, selectedGenre],
    });
    setSelectedGenre("");
  };

  const handleRemoveGenre = (genre: string) => {
    setFormData({
      ...formData,
      genres: formData.genres.filter((g) => g !== genre),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    await updateSelectedTrack(formData);
  };

  return (
    <Dialog open={editModalOpen} onOpenChange={closeEditModal}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Edit Track</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 mt-4"
          data-testid="track-form"
        >
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter track title"
              className={errors.title ? "border-red-500" : ""}
              data-testid="input-title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm" data-testid="error-title">
                {errors.title}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="artist">
              Artist <span className="text-red-500">*</span>
            </Label>
            <Input
              id="artist"
              name="artist"
              value={formData.artist}
              onChange={handleInputChange}
              placeholder="Enter artist name"
              className={errors.artist ? "border-red-500" : ""}
              data-testid="input-artist"
            />
            {errors.artist && (
              <p
                className="text-red-500 text-sm"
                data-testid="error-artist"
              >
                {errors.artist}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="album">Album</Label>
            <Input
              id="album"
              name="album"
              value={formData.album}
              onChange={handleInputChange}
              placeholder="Enter album name"
              data-testid="input-album"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image URL</Label>
            <Input
              id="coverImage"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleInputChange}
              placeholder="Enter cover image URL"
              className={errors.coverImage ? "border-red-500" : ""}
              data-testid="input-cover-image"
            />
            {errors.coverImage && (
              <p
                className="text-red-500 text-sm"
                data-testid="error-coverImage"
              >
                {errors.coverImage}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Genres</Label>
            <div className="flex space-x-2">
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger
                  className="flex-grow"
                  data-testid="genre-selector"
                >
                  <SelectValue placeholder="Select a genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres
                    .filter((genre) => !formData.genres.includes(genre))
                    .map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={handleAddGenre}
                disabled={!selectedGenre}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {formData.genres.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No genres selected
                </p>
              ) : (
                formData.genres.map((genre) => (
                  <Badge
                    key={genre}
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    {genre}
                    <button
                      type="button"
                      onClick={() => handleRemoveGenre(genre)}
                      className="text-muted-foreground hover:text-foreground ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={closeEditModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              data-testid="submit-button"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTrackModal;
