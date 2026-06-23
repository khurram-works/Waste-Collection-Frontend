import React, { useEffect, useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useForm, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { registerWorker } from "../../api/auth";
import { toast } from "react-toastify";
 
const STEPS = [
  { id: 1, label: "Personal", icon: "person" },
  { id: 2, label: "Assignment", icon: "badge" },
  { id: 3, label: "Credentials", icon: "lock" },
];
 
const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  phone: yup
    .string()
    .nullable()
    .max(20, "Max 20 characters")
    .matches(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s]?[(]?[0-9]{1,4}[)]?[-\s]?[0-9]{1,6}[-\s]?[0-9]{1,6}$/,
      "Enter a valid phone number"
    ),
  zoneId: yup.number().required("Zone is required"),
  vehicle: yup.string().required("Vehicle Number is required"),
  status: yup.boolean().required("Account Status is required"),
  assignedRoute: yup.string().required("Route is required"),
  password: yup
    .string()
    .min(8, "Minimum 8 characters")
    .matches(/[A-Z]/, "Must include an uppercase letter")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Must include a special character")
    .required("Password is required"),
});
 
type WorkerValues = yup.InferType<typeof schema>;
 
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase", pass: /[A-Z]/.test(password) },
    { label: "Special char", pass: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const colors = ['bg-red-300', 'bg-amber-400', 'bg-primary'];
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full transition-all duration-300 ${
              i < score ? colors[score - 1] : 'bg-gray-100'
            }`}
          />
        ))}
      </div>
      <div className="flex gap-3">
        {checks.map((c) => (
          <span key={c.label} className={`text-[10px] font-semibold flex items-center gap-0.5 ${c.pass ? 'text-primary' : 'text-gray-300'}`}>
            <span className="material-symbols-outlined text-xs">{c.pass ? 'check_circle' : 'radio_button_unchecked'}</span>
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}
 
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1 text-red-500 text-xs mt-1 font-medium">
      <span className="material-symbols-outlined text-xs">error</span>
      {message}
    </p>
  );
}
 
function AddWorkerDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
 
  const {
    register,
    handleSubmit,
    reset,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<WorkerValues>({
    resolver: yupResolver(schema) as Resolver<WorkerValues>,
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      zoneId: 0,
      vehicle: "",
      status: true,
      password: "",
      assignedRoute: "",
    },
  });
 
  const emailValue = watch("email");
  const passwordValue = watch("password") || "";
  const statusValue = watch("status");
 
  // Reset step when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => { setCurrentStep(1); reset(); }, 300);
    }
  }, [isOpen]);
 
  const stepFields: Record<number, (keyof WorkerValues)[]> = {
    1: ["name", "email", "phone"],
    2: ["zoneId", "vehicle", "assignedRoute", "status"],
    3: ["password"],
  };
 
  const goNext = async () => {
    const valid = await trigger(stepFields[currentStep]);
    if (valid) setCurrentStep((s) => Math.min(s + 1, 3));
  };
 
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1));
 
  const onSubmit = async (data: WorkerValues) => {
    try {
      const payload = { ...data, status: data.status ? "ACTIVE" : "INACTIVE" };
      await toast.promise(registerWorker(payload as any), {
        pending: "Creating worker account…",
        success: "Worker created successfully!",
        error: "Failed to create worker",
      });
      reset();
      onClose();
    } catch (error: any) {
      toast.error(error?.message);
    }
  };
 
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50 focus:outline-none">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px]" aria-hidden="true" />
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
          <DialogPanel
            transition
            className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl shadow-2xl flex flex-col duration-300 ease-out data-closed:scale-95 data-closed:opacity-0 overflow-hidden max-h-screen sm:max-h-[90vh]"
          >
            {/* ── Header ── */}
            <div className="px-6 pt-6 pb-4 border-b border-[#f0f4f2] flex-shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#121614]">Add New Worker</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Register a municipal waste management staff member</p>
                </div>
                <button
                  onClick={onClose}
                  className="size-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all -mt-1 -mr-1"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
 
              {/* Step Indicator */}
              <div className="flex items-center gap-0 mt-5">
                {STEPS.map((step, i) => (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div
                        className={`size-8 rounded-full flex items-center justify-center font-black text-xs transition-all duration-300 ${
                          currentStep > step.id
                            ? 'bg-primary text-white'
                            : currentStep === step.id
                            ? 'bg-primary text-white shadow-md shadow-primary/30'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {currentStep > step.id ? (
                          <span className="material-symbols-outlined text-sm">check</span>
                        ) : (
                          step.id
                        )}
                      </div>
                      <span className={`text-[9px] font-bold mt-1 ${currentStep >= step.id ? 'text-primary' : 'text-gray-400'}`}>
                        {step.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 mb-3 rounded transition-all duration-500 ${currentStep > step.id ? 'bg-primary' : 'bg-gray-100'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
 
            {/* ── Form Body ── */}
            <form
              id="add-worker-form"
              onSubmit={handleSubmit(onSubmit)}
              className="flex-1 overflow-y-auto"
            >
              <div className="px-6 py-5 space-y-4">
 
                {/* STEP 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="size-6 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-sm">person</span>
                      </div>
                      <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Personal Information</h3>
                    </div>
 
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                      <input
                        {...register("name")}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#dde3e0] bg-[#f8faf9] text-sm font-medium text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
                        placeholder="e.g. Muhammad Ali Khan"
                        type="text"
                      />
                      <FieldError message={errors.name?.message} />
                    </div>
 
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Email Address <span className="text-red-400">*</span></label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-lg pointer-events-none">mail</span>
                          <input
                            {...register("email")}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#dde3e0] bg-[#f8faf9] text-sm font-medium text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
                            placeholder="worker@municipality.gov"
                            type="email"
                          />
                        </div>
                        <FieldError message={errors.email?.message} />
                      </div>
 
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Phone Number</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-lg pointer-events-none">phone</span>
                          <input
                            {...register("phone")}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#dde3e0] bg-[#f8faf9] text-sm font-medium text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
                            placeholder="+92 300 0000000"
                            type="tel"
                          />
                        </div>
                        <FieldError message={errors.phone?.message} />
                      </div>
                    </div>
                  </div>
                )}
 
                {/* STEP 2: Official Assignment */}
                {currentStep === 2 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="size-6 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-sm">badge</span>
                      </div>
                      <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Official Assignment</h3>
                    </div>
 
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Zone <span className="text-red-400">*</span></label>
                        <select
                          {...register("zoneId")}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#dde3e0] bg-[#f8faf9] text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all appearance-none"
                        >
                          <option value="">Select Zone</option>
                          <option value={2}>Zone A</option>
                          <option value={3}>Zone B</option>
                          <option value={4}>Zone C</option>
                          <option value={5}>Zone D</option>
                        </select>
                        <FieldError message={errors.zoneId?.message} />
                      </div>
 
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Vehicle Number <span className="text-red-400">*</span></label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-lg pointer-events-none">local_shipping</span>
                          <input
                            {...register("vehicle")}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#dde3e0] bg-[#f8faf9] text-sm font-medium text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
                            placeholder="e.g. TRK-204"
                            type="text"
                          />
                        </div>
                        <FieldError message={errors.vehicle?.message} />
                      </div>
                    </div>
 
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-2">Assigned Route <span className="text-red-400">*</span></label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: 'recycling', label: 'Recycling', icon: 'recycling', desc: 'Recyclable materials' },
                          { value: 'landfill', label: 'Landfill', icon: 'delete_sweep', desc: 'General waste' },
                        ].map((route) => {
                          const routeValue = watch("assignedRoute");
                          return (
                            <label
                              key={route.value}
                              className={`relative flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                routeValue === route.value
                                  ? 'border-primary bg-primary/5'
                                  : 'border-[#dde3e0] bg-[#f8faf9] hover:border-gray-300'
                              }`}
                            >
                              <input
                                {...register("assignedRoute")}
                                type="radio"
                                value={route.value}
                                className="sr-only"
                              />
                              <span className={`material-symbols-outlined text-2xl ${routeValue === route.value ? 'text-primary' : 'text-gray-300'}`}>
                                {route.icon}
                              </span>
                              <span className={`text-sm font-bold ${routeValue === route.value ? 'text-primary' : 'text-gray-500'}`}>{route.label}</span>
                              <span className="text-[10px] text-gray-400">{route.desc}</span>
                            </label>
                          );
                        })}
                      </div>
                      <FieldError message={errors.assignedRoute?.message} />
                    </div>
 
                    {/* Account Status */}
                    <div className="flex items-center justify-between bg-[#f8faf9] rounded-xl border border-[#dde3e0] p-4">
                      <div>
                        <p className="text-sm font-bold text-gray-700">Account Status</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Worker will be able to log in immediately</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input {...register("status")} className="sr-only peer" type="checkbox" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all shadow-inner" />
                        <span className="ml-3 text-xs font-bold text-gray-500">
                          {statusValue ? 'Active' : 'Inactive'}
                        </span>
                      </label>
                    </div>
                  </div>
                )}
 
                {/* STEP 3: Credentials */}
                {currentStep === 3 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="size-6 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-sm">lock</span>
                      </div>
                      <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Login Credentials</h3>
                    </div>
 
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Email (auto-filled)</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/40 text-lg pointer-events-none">mail</span>
                        <input
                          value={emailValue}
                          disabled
                          readOnly
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary/10 bg-primary/5 text-primary text-sm font-bold cursor-not-allowed"
                          type="text"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 font-medium flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-xs">info</span>
                        Sourced from personal info step
                      </p>
                    </div>
 
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Temporary Password <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-lg pointer-events-none">lock</span>
                        <input
                          {...register("password")}
                          type={showPassword ? "text" : "password"}
                          className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-[#dde3e0] bg-[#f8faf9] text-sm font-medium text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
                          placeholder="Min. 8 characters"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">
                            {showPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                      {passwordValue && <PasswordStrength password={passwordValue} />}
                      <FieldError message={errors.password?.message} />
                    </div>
 
                    {/* Summary Card */}
                    <div className="bg-[#f8faf9] rounded-xl border border-[#dde3e0] p-4 space-y-2">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Review Summary</p>
                      {[
                        { icon: 'person', label: 'Name', value: watch('name') || '—' },
                        { icon: 'mail', label: 'Email', value: watch('email') || '—' },
                        { icon: 'location_on', label: 'Zone ID', value: watch('zoneId') ? `Zone ${watch('zoneId')}` : '—' },
                        { icon: 'route', label: 'Route', value: watch('assignedRoute') || '—' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2 text-xs">
                          <span className="material-symbols-outlined text-gray-300 text-sm">{item.icon}</span>
                          <span className="text-gray-400 font-medium w-12 flex-shrink-0">{item.label}</span>
                          <span className="text-gray-700 font-semibold truncate">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </form>
 
            {/* ── Footer ── */}
            <div className="px-6 py-4 bg-[#f8faf9] border-t border-[#f0f4f2] flex items-center justify-between gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={currentStep === 1 ? onClose : goBack}
                className="px-5 py-2.5 rounded-xl border border-[#dde3e0] text-gray-600 text-sm font-bold hover:bg-white transition-all"
              >
                {currentStep === 1 ? 'Cancel' : (
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back
                  </span>
                )}
              </button>
 
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-1.5"
                >
                  Next
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              ) : (
                <button
                  form="add-worker-form"
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                      Creating…
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">person_add</span>
                      Create Worker
                    </>
                  )}
                </button>
              )}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
 
export default AddWorkerDialog;
