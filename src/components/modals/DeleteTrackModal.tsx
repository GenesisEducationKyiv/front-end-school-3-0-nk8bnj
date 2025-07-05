"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useTracksStore from "@/store/useTracksStore";
import { useDeleteTrackMutation } from "@/hooks/useTracksQueries";

const DeleteTrackModal = () => {
  const deleteModalOpen = useTracksStore((state) => state.deleteModalOpen);
  const closeDeleteModal = useTracksStore((state) => state.closeDeleteModal);
  const selectedTrack = useTracksStore((state) => state.selectedTrack);

  const deleteTrackMutation = useDeleteTrackMutation();

  const handleDelete = async () => {
    if (selectedTrack) {
      await deleteTrackMutation.mutateAsync(selectedTrack.id);
      closeDeleteModal();
    }
  };

  return (
    <AlertDialog open={deleteModalOpen} onOpenChange={closeDeleteModal}>
      <AlertDialogContent className="bg-white" data-testid="confirm-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the track
            {selectedTrack && (
              <strong> &quot;{selectedTrack.title}&quot;</strong>
            )}{" "}
            and remove it from your library.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteTrackMutation.isPending} data-testid="cancel-delete">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => void handleDelete()}
            disabled={deleteTrackMutation.isPending}
            className="bg-slate-300 text-red-500-foreground hover:bg-red-500/90"
            data-testid="confirm-delete"
          >
            {deleteTrackMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTrackModal;
