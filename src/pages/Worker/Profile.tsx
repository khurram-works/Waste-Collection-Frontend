import React, { useState, useEffect, useRef } from "react";
import { useAuthContext } from "../../context/authContext";
import { useForm, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { updatedWorkerProfile, updatedWorkerPassword, deleteWorkerAccount } from "../../api/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const personalInfoSchema = yup.object({
  name: yup.string().required("Name is required").min(3, "At least 3 characters"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .required("Phone is required")
    .matches(/^[0-9]{11}$/, "Must be exactly 11 digits"),
  address: yup.string().required("Address is required"),
});
type PersonalInfoFormValues = yup.InferType<typeof personalInfoSchema>;

const passwordSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .min(8, "Min. 8 characters")
    .matches(/[A-Z]/, "One uppercase letter required")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "One special character required")
    .required("New password is required")
    .notOneOf([yup.ref("currentPassword")], "Cannot be same as current password"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords don't match")
    .required("Please confirm your password"),
});
type PasswordFormValues = yup.InferType<typeof passwordSchema>;

/* ─────────────────────────────────────────────────────
   UTILITIES
───────────────────────────────────────────────────── */
const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");

const getStrength = (pw: string) => {
  if (!pw) return null;
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(pw)) s++;
  if (s <= 1) return { label: "Weak",   bars: 1, color: "#ef4444", labelColor: "#ef4444" };
  if (s <= 2) return { label: "Fair",   bars: 2, color: "#f59e0b", labelColor: "#d97706" };
  if (s <= 3) return { label: "Good",   bars: 3, color: "#10b981", labelColor: "#059669" };
  return             { label: "Strong", bars: 4, color: "#059669", labelColor: "#047857" };
};

/* ─────────────────────────────────────────────────────
   ATOMS
───────────────────────────────────────────────────── */
const Field = ({
  label,
  error,
  hint,
  children,
  col,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  col?: string;
}) => (
  <div className={`flex flex-col gap-1.5 ${col ?? ""}`}>
    <label className="block text-[11px] font-semibold tracking-[0.08em] uppercase text-[#6b7280]">
      {label}
    </label>
    {children}
    {hint && !error && (
      <p className="flex items-center gap-1 text-[11.5px] text-[#9ca3af] leading-snug">
        <span className="material-symbols-outlined flex-shrink-0" style={{ fontSize: 12 }}>
          info
        </span>
        {hint}
      </p>
    )}
    {error && (
      <p className="flex items-center gap-1 text-[11.5px] text-red-500 animate-[slideDown_.15s_ease]">
        <span className="material-symbols-outlined flex-shrink-0" style={{ fontSize: 13 }}>
          error
        </span>
        {error}
      </p>
    )}
  </div>
);

const inputBase =
  "h-[44px] w-full rounded-xl border border-[#e5e7eb] bg-[#fafafa] px-4 text-[13.5px] text-[#111827] placeholder:text-[#d1d5db] transition-all duration-150 outline-none focus:bg-white focus:border-[#059669] focus:ring-[3px] focus:ring-[#059669]/10 hover:border-[#d1d5db] hover:bg-white";

const textareaBase =
  "w-full rounded-t-xl px-4 py-3 text-[13.5px] text-[#111827] placeholder:text-[#d1d5db] transition-all duration-150 outline-none resize-none leading-relaxed bg-transparent focus:outline-none";

const EyeToggle = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
  <button
    type="button"
    tabIndex={-1}
    onClick={onToggle}
    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#c8cdd8] hover:text-[#059669] transition-colors p-0.5 rounded"
  >
    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
      {show ? "visibility_off" : "visibility"}
    </span>
  </button>
);

const Req = ({ met, label }: { met: boolean; label: string }) => (
  <div
    className={`flex items-center gap-1.5 text-[11.5px] transition-all duration-200 ${
      met ? "text-[#059669]" : "text-[#c8cdd8]"
    }`}
  >
    <span
      className="material-symbols-outlined transition-all duration-200"
      style={{ fontSize: 13 }}
    >
      {met ? "check_circle" : "radio_button_unchecked"}
    </span>
    {label}
  </div>
);

/* ─────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────── */
const WorkerProfileView = () => {
  const { user, setUser } = useAuthContext();
  const navigate = useNavigate();

  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showCfm, setShowCfm] = useState(false);
  const [pwVal, setPwVal]     = useState("");
  const [saveOk, setSaveOk]   = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "password" | "danger">("info");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<PersonalInfoFormValues>({
    resolver: yupResolver(personalInfoSchema) as Resolver<PersonalInfoFormValues>,
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: "",
      address: user.address,
    },
    mode: "onTouched",
  });

  const {
    register: regPw,
    handleSubmit: handlePw,
    reset: resetPw,
    watch: watchPw,
    formState: { errors: pwErrors, isSubmitting: isPwSubmitting },
  } = useForm<PasswordFormValues>({
    resolver: yupResolver(passwordSchema) as Resolver<PasswordFormValues>,
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    mode: "onTouched",
  });

  useEffect(() => {
    setPwVal(watchPw("newPassword") ?? "");
  }, [watchPw("newPassword")]);

  const strength    = getStrength(pwVal);
  const watchedName = watch("name");

  const onSubmit = async (data: PersonalInfoFormValues) => {
    try {
      await updatedWorkerProfile(data);
      setUser({ ...user, name: data.name, email: data.email, address: data.address });
      reset({ name: data.name, email: data.email, phone: "", address: data.address });
      setSaveOk(true);
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => setSaveOk(false), 2500);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const onPwSubmit = async (data: PasswordFormValues) => {
    try {
      await updatedWorkerPassword(data);
      resetPw();
      toast.success("Password updated successfully");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteWorkerAccount();
      setUser(null);
      localStorage.clear();
      navigate("/");
      toast.success("Account deleted successfully");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const tabs = [
    { key: "info",     icon: "manage_accounts", label: "Personal Info"  },
    { key: "password", icon: "lock",            label: "Password"       },
    { key: "danger",   icon: "warning",         label: "Danger Zone"    },
  ] as const;

  return (
    <main
      className="flex-1 w-full overflow-y-auto min-h-[calc(100vh-64px)]"
      style={{
        background: "linear-gradient(160deg, #f0fdf4 0%, #f7f8fa 40%, #f8fafc 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div className="max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[268px_1fr] gap-5 lg:gap-7 items-start">

          {/* ══════════════════════════════════════
              SIDEBAR
          ══════════════════════════════════════ */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-8">

            {/* Profile Card */}
            <div
              className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden"
              style={{ boxShadow: "0 1px 8px rgba(0,0,0,.06), 0 0 0 1px rgba(5,150,105,.03)" }}
            >
              <div
                className="relative h-[80px] overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #064e3b 0%, #047857 40%, #059669 70%, #34d399 100%)",
                }}
              >
                <svg
                  className="absolute inset-0 w-full h-full opacity-[.12]"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern id="dots" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1.2" fill="white" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#dots)" />
                </svg>
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 pointer-events-none" />
                <div className="absolute right-10 bottom-[-12px] h-10 w-10 rounded-full bg-white/[.07] pointer-events-none" />
              </div>

              <div className="px-5 mt-7 pb-5">
                {/* Avatar */}
                <div className="flex items-end gap-3 -mt-7 mb-4">
                  <div
                    className="h-[58px] w-[58px] rounded-2xl border-[3px] border-white flex items-center justify-center select-none flex-shrink-0"
                    style={{
                      background: "linear-gradient(145deg, #047857, #10b981)",
                      boxShadow: "0 4px 14px rgba(5,150,105,.32)",
                    }}
                  >
                    <span
                      className="text-white text-[19px] font-black leading-none"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      {getInitials(watchedName || user.name || "?")}
                    </span>
                  </div>
                  <div className="pb-0.5 min-w-0">
                    <div
                      className="text-[14.5px] font-bold text-[#111827] leading-tight truncate"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      {user.name}
                    </div>
                    <div className="text-[11px] text-[#9ca3af] mt-0.5 truncate">{user.email}</div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-1.5 mb-4">
                  <div className="inline-flex items-center gap-1.5 bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] text-[10.5px] font-semibold rounded-full px-2.5 py-[3px]">
                    <span className="material-symbols-outlined" style={{ fontSize: 11 }}>
                      engineering
                    </span>
                    Verified Worker
                  </div>
                  <div className="inline-flex items-center gap-1.5 bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] text-[10.5px] font-semibold rounded-full px-2.5 py-[3px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </div>
                </div>

                <div className="h-px bg-[#f3f4f6] mb-4" />

                {/* Meta info */}
                <div className="space-y-2.5">
                  {[
                    { icon: "home_pin",   label: "Address",   val: user.address || "Not set" },
                    { icon: "badge",      label: "Role",      val: "Worker"                   },
                    { icon: "tag",        label: "Worker ID", val: user.userId || "—"         },
                  ].map(({ icon, label, val }) => (
                    <div key={label} className="flex items-start gap-2.5">
                      <span
                        className="material-symbols-outlined text-[#d1d5db] flex-shrink-0 mt-[1px]"
                        style={{ fontSize: 14 }}
                      >
                        {icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10.5px] text-[#9ca3af] block leading-none mb-[3px]">
                          {label}
                        </span>
                        <span className="text-[12px] font-semibold text-[#374151] leading-snug line-clamp-2">
                          {val}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tab Nav */}
            <div
              className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}
            >
              <div className="p-2 space-y-0.5">
                {tabs.map(({ key, icon, label }) => {
                  const isActive = activeTab === key;
                  const isDanger = key === "danger";
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveTab(key)}
                      className={`w-full flex items-center gap-3 px-3.5 py-[10px] rounded-xl text-[12.5px] font-semibold transition-all duration-200 group ${
                        isActive
                          ? isDanger
                            ? "bg-red-50 text-red-600"
                            : "bg-emerald-50 text-emerald-700"
                          : isDanger
                          ? "text-[#9ca3af] hover:bg-red-50/60 hover:text-red-500"
                          : "text-[#6b7280] hover:bg-[#f9fafb] hover:text-[#374151]"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined flex-shrink-0 transition-colors duration-200 ${
                          isActive
                            ? isDanger
                              ? "text-red-500"
                              : "text-emerald-600"
                            : "text-[#c8cdd8] group-hover:text-current"
                        }`}
                        style={{ fontSize: 16 }}
                      >
                        {icon}
                      </span>
                      {label}
                      {isActive && (
                        <span
                          className={`ml-auto h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                            isDanger ? "bg-red-500" : "bg-emerald-500"
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Official Assignment Card */}
            <div
              className="bg-white rounded-2xl border border-[#e5e7eb] p-4 hidden lg:block"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}
            >
              <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#c8cdd8] mb-3">
                Official Assignment
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Zone",    val: "Zone A",  icon: "map",             color: "#059669", bg: "#f0fdf4" },
                  { label: "Vehicle", val: "ABC-123", icon: "local_shipping",  color: "#0ea5e9", bg: "#f0f9ff" },
                ].map(({ label, val, icon, color, bg }) => (
                  <div key={label} className="rounded-xl p-3 text-center" style={{ background: bg }}>
                    <span
                      className="material-symbols-outlined block mx-auto mb-1"
                      style={{ fontSize: 18, color }}
                    >
                      {icon}
                    </span>
                    <div
                      className="text-[13px] font-black leading-none truncate"
                      style={{ color, fontFamily: "'Outfit', sans-serif" }}
                    >
                      {val}
                    </div>
                    <div className="text-[10px] text-[#9ca3af] mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════
              FORM PANEL
          ══════════════════════════════════════ */}
          <div
            className="bg-white rounded-2xl border border-[#e5e7eb]"
            style={{ boxShadow: "0 1px 8px rgba(0,0,0,.06)" }}
          >
            {/* Panel Header */}
            <div className="px-6 md:px-8 pt-6 pb-5 border-b border-[#f3f4f6]">
              <div className="flex items-center gap-3">
                <div>
                  <h2
                    className="text-[16px] font-bold text-[#111827] tracking-[-0.01em]"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {activeTab === "info"
                      ? "Personal Information"
                      : activeTab === "password"
                      ? "Change Password"
                      : "Danger Zone"}
                  </h2>
                  <p className="text-[12px] text-[#9ca3af] mt-0.5">
                    {activeTab === "info"
                      ? "Manage your profile details and contact information"
                      : activeTab === "password"
                      ? "Update your account password and security"
                      : "Irreversible account actions — proceed carefully"}
                  </p>
                </div>
              </div>

              {/* Tab pills — mobile only */}
              <div className="flex items-center gap-2 mt-4 lg:hidden overflow-x-auto pb-0.5 scrollbar-none">
                {tabs.map(({ key, label }) => {
                  const isActive = activeTab === key;
                  const isDanger = key === "danger";
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveTab(key)}
                      className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11.5px] font-semibold transition-all duration-200 border ${
                        isActive
                          ? isDanger
                            ? "bg-red-50 text-red-600 border-red-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-transparent text-[#9ca3af] border-[#e5e7eb] hover:border-[#d1d5db]"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Personal Info Tab ── */}
            {activeTab === "info" && (
              <div className="px-6 md:px-8 py-7 space-y-5 animate-[fadeSlide_.2s_ease]">

                {/* Name */}
                <Field label="Full Name" error={errors.name?.message}>
                  <div className="relative">
                    <span
                      className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#d1d5db] pointer-events-none"
                      style={{ fontSize: 16 }}
                    >
                      person
                    </span>
                    <input
                      {...register("name")}
                      type="text"
                      placeholder="Ahmad Raza"
                      className={`${inputBase} pl-10`}
                    />
                  </div>
                </Field>

                {/* Email */}
                <Field
                  label="Email Address"
                  error={errors.email?.message}
                  hint="Contact support to change your email address."
                >
                  <div className="relative">
                    <span
                      className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#d1d5db] pointer-events-none"
                      style={{ fontSize: 16 }}
                    >
                      mail
                    </span>
                    <input
                      {...register("email")}
                      type="email"
                      readOnly
                      className={`${inputBase} pl-10 pr-10 bg-[#f9fafb] cursor-not-allowed text-[#9ca3af]`}
                    />
                    <span
                      className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-[#d1d5db]"
                      style={{ fontSize: 14 }}
                    >
                      lock
                    </span>
                  </div>
                </Field>

                {/* Phone */}
                <Field label="Phone Number" error={errors.phone?.message}>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center gap-2 pl-3.5 border-r border-[#e5e7eb] pr-3 pointer-events-none z-10 select-none">
                      <span className="text-[13px]">🇵🇰</span>
                      <span className="text-[11px] font-bold text-[#9ca3af]">+92</span>
                    </div>
                    <input
                      {...register("phone")}
                      type="tel"
                      placeholder="03XXXXXXXXX"
                      className={`${inputBase} pl-[76px]`}
                    />
                  </div>
                </Field>

                {/* Address */}
                <Field label="Primary Address" error={errors.address?.message}>
                  <div
                    className="rounded-xl border border-[#e5e7eb] bg-[#fafafa] overflow-hidden transition-all duration-150 focus-within:border-[#059669] focus-within:ring-[3px] focus-within:ring-[#059669]/10 focus-within:bg-white hover:border-[#d1d5db] hover:bg-white"
                  >
                    <div className="flex items-start gap-2.5 pt-3 px-4 pb-1">
                      <span
                        className="material-symbols-outlined text-[#d1d5db] mt-[2px] flex-shrink-0"
                        style={{ fontSize: 16 }}
                      >
                        location_on
                      </span>
                      <textarea
                        {...register("address")}
                        rows={3}
                        placeholder="Street, Block, City, Province"
                        className={textareaBase}
                      />
                    </div>
                    <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#f0fdf4] border-t border-[#d1fae5] mt-1">
                      <span
                        className="material-symbols-outlined text-[#6ee7b7] flex-shrink-0"
                        style={{ fontSize: 12 }}
                      >
                        route
                      </span>
                      <span className="text-[10.5px] text-[#6ee7b7] font-medium leading-relaxed">
                        Used for route planning and shift assignments
                      </span>
                    </div>
                  </div>
                </Field>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-[#f3f4f6]">
                  <button
                    type="button"
                    onClick={() =>
                      reset({
                        name: user.name,
                        email: user.email,
                        phone: "",
                        address: user.address,
                      })
                    }
                    className={`text-[12.5px] font-semibold text-[#9ca3af] hover:text-[#6b7280] transition-all duration-200 flex items-center gap-1.5 ${
                      !isDirty ? "opacity-0 pointer-events-none" : ""
                    }`}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                      undo
                    </span>
                    Discard changes
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting || !isDirty}
                    className={`h-10 px-6 rounded-xl text-[13px] font-bold transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[.98] ${
                      saveOk
                        ? "bg-[#ecfdf5] text-[#059669] border-2 border-[#a7f3d0]"
                        : "bg-[#059669] text-white hover:bg-[#047857]"
                    }`}
                    style={
                      !saveOk
                        ? { boxShadow: "0 1px 4px rgba(5,150,105,.3), 0 0 0 1px #047857" }
                        : {}
                    }
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Saving…
                      </>
                    ) : saveOk ? (
                      <>
                        <span className="material-symbols-outlined" style={{ fontSize: 15 }}>check_circle</span>
                        Saved!
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined" style={{ fontSize: 15 }}>save</span>
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ── Password Tab ── */}
            {activeTab === "password" && (
              <div className="px-6 md:px-8 py-7 space-y-5 animate-[fadeSlide_.2s_ease]">

                {/* Current password */}
                <Field label="Current Password" error={pwErrors.currentPassword?.message}>
                  <div className="relative">
                    <span
                      className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#d1d5db] pointer-events-none"
                      style={{ fontSize: 16 }}
                    >
                      lock
                    </span>
                    <input
                      {...regPw("currentPassword")}
                      type={showCur ? "text" : "password"}
                      placeholder="••••••••"
                      className={`${inputBase} pl-10 pr-10`}
                    />
                    <EyeToggle show={showCur} onToggle={() => setShowCur((v) => !v)} />
                  </div>
                </Field>

                {/* New + confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="New Password" error={pwErrors.newPassword?.message}>
                    <div className="relative">
                      <span
                        className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#d1d5db] pointer-events-none"
                        style={{ fontSize: 16 }}
                      >
                        lock_open
                      </span>
                      <input
                        {...regPw("newPassword")}
                        type={showNew ? "text" : "password"}
                        placeholder="••••••••"
                        className={`${inputBase} pl-10 pr-10`}
                      />
                      <EyeToggle show={showNew} onToggle={() => setShowNew((v) => !v)} />
                    </div>
                  </Field>

                  <Field label="Confirm New Password" error={pwErrors.confirmPassword?.message}>
                    <div className="relative">
                      <span
                        className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#d1d5db] pointer-events-none"
                        style={{ fontSize: 16 }}
                      >
                        lock_reset
                      </span>
                      <input
                        {...regPw("confirmPassword")}
                        type={showCfm ? "text" : "password"}
                        placeholder="••••••••"
                        className={`${inputBase} pl-10 pr-10`}
                      />
                      <EyeToggle show={showCfm} onToggle={() => setShowCfm((v) => !v)} />
                    </div>
                  </Field>
                </div>

                {/* Strength meter */}
                {pwVal && strength && (
                  <div className="rounded-xl border border-[#f0f0f0] bg-[#fafafa] px-4 py-4 space-y-3 animate-[fadeSlide_.18s_ease]">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5 flex-1">
                        {[1, 2, 3, 4].map((b) => (
                          <div key={b} className="flex-1 h-[5px] rounded-full bg-[#eeeeee] overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-400"
                              style={{
                                width: b <= strength.bars ? "100%" : "0%",
                                background: b <= strength.bars ? strength.color : "transparent",
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      <span
                        className="text-[11px] font-bold w-12 text-right"
                        style={{ color: strength.labelColor }}
                      >
                        {strength.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                      <Req met={pwVal.length >= 8}                        label="8+ characters"     />
                      <Req met={/[A-Z]/.test(pwVal)}                      label="Uppercase letter"  />
                      <Req met={/[0-9]/.test(pwVal)}                      label="Number included"   />
                      <Req met={/[!@#$%^&*(),.?":{}|<>]/.test(pwVal)}     label="Special character" />
                    </div>
                  </div>
                )}

                {/* Tip */}
                <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
                  <span
                    className="material-symbols-outlined text-amber-400 flex-shrink-0 mt-[1px]"
                    style={{ fontSize: 15 }}
                  >
                    tips_and_updates
                  </span>
                  <p className="text-[11.5px] text-amber-700 leading-relaxed">
                    Use a unique password you haven't used on other sites. Mix letters, numbers, and symbols for better security.
                  </p>
                </div>

                {/* Update button */}
                <div className="pt-1 border-t border-[#f3f4f6]">
                  <button
                    type="button"
                    onClick={handlePw(onPwSubmit)}
                    disabled={isPwSubmitting}
                    className="h-10 px-6 rounded-xl border-2 border-[#059669] text-[#059669] text-[13px] font-bold hover:bg-[#059669] hover:text-white transition-all duration-150 disabled:opacity-50 flex items-center gap-2 active:scale-[.98]"
                  >
                    {isPwSubmitting ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Updating…
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined" style={{ fontSize: 15 }}>lock_reset</span>
                        Update Password
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ── Danger Zone Tab ── */}
            {activeTab === "danger" && (
              <div className="px-6 md:px-8 py-7 animate-[fadeSlide_.2s_ease]">

                {/* Warning callout */}
                <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3.5 mb-6">
                  <span
                    className="material-symbols-outlined text-red-400 flex-shrink-0 mt-[1px]"
                    style={{ fontSize: 17 }}
                  >
                    warning
                  </span>
                  <p className="text-[12px] text-red-600 leading-relaxed">
                    Actions in this section are <strong>permanent and cannot be undone</strong>. Please read carefully before proceeding.
                  </p>
                </div>

                {/* Delete account card */}
                <div className="rounded-xl border border-[#fecdd3] bg-white overflow-hidden">
                  <div className="px-5 py-4 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span
                          className="material-symbols-outlined text-red-500"
                          style={{ fontSize: 16 }}
                        >
                          person_remove
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p
                          className="text-[13px] font-bold text-[#be123c] leading-tight"
                          style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                          Delete Account
                        </p>
                        <p className="text-[12px] text-[#fb7185] mt-1 leading-relaxed max-w-[320px]">
                          Permanently removes your profile, work history, assignments, and all associated data.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleDeleteAccount}
                      className="flex-shrink-0 h-9 px-4 rounded-xl border border-[#fda4af] text-[#f43f5e] text-[12px] font-bold hover:bg-[#f43f5e] hover:text-white hover:border-[#f43f5e] transition-all duration-150 active:scale-[.97]"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="px-5 py-3 bg-[#fff1f2] border-t border-[#fecdd3]">
                    <p className="text-[10.5px] text-[#fda4af] leading-relaxed">
                      Once deleted, your data cannot be recovered. This action is irreversible.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-3px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </main>
  );
};

export default WorkerProfileView;