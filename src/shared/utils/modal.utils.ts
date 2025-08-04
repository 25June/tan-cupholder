import { MODAL_ID } from '@/constants/modal.const';

export const onOpenModal = (modalId: MODAL_ID) => {
  const modal = document.getElementById(modalId) as HTMLDialogElement;
  modal?.showModal();
};

export const onCloseModal = (modalId: MODAL_ID) => {
  const modal = document.getElementById(modalId) as HTMLDialogElement;
  modal?.close();
};
