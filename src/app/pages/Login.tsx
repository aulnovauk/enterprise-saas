import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import { Check, Info } from "lucide-react";
import { signIn } from "../lib/auth";

const STYLES = `
.sol-login-input {
  width: 100%;
  box-sizing: border-box;
  height: 48px;
  padding: 0 14px;
  font-family: inherit;
  font-size: 15px;
  color: #0F172A;
  background: #FFFFFF;
  border: 1px solid #CBD5E1;
  border-radius: 10px;
  outline: none;
  transition: border-color .15s ease, box-shadow .15s ease;
}
.sol-login-input::placeholder { color: #94A3B8; }
.sol-login-input:focus {
  border-color: var(--brand-800);
  box-shadow: 0 0 0 3px rgba(18,48,126,.16);
}
.sol-login-primary {
  height: 50px;
  width: 100%;
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
  background: var(--brand-800);
  border: 0;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(18,48,126,.26);
  transition: background .15s ease;
}
.sol-login-primary:hover { background: var(--brand-700); }
.sol-login-primary:disabled { opacity: .72; cursor: default; }
.sol-login-secondary {
  height: 50px;
  width: 100%;
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  color: #0F172A;
  background: #FFFFFF;
  border: 1px solid #CBD5E1;
  border-radius: 10px;
  cursor: pointer;
  transition: background .15s ease;
}
.sol-login-secondary:hover { background: #F8FAFC; }
.sol-login-link { color: var(--brand-800); text-decoration: none; }
.sol-login-link:hover { color: var(--brand-700); }
`;

export function Login() {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };
  const from = location.state?.from ?? "/";

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [reveal, setReveal] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;

    if (!userId.trim()) {
      setError("Enter your user ID.");
      return;
    }
    if (!password) {
      setError("Enter your password.");
      return;
    }

    setError("");
    setBusy(true);
    timer.current = window.setTimeout(() => {
      const session = signIn(userId, password, remember);
      if (!session) {
        setBusy(false);
        setError("Invalid user ID or password. Please try again.");
        return;
      }
      navigate(from, { replace: true });
    }, 600);
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#FFFFFF",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "stretch",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <style>{STYLES}</style>

      {/* ── Left brand panel ─────────────────────────────────────────── */}
      <div
        style={{
          flex: "1 1 380px",
          maxWidth: 600,
          minWidth: 0,
          boxSizing: "border-box",
          background: "var(--brand-800)",
          color: "#FFFFFF",
          padding: "56px 48px 48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 520,
            height: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 30% 30%, rgba(245,158,11,.22), rgba(245,158,11,0) 65%)",
            top: 220,
            left: -140,
          }}
        />

        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 14 }}>
          <img
            src="/solarops-logo.svg"
            alt="SolarOps"
            style={{ height: 46, width: "auto", borderRadius: 10, display: "block" }}
          />
          <span style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 21, fontWeight: 700, letterSpacing: "-.01em" }}>SolarOps</span>
            <span style={{ fontSize: 13, color: "var(--brand-200)" }}>Asset Monitoring Suite</span>
          </span>
        </div>

        <div style={{ position: "relative", padding: "48px 0" }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: ".18em",
              textTransform: "uppercase",
              color: "#F59E0B",
              marginBottom: 18,
            }}
          >
            SOLAR ASSET PLATFORM
          </div>
          <div
            style={{
              fontSize: 40,
              fontWeight: 600,
              lineHeight: 1.2,
              letterSpacing: "-.02em",
              marginBottom: 18,
              maxWidth: 460,
              textWrap: "pretty",
            }}
          >
            Centralized solar asset data management and monitoring.
          </div>
          <div style={{ fontSize: 16, lineHeight: 1.55, color: "var(--brand-200)", maxWidth: 440 }}>
            JMR capture, KPI governance, loss analytics and management MIS in one governed platform.
          </div>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            flexWrap: "wrap",
            gap: 44,
            borderTop: "1px solid rgba(255,255,255,.16)",
            paddingTop: 26,
          }}
        >
          {[
            { value: "220 MW", label: "Installed capacity" },
            { value: "12", label: "Plants monitored" },
            { value: "FY 2026-27", label: "Active reporting year" },
          ].map((stat) => (
            <div key={stat.label}>
              <div style={{ fontSize: 26, fontWeight: 600 }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: "var(--brand-200)", marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form panel ─────────────────────────────────────────── */}
      <div
        style={{
          flex: "1 1 520px",
          minWidth: 0,
          padding: "40px 40px 32px",
          display: "flex",
          flexDirection: "column",
          minHeight: "min(100vh, 760px)",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            color: "#64748B",
          }}
        >
          <span>Need access?</span>
          <a href="#" className="sol-login-link" style={{ fontWeight: 500 }}>
            Contact administrator
          </a>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: 420,
            width: "100%",
            margin: "0 auto",
            padding: "32px 0",
          }}
        >
          <h1
            style={{
              fontSize: 30,
              fontWeight: 600,
              letterSpacing: "-.02em",
              color: "#0F172A",
              margin: "0 0 8px",
            }}
          >
            Sign in
          </h1>
          <p style={{ fontSize: 15, color: "#64748B", margin: "0 0 32px" }}>
            Use your account credentials to continue.
          </p>

          {error && (
            <div
              role="alert"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: "12px 14px",
                marginBottom: 22,
                background: "#FEF2F2",
                border: "1px solid #FCA5A5",
                borderRadius: 10,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: "#B91C1C", lineHeight: 1.5 }}>!</span>
              <span style={{ fontSize: 13, lineHeight: 1.5, color: "#991B1B" }}>{error}</span>
            </div>
          )}

          <label
            htmlFor="login-user"
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 600,
              color: "#334155",
              marginBottom: 8,
            }}
          >
            User ID
          </label>
          <input
            id="login-user"
            type="text"
            autoComplete="username"
            autoFocus
            placeholder="admin@solar.com"
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value);
              setError("");
            }}
            className="sol-login-input"
            style={{ marginBottom: 20 }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 8,
            }}
          >
            <label htmlFor="login-pass" style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
              Password
            </label>
            <a href="#" className="sol-login-link" style={{ fontSize: 13, fontWeight: 500 }}>
              Forgot password?
            </a>
          </div>
          <div style={{ position: "relative", marginBottom: 20 }}>
            <input
              id="login-pass"
              type={reveal ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="sol-login-input"
              style={{ padding: "0 76px 0 14px" }}
            />
            <button
              type="button"
              onClick={() => setReveal((v) => !v)}
              style={{
                position: "absolute",
                right: 10,
                top: 11,
                height: 26,
                padding: "0 10px",
                fontFamily: "inherit",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--brand-800)",
                background: "var(--brand-50)",
                border: 0,
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              {reveal ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setRemember((v) => !v)}
            aria-pressed={remember}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 28,
              padding: 0,
              background: "none",
              border: 0,
              cursor: "pointer",
              fontFamily: "inherit",
              textAlign: "left",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 18,
                height: 18,
                borderRadius: 5,
                border: "1px solid #94A3B8",
                color: "#FFFFFF",
                background: remember ? "var(--brand-800)" : "#FFFFFF",
              }}
            >
              {remember && <Check size={12} strokeWidth={3} />}
            </span>
            <span style={{ fontSize: 14, color: "#475569" }}>Remember this device for 30 days</span>
          </button>

          <button type="submit" className="sol-login-primary" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "26px 0" }}>
            <span style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                color: "#64748B",
              }}
            >
              or
            </span>
            <span style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
          </div>

          <button type="button" className="sol-login-secondary">
            Continue with SSO
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              marginTop: 26,
              padding: "14px 16px",
              background: "#F1F5F9",
              borderRadius: 10,
            }}
          >
            <Info size={15} color="var(--brand-800)" style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontSize: 13, lineHeight: 1.5, color: "#475569" }}>
              Role-based access. Every sign-in and data change is recorded in the audit trail.
            </span>
          </div>
        </form>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 20,
            fontSize: 12,
            color: "#64748B",
            borderTop: "1px solid #EDF1F6",
            paddingTop: 18,
          }}
        >
          <span>© AulNova Techsoft Pvt. Ltd</span>
          <span>v1.0 · Prototype</span>
        </div>
      </div>
    </div>
  );
}
