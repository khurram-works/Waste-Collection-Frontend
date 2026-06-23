import React from "react";

const LINKS: Record<string, { label: string; href: string }[]> = {
  Platform: [
    { label: "How It Works", href: "#process" },
    { label: "Waste Categories", href: "#pricing" },
    { label: "For Municipalities", href: "#municipalities" },
    { label: "Worker Portal", href: "/worker" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press Kit", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Data Processing", href: "#" },
  ],
};

const SOCIALS = [
  { icon: "language", href: "#", label: "Website" },
  { icon: "mail", href: "mailto:support@smartwaste.pk", label: "Email" },
  { icon: "call", href: "tel:+921234567890", label: "Phone" },
];

function Footer() {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = () => {
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');

        .ft-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 400;
          color: #6b7280;
          text-decoration: none;
          display: block;
          padding: 3px 0;
          transition: color 0.18s;
        }
        .ft-link:hover { color: #059669; }

        .ft-social {
          width: 36px; height: 36px;
          border-radius: 9px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          display: flex; align-items: center; justify-content: center;
          text-decoration: none;
          transition: background 0.18s, border-color 0.18s, transform 0.15s;
        }
        .ft-social:hover { background: #ecfdf5; border-color: #10b981; transform: translateY(-2px); }

        .ft-input {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          height: 40px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 0 14px;
          background: #f9fafb;
          color: #111827;
          outline: none;
          width: 100%;
          box-sizing: border-box;
          transition: border-color 0.18s, background 0.18s;
        }
        .ft-input:focus { border-color: #10b981; background: #fff; }

        .ft-sub-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 700;
          height: 40px; width: 100%;
          border: none; border-radius: 10px;
          background: linear-gradient(135deg, #10b981, #0d9488);
          color: #fff;
          cursor: pointer;
          transition: opacity 0.18s;
          letter-spacing: 0.01em;
        }
        .ft-sub-btn:hover { opacity: 0.88; }
      `}</style>

      <footer style={{ width: "100%", background: "#fff", borderTop: "1px solid #f3f4f6", paddingTop: 60 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 40, paddingBottom: 56 }}>
            {/* Brand */}
            <div style={{ gridColumn: "span 1" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #10b981, #0d9488)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 10px rgba(16,185,129,0.28)" }}>
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
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#6b7280", lineHeight: 1.7, marginBottom: 18, maxWidth: 220 }}>
                Making waste management rewarding, transparent, and efficient for everyone.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                {SOCIALS.map((s, i) => (
                  <a key={i} href={s.href} className="ft-social" aria-label={s.label}>
                    <span className="material-symbols-outlined" style={{ color: "#6b7280", fontSize: 16 }}>{s.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(LINKS).map(([section, links]) => (
              <div key={section}>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 12, color: "#111827", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
                  {section}
                </div>
                {links.map(l => <a key={l.label} href={l.href} className="ft-link">{l.label}</a>)}
              </div>
            ))}

            {/* Newsletter */}
            <div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 12, color: "#111827", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
                Stay Updated
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#6b7280", lineHeight: 1.6, marginBottom: 14 }}>
                Get the latest recycling rates and platform news.
              </p>
              {subscribed ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#ecfdf5", borderRadius: 10, border: "1px solid #a7f3d0" }}>
                  <span className="material-symbols-outlined" style={{ color: "#10b981", fontSize: 16 }}>check_circle</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#059669", fontWeight: 600 }}>You're subscribed!</span>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <input
                    type="email"
                    className="ft-input"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  <button className="ft-sub-btn" onClick={handleSubscribe}>Subscribe</button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: "1px solid #f3f4f6", padding: "20px 0", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#9ca3af" }}>
              © 2026 Smart Waste Platform. All rights reserved.
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className="material-symbols-outlined" style={{ color: "#10b981", fontSize: 14 }}>favorite</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#9ca3af" }}>Built for a sustainable Pakistan</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
