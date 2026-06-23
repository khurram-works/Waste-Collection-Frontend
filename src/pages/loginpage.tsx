import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver } from "react-hook-form";
import * as yup from "yup";
import { useAuthNavigation } from "../hooks/useAuthNavigation";
import { toast } from "react-toastify";
import { loginUser } from "../api/auth";
import { useAuthContext } from "../context/authContext";

const ROLES = [
  { name: "Citizen", desc: "Submit requests & track earnings.", icon: "person" },
  { name: "Worker", desc: "View & complete assigned tasks.", icon: "engineering" },
  { name: "Admin", desc: "Manage system & assignments.", icon: "admin_panel_settings" },
];

const schema = yup.object({
  email: yup.string().email("Enter a valid email.").required("Email is required."),
  password: yup
    .string()
    .min(8, "Minimum 8 characters.")
    .matches(/[A-Z]/, "Need at least one uppercase letter.")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Need at least one special character.")
    .required("Password is required."),
});
type Form = yup.InferType<typeof schema>;

function LoginPage() {
  const { admin, worker, citizen, signup, home } = useAuthNavigation();
  const { setUser } = useAuthContext();
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: yupResolver(schema) as Resolver<Form>,
    mode: "onTouched",
  });

    const onSubmit = async (data: Form) => {
    try {
      const res = await toast.promise(loginUser(data as any), {
        pending: "Logging in...",
        success: "Logged in successfully!",
      });
      setUser(res.user);
      const map: Record<string, () => void> = {
        CITIZEN: citizen,
        WORKER: worker,
        ADMIN: admin,
      };
      (map[res.user.role] ?? (() => toast.error("Unknown role.")))();
    } catch (err: any) {
      toast.error(err?.message || "Login failed. Please try again.");
    }
  };

  const inputBase = (hasErr: boolean) =>
    `w-full h-11 px-4 rounded-xl border text-sm outline-none transition-all ${
      hasErr
        ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300/30"
        : "border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300/20"
    }`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .login-root { font-family: 'DM Sans', sans-serif; }
        .login-root * { box-sizing: border-box; }
        @keyframes loginSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .login-form-card { animation: loginSlideIn 0.45s ease both; }
        .role-chip {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 14px;
          border-radius: 12px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          transition: background 0.18s;
        }
        .role-chip:hover { background: rgba(255,255,255,0.1); }
      `}</style>

      <div className="login-root min-h-screen flex bg-gray-50">
        {/* ── Left panel ── */}
        <div
          className="hidden lg:flex lg:w-5/12 xl:w-[42%]"
          style={{
            background: "linear-gradient(160deg, #064e3b 0%, #065f46 50%, #047857 100%)",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "40px 44px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background decorations */}
          <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(16,185,129,0.12)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -60, left: -40, width: 240, height: 240, borderRadius: "50%", background: "rgba(13,148,136,0.1)", pointerEvents: "none" }} />

          {/* Logo */}
          <div style={{ position: "relative", zIndex: 1, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10 }} onClick={home}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>
              <span className="material-symbols-outlined" style={{ color: "#fff", fontSize: 19 }}>recycling</span>
            </div>
            <div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15, color: "#fff" }}>
                SmartWaste
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Platform</div>
            </div>
          </div>

          {/* Headline */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem, 2.5vw, 2.6rem)", color: "#fff", lineHeight: 1.15, letterSpacing: "-0.025em", marginBottom: 14 }}>
              A cleaner future,
              <br />
              <span style={{ color: "#6ee7b7" }}>powered by community.</span>
            </h1>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: 340, marginBottom: 36 }}>
              Join our platform to track, manage, and optimize recycling efforts across your city.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Platform Roles</div>
              {ROLES.map(r => (
                <div key={r.name} className="role-chip">
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(52,211,153,0.18)", border: "1px solid rgba(52,211,153,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span className="material-symbols-outlined" style={{ color: "#34d399", fontSize: 17 }}>{r.icon}</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 2 }}>{r.name}</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: "relative", zIndex: 1, fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
            © {new Date().getFullYear()} Smart Waste Platform
          </div>
        </div>

        {/* ── Right panel ── */}
        <div
          className="w-full lg:w-7/12 xl:w-[58%]"
          style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", position: "relative", background: "#fff" }}
        >
          {/* Mobile logo */}
          <div className="lg:hidden absolute top-5 left-5 flex items-center gap-2 cursor-pointer" onClick={home}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg, #10b981, #0d9488)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="material-symbols-outlined" style={{ color: "#fff", fontSize: 16 }}>recycling</span>
            </div>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: "#111827" }}>Smart<span style={{ color: "#059669" }}>Waste</span></span>
          </div>

          <div className="login-form-card w-full max-w-md" style={{ padding: "0 4px" }}>
            {/* Heading */}
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "clamp(1.6rem, 3vw, 2rem)", color: "#111827", letterSpacing: "-0.02em", marginBottom: 6 }}>
                Welcome back
              </h2>
              <p style={{ fontSize: 14, color: "#6b7280" }}>Sign in to your SmartWaste account.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 20 }} noValidate>
              {/* Email */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                  Email Address
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className={inputBase(!!errors.email)}
                />
                {errors.email && <p style={{ marginTop: 5, fontSize: 12, color: "#ef4444", fontWeight: 500 }}>{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Password</label>
                  <button type="button" style={{ fontSize: 13, fontWeight: 600, color: "#059669", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    Forgot password?
                  </button>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPass ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    {...register("password")}
                    className={inputBase(!!errors.password)}
                    style={{ paddingRight: 44 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#9ca3af" }}>{showPass ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
                {errors.password && <p style={{ marginTop: 5, fontSize: 12, color: "#ef4444", fontWeight: 500 }}>{errors.password.message}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: "100%", height: 48,
                  background: "linear-gradient(135deg, #10b981, #0d9488)",
                  color: "#fff", border: "none",
                  borderRadius: 12, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: "0 4px 16px rgba(16,185,129,0.28)",
                  opacity: isSubmitting ? 0.7 : 1,
                  transition: "opacity 0.2s, transform 0.15s",
                  marginTop: 4,
                }}
                onMouseEnter={e => { if (!isSubmitting) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, animation: "spin 1s linear infinite" }}>progress_activity</span>
                    Signing in…
                  </>
                ) : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
              <div style={{ flex: 1, height: 1, background: "#f3f4f6" }} />
              <span style={{ fontSize: 13, color: "#9ca3af" }}>New to SmartWaste?</span>
              <div style={{ flex: 1, height: 1, background: "#f3f4f6" }} />
            </div>

            <button
              onClick={signup}
              style={{
                width: "100%", height: 46,
                background: "#f9fafb", color: "#374151",
                border: "1.5px solid #e5e7eb",
                borderRadius: 12, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14, fontWeight: 600,
                transition: "border-color 0.18s, color 0.18s, background 0.18s",
              }}
              onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "#10b981"; b.style.color = "#059669"; b.style.background = "#ecfdf5"; }}
              onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "#e5e7eb"; b.style.color = "#374151"; b.style.background = "#f9fafb"; }}
            >
              Create a free account →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
