"use client";

import { lazy, Suspense } from 'react';
import useTracksStore from '@/store/useTracksStore';
import ModalSkeletonSmall from '@/components/skeletons/ModalSkeletonSmall';
import ModalSkeletonLarge from '@/components/skeletons/ModalSkeletonLarge';
import ModalSkeletonMedium from '@/components/skeletons/ModalSkeletonMedium';

const CreateTrackModal = lazy(() => import('./CreateTrackModal'));
const EditTrackModal = lazy(() => import('./EditTrackModal'));
const DeleteTrackModal = lazy(() => import('./DeleteTrackModal'));
const UploadTrackModal = lazy(() => import('./UploadTrackModal'));
const BulkDeleteModal = lazy(() => import('./BulkDeleteModal'));

const Modals = () => {
  const createModalOpen = useTracksStore((state) => state.createModalOpen);
  const editModalOpen = useTracksStore((state) => state.editModalOpen);
  const deleteModalOpen = useTracksStore((state) => state.deleteModalOpen);
  const uploadModalOpen = useTracksStore((state) => state.uploadModalOpen);
  const bulkDeleteModalOpen = useTracksStore((state) => state.bulkDeleteModalOpen);

  return (
    <>
      {createModalOpen && (
        <Suspense fallback={<ModalSkeletonLarge />}>
          <CreateTrackModal />
        </Suspense>
      )}

      {editModalOpen && (
        <Suspense fallback={<ModalSkeletonLarge />}>
          <EditTrackModal />
        </Suspense>
      )}

      {deleteModalOpen && (
        <Suspense fallback={<ModalSkeletonSmall />}>
          <DeleteTrackModal />
        </Suspense>
      )}

      {uploadModalOpen && (
        <Suspense fallback={<ModalSkeletonMedium />}>
          <UploadTrackModal />
        </Suspense>
      )}

      {bulkDeleteModalOpen && (
        <Suspense fallback={<ModalSkeletonSmall />}>
          <BulkDeleteModal />
        </Suspense>
      )}
    </>
  );
};

export default Modals;
