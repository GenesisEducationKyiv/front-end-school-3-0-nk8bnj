"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Music, Trash2, PlusCircle } from "lucide-react";
import useTracksStore from "@/store/useTracksStore";
import { useUploadTrackFileMutation, useDeleteTrackFileMutation } from "@/hooks/useTracksQueries";

const UploadTrackModal = () => {
  const uploadModalOpen = useTracksStore((state) => state.uploadModalOpen);
  const closeUploadModal = useTracksStore((state) => state.closeUploadModal);
  const selectedTrack = useTracksStore((state) => state.selectedTrack);
  const openCreateModal = useTracksStore((state) => state.openCreateModal);

  const uploadMutation = useUploadTrackFileMutation();
  const deleteMutation = useDeleteTrackFileMutation();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const isUploading = uploadMutation.isPending || deleteMutation.isPending;

  useEffect(() => {
    if (uploadModalOpen) {
      setError("");
    }
  }, [uploadModalOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const validTypes = [
        "audio/mpeg",
        "audio/wav",
        "audio/mp3",
        "audio/ogg",
        "audio/flac",
      ];
      if (!validTypes.includes(file.type)) {
        setError("Please select a valid audio file (MP3, WAV, OGG, FLAC)");
        setSelectedFile(null);
        return;
      }

      if (file.size > 20 * 1024 * 1024) {
        setError("File size exceeds 20MB limit");
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    if (!selectedTrack) {
      setError(
        "No track selected. Please select a track before uploading a file.",
      );
      return;
    }

    try {
      setError("");
      await uploadMutation.mutateAsync({ id: selectedTrack.id, file: selectedFile });
      setSelectedFile(null);
      closeUploadModal();
    } catch (error) {
      console.error("Upload failed:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Upload failed. Please try again.";

      const displayMessage = errorMessage.includes("Internal Server Error")
        ? "Server error occurred. The file might be too large or in an unsupported format. Please try again with a different file."
        : errorMessage;

      setError(displayMessage);
    }
  };

  const handleDeleteFile = async () => {
    if (!selectedTrack) return;

    try {
      await deleteMutation.mutateAsync(selectedTrack.id);
      closeUploadModal();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setError("");
    closeUploadModal();
  };

  const handleCreateNewTrack = () => {
    handleClose();
    openCreateModal();
  };

  return (
    <Dialog open={uploadModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>
            {selectedTrack?.audioFile
              ? "Manage Audio File"
              : "Upload Audio File"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {selectedTrack ? (
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-muted rounded-md">
                <Music className="h-8 w-8 mr-3 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{selectedTrack.title}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {selectedTrack.audioFile?.split("/").pop() ||
                      "No file uploaded yet"}
                  </p>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex space-x-2 justify-end">
                {selectedTrack.audioFile && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => void handleDeleteFile()}
                    disabled={isUploading}
                    className="flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isUploading ? "Removing..." : "Remove File"}
                  </Button>
                )}

                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center"
                    disabled={isUploading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {selectedTrack.audioFile ? "Replace File" : "Upload File"}
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                      accept="audio/*"
                      disabled={isUploading}
                    />
                  </Button>
                </div>

                {selectedFile && (
                  <Button
                    type="button"
                    onClick={() => void handleUpload()}
                    disabled={isUploading}
                  >
                    {isUploading ? "Uploading..." : "Upload"}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
                <p className="text-amber-800 text-sm">
                  You need to select a track before uploading a file. You can:
                </p>
                <ul className="list-disc list-inside text-amber-800 text-sm mt-2">
                  <li>
                    Go back and click the upload button on an existing track
                    card
                  </li>
                  <li>Create a new track first, then upload audio for it</li>
                </ul>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleCreateNewTrack}
                  className="flex items-center"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create New Track
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadTrackModal;
