import express, { type Express } from "express";
import path from "path";
import fs from "fs";

/**
 * Registers routes to serve the full Open Duelyst game as a standalone
 * Cocos2d-HTML5 application embedded within the Loredex OS project.
 *
 * In development: serves assets from the local webdev-static-assets directory.
 * In production: serves assets from the same directory (deployed alongside the app).
 *
 * The game is accessed at /duelyst-classic/* and renders in its own HTML page
 * with Cocos2d canvas, separate from the React app.
 */
export function registerDuelystClassic(app: Express) {
  // Path to the pre-built game files (JS bundles, CSS, HTML)
  const gameDir = path.resolve(
    import.meta.dirname,
    "..",
    "client",
    "src",
    "game",
    "duelyst-classic"
  );

  // Path to the game resources (sprites, audio, maps, etc.)
  // In development, these live in webdev-static-assets (outside project to avoid deployment timeout)
  // In production, they should be served from CDN or a static file server
  const resourcesDir = path.resolve(
    "/home/ubuntu/webdev-static-assets/duelyst-classic/resources"
  );

  // Serve game resources at /duelyst-classic/resources/*
  if (fs.existsSync(resourcesDir)) {
    app.use(
      "/duelyst-classic/resources",
      express.static(resourcesDir, {
        maxAge: "7d",
        immutable: true,
      })
    );
    console.log(
      `[Duelyst Classic] Serving resources from: ${resourcesDir}`
    );
  } else {
    console.warn(
      `[Duelyst Classic] Resources directory not found: ${resourcesDir}`
    );
  }

  // Serve the localization files
  const localizationDir = path.resolve(
    "/home/ubuntu/duelyst/app/localization/locales"
  );
  if (fs.existsSync(localizationDir)) {
    app.use(
      "/duelyst-classic/resources/locales",
      express.static(localizationDir, { maxAge: "7d" })
    );
  }

  // Serve the pre-built game bundles (vendor.js, duelyst.js, duelyst.css)
  app.use(
    "/duelyst-classic",
    express.static(gameDir, {
      maxAge: "1d",
    })
  );

  // Main game page route
  app.get("/duelyst-classic", (_req, res) => {
    // Serve a custom HTML page that loads the Duelyst game
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>DUELYST CLASSIC // LOREDEX OS</title>
  <link rel="icon" type="image/x-icon" href="/duelyst-classic/favicon.ico">
  <meta name="viewport" content="width=device-width, initial-scale=0.1, maximum-scale=1.0, user-scalable=no">
  <meta name="screen-orientation" content="portrait"/>
  <meta name="mobile-web-app-capable" content="yes"/>
  <meta name="apple-mobile-web-app-capable" content="yes"/>
  <meta name="msapplication-tap-highlight" content="no">
  <meta name="full-screen" content="yes"/>
  <meta name="x5-fullscreen" content="true"/>
  <script type="text/javascript">
    // Cocos2d config
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
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #000;
    }
    #app {
      width: 100%;
      height: 100%;
    }
    #app-preloading {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #000;
      z-index: 9999;
    }
    #app-preloading .brand-main h1 {
      color: #00e5ff;
      font-family: 'Courier New', monospace;
      font-size: 48px;
      letter-spacing: 12px;
      text-shadow: 0 0 20px rgba(0, 229, 255, 0.5);
    }
    .mystic-loader {
      width: 64px;
      height: 64px;
      margin-top: 20px;
    }
    /* Back button to return to Loredex OS */
    #back-to-loredex {
      position: fixed;
      top: 10px;
      left: 10px;
      z-index: 10000;
      background: rgba(0, 229, 255, 0.15);
      border: 1px solid rgba(0, 229, 255, 0.4);
      color: #00e5ff;
      padding: 8px 16px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      letter-spacing: 2px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s;
    }
    #back-to-loredex:hover {
      background: rgba(0, 229, 255, 0.3);
      box-shadow: 0 0 10px rgba(0, 229, 255, 0.3);
    }
  </style>
</head>
<body>
  <a id="back-to-loredex" href="/games">← LOREDEX OS</a>
  <!-- Duelyst application container -->
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
        <h1>DUELYST</h1>
      </div>
      <img class="mystic-loader" src="/duelyst-classic/loading.gif">
    </div>
  </div>
  <script src="/duelyst-classic/vendor.js" crossorigin></script>
  <script src="/duelyst-classic/duelyst.js" crossorigin></script>
</body>
</html>`;
    res.type("html").send(html);
  });

  console.log("[Duelyst Classic] Routes registered at /duelyst-classic");
}
