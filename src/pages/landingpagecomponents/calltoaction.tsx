import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const METRICS = [
  { value: "10+", label: "Active citizens" },
  { value: "10 kg", label: "Waste recycled" },
  { value: "Rs 100", label: "Rewards paid" },
  { value: "100%", label: "Satisfaction" },
];

function CallToAction() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.2 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .cta-section {
          position: relative;
          width: 100%;
          background: #064e3b;
          overflow: hidden;
          padding: 100px 20px;
        }

        @keyframes ctaOrb {
          0%,100% { transform: scale(1); opacity: 0.6; }
          50%      { transform: scale(1.12); opacity: 0.9; }
        }
        @keyframes ctaItemUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slowSpin {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to   { transform: translate(-50%,-50%) rotate(360deg); }
        }

        .cta-metric { opacity: 0; }
        .cta-metric.vis { animation: ctaItemUp 0.55s ease both; }

        .cta-btn-main {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 700;
          color: #064e3b;
          background: #34d399;
          border: none;
          border-radius: 12px;
          padding: 0 32px; height: 52px;
          cursor: pointer;
          display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 0 4px 20px rgba(52,211,153,0.38);
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          letter-spacing: 0.01em;
        }
        .cta-btn-main:hover { background: #10b981; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(52,211,153,0.45); }
        .cta-btn-main:active { transform: translateY(0); }

        .cta-btn-ghost {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 600;
          color: rgba(255,255,255,0.7);
          background: rgba(255,255,255,0.07);
          border: 1.5px solid rgba(255,255,255,0.15);
          border-radius: 12px;
          padding: 0 28px; height: 52px;
          cursor: pointer;
          display: inline-flex; align-items: center; gap: 8px;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .cta-btn-ghost:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.3); color: #fff; }
      `}</style>

      <section className="cta-section" ref={ref}>
        {/* Orb decorations */}
        <div style={{ position: "absolute", top: "-120px", right: "-80px", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.22) 0%, transparent 70%)", animation: "ctaOrb 6s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-100px", left: "-60px", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(13,148,136,0.18) 0%, transparent 70%)", animation: "ctaOrb 8s ease-in-out infinite reverse", pointerEvents: "none" }} />

        {/* Spinning rings */}
        {[640, 480].map((size, i) => (
          <div key={i} style={{
            position: "absolute", top: "50%", left: "50%",
            width: size, height: size,
            border: `1px solid rgba(255,255,255,${i === 0 ? 0.04 : 0.06})`,
            borderRadius: "50%",
            animation: `slowSpin ${30 - i * 8}s linear infinite ${i % 2 === 1 ? "reverse" : ""}`,
            pointerEvents: "none",
          }} />
        ))}

        {/* Content */}
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.25)",
            borderRadius: 50, padding: "6px 18px", marginBottom: 28,
          }}>
            <span className="material-symbols-outlined" style={{ color: "#34d399", fontSize: 14 }}>eco</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "#34d399", letterSpacing: "0.07em", textTransform: "uppercase" as const }}>
              Join the movement
            </span>
          </div>

          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
            color: "#fff",
            lineHeight: 1.12,
            letterSpacing: "-0.03em",
            marginBottom: 20,
          }}>
            Ready to Make Your City
            <br />
            <span style={{ color: "#34d399" }}>Cleaner & Richer?</span>
          </h2>

          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.58)", lineHeight: 1.75, maxWidth: 480, margin: "0 auto 40px" }}>
            Join our growing community earning real rewards while building a sustainable future. Takes under 2 minutes to get started.
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 64 }}>
            <button className="cta-btn-main" onClick={() => navigate(token ? "/citizen" : "/register")}>
              <span className="material-symbols-outlined" style={{ fontSize: 17 }}>{token ? "dashboard" : "person_add"}</span>
              {token ? "Go to Dashboard" : "Create Free Account"}
            </button>
            <button className="cta-btn-ghost" onClick={() => navigate("/login")}>
              <span className="material-symbols-outlined" style={{ fontSize: 17 }}>play_circle</span>
              Watch Demo
            </button>
          </div>

          <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 48 }} />

          {/* Metrics */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 0 }}>
            {METRICS.map((m, i) => (
              <React.Fragment key={i}>
                <div className={`cta-metric ${vis ? "vis" : ""}`} style={{ animationDelay: `${0.08 + i * 0.1}s`, padding: "0 28px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "clamp(1.5rem, 3vw, 2.2rem)", color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                    {m.value}
                  </span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.42)", fontWeight: 500, marginTop: 4 }}>
                    {m.label}
                  </span>
                </div>
                {i < METRICS.length - 1 && (
                  <div style={{ width: 1, height: 44, background: "rgba(255,255,255,0.1)", alignSelf: "center" }} />
                )}
              </React.Fragment>
            ))}
          </div>

          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.28)", marginTop: 36 }}>
            ✓ No credit card required &nbsp;·&nbsp; ✓ Free to join &nbsp;·&nbsp; ✓ Backed by Municipal Corp.
          </p>
        </div>
      </section>
    </>
  );
}

export default CallToAction;
