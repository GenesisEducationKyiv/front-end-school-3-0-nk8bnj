"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useTracksStore from "@/store/useTracksStore";

const BulkDeleteModal = () => {
  const {
    selectedTrackIds,
    isDeleting,
    bulkDeleteModalOpen,
    closeBulkDeleteModal,
    deleteSelectedTracks,
  } = useTracksStore();

  const handleConfirmDelete = async () => {
    await deleteSelectedTracks();
  };

  return (
    <AlertDialog open={bulkDeleteModalOpen} onOpenChange={closeBulkDeleteModal}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {selectedTrackIds.length} tracks?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {selectedTrackIds.length} selected
            tracks? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => void handleConfirmDelete()}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="mr-2">Deleting...</span>
                <div className="animate-spin h-4 w-4 border-2 border-gray-300 rounded-full border-t-white"></div>
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BulkDeleteModal; 