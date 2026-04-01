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
 * Authentication flow:
 * 1. Server reads the Loredex OS session cookie (app_session_id)
 * 2. If valid, generates a Duelyst-compatible JWT token
 * 3. Injects the token into localStorage via inline script BEFORE the game loads
 * 4. The Duelyst client finds the token, validates it, and skips the login screen
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
      express.static(localizationDir, { maxAge: "7d" })
    );
  }

  // Register the custom HTML route BEFORE static middleware
  // so our auto-login injection takes priority over the static index.html
  // Handle both /duelyst-classic and /duelyst-classic/ in one handler
  app.get("/duelyst-classic/?", async (req, res) => {
    const loredexUser = await getLoredexUser(req);
    let autoLoginScript = "";

    if (loredexUser) {
      const duelystToken = createDuelystToken(
        loredexUser.id,
        loredexUser.name
      );
      const safeName = loredexUser.name
        .replace(/'/g, "\\'")
        .replace(/"/g, "&quot;");
      autoLoginScript = `
    <script>
      try {
        localStorage.setItem('duelyst-staging.token', '${duelystToken}');
        console.log('[Dischordian Saga] Auto-login token injected for: ${safeName}');
      } catch(e) {
        console.warn('[Dischordian Saga] Could not set localStorage token:', e);
      }
    </script>`;
    }

    const html = buildGameHtml(autoLoginScript);
    res.type("html").send(html);
  });

  // Static middleware AFTER the custom route handlers
  // This serves JS bundles, CSS, images, but NOT index.html (our route handles that)
  app.use(
    "/duelyst-classic",
    express.static(gameDir, {
      maxAge: "1d",
      index: false, // Don't serve index.html from static
    })
  );

  console.log("[Duelyst Classic] Routes registered at /duelyst-classic");
}

function buildGameHtml(autoLoginScript: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>THE DISCHORDIAN SAGA // CARD BATTLE</title>
  <link rel="icon" type="image/x-icon" href="/duelyst-classic/favicon.ico">
  <meta name="viewport" content="width=device-width, initial-scale=0.1, maximum-scale=1.0, user-scalable=no">
  <meta name="screen-orientation" content="portrait"/>
  <meta name="mobile-web-app-capable" content="yes"/>
  <meta name="apple-mobile-web-app-capable" content="yes"/>
  <meta name="msapplication-tap-highlight" content="no">
  <meta name="full-screen" content="yes"/>
  <meta name="x5-fullscreen" content="true"/>
  ${autoLoginScript}
  <script type="text/javascript">
    window.ccMapLimit = 100;
    ccConfig = document["ccConfig"] = {
      renderMode: 2,
      frameRate: 60,
      debugMode: 1,
      showFPS: false,
      id: "app-gamecanvas"
    };
  </script>
  <link rel="stylesheet" href="/duelyst-classic/duelyst.css">
  <style>
    html, body {
      margin: 0; padding: 0;
      width: 100%; height: 100%;
      overflow: hidden; background: #000;
    }
    #app { width: 100%; height: 100%; }
    #app-preloading {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      background: #000; z-index: 9999;
    }
    #app-preloading .brand-main h1 {
      color: #00e5ff;
      font-family: 'Courier New', monospace;
      font-size: 48px; letter-spacing: 12px;
      text-shadow: 0 0 20px rgba(0, 229, 255, 0.5);
    }
    .mystic-loader { width: 64px; height: 64px; margin-top: 20px; }
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
  <a id="back-to-loredex" href="/games">&#8592; LOREDEX OS</a>
  <div id="app">
    <div id="app-main">
      <div id="app-horizontal">
        <canvas id="app-gamecanvas"></canvas>
        <div id="app-content-region"></div>
        <div id="app-utility-region"></div>
      </div>
      <div id="app-vertical">
        <div id="app-modal-region"></div>
        <div id="app-notifications-region"></div>
      </div>
    </div>
    <div id="app-overlay-region"></div>
    <div id="maintenance-announcements-region"></div>
    <div id="app-preloading">
      <div class="brand-main">
        <h1>DISCHORDIAN SAGA</h1>
      </div>
      <img class="mystic-loader" src="/duelyst-classic/loading.gif">
    </div>
  </div>
  <script>
    // Firebase shim - absorbs Firebase constructor calls in the patched bundle
    if (typeof Firebase === 'undefined') {
      window.Firebase = function(url) { this.url = url; this.childRef = this; };
      var fp = Firebase.prototype;
      fp.authWithCustomToken = function(token, cb) {
        try {
          var p = JSON.parse(atob(token.split('.')[1]));
          cb(null, {auth:{id:p.d.id,username:p.d.username},expires:p.exp||Date.now()/1000+86400});
        } catch(e) { cb(e); }
      };
      fp.child = function() { return this; };
      fp.on = function() { return this; };
      fp.off = function() { return this; };
      fp.once = function(ev, cb) { if(cb) cb({val:function(){return null;},exists:function(){return false;}}); return this; };
      fp.set = function(v, cb) { if(cb) cb(null); return this; };
      fp.update = function(v, cb) { if(cb) cb(null); return this; };
      fp.remove = function(cb) { if(cb) cb(null); return this; };
      fp.push = function() { return this; };
      fp.limit = function() { return this; };
      fp.limitToLast = function() { return this; };
      fp.orderByChild = function() { return this; };
      fp.startAt = function() { return this; };
      fp.endAt = function() { return this; };
      fp.unauth = function() {};
      fp.onAuth = function() {};
      fp.offAuth = function() {};
      fp.onDisconnect = function() { return {set:function(){},update:function(){},remove:function(){},cancel:function(){}}; };
      fp.val = function() { return null; };
      fp.exists = function() { return false; };
      fp.toString = function() { return this.url || ''; };
      Firebase.ServerValue = { TIMESTAMP: Date.now() };
    }
  </script>
  <script src="/duelyst-classic/vendor.js" crossorigin></script>
  <script src="/duelyst-classic/duelyst.js" crossorigin></script>
</body>
</html>`;
}
