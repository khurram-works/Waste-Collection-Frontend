import React from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

export default function CancelRequestModal({ isopen, onclose }) {
  return (
    <Dialog open={isopen} onClose={onclose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-xl bg-white shadow-xl">
          <div className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-700/5 text-red-600 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-4xl">warning</span>
            </div>
            <DialogTitle className="text-xl font-bold text-gray-900 mb-2">
              Cancel Request?
            </DialogTitle>
            <p className="text-gray-600 text-sm leading-relaxed">
              Are you sure you want to cancel this request? This action cannot be undone
              and your scheduled pickup window will be released.
            </p>
          </div>
          <div className="flex flex-col gap-2 p-6 pt-0">
            <button
              onClick={onclose}
              className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20"
            >
              Yes, Cancel Request
            </button>
            <button
              onClick={onclose}
              className="w-full py-3 bg-transparent text-gray-600 font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              No, Keep Request
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
