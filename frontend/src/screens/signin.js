// src/SigninWeb.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../signin.css";

/**
 * SigninWeb.jsx (updated)
 * - No Google sign-in
 * - Does NOT send push/expo tokens
 * - Keeps UI simple; shows friendly errors (including CORS hint)
 * - Configurable credentials behavior via REACT_APP_USE_CREDENTIALS (see notes below)
 */

const { innerWidth: SCREEN_W, innerHeight: SCREEN_H } =
  typeof window !== "undefined" ? window : { innerWidth: 1280, innerHeight: 800 };

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;
const scale = (size) => (SCREEN_W / guidelineBaseWidth) * size;
const verticalScale = (size) => (SCREEN_H / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AUTH_KEY = "dw_user_profile";

const storeProfile = (rawUser) => {
  try {
    if (!rawUser) return;
    const profile = {
      id: rawUser.id ?? rawUser._id ?? rawUser.userId ?? rawUser.uid ?? null,
      email: rawUser.email ?? rawUser.emailAddress ?? null,
      firstname: rawUser.firstName ?? rawUser.firstname ?? rawUser.name ?? null,
      lastname: rawUser.lastName ?? rawUser.lastname ?? null,
      avatar: rawUser.avatar ?? rawUser.profileImage ?? rawUser.photoUrl ?? null,
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(profile));
  } catch (e) {
    // non-fatal
    // eslint-disable-next-line no-console
    console.warn("storeProfile error", e);
  }
};

/** Create axios client; `withCredentials` controlled by config (see notes) */
const createAxios = (timeoutMs = 30000) =>
  axios.create({
    timeout: timeoutMs,
    headers: { "Content-Type": "application/json" },
    // IMPORTANT: withCredentials can be toggled via env var to match your backend config
    // If your backend sets HttpOnly cookies and you want the browser to send them, set:
    // REACT_APP_USE_CREDENTIALS=true
    withCredentials: String(process.env.REACT_APP_USE_CREDENTIALS || "").toLowerCase() === "true",
  });

export const Signin = () => {
  const API_BASE_URL = (process.env.REACT_APP_DOMAIN || "").replace(/\/$/, "");
  const defaultOrigin = typeof window !== "undefined" ? window.location.origin.replace(/\/$/, "") : "";
  const server = API_BASE_URL || defaultOrigin || "";

  const navigate = useNavigate?.() ?? (() => {});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [secure, setSecure] = useState(true);
  const [showClear, setShowClear] = useState(false);

  const passwordRef = useRef(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    if (!navigator?.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      (err) => {
        // non-fatal
        // eslint-disable-next-line no-console
        console.warn("geolocation error", err?.message || err);
      },
      { enableHighAccuracy: false, maximumAge: 600000 }
    );
  }, []);

  const onEmailChange = (v) => {
    setEmail(v);
    setShowClear(Boolean(v && v.length));
    if (error) setError("");
  };
  const onPasswordChange = (v) => {
    setPassword(v);
    if (error) setError("");
  };

  const signIn = async () => {
    setError("");
    if (!emailRegex.test(String(email).trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 4) {
      setError("Please enter your password (min 4 characters).");
      return;
    }

    if (!server) {
      setError("No API base configured. Set REACT_APP_DOMAIN or serve web from the API origin.");
      return;
    }

    setLoading(true);

    try {
      const client = createAxios(30000);
      const url = `${server.replace(/\/$/, "")}/auth/signin`;

      let res;
      try {
        res = await client.post(url, {
          email: String(email).trim(),
          password,
          // intentionally NOT sending push/expo tokens in web client
          location,
        });
      } catch (err) {
        // network/CORS vs response handling
        const isTimeout = err?.code === "ECONNABORTED" || String(err?.message || "").toLowerCase().includes("timeout");
        const hasResponse = !!err?.response;
        const hasRequest = !!err?.request && !err?.response;

        if (isTimeout) {
          setError("Request timed out (30s). The server may be slow. Try again.");
        } else if (hasRequest && !hasResponse) {
          // This is the typical symptom of CORS or network connectivity problems
          setError(
            "Network error or CORS issue when contacting the server. Check backend CORS policy (see console for details)."
          );
          // eslint-disable-next-line no-console
          console.error("Possible CORS/network error (no response):", err);
        } else if (hasResponse) {
          setError(err.response?.data?.message || `Sign in failed (status ${err.response.status}).`);
          // eslint-disable-next-line no-console
          console.error("Signin failed with response:", err.response);
        } else {
          setError("Unexpected network error. Check console for details.");
          // eslint-disable-next-line no-console
          console.error("Unexpected signin error:", err);
        }
        setLoading(false);
        return;
      }

      if (res.status === 200 || res.status === 201) {
        const user = res.data?.user ?? res.data;
        if (user) storeProfile(user);
        window.location.href = "/";
        return;
      }

      setError(res.data?.message || `Sign in failed (status ${res.status})`);
    } catch (outerErr) {
      // catch-all
      // eslint-disable-next-line no-console
      console.error("signin outer error", outerErr);
      setError("An unexpected error occurred. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sw-root">
      <div className="sw-container">
        <div className="sw-card">
          <div className="sw-brand">Dwelify</div>
          <div className="sw-sub">Welcome back</div>

          {error && <div className="sw-error" role="alert">{error}</div>}

          <label className="sw-label">Email</label>
          <div className="sw-row">
            <input
              className="sw-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") passwordRef.current?.focus(); }}
            />
            {showClear && (
              <button
                className="sw-clear"
                onClick={() => { setEmail(""); setShowClear(false); }}
                type="button"
              >
                ✕
              </button>
            )}
          </div>

          <label className="sw-label">Password</label>
          <div className="sw-row">
            <input
              ref={passwordRef}
              className="sw-input"
              placeholder="Enter password"
              type={secure ? "password" : "text"}
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") signIn(); }}
            />
            <button className="sw-clear" onClick={() => setSecure(!secure)} type="button">{secure ? "👁️" : "🙈"}</button>
          </div>

          <button
            className={`sw-button ${(!email || !password || loading) ? "disabled" : ""}`}
            onClick={signIn}
            disabled={!email || !password || loading}
            type="button"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>

          <div className="sw-bottom">
            <a className="sw-link" href="/signup">Register?</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
