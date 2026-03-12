var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// index.js
var index_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const origin = request.headers.get("Origin") || "";
    const allowedOrigins = ["https://kitvault.io", "https://www.kitvault.io", "http://localhost:5173"];
    const corsOrigin = allowedOrigins.includes(origin) ? origin : "https://kitvault.io";
    const corsHeaders = {
      "Access-Control-Allow-Origin": corsOrigin,
      "Access-Control-Allow-Methods": "GET, POST, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Admin-Key, Authorization",
      "Access-Control-Allow-Credentials": "true"
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    function generateSalt() {
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      return btoa(String.fromCharCode(...array));
    }
    __name(generateSalt, "generateSalt");
    async function hashPassword(password, salt) {
      const encoder = new TextEncoder();
      const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveBits"]
      );
      const hash = await crypto.subtle.deriveBits(
        { name: "PBKDF2", salt: encoder.encode(salt), iterations: 1e5, hash: "SHA-256" },
        keyMaterial,
        256
      );
      return btoa(String.fromCharCode(...new Uint8Array(hash)));
    }
    __name(hashPassword, "hashPassword");
    function base64UrlEncode(str) {
      return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    }
    __name(base64UrlEncode, "base64UrlEncode");
    function base64UrlDecode(str) {
      str = str.replace(/-/g, "+").replace(/_/g, "/");
      while (str.length % 4) str += "=";
      return atob(str);
    }
    __name(base64UrlDecode, "base64UrlDecode");
    async function createJWT(payload, secret) {
      const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
      const body = base64UrlEncode(JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1e3 }));
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(`${header}.${body}`));
      const sig = base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
      return `${header}.${body}.${sig}`;
    }
    __name(createJWT, "createJWT");
    async function verifyJWT(token, secret) {
      try {
        const [header, body, sig] = token.split(".");
        if (!header || !body || !sig) return null;
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
          "raw",
          encoder.encode(secret),
          { name: "HMAC", hash: "SHA-256" },
          false,
          ["verify"]
        );
        const sigBytes = Uint8Array.from(base64UrlDecode(sig), (c) => c.charCodeAt(0));
        const valid = await crypto.subtle.verify(
          "HMAC",
          key,
          sigBytes,
          encoder.encode(`${header}.${body}`)
        );
        if (!valid) return null;
        const payload = JSON.parse(base64UrlDecode(body));
        if (payload.exp < Date.now()) return null;
        return payload;
      } catch {
        return null;
      }
    }
    __name(verifyJWT, "verifyJWT");
    function setAuthCookie(token, corsOrigin2) {
      const isLocalhost = corsOrigin2.includes("localhost");
      return `kv_token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=${isLocalhost ? "Lax" : "None"}; ${isLocalhost ? "" : "Secure; "}`;
    }
    __name(setAuthCookie, "setAuthCookie");
    function clearAuthCookie(corsOrigin2) {
      const isLocalhost = corsOrigin2.includes("localhost");
      return `kv_token=; HttpOnly; Path=/; Max-Age=0; SameSite=${isLocalhost ? "Lax" : "None"}; ${isLocalhost ? "" : "Secure; "}`;
    }
    __name(clearAuthCookie, "clearAuthCookie");
    function getCookieToken(request2) {
      const cookie = request2.headers.get("Cookie") || "";
      const match = cookie.match(/kv_token=([^;]+)/);
      return match ? match[1] : null;
    }
    __name(getCookieToken, "getCookieToken");
    async function verifyGoogleToken(idToken) {
      const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
      if (!res.ok) return null;
      const payload = await res.json();
      if (payload.aud !== "1048413363942-31kef3psma06tg0c13heiiufoier6ltb.apps.googleusercontent.com") return null;
      if (!payload.email || !payload.email_verified || payload.email_verified === "false") return null;
      return payload;
    }
    __name(verifyGoogleToken, "verifyGoogleToken");
    function generateToken() {
      const bytes = new Uint8Array(32);
      crypto.getRandomValues(bytes);
      return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    __name(generateToken, "generateToken");
    async function sendEmail(env2, to, subject, html) {
      if (!env2.RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${env2.RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: "KitVault <noreply@kitvault.io>",
          to: [to],
          subject,
          html
        })
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Resend API returned non-JSON (${res.status}): ${text.slice(0, 200)}`);
      }
      if (!res.ok) throw new Error(data.message || `Email send failed (${res.status})`);
      return data;
    }
    __name(sendEmail, "sendEmail");
    async function checkEmailRateLimit(env2, email, maxPerHour = 5) {
      const oneHourAgo = Math.floor(Date.now() / 1e3) - 3600;
      const row = await env2.DB.prepare(
        "SELECT COUNT(*) as cnt FROM email_tokens WHERE email = ? AND created_at > ?"
      ).bind(email, oneHourAgo).first();
      return (row?.cnt || 0) < maxPerHour;
    }
    __name(checkEmailRateLimit, "checkEmailRateLimit");
    if (path === "/api/auth/google" && request.method === "POST") {
      try {
        const { credential } = await request.json();
        if (!credential) {
          return new Response(JSON.stringify({ ok: false, error: "Missing Google credential" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const gPayload = await verifyGoogleToken(credential);
        if (!gPayload) {
          return new Response(JSON.stringify({ ok: false, error: "Invalid Google token" }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const email = gPayload.email.toLowerCase();
        const displayName = gPayload.name || "";
        const avatarUrl = gPayload.picture || "";
        const existing = await env.DB.prepare(
          "SELECT user_id, display_name, avatar_url FROM user_auth WHERE email = ?"
        ).bind(email).first();
        let userId;
        if (existing) {
          userId = existing.user_id;
          await env.DB.prepare(
            "UPDATE user_auth SET display_name = ?, avatar_url = ?, auth_provider = 'google', email_verified = 1, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?"
          ).bind(displayName, avatarUrl, userId).run();
        } else {
          const randomBytes = new Uint8Array(16);
          crypto.getRandomValues(randomBytes);
          userId = "google_" + Array.from(randomBytes).map((b) => b.toString(16).padStart(2, "0")).join("");
          await env.DB.prepare(
            "INSERT INTO user_auth (user_id, email, pw_hash, pw_salt, display_name, avatar_url, auth_provider, email_verified, created_at, updated_at) VALUES (?, ?, '', '', ?, ?, 'google', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"
          ).bind(userId, email, displayName, avatarUrl).run();
        }
        const token = await createJWT({ userId, email, displayName, avatarUrl, emailVerified: true }, env.JWT_SECRET);
        return new Response(JSON.stringify({ ok: true, userId, email, displayName, avatarUrl, emailVerified: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json", "Set-Cookie": setAuthCookie(token, corsOrigin) }
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    if (path === "/api/auth/signup" && request.method === "POST") {
      try {
        const { email, password } = await request.json();
        if (!email || !password) {
          return new Response(JSON.stringify({ ok: false, error: "Missing email or password" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
          return new Response(JSON.stringify({ ok: false, error: "Invalid email format" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        if (password.length < 8) {
          return new Response(JSON.stringify({ ok: false, error: "Password must be at least 8 characters" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const existingEmail = await env.DB.prepare(
          "SELECT user_id FROM user_auth WHERE email = ?"
        ).bind(email.trim().toLowerCase()).first();
        if (existingEmail) {
          return new Response(JSON.stringify({ ok: false, error: "Email already in use" }), {
            status: 409,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const randomBytes = new Uint8Array(16);
        crypto.getRandomValues(randomBytes);
        const localId = "local_" + Array.from(randomBytes).map((b) => b.toString(16).padStart(2, "0")).join("");
        const salt = generateSalt();
        const pwHash = await hashPassword(password, salt);
        await env.DB.prepare(
          "INSERT INTO user_auth (user_id, email, pw_hash, pw_salt, display_name, avatar_url, auth_provider, email_verified, created_at, updated_at) VALUES (?, ?, ?, ?, '', '', 'email', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"
        ).bind(localId, email.trim().toLowerCase(), pwHash, salt).run();
        const cleanEmail = email.trim().toLowerCase();
        try {
          const token2 = generateToken();
          const expiresAt = Math.floor(Date.now() / 1e3) + 24 * 60 * 60;
          await env.DB.prepare(
            "INSERT INTO email_tokens (token, email, user_id, type, expires_at, created_at) VALUES (?, ?, ?, 'verify', ?, ?)"
          ).bind(token2, cleanEmail, localId, expiresAt, Math.floor(Date.now() / 1e3)).run();
          const verifyUrl = `https://kitvault.io/verify-email?token=${token2}`;
          await sendEmail(env, cleanEmail, "Verify your KitVault account", `
            <div style="font-family:monospace;background:#0a1220;color:#c8ddf5;padding:40px;max-width:500px">
              <div style="font-size:20px;font-weight:bold;margin-bottom:8px">KIT<span style="color:#ff6600">VAULT</span></div>
              <div style="font-size:11px;color:#5a7a9f;letter-spacing:2px;margin-bottom:24px">VERIFY YOUR EMAIL</div>
              <p style="font-size:13px;line-height:1.8;color:#9ab0cc">Click the button below to verify your email and unlock all KitVault features \u2014 your vault, build timers, hangar profile, and more.</p>
              <a href="${verifyUrl}" style="display:inline-block;background:#00aaff;color:#fff;padding:12px 28px;text-decoration:none;font-family:monospace;font-size:13px;letter-spacing:1px;margin:20px 0">VERIFY EMAIL \u2192</a>
              <p style="font-size:11px;color:#3a5a7a;margin-top:24px">If you didn't create this account, you can ignore this email. This link expires in 24 hours.</p>
            </div>
          `);
        } catch (emailErr) {
          console.error("Verification email failed:", emailErr.message);
        }
        const token = await createJWT({ userId: localId, email: cleanEmail, displayName: "", avatarUrl: "", emailVerified: false }, env.JWT_SECRET);
        return new Response(JSON.stringify({ ok: true, userId: localId, email: cleanEmail, displayName: "", avatarUrl: "", emailVerified: false }), {
          headers: { ...corsHeaders, "Content-Type": "application/json", "Set-Cookie": setAuthCookie(token, corsOrigin) }
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    if (path === "/api/auth/login" && request.method === "POST") {
      try {
        const { email, password } = await request.json();
        if (!email || !password) {
          return new Response(JSON.stringify({ ok: false, error: "Missing email or password" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const row = await env.DB.prepare(
          "SELECT user_id, pw_hash, pw_salt, display_name, avatar_url, email_verified FROM user_auth WHERE email = ?"
        ).bind(email.trim().toLowerCase()).first();
        if (!row) {
          return new Response(JSON.stringify({ ok: false, error: "Invalid email or password" }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        if (!row.pw_hash) {
          return new Response(JSON.stringify({ ok: false, error: "This account uses Google sign-in. Please use the Google button." }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const attemptHash = await hashPassword(password, row.pw_salt);
        if (attemptHash !== row.pw_hash) {
          return new Response(JSON.stringify({ ok: false, error: "Invalid email or password" }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const emailVerified = row.email_verified === 1 || row.email_verified === true;
        const token = await createJWT({ userId: row.user_id, email: email.trim().toLowerCase(), displayName: row.display_name || "", avatarUrl: row.avatar_url || "", emailVerified }, env.JWT_SECRET);
        return new Response(JSON.stringify({ ok: true, userId: row.user_id, email: email.trim().toLowerCase(), displayName: row.display_name || "", avatarUrl: row.avatar_url || "", emailVerified }), {
          headers: { ...corsHeaders, "Content-Type": "application/json", "Set-Cookie": setAuthCookie(token, corsOrigin) }
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    if (path === "/api/auth/me" && request.method === "GET") {
      try {
        const token = getCookieToken(request);
        if (!token) {
          return new Response(JSON.stringify({ ok: false, error: "Not logged in" }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const payload = await verifyJWT(token, env.JWT_SECRET);
        if (!payload) {
          return new Response(JSON.stringify({ ok: false, error: "Invalid or expired session" }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json", "Set-Cookie": clearAuthCookie(corsOrigin) }
          });
        }
        return new Response(JSON.stringify({ ok: true, userId: payload.userId, email: payload.email, displayName: payload.displayName || "", avatarUrl: payload.avatarUrl || "", emailVerified: payload.emailVerified !== void 0 ? payload.emailVerified : true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    if (path === "/api/auth/logout" && request.method === "POST") {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json", "Set-Cookie": clearAuthCookie(corsOrigin) }
      });
    }
    if (path === "/api/auth/change-password" && request.method === "POST") {
      try {
        const { userId, currentPassword, newPassword } = await request.json();
        if (!userId || !currentPassword || !newPassword) {
          return new Response(JSON.stringify({ ok: false, error: "Missing required fields" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        if (newPassword.length < 8) {
          return new Response(JSON.stringify({ ok: false, error: "New password must be at least 8 characters" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const row = await env.DB.prepare(
          "SELECT pw_hash, pw_salt FROM user_auth WHERE user_id = ?"
        ).bind(userId).first();
        if (!row) {
          return new Response(JSON.stringify({ ok: false, error: "No backup login found for this account" }), {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const currentHash = await hashPassword(currentPassword, row.pw_salt);
        if (currentHash !== row.pw_hash) {
          return new Response(JSON.stringify({ ok: false, error: "Current password is incorrect" }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const newSalt = generateSalt();
        const newHash = await hashPassword(newPassword, newSalt);
        await env.DB.prepare(
          "UPDATE user_auth SET pw_hash = ?, pw_salt = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?"
        ).bind(newHash, newSalt, userId).run();
        return new Response(JSON.stringify({ ok: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    if (path === "/api/auth/check" && request.method === "GET") {
      try {
        const userId = url.searchParams.get("userId");
        if (!userId) {
          return new Response(JSON.stringify({ ok: true, exists: false }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const row = await env.DB.prepare(
          "SELECT email, auth_provider FROM user_auth WHERE user_id = ?"
        ).bind(userId).first();
        return new Response(JSON.stringify({
          ok: true,
          exists: !!row,
          email: row ? row.email.replace(/^(.{2})(.*)(@.*)$/, "$1***$3") : null,
          authProvider: row ? row.auth_provider : null
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    if (path === "/api/auth/verify-email" && request.method === "GET") {
      try {
        const token = url.searchParams.get("token");
        if (!token) {
          return new Response(JSON.stringify({ ok: false, error: "Missing token" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const now = Math.floor(Date.now() / 1e3);
        const row = await env.DB.prepare(
          "SELECT email, user_id, used FROM email_tokens WHERE token = ? AND type = 'verify' AND expires_at > ?"
        ).bind(token, now).first();
        if (!row) {
          return new Response(JSON.stringify({ ok: false, error: "Invalid or expired verification link" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        if (row.used) {
          return new Response(JSON.stringify({ ok: true, message: "Email already verified" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        await env.DB.prepare(
          "UPDATE user_auth SET email_verified = 1, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?"
        ).bind(row.user_id).run();
        await env.DB.prepare(
          "UPDATE email_tokens SET used = 1 WHERE token = ?"
        ).bind(token).run();
        const userRow = await env.DB.prepare(
          "SELECT user_id, email, display_name, avatar_url FROM user_auth WHERE user_id = ?"
        ).bind(row.user_id).first();
        if (userRow) {
          const jwt = await createJWT({ userId: userRow.user_id, email: userRow.email, displayName: userRow.display_name || "", avatarUrl: userRow.avatar_url || "", emailVerified: true }, env.JWT_SECRET);
          return new Response(JSON.stringify({ ok: true, message: "Email verified successfully" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json", "Set-Cookie": setAuthCookie(jwt, corsOrigin) }
          });
        }
        return new Response(JSON.stringify({ ok: true, message: "Email verified successfully" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    if (path === "/api/auth/resend-verification" && request.method === "POST") {
      try {
        const { email } = await request.json();
        if (!email) {
          return new Response(JSON.stringify({ ok: false, error: "Missing email" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const cleanEmail = email.trim().toLowerCase();
        const user = await env.DB.prepare(
          "SELECT user_id, email_verified FROM user_auth WHERE email = ?"
        ).bind(cleanEmail).first();
        if (!user) {
          return new Response(JSON.stringify({ ok: true, message: "If that email is registered, a verification link has been sent." }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        if (user.email_verified === 1) {
          return new Response(JSON.stringify({ ok: true, message: "Email is already verified." }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const allowed = await checkEmailRateLimit(env, cleanEmail);
        if (!allowed) {
          return new Response(JSON.stringify({ ok: false, error: "Too many requests. Please wait before requesting another email." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const token = generateToken();
        const expiresAt = Math.floor(Date.now() / 1e3) + 24 * 60 * 60;
        await env.DB.prepare(
          "INSERT INTO email_tokens (token, email, user_id, type, expires_at, created_at) VALUES (?, ?, ?, 'verify', ?, ?)"
        ).bind(token, cleanEmail, user.user_id, expiresAt, Math.floor(Date.now() / 1e3)).run();
        const verifyUrl = `https://kitvault.io/verify-email?token=${token}`;
        await sendEmail(env, cleanEmail, "Verify your KitVault account", `
          <div style="font-family:monospace;background:#0a1220;color:#c8ddf5;padding:40px;max-width:500px">
            <div style="font-size:20px;font-weight:bold;margin-bottom:8px">KIT<span style="color:#ff6600">VAULT</span></div>
            <div style="font-size:11px;color:#5a7a9f;letter-spacing:2px;margin-bottom:24px">VERIFY YOUR EMAIL</div>
            <p style="font-size:13px;line-height:1.8;color:#9ab0cc">Click the button below to verify your email and unlock all KitVault features.</p>
            <a href="${verifyUrl}" style="display:inline-block;background:#00aaff;color:#fff;padding:12px 28px;text-decoration:none;font-family:monospace;font-size:13px;letter-spacing:1px;margin:20px 0">VERIFY EMAIL \u2192</a>
            <p style="font-size:11px;color:#3a5a7a;margin-top:24px">This link expires in 24 hours.</p>
          </div>
        `);
        return new Response(JSON.stringify({ ok: true, message: "Verification email sent." }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    if (path === "/api/auth/forgot-password" && request.method === "POST") {
      try {
        const { email } = await request.json();
        if (!email) {
          return new Response(JSON.stringify({ ok: false, error: "Missing email" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const cleanEmail = email.trim().toLowerCase();
        const successResp = { ok: true, message: "If that email is registered, a reset link has been sent." };
        const user = await env.DB.prepare(
          "SELECT user_id, auth_provider FROM user_auth WHERE email = ?"
        ).bind(cleanEmail).first();
        if (!user || user.auth_provider === "google") {
          return new Response(JSON.stringify(successResp), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const allowed = await checkEmailRateLimit(env, cleanEmail);
        if (!allowed) {
          return new Response(JSON.stringify({ ok: false, error: "Too many requests. Please wait before requesting another email." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        await env.DB.prepare(
          "UPDATE email_tokens SET used = 1 WHERE user_id = ? AND type = 'reset' AND used = 0"
        ).bind(user.user_id).run();
        const token = generateToken();
        const expiresAt = Math.floor(Date.now() / 1e3) + 60 * 60;
        await env.DB.prepare(
          "INSERT INTO email_tokens (token, email, user_id, type, expires_at, created_at) VALUES (?, ?, ?, 'reset', ?, ?)"
        ).bind(token, cleanEmail, user.user_id, expiresAt, Math.floor(Date.now() / 1e3)).run();
        const resetUrl = `https://kitvault.io/reset-password?token=${token}`;
        await sendEmail(env, cleanEmail, "Reset your KitVault password", `
          <div style="font-family:monospace;background:#0a1220;color:#c8ddf5;padding:40px;max-width:500px">
            <div style="font-size:20px;font-weight:bold;margin-bottom:8px">KIT<span style="color:#ff6600">VAULT</span></div>
            <div style="font-size:11px;color:#5a7a9f;letter-spacing:2px;margin-bottom:24px">PASSWORD RESET</div>
            <p style="font-size:13px;line-height:1.8;color:#9ab0cc">We received a request to reset your KitVault password. Click the button below to choose a new one.</p>
            <a href="${resetUrl}" style="display:inline-block;background:#ff6600;color:#fff;padding:12px 28px;text-decoration:none;font-family:monospace;font-size:13px;letter-spacing:1px;margin:20px 0">RESET PASSWORD \u2192</a>
            <p style="font-size:11px;color:#3a5a7a;margin-top:24px">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
          </div>
        `);
        return new Response(JSON.stringify(successResp), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    if (path === "/api/auth/reset-password" && request.method === "POST") {
      try {
        const { token, newPassword } = await request.json();
        if (!token || !newPassword) {
          return new Response(JSON.stringify({ ok: false, error: "Missing token or new password" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        if (newPassword.length < 8) {
          return new Response(JSON.stringify({ ok: false, error: "Password must be at least 8 characters" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const now = Math.floor(Date.now() / 1e3);
        const row = await env.DB.prepare(
          "SELECT user_id, used FROM email_tokens WHERE token = ? AND type = 'reset' AND expires_at > ?"
        ).bind(token, now).first();
        if (!row || row.used) {
          return new Response(JSON.stringify({ ok: false, error: "Invalid or expired reset link" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const newSalt = generateSalt();
        const newHash = await hashPassword(newPassword, newSalt);
        await env.DB.prepare(
          "UPDATE user_auth SET pw_hash = ?, pw_salt = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?"
        ).bind(newHash, newSalt, row.user_id).run();
        await env.DB.prepare(
          "UPDATE email_tokens SET used = 1 WHERE token = ?"
        ).bind(token).run();
        return new Response(JSON.stringify({ ok: true, message: "Password reset successfully. You can now log in." }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    if (path === "/api/xp" && request.method === "GET") {
      try {
        const userId = url.searchParams.get("user_id");
        if (!userId) return new Response(JSON.stringify({ xp: 0, sprites: [], parade: [] }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
        const xpRow = await env.DB.prepare(
          "SELECT xp FROM user_xp WHERE user_id = ?"
        ).bind(userId).first();
        const { results: spriteRows } = await env.DB.prepare(
          "SELECT sprite_id, in_parade FROM user_sprites WHERE user_id = ?"
        ).bind(userId).all();
        const allSprites = (spriteRows || []).map((r) => r.sprite_id);
        const paradeSprites = (spriteRows || []).filter((r) => r.in_parade !== 0).map((r) => r.sprite_id);
        return new Response(JSON.stringify({
          xp: xpRow?.xp || 0,
          sprites: allSprites,
          parade: paradeSprites
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify({ xp: 0, sprites: [], parade: [] }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    async function awardXP(env2, userId, amount, reason, refId) {
      const now = Math.floor(Date.now() / 1e3);
      await env2.DB.prepare(`
        INSERT INTO user_xp (user_id, xp, updated_at) VALUES (?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET xp = xp + ?, updated_at = ?
      `).bind(userId, amount, now, amount, now).run();
      await env2.DB.prepare(
        "INSERT INTO xp_log (user_id, amount, reason, ref_id, created_at) VALUES (?, ?, ?, ?, ?)"
      ).bind(userId, amount, reason, refId || null, now).run();
    }
    __name(awardXP, "awardXP");
    if (path === "/api/xp/grant" && request.method === "POST") {
      const key = request.headers.get("X-Admin-Key");
      if (key !== env.ADMIN_KEY) {
        return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      try {
        const { user_id, amount } = await request.json();
        if (!user_id || !amount || isNaN(amount)) {
          return new Response(JSON.stringify({ ok: false, error: "Missing user_id or amount" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        await awardXP(env, user_id, Number(amount), "admin_grant", null);
        const updated = await env.DB.prepare("SELECT xp FROM user_xp WHERE user_id = ?").bind(user_id).first();
        return new Response(JSON.stringify({ ok: true, xp: updated?.xp || 0 }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    if (path === "/api/sprites/buy" && request.method === "POST") {
      try {
        const { user_id, sprite_id } = await request.json();
        if (!user_id || !sprite_id) {
          return new Response(JSON.stringify({ ok: false, error: "Missing fields" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const SPRITE_COSTS = {
          rx78: 0,
          wingzero: 150,
          unicorn: 200,
          barbatos: 150,
          exia: 300,
          sazabi: 400
        };
        if (!(sprite_id in SPRITE_COSTS)) {
          return new Response(JSON.stringify({ ok: false, error: "Unknown sprite" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const existing = await env.DB.prepare(
          "SELECT id FROM user_sprites WHERE user_id = ? AND sprite_id = ?"
        ).bind(user_id, sprite_id).first();
        if (existing) {
          return new Response(JSON.stringify({ ok: false, error: "Already owned" }), {
            status: 409,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const cost = SPRITE_COSTS[sprite_id];
        if (cost > 0) {
          const xpRow = await env.DB.prepare(
            "SELECT xp FROM user_xp WHERE user_id = ?"
          ).bind(user_id).first();
          const balance = xpRow?.xp || 0;
          if (balance < cost) {
            return new Response(JSON.stringify({ ok: false, error: "Not enough XP", xp: balance }), {
              status: 402,
              headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
          }
          const now2 = Math.floor(Date.now() / 1e3);
          await env.DB.prepare(
            "UPDATE user_xp SET xp = xp - ?, updated_at = ? WHERE user_id = ?"
          ).bind(cost, now2, user_id).run();
        }
        const now = Math.floor(Date.now() / 1e3);
        await env.DB.prepare(
          "INSERT INTO user_sprites (user_id, sprite_id, created_at) VALUES (?, ?, ?)"
        ).bind(user_id, sprite_id, now).run();
        const updatedXp = await env.DB.prepare(
          "SELECT xp FROM user_xp WHERE user_id = ?"
        ).bind(user_id).first();
        return new Response(JSON.stringify({
          ok: true,
          sprite_id,
          xp: updatedXp?.xp || 0
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    if (path === "/api/sprites/toggle-parade" && request.method === "POST") {
      try {
        const { user_id, sprite_id, active } = await request.json();
        if (!user_id || !sprite_id || active === void 0) {
          return new Response(JSON.stringify({ ok: false, error: "Missing fields" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        await env.DB.prepare(
          "UPDATE user_sprites SET in_parade = ? WHERE user_id = ? AND sprite_id = ?"
        ).bind(active ? 1 : 0, user_id, sprite_id).run();
        return new Response(JSON.stringify({ ok: true, sprite_id, active }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    if (path === "/api/sprites/upload" && request.method === "POST") {
      const key = request.headers.get("X-Admin-Key");
      if (key !== env.ADMIN_KEY) {
        return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      try {
        const formData = await request.formData();
        const file = formData.get("image");
        const spriteId = formData.get("sprite_id");
        const VALID_SPRITES = ["rx78", "wingzero", "unicorn", "barbatos", "exia", "sazabi"];
        if (!VALID_SPRITES.includes(spriteId)) {
          return new Response(JSON.stringify({ ok: false, error: "Invalid sprite_id" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        if (!file || !file.size) {
          return new Response(JSON.stringify({ ok: false, error: "No file provided" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const buf = await file.arrayBuffer();
        if (buf.byteLength > 2 * 1024 * 1024) {
          return new Response(JSON.stringify({ ok: false, error: "Max 2MB" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const r2Key = `sprites/${spriteId}.png`;
        await env.BUCKET.put(r2Key, buf, {
          httpMetadata: { contentType: "image/png" }
        });
        const url_out = `https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/${r2Key}`;
        return new Response(JSON.stringify({ ok: true, url: url_out, sprite_id: spriteId }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    if (request.method === "PATCH" && url.pathname.startsWith("/api/kit/")) {
      const key = request.headers.get("X-Admin-Key");
      if (key !== env.ADMIN_KEY) {
        return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      const kitId = url.pathname.split("/").pop();
      if (!kitId || isNaN(kitId)) {
        return new Response(JSON.stringify({ ok: false, error: "Invalid kit ID" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      const body = await request.json();
      if (body.kit) {
        const { name, grade, scale, series, image_url, amazon_asin } = body.kit;
        await env.DB.prepare(
          `UPDATE kits SET
            name = COALESCE(?, name),
            grade = COALESCE(?, grade),
            scale = COALESCE(?, scale),
            series = COALESCE(?, series),
            image_url = COALESCE(?, image_url),
            amazon_asin = COALESCE(?, amazon_asin)
          WHERE id = ?`
        ).bind(
          name || null,
          grade || null,
          scale || null,
          series ?? null,
          image_url ?? null,
          amazon_asin ?? null,
          Number(kitId)
        ).run();
      }
      if (body.manuals && Array.isArray(body.manuals)) {
        for (const m of body.manuals) {
          if (!m.id) continue;
          await env.DB.prepare(
            `UPDATE manuals SET
              name = COALESCE(?, name),
              lang = COALESCE(?, lang),
              pages = COALESCE(?, pages)
            WHERE id = ?`
          ).bind(
            m.name || null,
            m.lang || null,
            m.pages ?? null,
            Number(m.id)
          ).run();
        }
      }
      return new Response(JSON.stringify({ ok: true, updated: Number(kitId) }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    if (request.method === "POST" && url.pathname.match(/^\/api\/kit\/\d+\/image$/)) {
      const token = request.headers.get("X-Admin-Key") || "";
      if (token !== env.ADMIN_KEY) {
        return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      try {
        const kitId = url.pathname.split("/")[3];
        const formData = await request.formData();
        const file = formData.get("image");
        if (!file || !file.size) {
          return new Response(JSON.stringify({ ok: false, error: "No image provided" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const ext = file.name?.split(".").pop()?.toLowerCase() || "jpg";
        const r2Key = `kit-images/${kitId}.${ext}`;
        const buf = await file.arrayBuffer();
        if (buf.byteLength > 10 * 1024 * 1024) {
          return new Response(JSON.stringify({ ok: false, error: "Image too large (max 10MB)" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        await env.BUCKET.put(r2Key, buf, {
          httpMetadata: { contentType: file.type || "image/jpeg" }
        });
        const imageUrl = `https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/${r2Key}`;
        await env.DB.prepare("UPDATE kits SET image_url = ? WHERE id = ?").bind(imageUrl, Number(kitId)).run();
        return new Response(JSON.stringify({ ok: true, image_url: imageUrl }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    if (request.method === "GET" && url.pathname.match(/^\/api\/gallery\/kit\/\d+$/)) {
      try {
        const kitId = url.pathname.split("/").pop();
        const { results } = await env.DB.prepare(`
          SELECT id, user_id, username, avatar_url, image_urls, caption, likes, created_at
          FROM gallery WHERE kit_id = ? ORDER BY likes DESC, created_at DESC LIMIT 20
        `).bind(Number(kitId)).all();
        const posts = (results || []).map((p) => ({
          ...p,
          images: p.image_urls ? JSON.parse(p.image_urls) : []
        }));
        return new Response(JSON.stringify(posts), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify([]), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    if (request.method === "DELETE" && url.pathname.startsWith("/api/manual/")) {
      const key = request.headers.get("X-Admin-Key");
      if (key !== env.ADMIN_KEY) {
        return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      const manualId = url.pathname.split("/").pop();
      if (!manualId || isNaN(manualId)) {
        return new Response(JSON.stringify({ ok: false, error: "Invalid manual ID" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      await env.DB.prepare("DELETE FROM manuals WHERE id = ?").bind(Number(manualId)).run();
      return new Response(JSON.stringify({ ok: true, deleted: "manual", id: Number(manualId) }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    if (request.method === "DELETE" && url.pathname.startsWith("/api/kit/")) {
      const key = request.headers.get("X-Admin-Key");
      if (key !== env.ADMIN_KEY) {
        return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      const kitId = url.pathname.split("/").pop();
      if (!kitId || isNaN(kitId)) {
        return new Response(JSON.stringify({ ok: false, error: "Invalid kit ID" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      await env.DB.prepare("DELETE FROM manuals WHERE kit_id = ?").bind(Number(kitId)).run();
      await env.DB.prepare("DELETE FROM kits WHERE id = ?").bind(Number(kitId)).run();
      return new Response(JSON.stringify({ ok: true, deleted: "kit", id: Number(kitId) }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    if (path === "/api/kits" && request.method === "GET") {
      try {
        const { results } = await env.DB.prepare(`
          SELECT k.id, k.grade, k.scale, k.name, k.series, k.image_url, k.amazon_asin, k.created_at,
            json_group_array(json_object(
              'id', m.id,
              'kit_id', m.kit_id,
              'name', m.name,
              'url', m.url,
              'lang', m.lang,
              'pages', m.pages,
              'size', m.size
            )) as manuals
          FROM kits k
          LEFT JOIN manuals m ON m.kit_id = k.id
          GROUP BY k.id
          ORDER BY k.created_at DESC
        `).all();
        const kits = results.map((kit) => ({
          ...kit,
          manuals: JSON.parse(kit.manuals).filter((m) => m.id !== null)
        }));
        return new Response(JSON.stringify(kits), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    if (path === "/api/upload" && request.method === "POST") {
      const token = request.headers.get("X-Admin-Key") || "";
      if (token !== env.ADMIN_KEY) {
        return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      try {
        const formData = await request.formData();
        const file = formData.get("file");
        const filename = (formData.get("filename") || file?.name || "").toLowerCase();
        if (!file) {
          return new Response(JSON.stringify({ ok: false, error: "No file provided" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const withoutExt = filename.replace(/\.pdf$/, "");
        const withoutSuffix = withoutExt.replace(/-assembly$/, "");
        const parts = withoutSuffix.split("-");
        const VALID_GRADES = ["hg", "mg", "rg", "pg", "sd", "eg", "mgsd"];
        const VALID_SCALES = ["144", "100", "60", "unk"];
        const SCALE_MAP = { "144": "1/144", "100": "1/100", "60": "1/60", "unk": "SD" };
        const rawGrade = parts[0];
        const rawScale = parts[1];
        if (!VALID_GRADES.includes(rawGrade)) {
          return new Response(JSON.stringify({
            ok: false,
            kitCreated: false,
            reason: `Unrecognised grade "${rawGrade}". Valid: ${VALID_GRADES.join(", ")}`
          }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        if (!VALID_SCALES.includes(rawScale)) {
          return new Response(JSON.stringify({
            ok: true,
            kitCreated: false,
            reason: `Unrecognised scale "${rawScale}". Valid: ${VALID_SCALES.join(", ")}`
          }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        const grade = rawGrade.toUpperCase();
        const scale = SCALE_MAP[rawScale];
        const nameWords = parts.slice(2).map((w) => w.charAt(0).toUpperCase() + w.slice(1));
        const name = nameWords.join(" ");
        if (!name) {
          return new Response(JSON.stringify({
            ok: true,
            kitCreated: false,
            reason: "Could not parse kit name from filename"
          }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        const fileBuffer = await file.arrayBuffer();
        const sizeMB = (fileBuffer.byteLength / 1024 / 1024).toFixed(1) + "MB";
        const r2Key = `${grade}/${scale.replace("/", "")}/${name.replace(/\s+/g, "_")}/${filename}`;
        await env.BUCKET.put(r2Key, fileBuffer, {
          httpMetadata: { contentType: "application/pdf" }
        });
        const pdfUrl = `https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/${r2Key}`;
        const now = Math.floor(Date.now() / 1e3);
        const kitResult = await env.DB.prepare(`
          INSERT INTO kits (grade, scale, name, series, image_url, created_at)
          VALUES (?, ?, ?, '', '', ?)
          ON CONFLICT(grade, scale, name) DO UPDATE SET created_at = created_at
          RETURNING id
        `).bind(grade, scale, name, now).first();
        const kitId = kitResult.id;
        await env.DB.prepare(`
          INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at)
          VALUES (?, 'Assembly', ?, 'JP', 0, ?, ?)
        `).bind(kitId, pdfUrl, sizeMB, now).run();
        return new Response(JSON.stringify({
          ok: true,
          kitCreated: true,
          kit: { grade, scale, name }
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    if (request.method === "GET" && url.pathname.match(/^\/api\/comments\/\d+$/)) {
      const kitId = url.pathname.split("/").pop();
      try {
        const { results } = await env.DB.prepare(
          `SELECT id, kit_id, user_id, username, avatar_url, body, parent_id, created_at
           FROM comments WHERE kit_id = ? ORDER BY created_at DESC LIMIT 200`
        ).bind(Number(kitId)).all();
        return new Response(JSON.stringify(results || []), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    if (path === "/api/comments" && request.method === "POST") {
      try {
        const { kit_id, user_id, username, avatar_url, body: commentBody, parent_id } = await request.json();
        if (!kit_id || !user_id || !commentBody?.trim()) {
          return new Response(JSON.stringify({ ok: false, error: "Missing required fields" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        if (commentBody.trim().length > 1e3) {
          return new Response(JSON.stringify({ ok: false, error: "Comment too long (max 1000 chars)" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const dayAgo = Math.floor(Date.now() / 1e3) - 86400;
        const countResult = await env.DB.prepare(
          "SELECT COUNT(*) as cnt FROM comments WHERE user_id = ? AND created_at > ?"
        ).bind(user_id, dayAgo).first();
        if (countResult && countResult.cnt >= 10) {
          return new Response(JSON.stringify({ ok: false, error: "Daily limit reached (10 comments per day)" }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const now = Math.floor(Date.now() / 1e3);
        await env.DB.prepare(
          `INSERT INTO comments (kit_id, user_id, username, avatar_url, body, parent_id, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          Number(kit_id),
          user_id,
          username || "Builder",
          avatar_url || "",
          commentBody.trim(),
          parent_id ? Number(parent_id) : null,
          now
        ).run();
        try {
          const insertId = await env.DB.prepare("SELECT last_insert_rowid() as id").first();
          await awardXP(env, user_id, 10, "comment", insertId?.id || null);
        } catch (_) {
        }
        return new Response(JSON.stringify({ ok: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    if (request.method === "DELETE" && url.pathname.match(/^\/api\/comments\/\d+$/)) {
      try {
        const commentId = url.pathname.split("/").pop();
        const { user_id, admin_key } = await request.json();
        const isAdmin = admin_key && admin_key === env.ADMIN_KEY;
        if (!isAdmin) {
          const comment = await env.DB.prepare(
            "SELECT user_id FROM comments WHERE id = ?"
          ).bind(Number(commentId)).first();
          if (!comment) {
            return new Response(JSON.stringify({ ok: false, error: "Comment not found" }), {
              status: 404,
              headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
          }
          if (comment.user_id !== user_id) {
            return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
              status: 403,
              headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
          }
        }
        await env.DB.prepare("DELETE FROM comments WHERE id = ?").bind(Number(commentId)).run();
        return new Response(JSON.stringify({ ok: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    if (path === "/api/gallery" && request.method === "GET") {
      try {
        const { results } = await env.DB.prepare(`
          SELECT g.*, 
            (SELECT COUNT(*) FROM gallery_comments gc WHERE gc.post_id = g.id) as comment_count
          FROM gallery g ORDER BY g.created_at DESC LIMIT 200
        `).all();
        const posts = (results || []).map((p) => ({
          ...p,
          images: p.image_urls ? JSON.parse(p.image_urls) : []
        }));
        return new Response(JSON.stringify(posts), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    if (path === "/api/gallery" && request.method === "POST") {
      try {
        const formData = await request.formData();
        const kitId = formData.get("kit_id");
        const kitName = formData.get("kit_name");
        const kitGrade = formData.get("kit_grade");
        const kitScale = formData.get("kit_scale") || "";
        const caption = formData.get("caption") || "";
        const userId = formData.get("user_id");
        const username = formData.get("username") || "Builder";
        const avatarUrl = formData.get("avatar_url") || "";
        const imageFiles = formData.getAll("images");
        if (!kitId || !userId || imageFiles.length === 0) {
          return new Response(JSON.stringify({ ok: false, error: "Missing required fields" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        if (imageFiles.length > 3) {
          return new Response(JSON.stringify({ ok: false, error: "Max 3 images per post" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const dayAgo = Math.floor(Date.now() / 1e3) - 86400;
        const countResult = await env.DB.prepare(
          "SELECT COUNT(*) as cnt FROM gallery WHERE user_id = ? AND created_at > ?"
        ).bind(userId, dayAgo).first();
        if (countResult && countResult.cnt >= 5) {
          return new Response(JSON.stringify({ ok: false, error: "Daily limit reached (5 posts per day)" }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const imageUrls = [];
        for (const file of imageFiles) {
          if (!file || !file.size) continue;
          const ext = file.name?.split(".").pop()?.toLowerCase() || "jpg";
          const ts = Date.now();
          const rand = Math.random().toString(36).slice(2, 8);
          const r2Key = `gallery/${userId}/${ts}-${rand}.${ext}`;
          const buf = await file.arrayBuffer();
          if (buf.byteLength > 5 * 1024 * 1024) continue;
          await env.BUCKET.put(r2Key, buf, {
            httpMetadata: { contentType: file.type || "image/jpeg" }
          });
          imageUrls.push(`https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/${r2Key}`);
        }
        if (imageUrls.length === 0) {
          return new Response(JSON.stringify({ ok: false, error: "No valid images uploaded" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const now = Math.floor(Date.now() / 1e3);
        await env.DB.prepare(`
          INSERT INTO gallery (user_id, username, avatar_url, kit_id, kit_name, kit_grade, kit_scale, caption, image_urls, likes, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
        `).bind(userId, username, avatarUrl, Number(kitId), kitName, kitGrade, kitScale, caption, JSON.stringify(imageUrls), now).run();
        try {
          const insertId = await env.DB.prepare("SELECT last_insert_rowid() as id").first();
          await awardXP(env, userId, 50, "gallery_post", insertId?.id || null);
        } catch (_) {
        }
        return new Response(JSON.stringify({ ok: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    if (request.method === "PATCH" && url.pathname.match(/^\/api\/gallery\/\d+$/)) {
      try {
        const postId = url.pathname.split("/").pop();
        const body = await request.json();
        const { admin_key, user_id, kit_name, caption, created_at } = body;
        const isAdmin = admin_key && admin_key === env.ADMIN_KEY;
        if (!isAdmin) {
          const post = await env.DB.prepare("SELECT user_id FROM gallery WHERE id = ?").bind(Number(postId)).first();
          if (!post) return new Response(JSON.stringify({ ok: false, error: "Not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
          if (post.user_id !== user_id) return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        const sets = [];
        const binds = [];
        if (kit_name !== void 0) {
          sets.push("kit_name = ?");
          binds.push(kit_name);
        }
        if (caption !== void 0) {
          sets.push("caption = ?");
          binds.push(caption);
        }
        if (created_at !== void 0) {
          sets.push("created_at = ?");
          binds.push(Number(created_at));
        }
        if (sets.length === 0) {
          return new Response(JSON.stringify({ ok: false, error: "No fields to update" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        binds.push(Number(postId));
        await env.DB.prepare(`UPDATE gallery SET ${sets.join(", ")} WHERE id = ?`).bind(...binds).run();
        return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }
    if (request.method === "DELETE" && url.pathname.match(/^\/api\/gallery\/\d+$/)) {
      try {
        const postId = url.pathname.split("/").pop();
        const { user_id, admin_key } = await request.json();
        const isAdmin = admin_key && admin_key === env.ADMIN_KEY;
        if (!isAdmin) {
          const post = await env.DB.prepare("SELECT user_id FROM gallery WHERE id = ?").bind(Number(postId)).first();
          if (!post) return new Response(JSON.stringify({ ok: false, error: "Not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
          if (post.user_id !== user_id) return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        await env.DB.prepare("DELETE FROM gallery_comments WHERE post_id = ?").bind(Number(postId)).run();
        await env.DB.prepare("DELETE FROM gallery_likes WHERE post_id = ?").bind(Number(postId)).run();
        await env.DB.prepare("DELETE FROM gallery WHERE id = ?").bind(Number(postId)).run();
        return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }
    if (request.method === "POST" && url.pathname.match(/^\/api\/gallery\/\d+\/like$/)) {
      try {
        const postId = url.pathname.split("/")[3];
        const { user_id } = await request.json();
        if (!user_id) return new Response(JSON.stringify({ ok: false }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        const existing = await env.DB.prepare(
          "SELECT id FROM gallery_likes WHERE post_id = ? AND user_id = ?"
        ).bind(Number(postId), user_id).first();
        if (existing) {
          await env.DB.prepare("DELETE FROM gallery_likes WHERE id = ?").bind(existing.id).run();
          await env.DB.prepare("UPDATE gallery SET likes = MAX(0, likes - 1) WHERE id = ?").bind(Number(postId)).run();
        } else {
          await env.DB.prepare("INSERT INTO gallery_likes (post_id, user_id) VALUES (?, ?)").bind(Number(postId), user_id).run();
          await env.DB.prepare("UPDATE gallery SET likes = likes + 1 WHERE id = ?").bind(Number(postId)).run();
        }
        return new Response(JSON.stringify({ ok: true, liked: !existing }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }
    if (path === "/api/gallery/likes" && request.method === "GET") {
      try {
        const userId = url.searchParams.get("user_id");
        if (!userId) return new Response(JSON.stringify([]), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        const { results } = await env.DB.prepare(
          "SELECT post_id FROM gallery_likes WHERE user_id = ?"
        ).bind(userId).all();
        return new Response(JSON.stringify((results || []).map((r) => r.post_id)), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify([]), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }
    if (request.method === "GET" && url.pathname.match(/^\/api\/gallery\/\d+\/comments$/)) {
      try {
        const postId = url.pathname.split("/")[3];
        const { results } = await env.DB.prepare(
          "SELECT * FROM gallery_comments WHERE post_id = ? ORDER BY created_at ASC LIMIT 100"
        ).bind(Number(postId)).all();
        return new Response(JSON.stringify(results || []), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }
    if (request.method === "POST" && url.pathname.match(/^\/api\/gallery\/\d+\/comments$/)) {
      try {
        const postId = url.pathname.split("/")[3];
        const { user_id, username, avatar_url, body: commentBody } = await request.json();
        if (!user_id || !commentBody?.trim()) {
          return new Response(JSON.stringify({ ok: false, error: "Missing fields" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        const dayAgo = Math.floor(Date.now() / 1e3) - 86400;
        const cnt = await env.DB.prepare("SELECT COUNT(*) as c FROM gallery_comments WHERE user_id = ? AND created_at > ?").bind(user_id, dayAgo).first();
        if (cnt && cnt.c >= 20) {
          return new Response(JSON.stringify({ ok: false, error: "Daily comment limit reached" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        const now = Math.floor(Date.now() / 1e3);
        await env.DB.prepare(
          "INSERT INTO gallery_comments (post_id, user_id, username, avatar_url, body, created_at) VALUES (?, ?, ?, ?, ?, ?)"
        ).bind(Number(postId), user_id, username || "Builder", avatar_url || "", commentBody.trim(), now).run();
        return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }
    if (request.method === "DELETE" && url.pathname.match(/^\/api\/gallery\/comments\/\d+$/)) {
      try {
        const commentId = url.pathname.split("/").pop();
        const { user_id, admin_key } = await request.json();
        const isAdmin = admin_key && admin_key === env.ADMIN_KEY;
        if (!isAdmin) {
          const comment = await env.DB.prepare("SELECT user_id FROM gallery_comments WHERE id = ?").bind(Number(commentId)).first();
          if (!comment) return new Response(JSON.stringify({ ok: false, error: "Not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
          if (comment.user_id !== user_id) return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        await env.DB.prepare("DELETE FROM gallery_comments WHERE id = ?").bind(Number(commentId)).run();
        return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }
    if (path === "/api/progress" && request.method === "GET") {
      try {
        const userId = url.searchParams.get("userId");
        if (!userId) return new Response(JSON.stringify({}), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        const row = await env.DB.prepare(
          "SELECT favourites, progress, pages, tags, notes, wishlist, timers FROM user_progress WHERE user_id = ?"
        ).bind(userId).first();
        if (!row) return new Response(JSON.stringify({}), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({
          favourites: row.favourites ? JSON.parse(row.favourites) : [],
          progress: row.progress ? JSON.parse(row.progress) : {},
          pages: row.pages ? JSON.parse(row.pages) : {},
          tags: row.tags ? JSON.parse(row.tags) : {},
          notes: row.notes ? JSON.parse(row.notes) : {},
          wishlist: row.wishlist ? JSON.parse(row.wishlist) : [],
          timers: row.timers ? JSON.parse(row.timers) : {}
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }
    if (path === "/api/progress" && request.method === "POST") {
      try {
        const body = await request.json();
        const userId = body.userId;
        if (!userId) return new Response(JSON.stringify({ ok: false, error: "Missing userId" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        const now = Math.floor(Date.now() / 1e3);
        const existing = await env.DB.prepare(
          "SELECT favourites, progress, pages, tags, notes, wishlist, timers FROM user_progress WHERE user_id = ?"
        ).bind(userId).first();
        const currentFavourites = existing?.favourites ? JSON.parse(existing.favourites) : [];
        const currentProgress = existing?.progress ? JSON.parse(existing.progress) : {};
        const currentPages = existing?.pages ? JSON.parse(existing.pages) : {};
        const currentTags = existing?.tags ? JSON.parse(existing.tags) : {};
        const currentNotes = existing?.notes ? JSON.parse(existing.notes) : {};
        const currentWishlist = existing?.wishlist ? JSON.parse(existing.wishlist) : [];
        const currentTimers = existing?.timers ? JSON.parse(existing.timers) : {};
        const newFavourites = body.favourites !== void 0 ? body.favourites : currentFavourites;
        const newProgress = body.progress !== void 0 ? body.progress : currentProgress;
        const newPages = body.pages !== void 0 ? body.pages : currentPages;
        const newTags = body.tags !== void 0 ? body.tags : currentTags;
        const newNotes = body.notes !== void 0 ? body.notes : currentNotes;
        const newWishlist = body.wishlist !== void 0 ? body.wishlist : currentWishlist;
        const newTimers = body.timers !== void 0 ? body.timers : currentTimers;
        await env.DB.prepare(`
          INSERT INTO user_progress (user_id, favourites, progress, pages, tags, notes, wishlist, timers, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(user_id) DO UPDATE SET
            favourites = excluded.favourites,
            progress = excluded.progress,
            pages = excluded.pages,
            tags = excluded.tags,
            notes = excluded.notes,
            wishlist = excluded.wishlist,
            timers = excluded.timers,
            updated_at = excluded.updated_at
        `).bind(
          userId,
          JSON.stringify(newFavourites),
          JSON.stringify(newProgress),
          JSON.stringify(newPages),
          JSON.stringify(newTags),
          JSON.stringify(newNotes),
          JSON.stringify(newWishlist),
          JSON.stringify(newTimers),
          now
        ).run();
        return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }
    if (path === "/api/hangar/check-username" && request.method === "GET") {
      try {
        const username = url.searchParams.get("username")?.trim().toLowerCase();
        if (!username) return new Response(JSON.stringify({ ok: false, error: "Missing username" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        const existing = await env.DB.prepare("SELECT user_id FROM user_profiles WHERE username = ?").bind(username).first();
        return new Response(JSON.stringify({ ok: true, available: !existing }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }
    if (path === "/api/hangar/profile" && request.method === "GET") {
      try {
        const userId = url.searchParams.get("user_id");
        if (!userId) return new Response(JSON.stringify({ ok: false, error: "Missing user_id" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        const profile = await env.DB.prepare("SELECT * FROM user_profiles WHERE user_id = ?").bind(userId).first();
        return new Response(JSON.stringify({ ok: true, profile: profile || null }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }
    if (path === "/api/hangar/profile" && request.method === "POST") {
      try {
        const { user_id, username, display_name, avatar_url, bio, is_public } = await request.json();
        if (!user_id || !username) return new Response(JSON.stringify({ ok: false, error: "Missing user_id or username" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        const cleanUsername = username.trim().toLowerCase();
        if (!/^[a-z0-9_-]{3,24}$/.test(cleanUsername)) {
          return new Response(JSON.stringify({ ok: false, error: "Username must be 3-24 characters, letters/numbers/underscores/hyphens only" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        const reserved = ["admin", "api", "gallery", "vault", "support", "settings", "hangar", "kit", "tools", "resources", "disclaimer", "null", "undefined"];
        if (reserved.includes(cleanUsername)) {
          return new Response(JSON.stringify({ ok: false, error: "That username is reserved" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        const existing = await env.DB.prepare("SELECT user_id FROM user_profiles WHERE username = ? AND user_id != ?").bind(cleanUsername, user_id).first();
        if (existing) {
          return new Response(JSON.stringify({ ok: false, error: "Username already taken" }), { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        const now = Math.floor(Date.now() / 1e3);
        await env.DB.prepare(`
          INSERT INTO user_profiles (user_id, username, display_name, avatar_url, bio, is_public, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(user_id) DO UPDATE SET
            username = excluded.username,
            display_name = excluded.display_name,
            avatar_url = excluded.avatar_url,
            bio = excluded.bio,
            is_public = excluded.is_public
        `).bind(
          user_id,
          cleanUsername,
          (display_name || "").trim(),
          avatar_url || "",
          (bio || "").trim().substring(0, 280),
          is_public ? 1 : 0,
          now
        ).run();
        return new Response(JSON.stringify({ ok: true, username: cleanUsername }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }
    if (path === "/api/hangar/photos" && request.method === "GET") {
      try {
        const userId = url.searchParams.get("user_id");
        const kitId = url.searchParams.get("kit_id");
        if (!userId) return new Response(JSON.stringify([]), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        let query = "SELECT * FROM hangar_photos WHERE user_id = ?";
        const binds = [userId];
        if (kitId) {
          query += " AND kit_id = ?";
          binds.push(Number(kitId));
        }
        query += " ORDER BY created_at DESC";
        const { results } = await env.DB.prepare(query).bind(...binds).all();
        return new Response(JSON.stringify(results || []), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify([]), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }
    if (request.method === "GET" && url.pathname.match(/^\/api\/hangar\/[a-z0-9_-]+$/)) {
      try {
        const username = url.pathname.split("/").pop();
        const viewerId = url.searchParams.get("viewer_id") || null;
        const profile = await env.DB.prepare("SELECT * FROM user_profiles WHERE username = ?").bind(username).first();
        if (!profile) return new Response(JSON.stringify({ ok: false, error: "User not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        const isOwner = viewerId && viewerId === profile.user_id;
        if (!profile.is_public && !isOwner) {
          return new Response(JSON.stringify({ ok: false, error: "This hangar is private" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        const progressRow = await env.DB.prepare("SELECT favourites, progress, pages, timers FROM user_progress WHERE user_id = ?").bind(profile.user_id).first();
        const favourites = progressRow?.favourites ? JSON.parse(progressRow.favourites) : [];
        const progress = progressRow?.progress ? JSON.parse(progressRow.progress) : {};
        const timers = progressRow?.timers ? JSON.parse(progressRow.timers) : {};
        const vaultKitIds = [];
        for (const [kitId, status] of Object.entries(progress)) {
          if (status === "inprogress" || status === "complete" || status === "backlog") {
            vaultKitIds.push(Number(kitId));
          }
        }
        for (const kitId of favourites) {
          if (!vaultKitIds.includes(Number(kitId))) vaultKitIds.push(Number(kitId));
        }
        let kits = [];
        if (vaultKitIds.length > 0) {
          const placeholders = vaultKitIds.map(() => "?").join(",");
          const { results } = await env.DB.prepare(`SELECT id, grade, scale, name, series, image_url FROM kits WHERE id IN (${placeholders})`).bind(...vaultKitIds).all();
          kits = results || [];
        }
        const { results: photos } = await env.DB.prepare("SELECT id, kit_id, image_url, caption, created_at FROM hangar_photos WHERE user_id = ? ORDER BY created_at DESC").bind(profile.user_id).all();
        const { results: galleryPosts } = await env.DB.prepare(
          "SELECT id, kit_id, kit_name, kit_grade, image_urls, caption, likes, created_at FROM gallery WHERE user_id = ? ORDER BY created_at DESC LIMIT 50"
        ).bind(profile.user_id).all();
        return new Response(JSON.stringify({
          ok: true,
          profile: {
            username: profile.username,
            display_name: profile.display_name,
            avatar_url: profile.avatar_url,
            bio: profile.bio,
            is_public: !!profile.is_public,
            created_at: profile.created_at
          },
          vault: {
            kits,
            favourites,
            progress
          },
          photos: photos || [],
          gallery_posts: galleryPosts || [],
          stats: {
            total_kits: vaultKitIds.length,
            completed: Object.values(progress).filter((s) => s === "complete").length,
            in_progress: Object.values(progress).filter((s) => s === "inprogress").length,
            backlog: Object.values(progress).filter((s) => s === "backlog").length,
            gallery_posts: (galleryPosts || []).length,
            photos: (photos || []).length,
            total_build_time: Object.values(timers).reduce((sum, t) => sum + (t?.accumulated || 0), 0)
          },
          is_owner: isOwner
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }
    if (path === "/api/hangar/photo" && request.method === "POST") {
      try {
        const formData = await request.formData();
        const userId = formData.get("user_id");
        const kitId = formData.get("kit_id");
        const caption = formData.get("caption") || "";
        const file = formData.get("file");
        if (!userId || !kitId || !file) {
          return new Response(JSON.stringify({ ok: false, error: "Missing user_id, kit_id, or file" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        const countResult = await env.DB.prepare("SELECT COUNT(*) as c FROM hangar_photos WHERE user_id = ? AND kit_id = ?").bind(userId, Number(kitId)).first();
        if (countResult && countResult.c >= 5) {
          return new Response(JSON.stringify({ ok: false, error: "Max 5 photos per kit" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        const ext = file.name?.split(".").pop()?.toLowerCase() || "jpg";
        const timestamp = Date.now();
        const r2Key = `hangar/${userId}/${kitId}/${timestamp}.${ext}`;
        const arrayBuffer = await file.arrayBuffer();
        await env.BUCKET.put(r2Key, arrayBuffer, { httpMetadata: { contentType: file.type || "image/jpeg" } });
        const imageUrl = `https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/${r2Key}`;
        const now = Math.floor(Date.now() / 1e3);
        await env.DB.prepare(
          "INSERT INTO hangar_photos (user_id, kit_id, image_url, caption, created_at) VALUES (?, ?, ?, ?, ?)"
        ).bind(userId, Number(kitId), imageUrl, caption.trim().substring(0, 280), now).run();
        return new Response(JSON.stringify({ ok: true, image_url: imageUrl }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }
    if (request.method === "DELETE" && url.pathname.match(/^\/api\/hangar\/photo\/\d+$/)) {
      try {
        const photoId = url.pathname.split("/").pop();
        const { user_id } = await request.json();
        if (!user_id) return new Response(JSON.stringify({ ok: false, error: "Missing user_id" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        const photo = await env.DB.prepare("SELECT * FROM hangar_photos WHERE id = ?").bind(Number(photoId)).first();
        if (!photo) return new Response(JSON.stringify({ ok: false, error: "Not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        if (photo.user_id !== user_id) return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        const r2Key = photo.image_url.replace("https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/", "");
        if (r2Key) await env.BUCKET.delete(r2Key);
        await env.DB.prepare("DELETE FROM hangar_photos WHERE id = ?").bind(Number(photoId)).run();
        return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }
    if (request.method === "GET" && url.pathname.startsWith("/api/kit-rating/")) {
      try {
        const kitId = url.pathname.replace("/api/kit-rating/", "");
        if (!kitId) return new Response(JSON.stringify({ ok: false, error: "Missing kit_id" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        const userId = url.searchParams.get("user_id");
        const commRow = await env.DB.prepare(
          `SELECT AVG(difficulty) as difficulty, AVG(articulation) as articulation,
                  AVG(detail) as detail, AVG(fun_factor) as fun_factor,
                  AVG(value) as value, COUNT(*) as count
           FROM kit_ratings WHERE kit_id = ?`
        ).bind(kitId).first();
        const count = commRow?.count || 0;
        const community = count > 0 ? {
          difficulty: Math.round((commRow.difficulty || 0) * 10) / 10,
          articulation: Math.round((commRow.articulation || 0) * 10) / 10,
          detail: Math.round((commRow.detail || 0) * 10) / 10,
          fun_factor: Math.round((commRow.fun_factor || 0) * 10) / 10,
          value: Math.round((commRow.value || 0) * 10) / 10
        } : null;
        let my_rating = null;
        if (userId) {
          const row = await env.DB.prepare(
            `SELECT difficulty, articulation, detail, fun_factor, value FROM kit_ratings WHERE kit_id = ? AND user_id = ?`
          ).bind(kitId, userId).first();
          if (row) my_rating = row;
        }
        return new Response(JSON.stringify({ ok: true, community, count, my_rating }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }
    if (request.method === "POST" && url.pathname === "/api/kit-rating") {
      try {
        const token = getCookieToken(request);
        if (!token) return new Response(JSON.stringify({ ok: false, error: "Not authenticated" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        const payload = await verifyJWT(token, env.JWT_SECRET);
        if (!payload) return new Response(JSON.stringify({ ok: false, error: "Invalid token" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        const body = await request.json();
        const { kit_id, difficulty, articulation, detail, fun_factor, value } = body;
        if (!kit_id) return new Response(JSON.stringify({ ok: false, error: "Missing kit_id" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        const clamp = /* @__PURE__ */ __name((v) => Math.max(0, Math.min(10, Math.round(Number(v) || 0))), "clamp");
        await env.DB.prepare(`
          INSERT INTO kit_ratings (user_id, kit_id, difficulty, articulation, detail, fun_factor, value, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, unixepoch())
          ON CONFLICT(user_id, kit_id) DO UPDATE SET
            difficulty   = excluded.difficulty,
            articulation = excluded.articulation,
            detail       = excluded.detail,
            fun_factor   = excluded.fun_factor,
            value        = excluded.value,
            updated_at   = unixepoch()
        `).bind(payload.userId, kit_id, clamp(difficulty), clamp(articulation), clamp(detail), clamp(fun_factor), clamp(value)).run();
        return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }
    if (path === "/api/stats" && request.method === "GET") {
      try {
        const { results: allProgress } = await env.DB.prepare(
          "SELECT timers, progress FROM user_progress WHERE timers IS NOT NULL OR progress IS NOT NULL"
        ).all();
        let totalBuildTimeSeconds = 0;
        let totalCompleted = 0;
        for (const row of allProgress || []) {
          if (row.timers) {
            try {
              const timers = JSON.parse(row.timers);
              const nowMs = Date.now();
              for (const t of Object.values(timers)) {
                totalBuildTimeSeconds += t?.accumulated || 0;
                if (t?.running && t?.startedAt) {
                  totalBuildTimeSeconds += Math.floor((nowMs - t.startedAt) / 1e3);
                }
              }
            } catch (_) {
            }
          }
          if (row.progress) {
            try {
              const progress = JSON.parse(row.progress);
              for (const status of Object.values(progress)) {
                if (status === "complete") totalCompleted++;
              }
            } catch (_) {
            }
          }
        }
        return new Response(JSON.stringify({
          ok: true,
          total_build_time_seconds: totalBuildTimeSeconds,
          total_completed: totalCompleted
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }
    if (path === "/api/community/recent-completed" && request.method === "GET") {
      try {
        const now = /* @__PURE__ */ new Date();
        const todayStart = Math.floor(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).getTime() / 1e3);
        const { results } = await env.DB.prepare(`
          SELECT g.kit_name, g.image_urls, g.username,
                 COALESCE(p.display_name, g.username) as display_name
          FROM gallery g
          LEFT JOIN user_profiles p ON p.user_id = g.user_id
          WHERE g.created_at >= ?
          ORDER BY g.created_at DESC
          LIMIT 4
        `).bind(todayStart).all();
        const items = (results || []).map((row) => {
          let photoUrl = "";
          try {
            const imgs = JSON.parse(row.image_urls || "[]");
            photoUrl = imgs[0] || "";
          } catch (_) {
          }
          return {
            kit_name: row.kit_name || "Unknown Kit",
            photo_url: photoUrl,
            display_name: row.display_name || row.username || "Builder",
            username: row.username || ""
          };
        }).filter((item) => item.photo_url);
        return new Response(JSON.stringify({ ok: true, items }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
};
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
