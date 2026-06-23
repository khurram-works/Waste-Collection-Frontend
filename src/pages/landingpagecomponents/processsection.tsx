import React, { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    num: "01",
    icon: "calendar_add_on",
    title: "Submit a Request",
    desc: "Log in, choose your waste type, and schedule a doorstep pickup — done in under 90 seconds from any device.",
    badge: "90-sec setup",
    badgeIcon: "bolt",
    accent: "#10b981",
    bg: "#ecfdf5",
    border: "#a7f3d0",
  },
  {
    num: "02",
    icon: "local_shipping",
    title: "Verified Collection",
    desc: "A certified, GPS-tracked collector arrives at your door, weighs your recyclables on a calibrated scale, and verifies quality on the spot.",
    badge: "GPS-tracked",
    badgeIcon: "location_on",
    accent: "#3b82f6",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  {
    num: "03",
    icon: "account_balance_wallet",
    title: "Instant Wallet Credit",
    desc: "Earnings are calculated at live rates and deposited instantly to your digital wallet — ready to transfer, redeem, or donate.",
    badge: "Instant payout",
    badgeIcon: "bolt",
    accent: "#f59e0b",
    bg: "#fffbeb",
    border: "#fde68a",
  },
];

const TIMELINE = [
  { icon: "smartphone", label: "Request Submitted" },
  { icon: "local_shipping", label: "Collector En Route" },
  { icon: "check_circle", label: "Wallet Credited" },
];

function ProcessSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVis(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        @keyframes stepUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .ps-card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid #f3f4f6;
          padding: 28px;
          position: relative;
          overflow: hidden;
          opacity: 0;
          transition: transform 0.28s, box-shadow 0.28s;
        }
        .ps-card.vis { animation: stepUp 0.6s ease both; }
        .ps-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.08);
        }
        .ps-num {
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: 80px;
          position: absolute;
          top: 12px; right: 18px;
          color: #111827;
          opacity: 0.04;
          line-height: 1;
          letter-spacing: -0.04em;
          pointer-events: none;
          user-select: none;
        }
        .ps-badge {
          display: inline-flex; align-items: center; gap: 5px;
          border-radius: 50px;
          padding: 5px 12px;
          width: fit-content;
        }
        .ps-timeline-dot {
          width: 42px; height: 42px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid;
          flex-shrink: 0;
        }
      `}</style>

      <section
        id="process"
        ref={ref}
        style={{ width: "100%", background: "#fff", padding: "88px 20px" }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 20, marginBottom: 56 }}>
            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "#ecfdf5", border: "1px solid #a7f3d0",
                borderRadius: 50, padding: "5px 14px", marginBottom: 14,
              }}>
                <span className="material-symbols-outlined" style={{ color: "#10b981", fontSize: 14 }}>auto_awesome</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "#059669", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
                  Simple Process
                </span>
              </div>
              <h2 style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                color: "#111827",
                letterSpacing: "-0.025em",
                lineHeight: 1.15,
                margin: 0,
              }}>
                How It Works in 3 Steps
              </h2>
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#6b7280", maxWidth: 340, lineHeight: 1.7, margin: 0 }}>
              No bureaucracy. No waiting in lines. From request to payout — entirely on your phone.
            </p>
          </div>

          {/* Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 64 }}>
            {STEPS.map((s, i) => (
              <div
                key={i}
                className={`ps-card ${vis ? "vis" : ""}`}
                style={{ animationDelay: `${i * 0.14}s` }}
              >
                {/* Top accent bar */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${s.accent}, ${s.accent}88)`, borderRadius: "20px 20px 0 0" }} />
                <span className="ps-num">{s.num}</span>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: s.bg, border: `1px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="material-symbols-outlined" style={{ color: s.accent, fontSize: 26 }}>{s.icon}</span>
                  </div>
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%",
                    background: s.bg, border: `2px solid ${s.accent}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Outfit', sans-serif", fontWeight: 800,
                    fontSize: 13, color: s.accent,
                  }}>
                    {i + 1}
                  </div>
                </div>

                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 20, color: "#111827", marginBottom: 10, lineHeight: 1.25 }}>
                  {s.title}
                </h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#6b7280", lineHeight: 1.75, marginBottom: 18 }}>
                  {s.desc}
                </p>

                <div className="ps-badge" style={{ background: s.bg }}>
                  <span className="material-symbols-outlined" style={{ color: s.accent, fontSize: 14 }}>{s.badgeIcon}</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: s.accent }}>{s.badge}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline tracker */}
          <div style={{
            background: "#f9fafb", border: "1px solid #f3f4f6",
            borderRadius: 18, padding: "28px 32px",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexWrap: "wrap", gap: 0,
          }}>
            {TIMELINE.map((t, i) => (
              <React.Fragment key={i}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div
                    className="ps-timeline-dot"
                    style={{
                      background: i === 2 ? "linear-gradient(135deg, #10b981, #0d9488)" : "#fff",
                      borderColor: i === 2 ? "#10b981" : "#e5e7eb",
                      boxShadow: i === 2 ? "0 4px 14px rgba(16,185,129,0.28)" : "none",
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 17, color: i === 2 ? "#fff" : "#9ca3af" }}>{t.icon}</span>
                  </div>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: i === 2 ? "#059669" : "#9ca3af", textAlign: "center", maxWidth: 90, lineHeight: 1.3 }}>
                    {t.label}
                  </span>
                </div>
                {i < 2 && (
                  <div style={{
                    flex: 1, height: 2, maxWidth: 100,
                    background: i === 0
                      ? "linear-gradient(90deg, #a7f3d0, #d1d5db)"
                      : "linear-gradient(90deg, #d1d5db, #10b981)",
                    margin: "0 8px", marginBottom: 28,
                  }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default ProcessSection;
