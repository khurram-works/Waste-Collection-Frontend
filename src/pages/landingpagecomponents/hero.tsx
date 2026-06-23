import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const STATS = [
  { icon: "group", value: "10+", label: "Citizens" },
  { icon: "scale", value: "10 kg", label: "Collected" },
  { icon: "account_balance_wallet", value: "Rs 100", label: "Paid Out" },
];

const TRUST = ["Municipal verified", "Instant payouts", "GPS-tracked pickups"];

function Hero() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    requestAnimationFrame(() => el.classList.add("hero-visible"));
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .hero-root { opacity: 0; transition: opacity 0.1s; }
        .hero-visible .h-item { animation-play-state: running; }

        @keyframes hFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes hFloat {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-7px); }
        }
        @keyframes hPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
          50%      { box-shadow: 0 0 0 8px rgba(16,185,129,0); }
        }
        .hero-visible { opacity: 1; }
        .h-item {
          opacity: 0;
          animation: hFadeUp 0.7s ease both;
          animation-play-state: paused;
        }
        .h-badge-float { animation: hFloat 3.8s ease-in-out infinite; }
        .h-live-dot { animation: hPulse 2s ease-in-out infinite; }

        .h-cta-primary {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 700;
          color: #fff;
          background: linear-gradient(135deg, #10b981 0%, #0d9488 100%);
          border: none;
          border-radius: 12px;
          padding: 0 28px; height: 52px;
          cursor: pointer;
          display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 0 4px 20px rgba(16,185,129,0.32);
          transition: transform 0.2s, box-shadow 0.2s;
          letter-spacing: 0.01em;
        }
        .h-cta-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(16,185,129,0.4); }
        .h-cta-primary:active { transform: translateY(0); }

        .h-cta-ghost {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 600;
          color: #374151;
          background: #fff;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          padding: 0 24px; height: 52px;
          cursor: pointer;
          display: inline-flex; align-items: center; gap: 8px;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .h-cta-ghost:hover { border-color: #10b981; color: #059669; background: #ecfdf5; }

        .h-stat-card {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 18px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          box-shadow: 0 1px 8px rgba(0,0,0,0.05);
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .h-stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1); transform: translateY(-2px); }

        .h-trust-tag {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500;
          color: #374151;
        }

        .h-float-badge {
          position: absolute;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 10px 16px;
          display: flex; align-items: center; gap: 10px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.10);
        }
      `}</style>

      <section
        ref={heroRef}
        className="hero-root"
        style={{
          width: "100%",
          background: "linear-gradient(180deg, #f0fdf4 0%, #ffffff 60%)",
          padding: "72px 20px 88px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: 1280, margin: "0 auto",
            display: "flex", flexWrap: "wrap",
            alignItems: "center", gap: 56,
          }}
        >
          {/* ── Left Content ── */}
          <div style={{ flex: "1 1 420px", display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Live pill */}
            <div
              className="h-item"
              style={{
                animationDelay: "0.05s",
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#ecfdf5", border: "1px solid #a7f3d0",
                borderRadius: 50, padding: "5px 14px", width: "fit-content",
              }}
            >
              <div
                className="h-live-dot"
                style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", flexShrink: 0 }}
              />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#059669" }}>
                Now live in Jhelum
              </span>
            </div>

            {/* Headline */}
            <h1
              className="h-item"
              style={{
                animationDelay: "0.12s",
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                color: "#111827",
                margin: 0,
              }}
            >
              Turn Recyclables
              <br />
              into{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #10b981, #0d9488)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Real Rewards.
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="h-item"
              style={{
                animationDelay: "0.22s",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "1.05rem",
                fontWeight: 400,
                color: "#4b5563",
                lineHeight: 1.75,
                maxWidth: 480,
                margin: 0,
              }}
            >
              A digital bridge connecting citizens, waste workers, and municipal
              authorities — making recycling effortless, transparent, and
              financially rewarding.
            </p>

            {/* CTAs */}
            <div className="h-item" style={{ animationDelay: "0.3s", display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="h-cta-primary" onClick={() => navigate("/register")}>
                Start Earning Today
                <span className="material-symbols-outlined" style={{ fontSize: 17 }}>arrow_forward</span>
              </button>
              <a href="#process" className="h-cta-ghost" style={{ textDecoration: "none" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 17, color: "#10b981" }}>play_circle</span>
                How it works
              </a>
            </div>

            {/* Stats */}
            <div className="h-item" style={{ animationDelay: "0.4s", display: "flex", flexWrap: "wrap", gap: 12 }}>
              {STATS.map((s, i) => (
                <div key={i} className="h-stat-card">
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: "#ecfdf5",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span className="material-symbols-outlined" style={{ color: "#10b981", fontSize: 19 }}>{s.icon}</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 17, color: "#111827", lineHeight: 1.2 }}>{s.value}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#6b7280", fontWeight: 500 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust signals */}
            <div className="h-item" style={{ animationDelay: "0.48s", display: "flex", flexWrap: "wrap", gap: "8px 20px" }}>
              {TRUST.map((t, i) => (
                <span key={i} className="h-trust-tag">
                  <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#10b981" }}>verified</span>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right Visual ── */}
          <div
            className="h-item"
            style={{
              animationDelay: "0.18s",
              flex: "1 1 380px",
              position: "relative",
              minHeight: 400,
            }}
          >
            {/* Decorative bg blob */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, #d1fae5, #ccfbf1 60%, #ecfdf5)",
                borderRadius: 28,
                transform: "rotate(-2.5deg) scale(1.02)",
              }}
            />
            {/* Image card */}
            <div
              style={{
                position: "relative",
                borderRadius: 22,
                overflow: "hidden",
                boxShadow: "0 24px 64px rgba(16,185,129,0.16), 0 8px 24px rgba(0,0,0,0.08)",
              }}
            >
              <img
                src="/landing.png"
                alt="Citizens recycling"
                style={{ width: "100%", display: "block", minHeight: 360, objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  height: 120,
                  background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent)",
                }}
              />
            </div>

            {/* Rate badge — bottom left */}
            <div
              className="h-float-badge h-badge-float"
              style={{ bottom: 24, left: -20 }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: "linear-gradient(135deg, #10b981, #0d9488)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span className="material-symbols-outlined" style={{ color: "#fff", fontSize: 17 }}>verified</span>
              </div>
              <div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: "#111827", lineHeight: 1.2 }}>Rs 100 / kg</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#6b7280" }}>PET Bottles</div>
              </div>
            </div>

            {/* Carbon badge — top right */}
            <div
              className="h-float-badge h-badge-float"
              style={{ top: 20, right: -16, animationDelay: "1.4s" }}
            >
              <span className="material-symbols-outlined" style={{ color: "#10b981", fontSize: 17 }}>eco</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#111827" }}>Carbon-neutral</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;
