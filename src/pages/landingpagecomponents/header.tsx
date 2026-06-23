import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../../Types/types";

const NAV_LINKS = [
  { label: "Home", href: "#" },
  { label: "How It Works", href: "#process" },
  { label: "Pricing", href: "#pricing" },
  { label: "Municipalities", href: "#municipalities" },
];

function Header() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = localStorage.getItem("user");

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const goToDashboard = () => {
    const raw = localStorage.getItem("user");
    if (!raw) return;
    const user = JSON.parse(raw) as User;
    const map: Record<string, string> = { CITIZEN: "/citizen", ADMIN: "/admin", WORKER: "/worker" };
    navigate(map[user.role] ?? "/login");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');

        :root {
          --em: #10b981;
          --em-dark: #059669;
          --em-darker: #047857;
          --teal: #0d9488;
          --text: #111827;
          --muted: #6b7280;
          --border: #e5e7eb;
          --surface: #f9fafb;
        }

        .h-nav-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500;
          color: #374151;
          text-decoration: none;
          position: relative;
          padding-bottom: 2px;
          transition: color 0.2s;
        }
        .h-nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 0; height: 2px;
          background: linear-gradient(90deg, #10b981, #0d9488);
          border-radius: 2px;
          transition: width 0.25s ease;
        }
        .h-nav-link:hover { color: #059669; }
        .h-nav-link:hover::after { width: 100%; }

        .h-btn-ghost {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600;
          color: #059669;
          background: transparent;
          border: 1.5px solid #a7f3d0;
          border-radius: 10px;
          padding: 0 18px; height: 38px;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }
        .h-btn-ghost:hover { background: #ecfdf5; border-color: #10b981; }

        .h-btn-primary {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600;
          color: #fff;
          background: linear-gradient(135deg, #10b981 0%, #0d9488 100%);
          border: none;
          border-radius: 10px;
          padding: 0 18px; height: 38px;
          cursor: pointer;
          display: inline-flex; align-items: center; gap: 5px;
          box-shadow: 0 2px 10px rgba(16,185,129,0.28);
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }
        .h-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 5px 20px rgba(16,185,129,0.38);
        }
        .h-btn-primary:active { transform: translateY(0); }

        .h-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.45);
          backdrop-filter: blur(5px);
          z-index: 999;
          animation: overlayFadeIn 0.2s ease;
        }
        @keyframes overlayFadeIn { from { opacity: 0; } to { opacity: 1; } }

        .h-panel {
          position: fixed; top: 0; right: 0;
          height: 100%; width: 290px; max-width: 88vw;
          background: #fff;
          z-index: 1000;
          display: flex; flex-direction: column;
          padding: 20px;
          box-shadow: -12px 0 50px rgba(0,0,0,0.14);
          animation: panelSlideIn 0.25s cubic-bezier(0.32, 0, 0.67, 0) forwards;
          overflow-y: auto;
        }
        @keyframes panelSlideIn {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }

        .h-mobile-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 500;
          color: #111827;
          text-decoration: none;
          display: flex; align-items: center;
          padding: 12px 14px;
          border-radius: 10px;
          transition: background 0.15s, color 0.15s;
        }
        .h-mobile-link:hover { background: #ecfdf5; color: #059669; }

        .h-logo-badge {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #10b981, #0d9488);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 10px rgba(16,185,129,0.3);
          flex-shrink: 0;
        }
      `}</style>

      <header
        style={{
          position: "sticky", top: 0, zIndex: 50, width: "100%",
          background: scrolled ? "rgba(255,255,255,0.97)" : "#ffffff",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: `1px solid ${scrolled ? "#e5e7eb" : "#f9fafb"}`,
          boxShadow: scrolled ? "0 1px 16px rgba(0,0,0,0.06)" : "none",
          transition: "background 0.3s, box-shadow 0.3s, border-color 0.3s",
        }}
      >
        <div
          style={{
            maxWidth: 1280, margin: "0 auto",
            padding: "0 20px", height: 64,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <div
            style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <div className="h-logo-badge">
              <span className="material-symbols-outlined" style={{ color: "#fff", fontSize: 18 }}>recycling</span>
            </div>
            <div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15, color: "#111827", lineHeight: 1.15 }}>
                Smart<span style={{ color: "#059669" }}>Waste</span>
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Platform
              </div>
            </div>
          </div>

          {/* Desktop nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 32 }} className="hidden md:flex">
            {NAV_LINKS.map(l => <a key={l.label} href={l.href} className="h-nav-link">{l.label}</a>)}
          </nav>

          {/* Desktop CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }} className="hidden md:flex">
            {user ? (
              <button className="h-btn-primary" onClick={goToDashboard}>
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>dashboard</span>
                Dashboard
              </button>
            ) : (
              <>
                <button className="h-btn-ghost" onClick={() => navigate("/login")}>Sign In</button>
                <button className="h-btn-primary" onClick={() => navigate("/register")}>
                  Get Started
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>arrow_forward</span>
                </button>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            style={{
              background: "none", border: "1px solid #e5e7eb",
              borderRadius: 8, padding: "6px 8px",
              cursor: "pointer", display: "flex", alignItems: "center",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#374151" }}>menu</span>
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="h-overlay" onClick={() => setMobileOpen(false)} />
          <div className="h-panel">
            {/* Panel header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="h-logo-badge" style={{ width: 30, height: 30, borderRadius: 8 }}>
                  <span className="material-symbols-outlined" style={{ color: "#fff", fontSize: 15 }}>recycling</span>
                </div>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: "#111827" }}>
                  Smart<span style={{ color: "#059669" }}>Waste</span>
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "5px", cursor: "pointer", display: "flex" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#6b7280" }}>close</span>
              </button>
            </div>

            {/* Nav links */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
              {NAV_LINKS.map(l => (
                <a key={l.label} href={l.href} className="h-mobile-link" onClick={() => setMobileOpen(false)}>{l.label}</a>
              ))}
            </div>

            {/* Auth CTA */}
            <div style={{ paddingTop: 20, borderTop: "1px solid #f3f4f6", display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
              {user ? (
                <button className="h-btn-primary" style={{ width: "100%", justifyContent: "center", height: 44 }}
                  onClick={() => { setMobileOpen(false); goToDashboard(); }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>dashboard</span>
                  Dashboard
                </button>
              ) : (
                <>
                  <button className="h-btn-ghost" style={{ width: "100%", height: 44 }}
                    onClick={() => { setMobileOpen(false); navigate("/login"); }}>Sign In</button>
                  <button className="h-btn-primary" style={{ width: "100%", justifyContent: "center", height: 44 }}
                    onClick={() => { setMobileOpen(false); navigate("/register"); }}>
                    Get Started
                    <span className="material-symbols-outlined" style={{ fontSize: 15 }}>arrow_forward</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Header;
