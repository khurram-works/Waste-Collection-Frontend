import React from "react";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  {
    tier: "best" as const,
    icon: "recycling",
    title: "High-Value Recyclables",
    price: "Rs 100",
    unit: "per kg",
    accent: "#10b981",
    bg: "#ecfdf5",
    border: "#a7f3d0",
    badgeBg: "#10b981",
    badgeColor: "#fff",
    badgeLabel: "Best Value",
    items: [
      { icon: "water_bottle", label: "PET Bottles (Clean)", ok: true },
      { icon: "package_2", label: "Cardboard Boxes", ok: true },
      { icon: "coffee", label: "Metal Cans & Tins", ok: true },
    ],
    note: "Items must be clean, empty, and properly sorted.",
    cta: "Start Collecting",
  },
  {
    tier: "moderate" as const,
    icon: "newspaper",
    title: "Paper Products",
    price: "Rs 50",
    unit: "per kg",
    accent: "#f59e0b",
    bg: "#fffbeb",
    border: "#fde68a",
    badgeBg: "#fef3c7",
    badgeColor: "#92400e",
    badgeLabel: "Moderate Value",
    items: [
      { icon: "description", label: "Mixed Paper", ok: true },
      { icon: "article", label: "Newspapers", ok: true },
      { icon: "book", label: "Magazines", ok: true },
    ],
    note: "Dry paper only — no grease, stains, or moisture.",
    cta: "Start Collecting",
  },
  {
    tier: "none" as const,
    icon: "delete",
    title: "Non-Recyclable",
    price: "N/A",
    unit: "Standard disposal",
    accent: "#9ca3af",
    bg: "#f9fafb",
    border: "#e5e7eb",
    badgeBg: "#f3f4f6",
    badgeColor: "#374151",
    badgeLabel: "No Earnings",
    items: [
      { icon: "lunch_dining", label: "Organic / Food Waste", ok: false },
      { icon: "dangerous", label: "Hazardous Materials", ok: false },
      { icon: "home", label: "General Household Waste", ok: false },
    ],
    note: "Responsibly directed to composting or certified landfill.",
    cta: "Learn More",
  },
];

const TRUST_ITEMS = [
  { icon: "verified_user", text: "Municipal verified" },
  { icon: "payments", text: "Instant wallet credit" },
  { icon: "support_agent", text: "Support 7 days a week" },
];

function WasteTypesSection() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .wt-card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid #f3f4f6;
          padding: 28px;
          display: flex; flex-direction: column;
          position: relative;
          overflow: hidden;
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .wt-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.09); }
        .wt-card-bar { position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 20px 20px 0 0; }
        .wt-item { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f9fafb; }
        .wt-item:last-child { border-bottom: none; }
        .wt-item-icon { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .wt-cta {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 700;
          border: none; border-radius: 12px;
          height: 44px; width: 100%;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: opacity 0.2s, transform 0.15s;
          margin-top: 20px;
          letter-spacing: 0.01em;
        }
        .wt-cta:hover { opacity: 0.88; transform: translateY(-1px); }
        .wt-cta:active { transform: translateY(0); }
      `}</style>

      <section
        id="pricing"
        style={{ width: "100%", background: "#f9fafb", padding: "88px 20px" }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#ecfdf5", border: "1px solid #a7f3d0",
              borderRadius: 50, padding: "5px 14px", marginBottom: 14,
            }}>
              <span className="material-symbols-outlined" style={{ color: "#10b981", fontSize: 14 }}>payments</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "#059669", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
                Transparent Pricing
              </span>
            </div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "#111827", letterSpacing: "-0.025em", lineHeight: 1.15, margin: "0 0 12px" }}>
              What We Collect & How You Earn
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#6b7280", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
              Every kilogram of properly sorted recyclable earns you real money, credited instantly to your digital wallet.
            </p>
          </div>

          {/* Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {CATEGORIES.map((cat, i) => (
              <div key={i} className="wt-card">
                <div className="wt-card-bar" style={{ background: cat.tier === "best" ? "linear-gradient(90deg, #10b981, #0d9488)" : cat.tier === "moderate" ? "linear-gradient(90deg, #f59e0b, #d97706)" : "#e5e7eb" }} />

                {/* Top row */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: cat.bg, border: `1px solid ${cat.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="material-symbols-outlined" style={{ color: cat.accent, fontSize: 21 }}>{cat.icon}</span>
                  </div>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" as const, background: cat.badgeBg, color: cat.badgeColor, borderRadius: 50, padding: "4px 12px" }}>
                    {cat.badgeLabel}
                  </span>
                </div>

                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, color: "#111827", marginBottom: 6 }}>
                  {cat.title}
                </h3>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 20 }}>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 30, color: cat.tier === "none" ? "#9ca3af" : cat.accent, letterSpacing: "-0.02em" }}>
                    {cat.price}
                  </span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#9ca3af", fontWeight: 500 }}>{cat.unit}</span>
                </div>

                <div style={{ height: 1, background: "#f3f4f6", marginBottom: 14 }} />

                <div style={{ flex: 1 }}>
                  {cat.items.map((item, j) => (
                    <div key={j} className="wt-item">
                      <div className="wt-item-icon" style={{ background: item.ok ? cat.bg : "#f3f4f6" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 15, color: item.ok ? cat.accent : "#9ca3af" }}>
                          {item.ok ? "check_circle" : "cancel"}
                        </span>
                      </div>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: item.ok ? "#1f2937" : "#9ca3af", fontWeight: item.ok ? 500 : 400 }}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Note */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginTop: 16, padding: "10px 12px", background: "#f9fafb", borderRadius: 10 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#9ca3af", marginTop: 1, flexShrink: 0 }}>info</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#9ca3af", lineHeight: 1.5 }}>{cat.note}</span>
                </div>

                <button
                  className="wt-cta"
                  onClick={() => navigate("/register")}
                  style={{
                    background: cat.tier === "best"
                      ? "linear-gradient(135deg, #10b981, #0d9488)"
                      : cat.tier === "moderate"
                        ? "#fffbeb"
                        : "#f3f4f6",
                    color: cat.tier === "best" ? "#fff" : cat.tier === "moderate" ? "#92400e" : "#6b7280",
                    boxShadow: cat.tier === "best" ? "0 4px 16px rgba(16,185,129,0.28)" : "none",
                  }}
                >
                  {cat.cta}
                  {cat.tier !== "none" && (
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Trust strip */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 32, marginTop: 40, flexWrap: "wrap" }}>
            {TRUST_ITEMS.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span className="material-symbols-outlined" style={{ color: "#10b981", fontSize: 16 }}>{t.icon}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#6b7280", fontWeight: 500 }}>{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default WasteTypesSection;
