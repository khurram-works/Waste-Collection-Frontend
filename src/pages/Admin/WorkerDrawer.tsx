import { Dialog, DialogPanel } from "@headlessui/react";
import { ZoneData, WorkerData } from "../../Types/types";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { updateWorker, deactivateWorker } from "../../api/auth";
 
const avatarColors = [
  'bg-emerald-100 text-emerald-700',
  'bg-blue-100 text-blue-700',
  'bg-violet-100 text-violet-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
];
const getAvatarColor = (id: string | number) =>
  avatarColors[Number(String(id).slice(-1)) % avatarColors.length];
 
const getInitials = (name: string) =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
 
const WorkerDrawer = ({
  isOpen,
  onClose,
  worker,
  zones,
}: {
  isOpen: boolean;
  onClose: () => void;
  worker: WorkerData;
  zones: ZoneData[];
}) => {
  const [selectedZoneId, setSelectedZoneId] = useState<number>(worker.zone?.zoneId || 0);
  const [selectedVehicle, setSelectedVehicle] = useState<string>(worker.vehicle || '');
  const [selectedRoute, setSelectedRoute] = useState<string>(worker.responsibleFor || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [activeTab, setActiveTab] = useState<'assignment' | 'performance'>('assignment');
 
  useEffect(() => {
    if (worker) {
      setSelectedZoneId(worker.zone?.zoneId || 0);
      setSelectedVehicle(worker.vehicle || '');
      setSelectedRoute(worker.responsibleFor || '');
    }
  }, [worker])

  // console.log(worker);
 
  const hasChanges =
    selectedZoneId !== (worker.zone?.zoneId || 0) ||
    selectedVehicle !== (worker.vehicle || '') ||
    selectedRoute !== (worker.responsibleFor || '');
 
  const progress = worker._count?.assignedPickups
    ? Math.round((worker.collectedCount / worker._count.assignedPickups) * 100)
    : 0;
 
  const saveChanges = async () => {
    if (!hasChanges) { onClose(); return; }
    if (selectedZoneId === 0) { toast.error('Please select a valid zone'); return; }
    if (selectedVehicle.trim() === '') { toast.error('Please enter a vehicle number'); return; }
    if (selectedRoute.trim() === '') { toast.error('Please select a route'); return; }
 
    setIsSubmitting(true);
    try {
      const result = await updateWorker(worker.userId, {
        zoneId: selectedZoneId,
        vehicle: selectedVehicle,
        responsibleFor: selectedRoute,
      });
      if (result?.success === false) throw new Error(result.message || 'Update failed');
      toast.success(result?.message || 'Worker updated successfully');
      onClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to update. Please try again.');
      } else {
        toast.error('Failed to update. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
 
  const deActivateWorker = async () => {
    setIsDeactivating(true);
    try {
      const result = await deactivateWorker(worker.userId);
      if (result?.success === false) throw new Error(result.message || 'Update failed');
      toast.success(result?.message || 'Worker deactivated successfully');
      onClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to deactivate. Please try again.');
      } else {
        toast.error('Failed to deactivate. Please try again.');
      }
    } finally {
      setIsDeactivating(false);
    }
  };
 
  const isActive = worker.status === 'ACTIVE';
 
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity" />
 
      <div className="fixed inset-0 flex justify-end">
        <DialogPanel
          transition
          className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition duration-300 ease-in-out data-closed:translate-x-full"
        >
          <div className="relative bg-linear-to-br from-[#f8faf9] to-white border-b border-[#dde3e0] px-6 pt-6 pb-5">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 size-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
 
            <div className="flex items-center gap-4">
              <div className={`size-14 rounded-2xl ${getAvatarColor(worker.userId)} flex items-center justify-center font-black text-xl shrink-0 shadow-sm`}>
                {getInitials(worker.name)}
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-black text-[#121614] leading-tight truncate">{worker.name}</h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                    #{worker.userId}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <span className={`size-1.5 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">location_on</span>
                  {worker.zone?.name}
                </p>
              </div>
            </div>
 
            {/* Quick Stats Row */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              {[
                { label: 'Tasks Done', value: worker.collectedCount, icon: 'task_alt' },
                { label: 'Assigned', value: worker._count?.assignedPickups || 0, icon: 'assignment' },
                { label: 'Progress', value: `${progress}%`, icon: 'trending_up' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl border border-[#dde3e0] px-3 py-2 text-center shadow-sm">
                  <p className="text-[10px] text-gray-400 font-semibold leading-none">{stat.label}</p>
                  <p className="text-base font-black text-[#121614] mt-1">{stat.value}</p>
                </div>
              ))}
            </div>
 
            {/* Progress Bar */}
            <div className="mt-3">
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-700 ${
                    progress >= 80 ? 'bg-primary' : progress >= 40 ? 'bg-amber-400' : 'bg-gray-300'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
 
          {/* ── Tabs ── */}
          <div className="flex border-b border-[#dde3e0] bg-white shrink-0">
            {[
              { key: 'assignment', label: 'Assignment', icon: 'badge' } as const,
              { key: 'performance', label: 'Performance', icon: 'trending_up' } as const,
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold transition-all border-b-2 ${
                  activeTab === tab.key
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
 
          {/* ── Tab Content ── */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'assignment' && (
              <div className="p-6 space-y-5">
                {/* Zone */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <span className="material-symbols-outlined text-xs">location_on</span>
                    Assigned Zone
                  </label>
                  <Listbox value={selectedZoneId} onChange={setSelectedZoneId}>
                    <div className="relative">
                      <ListboxButton className="relative w-full rounded-xl bg-[#f8faf9] border border-[#dde3e0] py-2.5 pl-4 pr-10 text-left text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all">
                        {selectedZoneId
                          ? zones.find((z) => z.zoneId === selectedZoneId)?.name
                          : worker.zone?.name || 'Select zone'}
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <ChevronDownIcon className="size-4 fill-gray-400" aria-hidden="true" />
                        </span>
                      </ListboxButton>
                      <ListboxOptions className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-xl bg-white border border-[#dde3e0] py-1 shadow-xl text-sm focus:outline-none">
                        {zones.map((zone) => (
                          <ListboxOption
                            key={zone.zoneId}
                            value={zone.zoneId}
                            className="relative cursor-default select-none py-2.5 pl-10 pr-4 text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                          >
                            {({ selected }) => (
                              <>
                                <span className={`block ${selected ? 'font-bold text-primary' : 'font-normal'}`}>
                                  {zone.name}
                                </span>
                                {selected && (
                                  <span className="absolute inset-y-0 left-3 flex items-center text-primary">
                                    <span className="material-symbols-outlined text-sm">check</span>
                                  </span>
                                )}
                              </>
                            )}
                          </ListboxOption>
                        ))}
                      </ListboxOptions>
                    </div>
                  </Listbox>
                </div>
 
                {/* Vehicle */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <span className="material-symbols-outlined text-xs">local_shipping</span>
                    Vehicle Number
                  </label>
                  <input
                    type="text"
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    placeholder="e.g. TRK-204"
                    className="w-full h-10 px-4 rounded-xl bg-[#f8faf9] border border-[#dde3e0] text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all placeholder-gray-300"
                  />
                </div>
 
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <span className="material-symbols-outlined text-xs">route</span>
                    Assigned Route
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['recycling', 'landfill'].map((route) => (
                      <button
                        key={route}
                        type="button"
                        onClick={() => setSelectedRoute(route)}
                        className={`py-2.5 px-4 rounded-xl text-sm font-bold border-2 transition-all ${
                          selectedRoute === route
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-[#dde3e0] bg-[#f8faf9] text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base block mb-0.5">
                          {route === 'recycling' ? 'recycling' : 'delete_sweep'}
                        </span>
                        {route.charAt(0).toUpperCase() + route.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-[#f8faf9] rounded-xl border border-[#dde3e0] p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-700">Account Status</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Toggle worker active / inactive</p>
                  </div>
                  <div
                    className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors duration-200 ${
                      isActive ? 'bg-primary' : 'bg-gray-200'
                    }`}
                    onClick={deActivateWorker}
                    title={isActive ? 'Click to deactivate' : 'Activate worker'}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                        isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Info</p>
                  <div className="bg-[#f8faf9] rounded-xl border border-[#dde3e0] divide-y divide-[#dde3e0]">
                    {[
                      { icon: 'phone', value: worker.phone || '—' },
                    ].map((item) => (
                      <div key={item.icon} className="flex items-center gap-3 px-4 py-2.5">
                        <span className="material-symbols-outlined text-gray-300 text-base">{item.icon}</span>
                        <span className="text-sm text-gray-600 font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
 
            {activeTab === 'performance' && (
              <div className="p-6 space-y-5">
                <div className="bg-[#f8faf9] rounded-xl border border-[#dde3e0] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black text-gray-500 uppercase tracking-wider">Today's Progress</p>
                    <span className={`text-sm font-black ${progress >= 80 ? 'text-primary' : progress >= 40 ? 'text-amber-500' : 'text-gray-400'}`}>
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${
                        progress >= 80 ? 'bg-primary' : progress >= 40 ? 'bg-amber-400' : 'bg-gray-300'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                    <span>{worker.collectedCount} completed</span>
                    <span>{worker._count?.assignedPickups || 0} total assigned</span>
                  </div>
                </div>
 
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Tasks Completed', value: worker.collectedCount, icon: 'task_alt', color: 'text-primary bg-primary/10' },
                    { label: 'Avg. Rating', value: '—', icon: 'star', color: 'text-amber-500 bg-amber-50' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-[#f8faf9] rounded-xl border border-[#dde3e0] p-4">
                      <div className={`size-8 rounded-lg ${stat.color} flex items-center justify-center mb-2`}>
                        <span className="material-symbols-outlined text-base">{stat.icon}</span>
                      </div>
                      <p className="text-2xl font-black text-[#121614]">{stat.value}</p>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black text-primary uppercase tracking-wider">Attendance Summary</p>
                    <span className="text-[10px] text-primary/60 font-semibold">Oct 2023</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 28 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-5 rounded-sm ${
                          Math.random() > 0.15 ? 'bg-primary/30' : 'bg-gray-100'
                        }`}
                        title={`Day ${i + 1}`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-primary/50 font-medium">Attendance data visualization</p>
                </div>
              </div>
            )}
          </div>
          <div className="shrink-0 p-5 border-t border-[#dde3e0] bg-white space-y-3">
            <button
              onClick={saveChanges}
              disabled={isSubmitting || !hasChanges}
              className={`w-full h-11 font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm ${
                hasChanges && !isSubmitting
                  ? 'bg-primary text-white hover:bg-primary/90 shadow-primary/20 hover:shadow-md'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">refresh</span>
                  Saving…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">save</span>
                  {hasChanges ? 'Save Changes' : 'No Changes'}
                </>
              )}
            </button>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 h-10 bg-white border border-[#dde3e0] text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={deActivateWorker}
                disabled={isDeactivating}
                className="flex-1 h-10 text-red-500 font-bold text-sm hover:bg-red-50 rounded-xl border border-red-100 transition-all flex items-center justify-center gap-1"
              >
                {isDeactivating ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                    Deactivating…
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">person_off</span>
                    Deactivate
                  </>
                )}
              </button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
 
export default WorkerDrawer;