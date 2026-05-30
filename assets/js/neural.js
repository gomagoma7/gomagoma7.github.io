/* ============================================================================
   neural.js — drifting node-graph behind the profile hero (Jupiter accent).
   Loaded from layouts/_partials/extend-head.html. Vanilla, dependency-free.
   Self-disables on prefers-reduced-motion (renders a single static frame).
   Host: the element marked [data-neural] (falls back to common hero classes).
   ========================================================================== */
(function () {
  "use strict";

  function accent() {
    return (
      getComputedStyle(document.documentElement)
        .getPropertyValue("--color-primary-500")
        .trim() || "247, 178, 46"
    );
  }
  function rgbaAccent(a) {
    var c = accent();
    // scheme stores triples as "R, G, B"; also tolerate hex.
    if (c.indexOf(",") !== -1) return "rgba(" + c + "," + a + ")";
    var hex = c.replace("#", "");
    if (hex.length === 3)
      hex = hex.split("").map(function (x) { return x + x; }).join("");
    var r = parseInt(hex.slice(0, 2), 16),
      g = parseInt(hex.slice(2, 4), 16),
      b = parseInt(hex.slice(4, 6), 16);
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
  }

  function init() {
    // Homepage hero only — the host carries [data-neural]. No generic
    // fallback, so the motif never leaks onto list/article pages.
    var host = document.querySelector("[data-neural]");
    if (!host) return;

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;" +
      "-webkit-mask-image:radial-gradient(110% 80% at 50% 22%,#000 30%,transparent 75%);" +
      "mask-image:radial-gradient(110% 80% at 50% 22%,#000 30%,transparent 75%);";
    if (getComputedStyle(host).position === "static")
      host.style.position = "relative";
    Array.prototype.forEach.call(host.children, function (c) {
      if (getComputedStyle(c).position === "static") c.style.position = "relative";
      c.style.zIndex = c.style.zIndex || "1";
    });
    host.insertBefore(canvas, host.firstChild);

    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, nodes = [], signals = [], tick = 0, raf = 0;
    var LINK = 150;

    function resize() {
      var r = host.getBoundingClientRect();
      w = r.width;
      h = Math.max(r.height, 240);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.max(10, Math.round((26 * (w * h)) / 480000));
      nodes = [];
      for (var i = 0; i < n; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          r: 1.1 + Math.random() * 1.8,
        });
      }
    }

    function frame() {
      tick++;
      ctx.clearRect(0, 0, w, h);
      var i, j, p, a, b, dx, dy, d;
      if (!reduce) {
        for (i = 0; i < nodes.length; i++) {
          p = nodes[i];
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }
      }
      for (i = 0; i < nodes.length; i++) {
        for (j = i + 1; j < nodes.length; j++) {
          a = nodes[i];
          b = nodes[j];
          dx = a.x - b.x;
          dy = a.y - b.y;
          d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            ctx.strokeStyle = rgbaAccent((1 - d / LINK) * 0.45);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (i = 0; i < nodes.length; i++) {
        p = nodes[i];
        ctx.fillStyle = rgbaAccent(0.8);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduce) {
        if (tick % 26 === 0 && signals.length < 8 && nodes.length > 2) {
          a = nodes[(Math.random() * nodes.length) | 0];
          b = nodes[(Math.random() * nodes.length) | 0];
          if (a !== b && Math.hypot(a.x - b.x, a.y - b.y) < LINK)
            signals.push({ a: a, b: b, t: 0 });
        }
        signals = signals.filter(function (s) {
          s.t += 0.025;
          if (s.t >= 1) return false;
          var x = s.a.x + (s.b.x - s.a.x) * s.t,
            y = s.a.y + (s.b.y - s.a.y) * s.t;
          ctx.fillStyle = rgbaAccent(0.9 * Math.sin(s.t * Math.PI));
          ctx.beginPath();
          ctx.arc(x, y, 2.4, 0, Math.PI * 2);
          ctx.fill();
          return true;
        });
        raf = requestAnimationFrame(frame);
      }
    }

    resize();
    frame();
    window.addEventListener("resize", function () {
      cancelAnimationFrame(raf);
      resize();
      frame();
    });
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
