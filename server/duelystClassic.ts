import express, { type Express, type Request } from "express";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import { parse as parseCookieHeader } from "cookie";
import { COOKIE_NAME } from "@shared/const";
import { sdk } from "./_core/sdk";

/**
 * Registers routes to serve the full Open Duelyst game as a standalone
 * Cocos2d-HTML5 application embedded within the Loredex OS project.
 *
 * CRITICAL: The HTML must match the original index.html structure exactly.
 * vendor.js and duelyst.js are extremely sensitive to the page environment.
 * Any extra inline scripts or ccConfig setup BEFORE the bundles will prevent
 * duelyst.js from executing properly.
 *
 * Authentication flow:
 * 1. Server reads the Loredex OS session cookie (app_session_id)
 * 2. If valid, generates a Duelyst-compatible JWT token
 * 3. Injects the token into localStorage via inline script BEFORE the game loads
 * 4. Post-bundle script patches Session prototype and triggers game setup
 */

const DUELYST_JWT_SECRET =
  process.env.JWT_SECRET || "duelyst-dischordian-saga-secret";

function createDuelystToken(userId: number, username: string): string {
  const payload = {
    d: { id: userId.toString(), username },
    v: 0,
    iat: Math.floor(Date.now() / 1000),
  };
  return jwt.sign(payload, DUELYST_JWT_SECRET, {
    expiresIn: "7d",
    algorithm: "HS256",
  });
}

async function getLoredexUser(
  req: Request
): Promise<{ id: number; name: string } | null> {
  try {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) return null;
    const cookies = parseCookieHeader(cookieHeader);
    const sessionCookie = cookies[COOKIE_NAME];
    if (!sessionCookie) return null;

    const session = await sdk.verifySession(sessionCookie);
    if (!session) return null;

    const { getDb } = await import("./db");
    const { users } = await import("../drizzle/schema");
    const { eq } = await import("drizzle-orm");
    const db = await getDb();
    if (!db) return null;

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.openId, session.openId))
      .limit(1);

    if (!user) return null;
    return { id: user.id, name: user.name || session.name || "Operative" };
  } catch (err) {
    console.error("[Duelyst Classic] Auth check error:", err);
    return null;
  }
}

export function registerDuelystClassic(app: Express) {
  const gameDir = path.resolve(
    import.meta.dirname,
    "..",
    "client",
    "src",
    "game",
    "duelyst-classic"
  );

  const resourcesDir = path.resolve(
    "/home/ubuntu/webdev-static-assets/duelyst-classic/resources"
  );

  if (fs.existsSync(resourcesDir)) {
    app.use(
      "/duelyst-classic/resources",
      express.static(resourcesDir, { maxAge: "7d", immutable: true })
    );
    console.log(
      `[Duelyst Classic] Serving resources from: ${resourcesDir}`
    );
  } else {
    console.warn(
      `[Duelyst Classic] Resources directory not found: ${resourcesDir}`
    );
  }

  const localizationDir = path.resolve(
    "/home/ubuntu/duelyst/app/localization/locales"
  );
  if (fs.existsSync(localizationDir)) {
    app.use(
      "/duelyst-classic/resources/locales",
      express.static(localizationDir, {
        maxAge: 0,
        setHeaders: (res) => {
          res.setHeader("Cache-Control", "no-cache");
        },
      })
    );
  }

  // Serve the custom HTML for both /duelyst-classic and /duelyst-classic/
  // The <base> tag in the HTML ensures relative paths resolve correctly
  app.get("/duelyst-classic/?", async (req, res) => {
    const loredexUser = await getLoredexUser(req);
    const html = buildGameHtml(loredexUser);
    res.type("html").send(html);
  });

  // Static middleware AFTER the custom route handlers
  app.use(
    "/duelyst-classic",
    express.static(gameDir, {
      maxAge: "1d",
      index: false, // Don't serve index.html from static
    })
  );

  console.log("[Duelyst Classic] Routes registered at /duelyst-classic");
}

function buildGameHtml(
  user: { id: number; name: string } | null
): string {
  // Build the auto-login localStorage injection
  let tokenScript = "";
  if (user) {
    const duelystToken = createDuelystToken(user.id, user.name);
    const safeName = user.name
      .replace(/'/g, "\\'")
      .replace(/"/g, "&quot;");
    tokenScript = `
      try {
        localStorage.setItem('duelyst-staging.token', '${duelystToken}');
        localStorage.setItem('redirected', 'true');
        localStorage.setItem('duelyst-staging.redirected', 'true');
        console.log('[Dischordian Saga] Auto-login token injected for: ${safeName}');
      } catch(e) {}`;
  } else {
    tokenScript = `
      try {
        localStorage.setItem('redirected', 'true');
        localStorage.setItem('duelyst-staging.redirected', 'true');
      } catch(e) {}`;
  }

  // ═══════════════════════════════════════════════════════════════════
  // CRITICAL: The HTML structure below MUST match the original index.html
  // as closely as possible. The only additions are:
  // 1. A tiny localStorage script in <head> (before any game code)
  // 2. Custom CSS for the back button overlay
  // 3. The back-to-loredex link element
  // 4. A post-bundle <script> that patches Session and installs interceptors
  //
  // DO NOT add ccConfig, extra inline scripts, or modify the DOM structure
  // between <body> and the vendor.js/duelyst.js script tags.
  // The Cocos2d engine and browserify bundles are extremely sensitive to
  // the page environment during initialization.
  // ═══════════════════════════════════════════════════════════════════

  return `<!DOCTYPE html>
<html>
<head>
  <base href="/duelyst-classic/">
  <meta charset=utf-8>
  <meta http-equiv=X-UA-Compatible content="IE=edge">
  <title>THE DISCHORDIAN SAGA // CARD BATTLE</title>
  <link rel=icon type=image/x-icon href=/duelyst-classic/favicon.ico>
  <meta name=viewport content="width=device-width, initial-scale=0.1, maximum-scale=1.0, user-scalable=no">
  <meta name=screen-orientation content=portrait>
  <meta name=mobile-web-app-capable content=yes>
  <meta name=apple-mobile-web-app-capable content=yes>
  <meta name=msapplication-tap-highlight content=no>
  <meta name=full-screen content=yes>
  <meta name=x5-fullscreen content=true>
  <script type=text/javascript>
    // this is for cocos (matches original exactly)
    window.ccMapLimit = 100
  </script>
  <script type=text/javascript>${tokenScript}
  </script>
  <link rel=stylesheet href=duelyst.css>
  <style>
    #back-to-loredex {
      position: fixed; top: 10px; left: 10px; z-index: 10000;
      background: rgba(0, 229, 255, 0.15);
      border: 1px solid rgba(0, 229, 255, 0.4);
      color: #00e5ff; padding: 8px 16px;
      font-family: 'Courier New', monospace;
      font-size: 12px; letter-spacing: 2px;
      cursor: pointer; text-decoration: none;
      transition: all 0.2s;
    }
    #back-to-loredex:hover {
      background: rgba(0, 229, 255, 0.3);
      box-shadow: 0 0 10px rgba(0, 229, 255, 0.3);
    }
  </style>
</head>
<body>
  <a id=back-to-loredex href="/games">&#8592; LOREDEX OS</a>
  <div id=app>
    <div id=app-main>
      <div id=app-horizontal>
        <canvas id=app-gamecanvas></canvas>
        <div id=app-content-region></div>
        <div id=app-utility-region></div>
      </div>
      <div id=app-vertical>
        <div id=app-modal-region></div>
        <div id=app-notifications-region></div>
      </div>
    </div>
    <div id=app-overlay-region></div>
    <div id=maintenance-announcements-region></div>
    <div id=app-preloading>
      <div class=brand-main><h1>DUELYST</h1></div>
      <img class=mystic-loader src=loading.gif>
    </div>
  </div>
  <script src=vendor.js crossorigin></script>
  <script src=duelyst.js crossorigin></script>
  <script>
  // ═══ POST-BUNDLE PATCHES ═══
  // Applied AFTER vendor.js and duelyst.js have fully executed.
  // Installs interceptors and patches Session for offline/local play.
  (function() {
    'use strict';
    var origin = window.location.origin;

    // ─── 1. WebSocket interceptor ───────────────────────────────────
    var RealWebSocket = window.WebSocket;

    function FakeFirebaseWS(url, protocols) {
      var self = this;
      this.url = url;
      this.readyState = 0;
      this.protocol = '';
      this.extensions = '';
      this.bufferedAmount = 0;
      this.binaryType = 'blob';
      this._listeners = {};
      this.onopen = null;
      this.onmessage = null;
      this.onclose = null;
      this.onerror = null;

      setTimeout(function() {
        self.readyState = 1;
        var evt = new Event('open');
        if (self.onopen) self.onopen(evt);
        self.dispatchEvent(evt);
        self._fireMessage(JSON.stringify({
          t: 'c', d: { t: 'h', d: {
            ts: Date.now(), v: '5',
            h: 'duelyst-59830-default-rtdb.firebaseio.com',
            s: 'session_' + Math.random().toString(36).substr(2)
          }}
        }));
      }, 10);
    }

    FakeFirebaseWS.prototype._fireMessage = function(data) {
      var evt = new MessageEvent('message', { data: data });
      if (this.onmessage) this.onmessage(evt);
      this.dispatchEvent(evt);
    };

    FakeFirebaseWS.prototype.send = function(data) {
      if (this.readyState !== 1) return;
      var self = this;
      try {
        var msg = JSON.parse(data);
        if (msg.t === 'd') {
          var req = msg.d;
          if (req.a === 'q' || req.a === 'g') {
            setTimeout(function() {
              self._fireMessage(JSON.stringify({ t:'d', d:{ r:req.r, b:{ s:'ok', d:null } } }));
            }, 5);
          } else if (req.a === 'p' || req.a === 'm') {
            setTimeout(function() {
              self._fireMessage(JSON.stringify({ t:'d', d:{ r:req.r, b:{ s:'ok', d:{} } } }));
            }, 5);
          } else if (req.a === 'n' || req.a === 'l') {
            setTimeout(function() {
              self._fireMessage(JSON.stringify({ t:'d', d:{ r:req.r, b:{ s:'ok', d:null } } }));
            }, 5);
          } else if (req.a === 'auth') {
            setTimeout(function() {
              var authPayload = null;
              try { if (req.b && req.b.cred) authPayload = JSON.parse(atob((req.b.cred+'').split('.')[1] || 'e30=')); } catch(e2) {}
              self._fireMessage(JSON.stringify({ t:'d', d:{ r:req.r, b:{ s:'ok', d:{ auth:authPayload } } } }));
            }, 5);
          } else if (req.a === 's') {
            setTimeout(function() {
              self._fireMessage(JSON.stringify({ t:'d', d:{ r:req.r, b:{ s:'ok', d:'' } } }));
            }, 5);
          } else if (req.r) {
            setTimeout(function() {
              self._fireMessage(JSON.stringify({ t:'d', d:{ r:req.r, b:{ s:'ok', d:null } } }));
            }, 5);
          }
        }
      } catch(e) {}
    };

    FakeFirebaseWS.prototype.close = function(code, reason) {
      this.readyState = 3;
      var evt = new CloseEvent('close', { code: code||1000, reason: reason||'', wasClean: true });
      if (this.onclose) this.onclose(evt);
      this.dispatchEvent(evt);
    };

    FakeFirebaseWS.prototype.addEventListener = function(type, fn) {
      if (!this._listeners[type]) this._listeners[type] = [];
      this._listeners[type].push(fn);
    };

    FakeFirebaseWS.prototype.removeEventListener = function(type, fn) {
      if (!this._listeners[type]) return;
      this._listeners[type] = this._listeners[type].filter(function(f) { return f !== fn; });
    };

    FakeFirebaseWS.prototype.dispatchEvent = function(evt) {
      var fns = this._listeners[evt.type] || [];
      for (var i = 0; i < fns.length; i++) fns[i].call(this, evt);
      return true;
    };

    FakeFirebaseWS.CONNECTING = 0;
    FakeFirebaseWS.OPEN = 1;
    FakeFirebaseWS.CLOSING = 2;
    FakeFirebaseWS.CLOSED = 3;

    window.WebSocket = function(url, protocols) {
      if (typeof url === 'string' && url.indexOf('firebaseio.com') !== -1) {
        return new FakeFirebaseWS(url, protocols);
      }
      if (protocols) return new RealWebSocket(url, protocols);
      return new RealWebSocket(url);
    };
    window.WebSocket.CONNECTING = 0;
    window.WebSocket.OPEN = 1;
    window.WebSocket.CLOSING = 2;
    window.WebSocket.CLOSED = 3;
    window.WebSocket.prototype = RealWebSocket.prototype;
    console.log('[Dischordian] WebSocket interceptor installed');

    // ─── 2. XHR interceptor ─────────────────────────────────────────
    (function() {
      var origOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(method, url) {
        if (typeof url === 'string') {
          if (url.indexOf('staging.duelyst.org') !== -1 || url.indexOf('duelyst.org') !== -1 || url.indexOf('duelyst.com') !== -1) {
            try {
              var parsed = new URL(url);
              url = origin + parsed.pathname + parsed.search;
              console.log('[Dischordian XHR] ' + method + ' ' + url);
            } catch(e) {
              var idx = url.indexOf('/api/');
              if (idx === -1) idx = url.indexOf('/matchmaking');
              if (idx === -1) idx = url.indexOf('/replays');
              if (idx === -1) idx = url.indexOf('/forgot');
              if (idx === -1) idx = url.indexOf('/replay');
              if (idx !== -1) url = origin + url.substring(idx);
            }
          }
          if (url.indexOf('locales') !== -1 && url.indexOf('index.json') !== -1) {
            var sep = url.indexOf('?') === -1 ? '?' : '&';
            url = url + sep + '_cb=' + Date.now();
          }
        }
        var args = Array.prototype.slice.call(arguments);
        args[1] = url;
        return origOpen.apply(this, args);
      };
      console.log('[Dischordian] XHR interceptor installed');
    })();

    // ─── 3. jQuery.ajaxPrefilter ────────────────────────────────────
    if (typeof jQuery !== 'undefined' && jQuery.ajaxPrefilter) {
      jQuery.ajaxPrefilter(function(options) {
        if (options.url && (options.url.indexOf('staging.duelyst.org') !== -1 || options.url.indexOf('duelyst.org') !== -1 || options.url.indexOf('duelyst.com') !== -1)) {
          try {
            var parsed = new URL(options.url);
            options.url = origin + parsed.pathname + parsed.search;
          } catch(e) {
            var idx2 = options.url.indexOf('/api/');
            if (idx2 === -1) idx2 = options.url.indexOf('/matchmaking');
            if (idx2 !== -1) options.url = origin + options.url.substring(idx2);
          }
        }
      });
      console.log('[Dischordian] jQuery.ajaxPrefilter installed');
    }

    // ─── 4. Session patches ─────────────────────────────────────────
    function makeStubRef(self) {
      self.fbRef = {
        child: function() { return self.fbRef; },
        update: function(d,cb) { if(cb) cb(null); },
        set: function(d,cb) { if(cb) cb(null); },
        on: function() {}, off: function() {},
        once: function(ev,cb) { if(cb) cb({val:function(){return null;}}); },
        push: function() { return self.fbRef; },
        remove: function(cb) { if(cb) cb(null); },
        unauth: function() {}, onAuth: function() {}, offAuth: function() {},
        toString: function() { return 'stub-ref'; }
      };
    }

    function applyPatches(session) {
      var sp = Object.getPrototypeOf(session);
      if (!sp || !sp._authFirebase) {
        console.error('[Dischordian] Cannot patch: no _authFirebase on prototype');
        return false;
      }

      Object.defineProperty(session, 'url', {
        get: function() { return origin; },
        set: function() {},
        configurable: true
      });

      sp._authFirebase = function(token) {
        var self = this;
        return new Promise(function(resolve, reject) {
          try {
            var payload = JSON.parse(atob(token.split('.')[1]));
            makeStubRef(self);
            resolve({
              auth: { id: payload.d.id, username: payload.d.username },
              expires: payload.exp || (Date.now()/1000 + 86400),
              token: token, uid: payload.d.id, provider: 'custom'
            });
          } catch(e) { reject(e); }
        });
      };

      sp._deauthFirebase = function() { this.fbRef = null; };

      sp.isAuthenticated = function(token) {
        var self = this;
        if (token == null) return Promise.resolve(false);
        return self._authFirebase(token)
          .then(function(authData) {
            console.log('[Dischordian] isAuth resolved', authData.auth);
            self.token = token;
            self.userId = authData.auth.id;
            self.username = authData.auth.username;
            self.expires = authData.expires;
            return fetch(self.url + '/session', {
              method: 'GET',
              headers: { 'Accept':'application/json', 'Content-Type':'application/json', 'Authorization':'Bearer '+self.token }
            });
          })
          .then(function(response) {
            if (response.ok) return response.json().then(function(d) { d.status = response.status; return d; });
            return null;
          })
          .then(function(data) {
            if (data !== null) {
              self.analyticsData = data.analytics_data;
              self.emit('login', { token: self.token, userId: self.userId, analyticsData: self.analyticsData });
              console.log('[Dischordian] Auth SUCCESS userId=' + self.userId + ' username=' + self.username);
              return true;
            }
            return false;
          })
          .catch(function(e) { console.error('[Dischordian] isAuth FAILED', e.message); return false; });
      };

      sp.refreshToken = function() {
        var self = this;
        if (!self.token) return Promise.resolve(null);
        return fetch(self.url + '/session', {
          method: 'GET',
          headers: { 'Accept':'application/json', 'Content-Type':'application/json', 'Authorization':'Bearer '+self.token }
        })
        .then(function(r) { return r.ok ? r.json() : null; })
        .then(function(data) {
          if (!data) return null;
          self.analyticsData = data.analytics_data;
          if (data.token) self.token = data.token;
          return self._authFirebase(self.token);
        })
        .then(function(authData) {
          if (!authData) return null;
          self.userId = authData.auth.id; self.username = authData.auth.username; self.expires = authData.expires;
          self.emit('login', { token: self.token, userId: self.userId, analyticsData: self.analyticsData });
          return true;
        })
        .catch(function(e) { console.error('[Dischordian] refreshToken FAILED', e.message); return null; });
      };

      sp.login = function(username, password, isGuest) {
        var self = this;
        return fetch(self.url + '/session', {
          method: 'POST',
          headers: { 'Accept':'application/json', 'Content-Type':'application/json' },
          body: JSON.stringify({ username: username, password: password || '' })
        })
        .then(function(r) { if (!r.ok) throw new Error(r.statusText); return r.json(); })
        .then(function(data) {
          self.analyticsData = data.analytics_data; self.token = data.token;
          return self._authFirebase(self.token);
        })
        .then(function(authData) {
          self.userId = authData.auth.id; self.username = authData.auth.username; self.expires = authData.expires;
          if (!isGuest) self.emit('login', { token: self.token, userId: self.userId, analyticsData: self.analyticsData });
          return true;
        })
        .catch(function(e) { console.error('[Dischordian] login FAILED', e.message); throw e; });
      };

      console.log('[Dischordian] Session patches applied successfully');
      return true;
    }

    // ─── 5. Patch + trigger game setup ──────────────────────────────
    function tryPatchAndSetup() {
      var s = window.Session;
      if (!s) return false;
      applyPatches(s);
      if (typeof window._duelystSetup === 'function') {
        console.log('[Dischordian] Triggering deferred game setup');
        window._duelystSetup();
      }
      return true;
    }

    if (!tryPatchAndSetup()) {
      console.log('[Dischordian] Session not ready, polling...');
      var attempts = 0;
      var iv = setInterval(function() {
        if (tryPatchAndSetup()) {
          clearInterval(iv);
        } else if (++attempts > 200) {
          clearInterval(iv);
          console.error('[Dischordian] Session never appeared after 10s');
          if (typeof window._duelystSetup === 'function') window._duelystSetup();
        }
      }, 50);
    }
  })();
  </script>
</body>
</html>`;
}
