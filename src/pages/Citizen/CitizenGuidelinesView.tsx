import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
const CATEGORIES = [
  {
    tier: "High Value",
    rate: "Rs 100 / kg",
    colorVar: "emerald",
    gradient: "linear-gradient(135deg, #059669 0%, #0d9488 100%)",
    glow: "0 20px 60px -12px rgba(5,150,105,0.35)",
    bg: "rgba(236,253,245,0.7)",
    borderColor: "#6ee7b7",
    tagColor: "#065f46",
    tagBg: "#d1fae5",
    items: [
      {
        label: "PET Plastic Bottles",
        detail: "Clear & colored — caps removed",
      },
      { label: "Corrugated Cardboard", detail: "Flattened, grease-free" },
      { label: "Aluminum & Tin Cans", detail: "Rinsed, labels optional" },
    ],
    tip: "Rinse & flatten. Every gram counts toward your earnings.",
    level: 3,
  },
  {
    tier: "Standard Value",
    rate: "Rs 50 / kg",
    colorVar: "amber",
    gradient: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
    glow: "0 20px 60px -12px rgba(217,119,6,0.3)",
    bg: "rgba(255,251,235,0.7)",
    borderColor: "#fcd34d",
    tagColor: "#78350f",
    tagBg: "#fef3c7",
    items: [
      { label: "Mixed Office Paper", detail: "No coatings or laminate" },
      { label: "Newspapers & Magazines", detail: "Bundled neatly, bone dry" },
    ],
    tip: "Paper loses all value when wet. Keep it dry until collection.",
    level: 2,
  },
  {
    tier: "Non-Recyclable",
    rate: "General Waste",
    colorVar: "slate",
    gradient: "linear-gradient(135deg, #475569 0%, #334155 100%)",
    glow: "0 20px 60px -12px rgba(71,85,105,0.2)",
    bg: "rgba(248,250,252,0.7)",
    borderColor: "#cbd5e1",
    tagColor: "#1e293b",
    tagBg: "#f1f5f9",
    items: [
      { label: "Food & Organic Waste", detail: "Compost or municipal bin" },
      {
        label: "Soft Plastics & Bags",
        detail: "Film, cling wrap, carrier bags",
      },
      { label: "Glass & Textiles", detail: "Clothing, bottles & jars" },
    ],
    tip: "Contaminated loads reduce value for the entire batch.",
    level: 1,
  },
];

const FAQS = [
  {
    q: "What happens if I mix waste categories?",
    a: "Mixed batches significantly reduce processing efficiency and your earnings. Our collection teams assess each pickup — contaminated loads may receive partial credit or be declined entirely. Always use separate, labeled bags for each category.",
  },
  {
    q: "Why is glass not currently accepted?",
    a: "Broken glass poses safety risks for collection partners and requires specialized sorting equipment we are actively working to integrate. Please dispose of glass through local municipal channels in the meantime.",
  },
  {
    q: "How exactly are my earnings calculated?",
    a: "Earnings are strictly weight-based and vary by material tier. High-value materials (PET, metals, cardboard) yield the highest rate per kilogram. Your total is computed at the point of collection after an in-person weigh-in.",
  },
  {
    q: "Can I schedule recurring pickups?",
    a: "Yes. After your first successful request, you can opt into a weekly or bi-weekly schedule directly from your dashboard. One-off collections remain available anytime.",
  },
];

const CHECKLIST = [
  { icon: "💧", label: "Rinse all containers", ok: true },
  { icon: "📦", label: "Flatten cardboard", ok: true },
  { icon: "🛍️", label: "Separate bags per tier", ok: true },
  { icon: "🍽️", label: "No food residue", ok: false },
];

function useInView(
  threshold = 0.15,
): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const el = ref.current;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
}

function ValueBar({ level }) {
  return (
    <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            width: "18px",
            height: "4px",
            borderRadius: "2px",
            background:
              i <= level
                ? level === 3
                  ? "#10b981"
                  : level === 2
                    ? "#f59e0b"
                    : "#94a3b8"
                : "rgba(0,0,0,0.08)",
            transition: "background 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}

function CategoryCard({ cat, index }) {
  const [hovered, setHovered] = useState(false);
  const [ref, visible] = useInView();

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#ffffff",
        borderRadius: "20px",
        border: `1.5px solid ${hovered ? cat.borderColor : "rgba(0,0,0,0.06)"}`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.32s cubic-bezier(0.34,1.56,0.64,1)",
        transform: visible
          ? hovered
            ? "translateY(-6px) scale(1.01)"
            : "translateY(0) scale(1)"
          : "translateY(24px) scale(0.97)",
        opacity: visible ? 1 : 0,
        transitionDelay: `${index * 80}ms`,
        boxShadow: hovered ? cat.glow : "0 2px 12px rgba(0,0,0,0.05)",
        cursor: "default",
        willChange: "transform, opacity",
      }}
    >
      <div
        style={{
          background: cat.gradient,
          padding: "22px 26px 18px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='28' fill='none' stroke='rgba(255,255,255,0.06)' stroke-width='1'/%3E%3C/svg%3E\") repeat",
            backgroundSize: "40px 40px",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(8px)",
                borderRadius: "6px",
                padding: "3px 10px",
                marginBottom: "12px",
              }}
            >
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                {cat.tier}
              </span>
            </div>
            <div
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "28px",
                fontWeight: 600,
                color: "#ffffff",
                lineHeight: 1.1,
                textShadow: "0 1px 4px rgba(0,0,0,0.12)",
              }}
            >
              {cat.rate}
            </div>
          </div>
          <ValueBar level={cat.level} />
        </div>
      </div>
      <div
        style={{
          padding: "22px 26px",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "0 0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "13px",
          }}
        >
          {cat.items.map((item) => (
            <li
              key={item.label}
              style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}
            >
              <div
                style={{
                  marginTop: "5px",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: cat.gradient,
                  flexShrink: 0,
                  boxShadow: `0 0 6px ${cat.borderColor}`,
                }}
              />
              <div>
                <div
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: "13.5px",
                    color: "#111827",
                    marginBottom: "2px",
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "12px",
                    color: "#9ca3af",
                  }}
                >
                  {item.detail}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div
          style={{
            marginTop: "20px",
            paddingTop: "16px",
            borderTop: "1px dashed rgba(0,0,0,0.07)",
            display: "flex",
            gap: "8px",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "6px",
              background: cat.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              flexShrink: 0,
              marginTop: "1px",
            }}
          >
            💡
          </div>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "12px",
              color: "#6b7280",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {cat.tip}
          </p>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer, defaultOpen, index }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      style={{
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        transition: "background 0.2s ease",
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "12px",
              fontWeight: 600,
              color: "#10b981",
              opacity: 0.6,
              minWidth: "20px",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: "14.5px",
              color: "#111827",
              lineHeight: 1.5,
            }}
          >
            {question}
          </span>
        </div>
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "10px",
            flexShrink: 0,
            background: open
              ? "linear-gradient(135deg, #059669, #0d9488)"
              : "rgba(0,0,0,0.04)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.25s ease",
            boxShadow: open ? "0 4px 12px rgba(5,150,105,0.3)" : "none",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d={open ? "M2 6h8" : "M6 2v8M2 6h8"}
              stroke={open ? "#fff" : "#6b7280"}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </button>
      <div
        style={{
          maxHeight: open ? "200px" : "0",
          overflow: "hidden",
          transition: "max-height 0.38s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "14px",
            color: "#6b7280",
            lineHeight: 1.85,
            margin: "0 0 22px",
            paddingLeft: "34px",
            paddingRight: "52px",
          }}
        >
          {answer}
        </p>
      </div>
    </div>
  );
}

function ChecklistCard({ item, index }) {
  const [ref, visible] = useInView(0.1);
  return (
    <div
      ref={ref}
      style={{
        background: "#ffffff",
        borderRadius: "18px",
        border: item.ok
          ? "1.5px solid rgba(16,185,129,0.2)"
          : "1.5px solid rgba(239,68,68,0.15)",
        padding: "24px 20px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "12px",
        transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        transform: visible ? "translateY(0)" : "translateY(20px)",
        opacity: visible ? 1 : 0,
        transitionDelay: `${index * 70}ms`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: item.ok
            ? "linear-gradient(90deg, #059669, #0d9488)"
            : "linear-gradient(90deg, #ef4444, #f97316)",
          borderRadius: "18px 18px 0 0",
        }}
      />
      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "16px",
          background: item.ok
            ? "linear-gradient(135deg, #ecfdf5, #d1fae5)"
            : "linear-gradient(135deg, #fef2f2, #fee2e2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
        }}
      >
        {item.icon}
      </div>
      <span
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 600,
          fontSize: "13px",
          color: "#374151",
          lineHeight: 1.4,
        }}
      >
        {item.label}
      </span>
      <div
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          background: item.ok
            ? "linear-gradient(135deg, #059669, #0d9488)"
            : "#ef4444",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "12px",
          fontWeight: 800,
          boxShadow: item.ok
            ? "0 4px 12px rgba(5,150,105,0.35)"
            : "0 4px 12px rgba(239,68,68,0.3)",
        }}
      >
        {item.ok ? "✓" : "✕"}
      </div>
    </div>
  );
}
export default function RecyclingGuidelines() {
  const navigate = useNavigate();
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .rg-root *, .rg-root *::before, .rg-root *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
        ::selection { background: #6ee7b7; color: #064e3b; }
 
        .rg-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #f8fafc;
          min-height: 100vh;
        }
 
        .rg-hero {
          position: relative;
          overflow: hidden;
          padding: 80px 48px 72px;
          background: #0a0f0d;
        }
 
        .rg-hero-mesh {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 80% at 10% 50%, rgba(5,150,105,0.28) 0%, transparent 60%),
            radial-gradient(ellipse 50% 60% at 80% 20%, rgba(13,148,136,0.22) 0%, transparent 55%),
            radial-gradient(ellipse 40% 40% at 60% 90%, rgba(16,185,129,0.14) 0%, transparent 50%);
          pointer-events: none;
        }
 
        .rg-hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }
 
        .rg-hero-noise {
          position: absolute;
          inset: 0;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          pointer-events: none;
        }
 
        .rg-stat-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          borderRadius: 100px;
          padding: 10px 18px;
          backdrop-filter: blur(12px);
        }
 
        .rg-section-label {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #059669;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }
 
        .rg-section-label::before {
          content: '';
          display: inline-block;
          width: 18px;
          height: 2px;
          background: linear-gradient(90deg, #059669, #0d9488);
          border-radius: 2px;
        }
 
        .rg-h2 {
          font-family: 'Fraunces', serif;
          font-size: 32px;
          font-weight: 600;
          color: #0f172a;
          line-height: 1.12;
          margin-bottom: 6px;
        }
 
        .rg-subtext {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          color: #94a3b8;
          line-height: 1.7;
        }
 
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
 
        .rg-btn-primary {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 700;
          font-size: 14px;
          background: linear-gradient(135deg, #059669, #0d9488);
          color: #fff;
          border: none;
          border-radius: 14px;
          padding: 14px 32px;
          cursor: pointer;
          letter-spacing: 0.01em;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.22s ease;
          box-shadow: 0 8px 24px -4px rgba(5,150,105,0.45);
          position: relative;
          overflow: hidden;
        }
 
        .rg-btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }
 
        .rg-btn-primary:hover::before { opacity: 1; }
        .rg-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px -4px rgba(5,150,105,0.5); }
        .rg-btn-primary:active { transform: translateY(0); }
 
        .rg-btn-ghost {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          font-size: 14px;
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 14px;
          padding: 14px 28px;
          cursor: pointer;
          transition: all 0.22s ease;
          backdrop-filter: blur(8px);
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
 
        .rg-btn-ghost:hover {
          background: rgba(255,255,255,0.13);
          color: #fff;
          border-color: rgba(255,255,255,0.2);
        }
      `}</style>

      <div className="rg-root">
        <section className="rg-hero">
          <div className="rg-hero-mesh" />
          <div className="rg-hero-grid" />
          <div className="rg-hero-noise" />

          {[
            { size: 320, top: "-100px", right: "-60px", opacity: 0.12 },
            { size: 180, top: "60px", right: "120px", opacity: 0.07 },
            { size: 80, bottom: "40px", left: "300px", opacity: 0.09 },
          ].map((ring, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: ring.size,
                height: ring.size,
                borderRadius: "50%",
                border: `1px solid rgba(16,185,129,${ring.opacity})`,
                top: ring.top,
                right: ring.right,
                bottom: ring.bottom,
                left: ring.left,
                pointerEvents: "none",
              }}
            />
          ))}

          <div
            style={{
              maxWidth: "920px",
              margin: "0 auto",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.2)",
                borderRadius: "100px",
                padding: "6px 14px 6px 8px",
                marginBottom: "28px",
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(12px)",
                transition: "all 0.5s ease",
              }}
            >
              <div
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #059669, #0d9488)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                }}
              >
                ♻️
              </div>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#6ee7b7",
                }}
              >
                SmartWaste · Recycling Program
              </span>
            </div>

            <h1
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "clamp(40px, 6vw, 68px)",
                fontWeight: 600,
                color: "#ffffff",
                lineHeight: 1.05,
                margin: "0 0 22px",
                maxWidth: "600px",
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(16px)",
                transition: "all 0.55s ease 0.08s",
              }}
            >
              Separate right.
              <br />
              <em
                style={{
                  color: "transparent",
                  background: "linear-gradient(135deg, #34d399, #5eead4)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  fontStyle: "italic",
                }}
              >
                Earn more.
              </em>
            </h1>

            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "16px",
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.8,
                maxWidth: "480px",
                margin: "0 0 48px",
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(14px)",
                transition: "all 0.55s ease 0.15s",
              }}
            >
              Proper sorting ensures materials re-enter the circular economy and
              maximises your platform earnings on every collection.
            </p>
            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(14px)",
                transition: "all 0.55s ease 0.22s",
              }}
            >
              {[
                { val: "3", label: "Material tiers", icon: "◈" },
                { val: "100%", label: "Weight-based payout", icon: "⊙" },
                { val: "Rs 0", label: "Cost to join", icon: "◻" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "14px",
                    padding: "14px 20px",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <span
                    style={{
                      color: "#34d399",
                      fontSize: "18px",
                      lineHeight: 1,
                    }}
                  >
                    {stat.icon}
                  </span>
                  <div>
                    <div
                      style={{
                        fontFamily: "'Fraunces', serif",
                        fontSize: "22px",
                        fontWeight: 600,
                        color: "#fff",
                        lineHeight: 1,
                      }}
                    >
                      {stat.val}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.38)",
                        letterSpacing: "0.03em",
                        marginTop: "3px",
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <div
          style={{
            maxWidth: "920px",
            margin: "0 auto",
            padding: "0 48px 80px",
          }}
        >
          <section style={{ marginTop: "56px" }}>
            <div
              style={{
                background: "#ffffff",
                borderRadius: "22px",
                border: "1.5px solid rgba(0,0,0,0.06)",
                padding: "36px 40px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background:
                    "linear-gradient(90deg, #059669, #0d9488, #06b6d4)",
                }}
              />

              <div style={{ marginBottom: "32px" }}>
                <div className="rg-section-label">The Golden Rule</div>
                <p className="rg-subtext" style={{ marginTop: "2px" }}>
                  Three steps every collection day, no exceptions.
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0",
                  alignItems: "stretch",
                }}
              >
                {[
                  {
                    n: "01",
                    title: "Clean",
                    sub: "No food residue",
                    icon: "✦",
                  },
                  {
                    n: "02",
                    title: "Dry",
                    sub: "No moisture at all",
                    icon: "✦",
                  },
                  {
                    n: "03",
                    title: "Separate",
                    sub: "One material per bag",
                    icon: "✦",
                  },
                ].map((step, i) => (
                  <React.Fragment key={step.n}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        minWidth: "140px",
                        paddingRight: "12px",
                        position: "relative",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Fraunces', serif",
                          fontSize: "52px",
                          fontWeight: 600,
                          color: "rgba(0,0,0,0.06)",
                          lineHeight: 1,
                          marginBottom: "6px",
                          letterSpacing: "-2px",
                        }}
                      >
                        {step.n}
                      </span>
                      <span
                        style={{
                          fontFamily: "'Fraunces', serif",
                          fontWeight: 600,
                          fontSize: "20px",
                          color: "#0f172a",
                          marginBottom: "4px",
                        }}
                      >
                        {step.title}
                      </span>
                      <span
                        style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontSize: "12.5px",
                          color: "#94a3b8",
                        }}
                      >
                        {step.sub}
                      </span>
                    </div>
                    {i < 2 && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "0 20px",
                          alignSelf: "center",
                        }}
                      >
                        <svg
                          width="24"
                          height="12"
                          viewBox="0 0 24 12"
                          fill="none"
                        >
                          <path
                            d="M0 6h20M16 2l4 4-4 4"
                            stroke="url(#arr)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <defs>
                            <linearGradient
                              id="arr"
                              x1="0"
                              y1="0"
                              x2="24"
                              y2="0"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#a7f3d0" />
                              <stop offset="1" stopColor="#99f6e4" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>
          <section style={{ marginTop: "52px" }}>
            <div style={{ marginBottom: "28px" }}>
              <div className="rg-section-label">Material Categories</div>
              <h2 className="rg-h2">Match. Sort. Earn.</h2>
              <p className="rg-subtext">
                Match each item to its tier before your collection day.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(268px, 1fr))",
                gap: "16px",
              }}
            >
              {CATEGORIES.map((cat, i) => (
                <CategoryCard key={cat.tier} cat={cat} index={i} />
              ))}
            </div>
          </section>
          <section style={{ marginTop: "52px" }}>
            <div style={{ marginBottom: "24px" }}>
              <div className="rg-section-label">Before Every Collection</div>
              <h2 className="rg-h2">Quick checklist.</h2>
              <p className="rg-subtext">
                Run this check to ensure full credit on every pickup.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "12px",
              }}
            >
              {CHECKLIST.map((item, i) => (
                <ChecklistCard key={item.label} item={item} index={i} />
              ))}
            </div>
          </section>
          <section style={{ marginTop: "52px" }}>
            <div
              style={{
                background: "#ffffff",
                borderRadius: "22px",
                border: "1.5px solid rgba(0,0,0,0.06)",
                padding: "36px 40px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background:
                    "linear-gradient(90deg, #059669, #0d9488, #06b6d4)",
                }}
              />
              <div style={{ marginBottom: "28px" }}>
                <div className="rg-section-label">FAQ</div>
                <h2 className="rg-h2">Questions & Answers</h2>
                <p className="rg-subtext">
                  Common concerns from our recycling community.
                </p>
              </div>
              {FAQS.map((faq, i) => (
                <FAQItem
                  key={i}
                  question={faq.q}
                  answer={faq.a}
                  defaultOpen={i === 0}
                  index={i}
                />
              ))}
            </div>
          </section>
          <section style={{ marginTop: "52px" }}>
            <div
              style={{
                background: "#0a0f0d",
                borderRadius: "24px",
                padding: "64px 56px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `
                  radial-gradient(ellipse 60% 80% at 80% 50%, rgba(5,150,105,0.22) 0%, transparent 60%),
                  radial-gradient(ellipse 40% 60% at 20% 20%, rgba(13,148,136,0.18) 0%, transparent 55%)
                `,
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `
                  linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)
                `,
                  backgroundSize: "48px 48px",
                  pointerEvents: "none",
                }}
              />
              {[
                { size: 280, bottom: "-80px", right: "-40px", opacity: 0.1 },
                { size: 150, bottom: "40px", right: "100px", opacity: 0.06 },
              ].map((ring, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    width: ring.size,
                    height: ring.size,
                    borderRadius: "50%",
                    border: `1px solid rgba(16,185,129,${ring.opacity})`,
                    bottom: ring.bottom,
                    right: ring.right,
                    pointerEvents: "none",
                  }}
                />
              ))}

              <div style={{ position: "relative", maxWidth: "520px" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(16,185,129,0.12)",
                    border: "1px solid rgba(16,185,129,0.2)",
                    borderRadius: "100px",
                    padding: "5px 14px",
                    marginBottom: "22px",
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#10b981",
                      boxShadow: "0 0 8px #10b981",
                      animation: "pulse 2s ease-in-out infinite",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#6ee7b7",
                    }}
                  >
                    Ready to collect
                  </span>
                </div>
                <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>

                <h2
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: "clamp(30px, 4.5vw, 48px)",
                    fontWeight: 600,
                    color: "#ffffff",
                    lineHeight: 1.1,
                    margin: "0 0 16px",
                  }}
                >
                  Bins sorted.
                  <br />
                  <em
                    style={{
                      color: "transparent",
                      background: "linear-gradient(135deg, #34d399, #5eead4)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                    }}
                  >
                    Time to collect.
                  </em>
                </h2>

                <p
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "15px",
                    color: "rgba(255,255,255,0.45)",
                    lineHeight: 1.8,
                    margin: "0 0 36px",
                  }}
                >
                  Earn credits, cut landfill impact, and help build a cleaner
                  city — one collection at a time.
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <button
                    className="rg-btn-primary"
                    onClick={() => navigate("/citizen/request")}
                  >
                    Submit a Pickup Request
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    className="rg-btn-ghost"
                    onClick={() => navigate("/citizen")}
                  >
                    View Dashboard
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
