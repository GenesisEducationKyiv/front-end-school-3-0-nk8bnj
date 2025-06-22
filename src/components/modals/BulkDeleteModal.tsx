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
import { useBulkDeleteMutation } from "@/hooks/useTracksQueries";

const BulkDeleteModal = () => {
  const {
    selectedTrackIds,
    bulkDeleteModalOpen,
    closeBulkDeleteModal,
    clearTrackSelection,
  } = useTracksStore();

  const bulkDeleteMutation = useBulkDeleteMutation();

  const handleConfirmDelete = () => {
    bulkDeleteMutation.mutate(selectedTrackIds, {
      onSuccess: () => {
        clearTrackSelection();
        closeBulkDeleteModal();
      },
      onError: (error) => {
        console.error("Failed to delete tracks:", error);
      }
    });
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
          <AlertDialogCancel disabled={bulkDeleteMutation.isPending}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => void handleConfirmDelete()}
            disabled={bulkDeleteMutation.isPending}
          >
            {bulkDeleteMutation.isPending ? (
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