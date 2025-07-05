"use client";

import dynamic from 'next/dynamic';
import useTracksStore from '@/store/useTracksStore';
import ModalSkeletonSmall from '@/components/skeletons/ModalSkeletonSmall';
import ModalSkeletonLarge from '@/components/skeletons/ModalSkeletonLarge';
import ModalSkeletonMedium from '@/components/skeletons/ModalSkeletonMedium';

const CreateTrackModal = dynamic(() => import('./CreateTrackModal'), {
  loading: () => <ModalSkeletonLarge />,
  ssr: false,
});

const EditTrackModal = dynamic(() => import('./EditTrackModal'), {
  loading: () => <ModalSkeletonLarge />,
  ssr: false,
});

const DeleteTrackModal = dynamic(() => import('./DeleteTrackModal'), {
  loading: () => <ModalSkeletonSmall />,
  ssr: false,
});

const UploadTrackModal = dynamic(() => import('./UploadTrackModal'), {
  loading: () => <ModalSkeletonMedium />,
  ssr: false,
});

const BulkDeleteModal = dynamic(() => import('./BulkDeleteModal'), {
  loading: () => <ModalSkeletonSmall />,
  ssr: false,
});

const Modals = () => {
  const createModalOpen = useTracksStore((state) => state.createModalOpen);
  const editModalOpen = useTracksStore((state) => state.editModalOpen);
  const deleteModalOpen = useTracksStore((state) => state.deleteModalOpen);
  const uploadModalOpen = useTracksStore((state) => state.uploadModalOpen);
  const bulkDeleteModalOpen = useTracksStore((state) => state.bulkDeleteModalOpen);

  return (
    <>
      {createModalOpen && <CreateTrackModal />}
      {editModalOpen && <EditTrackModal />}
      {deleteModalOpen && <DeleteTrackModal />}
      {uploadModalOpen && <UploadTrackModal />}
      {bulkDeleteModalOpen && <BulkDeleteModal />}
    </>
  );
};

export default Modals;