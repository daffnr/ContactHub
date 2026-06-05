import React from 'react';
import { Modal } from '../molecules/Modal';
import { Button } from '../atoms/Button';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Destroy Contact Data"
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Are you absolutely sure you want to delete this contact? This action is irreversible and all matching telemetry database links will be purged.
        </p>
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-850">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            isLoading={isLoading}
            onClick={onConfirm}
          >
            Confirm Purge
          </Button>
        </div>
      </div>
    </Modal>
  );
};
