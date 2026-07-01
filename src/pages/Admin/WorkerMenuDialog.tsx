import React, { useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { deleteWorker } from '../../api/auth';
import { toast } from 'react-toastify';
 
interface WorkerMenuDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workerId: number;
  workerName?: string;
}
 
const WorkerMenuDialog = ({ isOpen, onClose, workerId, workerName }: WorkerMenuDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
 
  const handleClose = () => {
    setConfirmed(false);
    onClose();
  };
 
  const handleDelete = async () => {
    if (!confirmed) {
      setConfirmed(true);
      return;
    }
    setIsDeleting(true);
    try {
      const result = await deleteWorker(workerId);
      if (result?.success === false) {
        throw new Error(result.message || 'Delete failed');
      }
      toast.success(result?.message || 'Worker deleted successfully');
      handleClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to delete worker');
      } else {
        toast.error('Failed to delete worker');
      }
    } finally {
      setIsDeleting(false);
    }
  };
 
  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity" />
 
      <div className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <DialogPanel
          transition
          className="w-full sm:max-w-sm bg-white sm:rounded-2xl shadow-2xl duration-300 ease-out data-closed:opacity-0 data-closed:scale-95 overflow-hidden"
        >
          <div className="relative bg-red-50 px-6 pt-6 pb-5 text-center">
            <div className="mx-auto size-14 rounded-2xl bg-red-100 flex items-center justify-center mb-3 shadow-sm">
              <span className="material-symbols-outlined text-red-500 text-2xl">person_remove</span>
            </div>
            <h3 className="text-base font-black text-gray-900">Delete Worker</h3>
            <p className="text-xs text-gray-500 mt-1">
              This action <strong className="text-gray-700">cannot be undone</strong>
            </p>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="bg-[#f8faf9] rounded-xl border border-[#dde3e0] px-4 py-3 flex items-center gap-3">
              <div className="size-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-black text-sm flex-shrink-0">
                {workerName
                  ? workerName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
                  : '?'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">{workerName || 'Unknown Worker'}</p>
                <p className="text-[10px] text-gray-400 font-mono">ID: #{workerId}</p>
              </div>
              <span className="ml-auto flex-shrink-0">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                  <span className="material-symbols-outlined text-xs">warning</span>
                  To be deleted
                </span>
              </span>
            </div>
            <div className="space-y-1.5">
              {[
                'All pickup assignments will be removed',
                'Login access will be permanently revoked',
                'Historical data may be affected',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-red-400 text-sm flex-shrink-0 mt-0.5">cancel</span>
                  <p className="text-xs text-gray-500 font-medium">{item}</p>
                </div>
              ))}
            </div>
            {confirmed && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500 text-base flex-shrink-0">warning</span>
                <p className="text-xs text-red-700 font-semibold">
                  Click <strong>Delete</strong> again to confirm permanently deleting this worker.
                </p>
              </div>
            )}
          </div>
          <div className="px-6 pb-6 flex flex-col gap-2">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`w-full h-11 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                confirmed
                  ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200 active:scale-95'
                  : 'bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100'
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {isDeleting ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">refresh</span>
                  Deleting…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">
                    {confirmed ? 'delete_forever' : 'delete'}
                  </span>
                  {confirmed ? 'Confirm Delete' : 'Delete Worker'}
                </>
              )}
            </button>
            <button
              onClick={handleClose}
              disabled={isDeleting}
              className="w-full h-10 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 border border-[#dde3e0] transition-all"
            >
              Cancel
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
 
export default WorkerMenuDialog;