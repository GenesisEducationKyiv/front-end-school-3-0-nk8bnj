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

const DeleteTrackModal = () => {
  const {
    deleteModalOpen,
    closeDeleteModal,
    deleteSelectedTrack,
    selectedTrack,
    isDeleting,
  } = useTracksStore();

  const handleDelete = async () => {
    await deleteSelectedTrack();
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
          <AlertDialogCancel disabled={isDeleting} data-testid="cancel-delete">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => void handleDelete()}
            disabled={isDeleting}
            className="bg-slate-300 text-red-500-foreground hover:bg-red-500/90"
            data-testid="confirm-delete"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTrackModal;
