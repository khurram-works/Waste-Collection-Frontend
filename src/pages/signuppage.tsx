import React, { useState, useEffect } from "react";
import { useForm, Controller, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { registerUser, getZones } from "../api/auth";
import { useAuthNavigation } from "../hooks/useAuthNavigation";
import { useAuthContext } from "../context/authContext";
import { userData, ZoneData } from "../Types/types";

const API_URL = import.meta.env.VITE_API_URL;
type LatLon = [number, number];

const schema = yup.object({
  name: yup
    .string()
    .required("Full name is required.")
    .min(3, "At least 3 characters."),
  email: yup.string().email("Invalid email.").required("Email is required."),
  password: yup
    .string()
    .min(8, "Min. 8 characters.")
    .matches(/[A-Z]/, "Need one uppercase letter.")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Need one special character.")
    .required("Password is required."),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords don't match.")
    .required("Please confirm password."),
  address: yup.string().required("Pickup address is required."),
  terms: yup.boolean().oneOf([true], "You must accept the terms.").required(),
  zoneId: yup
    .number()
    .min(1, "Please select a zone.")
    .required("Please select a zone."),
  latitude: yup.number().required(),
  longitude: yup.number().required(),
});
type FormData = yup.InferType<typeof schema>;

const fieldCls = (err: boolean) =>
  [
    "w-full h-11 px-4 rounded-xl border text-sm outline-none transition-all",
    "bg-white/80 placeholder:text-slate-300 text-slate-800",
    err
      ? "border-red-300 ring-2 ring-red-100 focus:border-red-400"
      : "border-slate-200 hover:border-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:bg-white",
  ].join(" ");

const Err = ({ msg }: { msg?: string }) =>
  msg ? (
    <p
      style={{
        marginTop: 5,
        fontSize: 11.5,
        fontWeight: 600,
        color: "#ef4444",
        display: "flex",
        alignItems: "center",
        gap: 3,
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 12 }}>
        error
      </span>
      {msg}
    </p>
  ) : null;

const Lbl = ({ children }: { children: React.ReactNode }) => (
  <p
    style={{
      fontSize: 11,
      fontWeight: 700,
      color: "#64748b",
      letterSpacing: "0.07em",
      textTransform: "uppercase",
      marginBottom: 5,
    }}
  >
    {children}
  </p>
);

const SectionDivider = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}
  >
    <span
      style={{
        fontSize: 10,
        fontWeight: 800,
        color: "#94a3b8",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        fontFamily: "'Outfit', sans-serif",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
    <div
      style={{
        flex: 1,
        height: 1,
        background: "linear-gradient(to right, #e2e8f0, transparent)",
      }}
    />
  </div>
);

function Logo({
  inverted,
  onClick,
}: {
  inverted?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 9,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          flexShrink: 0,
          background: inverted
            ? "rgba(255,255,255,0.15)"
            : "linear-gradient(135deg,#10b981,#0d9488)",
          border: inverted ? "1px solid rgba(255,255,255,0.22)" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: inverted ? "none" : "0 4px 14px rgba(16,185,129,0.32)",
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{ color: "#fff", fontSize: 17 }}
        >
          recycling
        </span>
      </div>
      <div>
        <div
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: 15,
            color: inverted ? "#fff" : "#111827",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
          }}
        >
          Smart
          <span style={{ color: inverted ? "#6ee7b7" : "#059669" }}>Waste</span>
        </div>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 9,
            fontWeight: 700,
            color: inverted ? "rgba(255,255,255,0.4)" : "#9ca3af",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Platform
        </div>
      </div>
    </div>
  );
}
const BENEFITS = [
  { icon: "schedule", text: "On-demand pickup scheduling" },
  { icon: "volunteer_activism", text: "Earn green rewards & cashback" },
  { icon: "location_on", text: "Live GPS tracking for your driver" },
  { icon: "bar_chart", text: "Personal recycling impact dashboard" },
];
const STATS = [
  { icon: "groups", value: "12+", label: "Users" },
  { icon: "recycling", value: "10t", label: "Waste diverted" },
  { icon: "eco", value: "4.9★", label: "App rating" },
];

export default function SignUpPage() {
  const { login, home } = useAuthNavigation();
  const { setUser } = useAuthContext();

  const [zones, setZones] = useState<ZoneData[]>([]);
  const [location, setLocation] = useState<LatLon | null>(null);
  const [locating, setLocating] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [showCfm, setShowCfm] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema) as Resolver<FormData>,
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      address: "",
      terms: false,
      zoneId: 0,
      latitude: undefined,
      longitude: undefined,
    },
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (p) => setLocation([p.coords.latitude, p.coords.longitude]),
      () => setLocating(false),
    );
  }, []);

  useEffect(() => {
    if (!location) return;
    const [lat, lon] = location;
    setValue("latitude", lat);
    setValue("longitude", lon);
    fetch(`${API_URL}/api/reverse-geocode?lat=${lat}&lon=${lon}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.address) setValue("address", d.address);
      })
      .catch(console.error)
      .finally(() => setLocating(false));
  }, [location, setValue]);

  useEffect(() => {
    getZones()
      .then((d) => setZones(d.zones))
      .catch(console.error);
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      const { confirmPassword, terms, ...payload } = data;
      const res = await toast.promise(registerUser(payload as userData), {
        pending: "Creating your account…",
        success: "Account created!",
        error: "Sign-up failed.",
      });
      setUser(res.user);
      login();
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong.");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
 
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
 
        /* Prevent the whole page from scrolling — only right column scrolls */
        html, body { height: 100%; overflow: hidden; }
 
        .sw { font-family: 'DM Sans', sans-serif; }
 
        /* ── Left panel ──────────────────────────────────────────────
           overflow:hidden clips the decorative pseudo-elements only.
           All real content is sized to fit exactly in 100vh via the
           flex column + controlled padding below.
        ── */
        .sw-panel {
          background: linear-gradient(155deg, #064e3b 0%, #065f46 45%, #047857 100%);
          position: relative;
          overflow: hidden;
        }
        .sw-panel::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 65% 55% at 15% 25%, rgba(16,185,129,0.22) 0%, transparent 60%),
            radial-gradient(ellipse 45% 65% at 85% 75%, rgba(5,150,105,0.18) 0%, transparent 55%),
            radial-gradient(ellipse 35% 45% at 55% 5%,  rgba(110,231,183,0.10) 0%, transparent 50%);
        }
        .sw-panel::after {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 26px 26px;
        }
 
        /* ── Right column scrolls independently ── */
        .sw-right {
          overflow-y: auto;
          overflow-x: hidden;
          height: 100vh;
          scrollbar-width: thin;
          scrollbar-color: #e2e8f0 transparent;
        }
        .sw-right::-webkit-scrollbar { width: 4px; }
        .sw-right::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
 
        /* ── Submit button ── */
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .sw-btn {
          width: 100%; height: 50px; border: none; border-radius: 13px;
          background: linear-gradient(135deg, #10b981 0%, #059669 55%, #0d9488 100%);
          color: #fff; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          cursor: pointer; position: relative; overflow: hidden;
          box-shadow: 0 4px 18px rgba(16,185,129,0.38), 0 1px 4px rgba(16,185,129,0.2);
          transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s;
        }
        .sw-btn::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%);
          background-size: 200% 100%; opacity: 0; transition: opacity 0.2s;
        }
        .sw-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 26px rgba(16,185,129,0.44), 0 2px 8px rgba(16,185,129,0.22); }
        .sw-btn:hover:not(:disabled)::after { opacity: 1; animation: shimmer 1.4s linear infinite; }
        .sw-btn:active:not(:disabled) { transform: translateY(0); }
        .sw-btn:disabled { opacity: 0.65; cursor: not-allowed; }
 
        /* ── Zone dropdown ── */
        .sw-zb {
          width: 100%; height: 44px; padding: 0 40px 0 14px;
          border-radius: 11px; border: 1px solid #e2e8f0;
          background: rgba(255,255,255,0.8); text-align: left;
          font-size: 14px; font-family: 'DM Sans', sans-serif;
          cursor: pointer; outline: none;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
        }
        .sw-zb:hover  { border-color: #94a3b8; background: #fff; }
        .sw-zb:focus  { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,0.1); background: #fff; }
        .sw-zb.err    { border-color: #fca5a5; }
 
        .sw-zopts {
          position: absolute; z-index: 50; top: calc(100% + 5px); left: 0;
          width: 100%; max-height: 190px; overflow-y: auto;
          background: #fff; border: 1px solid #e2e8f0; border-radius: 13px;
          box-shadow: 0 10px 36px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.05);
          padding: 5px;
          scrollbar-width: thin; scrollbar-color: #e2e8f0 transparent;
        }
        .sw-zopts::-webkit-scrollbar { width: 4px; }
        .sw-zopts::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
 
        .sw-zopt {
          padding: 9px 11px; border-radius: 9px; font-size: 13.5px;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          display: flex; align-items: center; gap: 8px; transition: background 0.1s;
        }
        .sw-zopt.hi           { background: #ecfdf5; color: #065f46; font-weight: 600; }
        .sw-zopt:not(.hi):hover { background: #f8fafc; }
 
        /* ── Animations ── */
        @keyframes swUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .sw-u1 { animation: swUp 0.42s cubic-bezier(.22,.68,0,1.15) both; }
        .sw-u2 { animation: swUp 0.42s 0.07s cubic-bezier(.22,.68,0,1.15) both; }
        .sw-u3 { animation: swUp 0.42s 0.14s cubic-bezier(.22,.68,0,1.15) both; }
 
        @keyframes spin { to { transform: rotate(360deg); } }
        .sw-spin { animation: spin 0.85s linear infinite; display: inline-flex; }
 
        /* ── Responsive: hide panel on narrow screens ── */
        @media (max-width: 820px) {
          .sw-panel-col { display: none !important; }
          .sw-form-col  { width: 100% !important;   }
        }
      `}</style>

      <div
        className="sw"
        style={{
          display: "flex",
          height: "100vh",
          overflow: "hidden",
          background: "#f8fafc",
        }}
      >
        <div
          className="sw-panel sw-panel-col"
          style={{
            width: 400,
            flexShrink: 0,
            height: "100vh",
          }}
        >
          <div
            style={{
              position: "relative",
              zIndex: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              padding: "26px 30px",
            }}
          >
            <Logo inverted onClick={home} />
            <div style={{ marginTop: 22 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  background: "rgba(110,231,183,0.14)",
                  border: "1px solid rgba(110,231,183,0.24)",
                  borderRadius: 99,
                  padding: "3px 11px",
                  marginBottom: 11,
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ color: "#6ee7b7", fontSize: 12 }}
                >
                  eco
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#6ee7b7",
                    letterSpacing: "0.04em",
                  }}
                >
                  Zero-waste, made simple
                </span>
              </div>
              <h1
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 800,
                  fontSize: "1.75rem",
                  color: "#fff",
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                  marginBottom: 9,
                }}
              >
                Smarter pickups.
                <br />
                <span style={{ color: "#6ee7b7" }}>Greener planet.</span>
              </h1>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.56)",
                  lineHeight: 1.7,
                }}
              >
                Schedule collections, track your recycling impact, and earn
                rewards — all in one platform built for a cleaner tomorrow.
              </p>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              {STATS.map((s) => (
                <div
                  key={s.label}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.11)",
                    borderRadius: 12,
                    backdropFilter: "blur(6px)",
                    padding: "10px 6px",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      color: "#6ee7b7",
                      fontSize: 16,
                      display: "block",
                      marginBottom: 3,
                    }}
                  >
                    {s.icon}
                  </span>
                  <div
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 800,
                      fontSize: 15,
                      color: "#fff",
                      lineHeight: 1,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.4)",
                      marginTop: 3,
                      fontWeight: 500,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 13,
                padding: "3px 13px",
                backdropFilter: "blur(8px)",
                marginTop: 18,
              }}
            >
              {BENEFITS.map((b, i) => (
                <div
                  key={b.text}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 0",
                    borderBottom:
                      i < BENEFITS.length - 1
                        ? "1px solid rgba(255,255,255,0.06)"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      flexShrink: 0,
                      borderRadius: 7,
                      background: "rgba(255,255,255,0.09)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ color: "#6ee7b7", fontSize: 14 }}
                    >
                      {b.icon}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 12.5,
                      color: "rgba(255,255,255,0.70)",
                      fontWeight: 500,
                      lineHeight: 1.4,
                    }}
                  >
                    {b.text}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 13,
                padding: "12px 13px",
                backdropFilter: "blur(8px)",
                marginTop: 14,
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.58)",
                  lineHeight: 1.65,
                  fontStyle: "italic",
                  marginBottom: 9,
                }}
              >
                "We diverted 2 tons of recyclables last quarter. The dashboard
                makes tracking impact effortless."
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: "linear-gradient(135deg,#10b981,#0d9488)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: 11,
                    color: "#fff",
                  }}
                >
                  JS
                </div>
                <div>
                  <div
                    style={{ fontSize: 11.5, fontWeight: 700, color: "#fff" }}
                  >
                    John Smith
                  </div>
                  <div
                    style={{ fontSize: 10, color: "rgba(255,255,255,0.36)" }}
                  >
                    Community Manager, Jhelum
                  </div>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", gap: 1 }}>
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined"
                      style={{ fontSize: 11, color: "#fbbf24" }}
                    >
                      star
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p
              style={{
                marginTop: "auto",
                paddingTop: 14,
                fontSize: 10.5,
                color: "rgba(255,255,255,0.25)",
                textAlign: "center",
              }}
            >
              © {new Date().getFullYear()} SmartWaste Platform · All rights
              reserved
            </p>
          </div>
        </div>

        <div className="sw-right sw-form-col" style={{ flex: 1 }}>
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 20,
              background: "rgba(248,250,252,0.88)",
              backdropFilter: "blur(12px)",
              borderBottom: "1px solid #f1f5f9",
              padding: "0 36px",
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={login}
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#059669",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              Already have an account?
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 15 }}
              >
                arrow_forward
              </span>
            </button>
          </div>
          <div
            style={{
              padding: "36px 40px 56px",
              maxWidth: 528,
              margin: "0 auto",
            }}
          >
            <div className="sw-u1" style={{ marginBottom: 28 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  background: "rgba(16,185,129,0.08)",
                  border: "1px solid rgba(16,185,129,0.18)",
                  borderRadius: 99,
                  padding: "3px 11px",
                  marginBottom: 12,
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ color: "#10b981", fontSize: 12 }}
                >
                  person_add
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#059669",
                    letterSpacing: "0.04em",
                  }}
                >
                  Free account · No credit card needed
                </span>
              </div>
              <h2
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.5rem,3vw,1.9rem)",
                  color: "#0f172a",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.2,
                  marginBottom: 7,
                }}
              >
                Create your account
              </h2>
              <p style={{ fontSize: 14.5, color: "#64748b", lineHeight: 1.6 }}>
                Join thousands scheduling smarter pickups and reducing waste
                every day.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{ display: "flex", flexDirection: "column", gap: 26 }}
              noValidate
            >
              <div className="sw-u2">
                <SectionDivider>Personal Info</SectionDivider>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 13,
                  }}
                >
                  <div>
                    <Lbl>Full Name</Lbl>
                    <input
                      type="text"
                      placeholder="e.g.  John Smith"
                      {...register("name")}
                      className={fieldCls(!!errors.name)}
                    />
                    <Err msg={errors.name?.message} />
                  </div>
                  <div>
                    <Lbl>Email Address</Lbl>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      {...register("email")}
                      className={fieldCls(!!errors.email)}
                    />
                    <Err msg={errors.email?.message} />
                  </div>
                </div>
              </div>
              <div className="sw-u3">
                <SectionDivider>Security</SectionDivider>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 13,
                  }}
                >
                  <div>
                    <Lbl>Password</Lbl>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showPass ? "text" : "password"}
                        placeholder="Min. 8 characters"
                        {...register("password")}
                        className={fieldCls(!!errors.password)}
                        style={{ paddingRight: 42 }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((v) => !v)}
                        style={{
                          position: "absolute",
                          right: 11,
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          display: "flex",
                          color: "#94a3b8",
                          transition: "color 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLButtonElement).style.color =
                            "#475569")
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLButtonElement).style.color =
                            "#94a3b8")
                        }
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: 17 }}
                        >
                          {showPass ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                    <Err msg={errors.password?.message} />
                  </div>
                  <div>
                    <Lbl>Confirm Password</Lbl>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showCfm ? "text" : "password"}
                        placeholder="Re-enter password"
                        {...register("confirmPassword")}
                        className={fieldCls(!!errors.confirmPassword)}
                        style={{ paddingRight: 42 }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCfm((v) => !v)}
                        style={{
                          position: "absolute",
                          right: 11,
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          display: "flex",
                          color: "#94a3b8",
                          transition: "color 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLButtonElement).style.color =
                            "#475569")
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLButtonElement).style.color =
                            "#94a3b8")
                        }
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: 17 }}
                        >
                          {showCfm ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                    <Err msg={errors.confirmPassword?.message} />
                  </div>
                </div>
                <div
                  style={{
                    marginTop: 10,
                    padding: "9px 13px",
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 7,
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "#16a34a", fontSize: 14, marginTop: 1 }}
                  >
                    info
                  </span>
                  <p
                    style={{ fontSize: 12, color: "#15803d", lineHeight: 1.55 }}
                  >
                    Use an <strong>uppercase letter</strong>, a{" "}
                    <strong>special character</strong>, and at least{" "}
                    <strong>8 characters</strong>.
                  </p>
                </div>
              </div>
              <div>
                <SectionDivider>Location</SectionDivider>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  <div>
                    <Lbl>Pickup Zone</Lbl>
                    <Controller
                      name="zoneId"
                      control={control}
                      render={({
                        field: { value, onChange },
                        fieldState: { error },
                      }) => (
                        <div>
                          <Listbox value={value} onChange={onChange}>
                            <div style={{ position: "relative" }}>
                              <ListboxButton
                                className={`sw-zb${error ? " err" : ""}`}
                                style={{
                                  color: value === 0 ? "#94a3b8" : "#0f172a",
                                }}
                              >
                                {zones.find((z) => z.zoneId === value)?.name ||
                                  "Select your pickup zone…"}
                                <span
                                  className="material-symbols-outlined"
                                  style={{
                                    position: "absolute",
                                    right: 11,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    fontSize: 18,
                                    color: "#94a3b8",
                                    pointerEvents: "none",
                                  }}
                                >
                                  expand_more
                                </span>
                              </ListboxButton>
                              <ListboxOptions className="sw-zopts">
                                {zones.length === 0 ? (
                                  <div
                                    style={{
                                      padding: "10px 14px",
                                      fontSize: 13,
                                      color: "#94a3b8",
                                      fontStyle: "italic",
                                    }}
                                  >
                                    Loading zones…
                                  </div>
                                ) : (
                                  zones.map((z) => (
                                    <ListboxOption
                                      key={z.zoneId}
                                      value={z.zoneId}
                                      className={({
                                        active,
                                        selected,
                                      }: {
                                        active: boolean;
                                        selected: boolean;
                                      }) =>
                                        `sw-zopt${active || selected ? " hi" : ""}`
                                      }
                                    >
                                      {({
                                        selected,
                                      }: {
                                        selected: boolean;
                                      }) => (
                                        <>
                                          {selected ? (
                                            <span
                                              className="material-symbols-outlined"
                                              style={{
                                                fontSize: 14,
                                                color: "#10b981",
                                              }}
                                            >
                                              check
                                            </span>
                                          ) : (
                                            <span
                                              style={{
                                                width: 14,
                                                display: "inline-block",
                                              }}
                                            />
                                          )}
                                          <span>{z.name}</span>
                                        </>
                                      )}
                                    </ListboxOption>
                                  ))
                                )}
                              </ListboxOptions>
                            </div>
                          </Listbox>
                          <Err msg={error?.message} />
                        </div>
                      )}
                    />
                  </div>

                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 5,
                      }}
                    >
                      <Lbl>Pickup Address</Lbl>
                      {locating && (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#10b981",
                            background: "#ecfdf5",
                            border: "1px solid #a7f3d0",
                            borderRadius: 99,
                            padding: "2px 8px",
                          }}
                        >
                          <span
                            className="material-symbols-outlined sw-spin"
                            style={{ fontSize: 11 }}
                          >
                            progress_activity
                          </span>
                          Detecting location…
                        </span>
                      )}
                    </div>
                    <textarea
                      rows={3}
                      placeholder="123 Main Street, Apartment 4B, Lahore…"
                      {...register("address")}
                      style={{
                        width: "100%",
                        padding: "11px 14px",
                        borderRadius: 12,
                        border: `1px solid ${errors.address ? "#fca5a5" : "#e2e8f0"}`,
                        background: "rgba(255,255,255,0.8)",
                        fontSize: 14,
                        lineHeight: 1.65,
                        fontFamily: "'DM Sans', sans-serif",
                        resize: "none",
                        outline: "none",
                        transition:
                          "border-color 0.15s, box-shadow 0.15s, background 0.15s",
                        color: "#0f172a",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#10b981";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(16,185,129,0.1)";
                        e.target.style.background = "#fff";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.address
                          ? "#fca5a5"
                          : "#e2e8f0";
                        e.target.style.boxShadow = "none";
                        e.target.style.background = "rgba(255,255,255,0.8)";
                      }}
                    />
                    {!locating && !errors.address && (
                      <p
                        style={{
                          marginTop: 5,
                          fontSize: 12,
                          color: "#94a3b8",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: 13, color: "#10b981" }}
                        >
                          check_circle
                        </span>
                        Auto-filled from GPS — please review before submitting.
                      </p>
                    )}
                    <Err msg={errors.address?.message} />
                  </div>
                </div>
              </div>
              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 11,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    {...register("terms")}
                    style={{
                      width: 18,
                      height: 18,
                      marginTop: 2,
                      flexShrink: 0,
                      cursor: "pointer",
                      accentColor: "#10b981",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 13.5,
                      color: "#64748b",
                      lineHeight: 1.65,
                    }}
                  >
                    I agree to the{" "}
                    <a
                      href="#"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        color: "#059669",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        color: "#059669",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Privacy Policy
                    </a>
                    . We will never sell your data.
                  </span>
                </label>
                <Err msg={errors.terms?.message} />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="sw-btn"
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="material-symbols-outlined sw-spin"
                        style={{ fontSize: 18 }}
                      >
                        progress_activity
                      </span>
                      Creating your account…
                    </>
                  ) : (
                    <>
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 18 }}
                      >
                        person_add
                      </span>
                      Create Free Account
                    </>
                  )}
                </button>
                <div
                  style={{
                    marginTop: 13,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                  }}
                >
                  <div style={{ display: "flex" }}>
                    {["A", "B", "C"].map((l, i) => (
                      <div
                        key={l}
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          background: `hsl(${158 + i * 18}, 58%, 42%)`,
                          border: "2px solid #f8fafc",
                          marginLeft: i > 0 ? -7 : 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: 8.5,
                          fontWeight: 800,
                          color: "#fff",
                        }}
                      >
                        {l}
                      </div>
                    ))}
                  </div>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>
                    Join <strong style={{ color: "#475569" }}>12+</strong> users
                    making a difference
                  </span>
                </div>
              </div>

              <p
                style={{
                  textAlign: "center",
                  fontSize: 13.5,
                  color: "#94a3b8",
                }}
              >
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={login}
                  style={{
                    color: "#059669",
                    fontWeight: 700,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 13.5,
                  }}
                >
                  Sign in →
                </button>
              </p>
            </form>
          </div>
          <div
            style={{
              padding: "14px 40px",
              borderTop: "1px solid #f1f5f9",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <p style={{ fontSize: 11.5, color: "#94a3b8" }}>
              © {new Date().getFullYear()} SmartWaste Platform. All rights
              reserved.
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              {["Privacy", "Terms", "Support"].map((l) => (
                <a
                  key={l}
                  href="#"
                  style={{
                    fontSize: 11.5,
                    color: "#94a3b8",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
