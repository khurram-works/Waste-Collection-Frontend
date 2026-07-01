import React, { useState, useEffect, useMemo } from 'react';
import WorkerDrawer from './WorkerDrawer';
import WorkerMenuDialog from './WorkerMenuDialog';
import AddWorkerDialog from "./AddWorkerDialog";
import { getworkerData } from '../../api/auth';
import { WorkerData, WorkerforEdit } from '../../Types/types';
import { ZoneData } from '../../Types/types';
 
function WorkerView() {
  const [dashboardData, setDashboardData] = useState<WorkerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [menuWorker, setMenuWorker] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [zones, setZones] = useState<ZoneData[]>([]);
 
  const openEditDrawer = (worker: WorkerforEdit) => setSelectedWorker(worker);
  const closeEditDrawer = () => setSelectedWorker(null);
  const openMenu = (worker: WorkerforEdit) => setMenuWorker(worker);
  const closeMenu = () => setMenuWorker(null);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getworkerData();
        setZones(data.allZones);
        setDashboardData(data.allWorkers);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
 
  const filteredWorkers = useMemo(() => {
    return dashboardData.filter((w) => {
      const matchesSearch =
        w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(w.userId).toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'All' || w.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [dashboardData, searchQuery, statusFilter]);
 
  const activeCount = dashboardData.filter((w) => w.status === 'ACTIVE').length;
 
  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
 
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
 
  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 min-h-screen bg-[#f8faf9]">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-primary/10" />
          <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
        </div>
        <p className="text-sm text-gray-400 font-medium tracking-wide">Loading workforce data…</p>
      </div>
    );
  }
 
  return (
    <main className="flex-1 overflow-y-auto bg-[#f8faf9] min-h-screen">
      <div className="sticky top-0 z-20 bg-[#f8faf9]/90 backdrop-blur border-b border-[#dde3e0] px-6 md:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[#121614] text-2xl md:text-3xl font-black tracking-tight leading-none">
            Municipal Workforce
          </h1>
          <p className="text-gray-400 text-xs mt-1 font-medium">
            Manage and assign waste management staff across city zones
          </p>
        </div>
        <button
          onClick={() => setIsAddWorkerOpen(true)}
          className="group flex items-center gap-2 rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 active:scale-95 transition-all duration-150"
        >
          <span className="material-symbols-outlined text-base transition-transform group-hover:rotate-90 duration-200">add</span>
          Add New Worker
        </button>
      </div>
 
      <div className="max-w-full px-6 md:px-8 py-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative bg-white rounded-2xl p-5 border border-[#dde3e0] shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 left-0 h-1 w-full bg-linear-to-r from-primary/60 to-primary rounded-t-2xl" />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Workers</p>
                <p className="text-4xl font-black text-[#121614] mt-1">{dashboardData.length}</p>
                <p className="text-[10px] text-gray-400 mt-1 font-medium">Registered in system</p>
              </div>
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-xl">groups</span>
              </div>
            </div>
          </div>
          <div className="relative bg-white rounded-2xl p-5 border border-[#dde3e0] shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="absolute top-0 left-0 h-1 w-full bg-linear-to-r from-blue-400 to-blue-500 rounded-t-2xl" />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">On Duty Now</p>
                <p className="text-4xl font-black text-[#121614] mt-1">{activeCount}</p>
                <p className="text-[10px] text-gray-400 mt-1 font-medium">
                  {dashboardData.length > 0 ? Math.round((activeCount / dashboardData.length) * 100) : 0}% workforce active
                </p>
              </div>
              <div className="size-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-blue-500 text-xl">bolt</span>
              </div>
            </div>
          </div>
          <div className="relative bg-white rounded-2xl p-5 border border-[#dde3e0] shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="absolute top-0 left-0 h-1 w-full bg-linear-to-r from-orange-400 to-amber-500 rounded-t-2xl" />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Zones Covered</p>
                <p className="text-4xl font-black text-[#121614] mt-1">{zones.length}</p>
                <p className="text-[10px] text-gray-400 mt-1 font-medium">City collection areas</p>
              </div>
              <div className="size-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-orange-500 text-xl">map</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#dde3e0] shadow-sm p-3 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-xl pointer-events-none">
              search
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-11 pr-4 rounded-xl bg-[#f8faf9] border border-transparent text-[#121614] placeholder-gray-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
              placeholder="Search by name or worker ID…"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            )}
          </div>
 
          <div className="flex gap-2">
            {['All', 'ACTIVE', 'INACTIVE'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`h-10 px-4 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === s
                    ? s === 'ACTIVE'
                      ? 'bg-green-100 text-green-700 ring-1 ring-green-200'
                      : s === 'INACTIVE'
                      ? 'bg-red-100 text-red-700 ring-1 ring-red-200'
                      : 'bg-primary text-white shadow-sm'
                    : 'bg-[#f8faf9] text-gray-500 hover:bg-gray-100'
                }`}
              >
                {s === 'All' ? 'All Status' : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#dde3e0] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#dde3e0]">
                  {['Worker ID', 'Full Name', 'Contact', 'Zone', 'Status', "Today's Tasks", 'Actions'].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-[#f8faf9] whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f4f2]">
                {filteredWorkers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-300">
                        <span className="material-symbols-outlined text-5xl">search_off</span>
                        <p className="text-sm font-semibold text-gray-400">No workers found</p>
                        <p className="text-xs text-gray-300">Try adjusting your search or filter</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredWorkers.map((worker) => {
                    const progress = worker._count.assignedPickups
                      ? Math.round((worker.collectedCount / worker._count.assignedPickups) * 100)
                      : 0;
                    const isActive = worker.status === 'ACTIVE';
                    return (
                      <tr
                        key={worker.userId}
                        className="hover:bg-[#f8faf9] transition-colors group"
                      >
                        <td className="px-5 py-3.5">
                          <span className="text-xs font-mono font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                            #{worker.userId}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`size-9 rounded-xl ${getAvatarColor(worker.userId)} flex items-center justify-center font-black text-xs shrink-0`}>
                              {getInitials(worker.name)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#121614] leading-none">{worker.name}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">{worker.zone?.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <span className="material-symbols-outlined text-sm text-gray-300">phone</span>
                            {worker.phone}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">
                            <span className="material-symbols-outlined text-xs text-gray-400">location_on</span>
                            {worker.zone?.name}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-[11px] font-bold ${
                            isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                            <span className={`size-1.5 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex flex-col gap-1 w-28">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] text-gray-400 font-semibold">
                                {worker.collectedCount}/{worker._count.assignedPickups} tasks
                              </span>
                              <span className="text-[10px] font-black text-gray-500">{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-1.5 rounded-full transition-all duration-500 ${
                                  progress >= 80 ? 'bg-primary' : progress >= 40 ? 'bg-amber-400' : 'bg-gray-300'
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEditDrawer(worker)}
                              title="Edit worker"
                              className="size-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 transition-all"
                            >
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button
                              onClick={() => openMenu(worker)}
                              title="More options"
                              className="size-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
                            >
                              <span className="material-symbols-outlined text-lg">more_vert</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
 
          {/* Footer */}
          <div className="px-5 py-3 flex items-center justify-between border-t border-[#f0f4f2] bg-[#f8faf9]">
            <span className="text-[11px] font-semibold text-gray-400">
              Showing <span className="text-gray-600">{filteredWorkers.length}</span> of{' '}
              <span className="text-gray-600">{dashboardData.length}</span> workers
            </span>
            <div className="flex items-center gap-1">
              <button className="size-8 flex items-center justify-center rounded-lg border border-[#dde3e0] bg-white text-gray-400 hover:bg-gray-50 disabled:opacity-40 transition-all text-xs font-bold">
                <span className="material-symbols-outlined text-base">chevron_left</span>
              </button>
              <button className="size-8 flex items-center justify-center rounded-lg bg-primary text-white text-xs font-bold shadow-sm">
                1
              </button>
              <button className="size-8 flex items-center justify-center rounded-lg border border-[#dde3e0] bg-white text-gray-400 hover:bg-gray-50 transition-all text-xs font-bold">
                <span className="material-symbols-outlined text-base">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
 
      {/* ── Drawers / Dialogs ── */}
      <WorkerDrawer
        isOpen={!!selectedWorker}
        onClose={closeEditDrawer}
        worker={selectedWorker}
        zones={zones}
      />
      <WorkerMenuDialog
        isOpen={!!menuWorker}
        onClose={closeMenu}
        workerId={menuWorker?.userId}
        workerName={menuWorker?.name}
      />
      <AddWorkerDialog
        isOpen={isAddWorkerOpen}
        onClose={() => setIsAddWorkerOpen(false)}
      />
    </main>
  );
}
 
export default WorkerView;