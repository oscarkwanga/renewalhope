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
  const API_BASE_URL = "https://church-backend-48tj.onrender.com";
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





  //signin function
  const signIn = async () => {
  setError("");

  if (!emailRegex.test(email.trim())) {
    setError("Please enter a valid email.");
    return;
  }

  if (!password) {
    setError("Please enter your password.");
    return;
  }

  setLoading(true);

  try {
    const response = await axios.post(
      `${server}/auth/signin`,
      {
        email: email.trim(),
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      window.location.href = "/admin";
    }
  } catch (err) {
    setError(
      err.response?.data?.message ||
      "Invalid email or password."
    );
  } finally {
    setLoading(false);
  }
};






  return (
    <div className="sw-root">
      <div className="sw-container">
        <div className="sw-card">
          <div className="sw-brand">Word Revelation Church</div>
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

        
        </div>
      </div>
    </div>
  );
};

export default Signin;
