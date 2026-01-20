
/* ================= FAMEIQ PERFORMANCE LAYER =================
   Optimizes only heavy parts:
   - VANTA Birds
   - VANTA Globe
   - Cursor system
   - Portfolio iframes
   Keeps all visuals, improves load speed (1–3s)
============================================================ */

/* Device detection */
const __isMobile = window.innerWidth < 768;
const __isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

/* --------- Lazy load portfolio iframes (after first paint) --------- */
window.addEventListener("load", () => {
  const frames = document.querySelectorAll(".site-preview iframe");
  frames.forEach((iframe) => {
    const src = iframe.getAttribute("src");
    if (!src) return;
    iframe.removeAttribute("src");
    setTimeout(() => {
      iframe.setAttribute("src", src);
    }, (__isMobile || __isTablet) ? 900 : 500);
  });
});

/* --------- VANTA Quality Scaling (no disable, only tune) --------- */
window.FAMEIQ_VANTA_PROFILE = {
  birds: {
    quantity: __isMobile ? 3.5 : __isTablet ? 4.5 : 6,
    speed: __isMobile ? 1.6 : __isTablet ? 2.2 : 3.0
  },
  globe: {
    size: __isMobile ? 0.6 : __isTablet ? 0.85 : 1.0,
    spacing: __isMobile ? 26 : __isTablet ? 22 : 18,
    speed: __isMobile ? 0.35 : __isTablet ? 0.45 : 0.6
  }
};

/* --------- Cursor Throttle (still smooth, less CPU on mobile) --------- */
if (__isMobile || __isTablet) {
  document.documentElement.style.setProperty("--cursor-follow-speed", "0.35");
}
/* ================= END PERFORMANCE LAYER ================= */

// main.js
// FAMEIQ – shared behavior for all pages
// Clean, conflict-free, responsive-safe



/* =========================================
   GLOBAL SAFE RESIZE GUARD (TOUCH DEVICES)
   Prevents animation refresh on scroll
========================================= */
const isMobile = window.innerWidth < 768;
const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
const isLowEndDevice = isMobile || isTablet || navigator.hardwareConcurrency <= 4;


const SafeViewport = (() => {
  let lastWidth = window.innerWidth;
  let lastHeight = window.innerHeight;

  function isRealResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const widthChanged = Math.abs(w - lastWidth) > 80;
    const heightChanged = Math.abs(h - lastHeight) > 120;

    lastWidth = w;
    lastHeight = h;

    return widthChanged || heightChanged;
  }

  return {
    onResize(callback) {
      window.addEventListener(
        "resize",
        () => {
          // Ignore scroll-induced resize on touch devices
          const isTouch =
            "ontouchstart" in window ||
            navigator.maxTouchPoints > 0;

          if (isTouch && !isRealResize()) return;

          callback();
        },
        { passive: true }
      );
    }
  };
})();



(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ===============================
     DOM READY HELPER
  =============================== */
  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  /* ===============================
     PAGE FADE-IN
  =============================== */
  function initPageTransition() {
    document.documentElement.classList.add("page-is-ready");
  }

  /* ===============================
     SCROLL REVEAL
  =============================== */
  function initScrollReveal() {
    const elements = document.querySelectorAll(".reveal-up, .reveal-fade");
    if (!elements.length) return;

    if (!prefersReducedMotion && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add("reveal-visible");
              obs.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.2,
          rootMargin: "0px 0px -60px 0px"
        }
      );

      elements.forEach(el => observer.observe(el));
    } else {
      elements.forEach(el => el.classList.add("reveal-visible"));
    }
  }

  /* ===============================
     METRIC COUNT UP
  =============================== */
  function initMetricCountUp() {
    const metrics = document.querySelectorAll(".metric-value[data-target]");
    if (!metrics.length) return;

    function animate(el) {
      const target = Number(el.dataset.target);
      if (!target) return;

      const duration = 1200;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(target * eased);

        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }

      requestAnimationFrame(tick);
    }

    if ("IntersectionObserver" in window && !prefersReducedMotion) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              animate(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );

      metrics.forEach(el => observer.observe(el));
    } else {
      metrics.forEach(el => (el.textContent = el.dataset.target));
    }
  }

  /* ===============================
     FAQ TOGGLE
  =============================== */
  function initFaq() {
    const items = document.querySelectorAll(".faq-item");
    if (!items.length) return;

    items.forEach(item => {
      item.addEventListener("click", () => {
        item.classList.toggle("is-open");
      });
    });
  }

  /* ===============================
     YELLOW BOX ROLLOUT (AKIO STYLE)
  =============================== */
  function initHighlightRollout() {
    const highlights = document.querySelectorAll(".highlight-inline");
    if (!highlights.length) return;

    if (prefersReducedMotion) {
      highlights.forEach(el => el.classList.add("is-active"));
      return;
    }

    highlights.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add("is-active");
      }, 150 + index * 160);
    });
  }

  /* ===============================
     FOOTER YEAR
  =============================== */
  function initFooterYear() {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }


/* =========================================
   ADVANCED WEB — PREMIUM BUBBLE WORD ROTATION
========================================= */
function initAdvancedWebBubble() {
  const wrapper = document.querySelector(".highlight-rollout");
  if (!wrapper) return;

  // Ensure inner span exists
  let textEl = wrapper.querySelector(".roll-text");
  if (!textEl) {
    textEl = document.createElement("span");
    textEl.className = "roll-text roll-in";
    textEl.textContent = wrapper.textContent.trim();
    wrapper.textContent = "";
    wrapper.appendChild(textEl);
  }

  const words = wrapper.dataset.words
    .split(",")
    .map(w => w.trim());

  let index = 0;
  let direction = true; // true = LTR, false = RTL
  const INTERVAL = 2600;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    textEl.textContent = words[0];
    return;
  }

  setInterval(() => {
    // TEXT EXIT
    textEl.classList.remove("roll-in");
    textEl.classList.add("roll-out");

    // BUBBLE retreats
    wrapper.style.transformOrigin = direction ? "right center" : "left center";
    wrapper.style.transform = "scaleX(0.92)";

    setTimeout(() => {
      // CHANGE WORD
      index = (index + 1) % words.length;
      textEl.textContent = words[index];

      // SWITCH DIRECTION
      direction = !direction;

      // BUBBLE rolls in opposite direction
      wrapper.style.transformOrigin = direction ? "left center" : "right center";
      wrapper.style.transform = "scaleX(1)";

      // TEXT ENTER
      textEl.classList.remove("roll-out");
      textEl.classList.add("roll-in");
    }, 420);

  }, INTERVAL);
}



// FAB Navigation Toggle
function initFabNav() {
  const container = document.querySelector('.fab-nav-container');
  if (!container) return;
  
  const btn = container.querySelector('.fab-nav-btn');
  
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !isOpen);
  });
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFabNav);
} else {
  initFabNav();
}


// ChatGPT-style Plus Menu
(() => {
  const root = document.getElementById("plusMenuRoot");
  const toggle = document.getElementById("plusToggle");

  if (!root || !toggle) return;

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    root.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!root.contains(e.target)) {
      root.classList.remove("open");
    }
  });
})();

// ============ Scroll-driven 3D Illusion Background ============

// Guard: if element or environment is missing, safely exit
const scrollIllusionEl = document.querySelector('.scroll-illusion-bg');
if (scrollIllusionEl) {
  const prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll configuration (can be tweaked per brand feel)
  const MIN_SCALE = 0.88; // very top of page
  const MAX_SCALE = 2.4;  // bottom of page on desktop
  const MOBILE_MAX_SCALE = 1.7; // capped for small screens
  const TABLET_MAX_SCALE = 2.0;

  let latestScrollY = window.scrollY || window.pageYOffset || 0;
  let ticking = false;

  // Helper: figure out how far down the page we are (0 → top, 1 → bottom)
  function getScrollProgress() {
    const doc = document.documentElement;
    const scrollTop = window.scrollY || window.pageYOffset || doc.scrollTop || 0;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    if (scrollHeight <= 0) return 0;
    return Math.min(1, Math.max(0, scrollTop / scrollHeight));
  }

  // Helper: device-aware max scale (desktop > tablet > mobile)
  function getDeviceMaxScale() {
    const width = window.innerWidth || document.documentElement.clientWidth;
    if (width < 768) return MOBILE_MAX_SCALE;
    if (width < 1024) return TABLET_MAX_SCALE;
    return MAX_SCALE;
  }

  // Core function: update transform based on scroll position
  function updateScrollIllusion() {
    ticking = false;

    // Respect motion preferences: keep element mostly static
    if (prefersReducedMotion) {
      scrollIllusionEl.style.transform =
        'translate3d(0, 0, 0) scale(1)';
      return;
    }

    const progress = getScrollProgress(); // 0 → 1
    const maxScale = getDeviceMaxScale();

    // Use a slightly eased curve for more premium feel
    const eased = progress * progress * (3 - 2 * progress); // smoothstep

    const scale = MIN_SCALE + (maxScale - MIN_SCALE) * eased;

  // Depth illusion: subtle upward movement + perspective
const depthY = (1 - eased) * 18; // px (far → near)
const perspective = 900; // fixed, safe value

scrollIllusionEl.style.transform =
  `perspective(${perspective}px)
  translate3d(0, ${depthY.toFixed(2)}px, 0)
  scale(${scale.toFixed(3)})`;

// State classes for visual tuning
scrollIllusionEl.classList.toggle('is-near', eased > 0.85);
scrollIllusionEl.classList.toggle('is-far', eased < 0.25);

  }

  // Run on scroll using requestAnimationFrame for performance
  function onScroll() {
    latestScrollY = window.scrollY || window.pageYOffset || 0;
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateScrollIllusion);
    }
  }

  // Keep responsive behaviour on resize and orientation change
  function onResize() {
    window.requestAnimationFrame(updateScrollIllusion);
  }

  // Initial paint
  updateScrollIllusion();
  


  // Passive listeners for scroll / resize
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);
}

// --- Add rotational depth based on scroll ---
const rotationBase = 360;

function updateRotation(progress) {
  const angle = rotationBase * progress;

  document.querySelectorAll('.scroll-illusion-bg').forEach((el, index) => {
    const multiplier = index === 0 ? 1 : index === 1 ? 0.6 : 0.4;
    el.style.rotate = `${angle * multiplier}deg`;
  });
}

/* =========================================
   PREMIUM VELOCITY CURSOR SYSTEM
========================================= */

(() => {
  const blob = document.createElement("div");
  blob.className = "cursor-blob";
  blob.innerHTML = "<span></span>";
  document.body.appendChild(blob);

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let tx = x;
  let ty = y;

  let lastX = x;
  let lastY = y;
  let velocity = 0;

  let idleTimer;
  const IDLE_DELAY = 900;

  function activate() {
    blob.classList.add("is-visible");
    blob.classList.remove("is-idle");
    clearTimeout(idleTimer);

    idleTimer = setTimeout(() => {
      blob.classList.add("is-idle");
    }, IDLE_DELAY);
  }

  function animate() {
    x += (tx - x) * 0.18;
    y += (ty - y) * 0.18;

    const dx = tx - lastX;
    const dy = ty - lastY;
    velocity = Math.min(30, Math.hypot(dx, dy));

    /* Velocity scale */
    const scale = 1 + velocity * 0.015;
    blob.style.transform =
      `translate(-50%, -50%) scale(${scale.toFixed(2)})`;

    /* Directional light illusion */
    const lx = 35 + dx * 0.8;
    const ly = 35 + dy * 0.8;
    blob.style.setProperty("--lx", `${lx}%`);
    blob.style.setProperty("--ly", `${ly}%`);

    blob.style.left = x + "px";
    blob.style.top = y + "px";

    lastX = x;
    lastY = y;

    requestAnimationFrame(animate);
  }
  animate();

  /* Desktop */
  window.addEventListener("mousemove", e => {
    tx = e.clientX;
    ty = e.clientY;
    activate();
  }, { passive: true });

  window.addEventListener("mousedown", e => {
    tx = e.clientX;
    ty = e.clientY;
    activate();

    blob.style.transform += " scale(0.85)";
  });

  /* Mobile & tablet */
  window.addEventListener("touchstart", e => {
    const t = e.touches[0];
    tx = t.clientX;
    ty = t.clientY;
    activate();
  }, { passive: true });

  window.addEventListener("touchmove", e => {
    const t = e.touches[0];
    tx = t.clientX;
    ty = t.clientY;
    activate();
  }, { passive: true });
})();

/* =========================================
   PREMIUM FLUID CURSOR TAIL (DIV ONLY)
========================================= */

(() => {
  const container = document.getElementById("cursorFluid");
  if (!container) return;

  const DOTS = 14;              // tail length
  const SPACING = 0.18;         // fluid smoothness
  const OFFSET = 14;            // stays behind cursor
  const IDLE_DELAY = 900;

  let tx = innerWidth / 2;
  let ty = innerHeight / 2;

  let idleTimer;
  let isActive = false;

  const points = Array.from({ length: DOTS }).map(() => ({
    x: tx,
    y: ty
  }));

  const dots = points.map((_, i) => {
    const el = document.createElement("div");
    el.className = "cursor-fluid-dot";
    el.style.width = `${10 - i * 0.45}px`;
    el.style.height = el.style.width;
    el.style.filter = `blur(${6 + i * 0.6}px)`;
    container.appendChild(el);
    return el;
  });

  function activate() {
    isActive = true;
    dots.forEach(d => d.classList.add("is-active"));
    dots.forEach(d => d.classList.remove("is-idle"));

    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      isActive = false;
      dots.forEach(d => d.classList.add("is-idle"));
    }, IDLE_DELAY);
  }

  function animate() {
    // Lead point (offset behind cursor)
    const dx = points[0].x - tx;
    const dy = points[0].y - ty;
    const dist = Math.hypot(dx, dy) || 1;

    const ox = tx + (dx / dist) * OFFSET;
    const oy = ty + (dy / dist) * OFFSET;

    points[0].x += (ox - points[0].x) * 0.35;
    points[0].y += (oy - points[0].y) * 0.35;

    // Follow chain (fluid physics illusion)
    for (let i = 1; i < points.length; i++) {
      points[i].x += (points[i - 1].x - points[i].x) * SPACING;
      points[i].y += (points[i - 1].y - points[i].y) * SPACING;
    }

    // Render
    dots.forEach((dot, i) => {
      dot.style.transform =
        `translate(${points[i].x}px, ${points[i].y}px) translate(-50%, -50%)`;
    });

    requestAnimationFrame(animate);
  }

  animate();

  /* INPUT */
  window.addEventListener("mousemove", e => {
    tx = e.clientX;
    ty = e.clientY;
    activate();
  }, { passive: true });

  window.addEventListener("touchstart", e => {
    const t = e.touches[0];
    tx = t.clientX;
    ty = t.clientY;
    activate();
  }, { passive: true });

  window.addEventListener("touchmove", e => {
    const t = e.touches[0];
    tx = t.clientX;
    ty = t.clientY;
    activate();
  }, { passive: true });
})();




/* =========================================
   FAMEIQ — PREMIUM CURSOR + FLUID TAIL
   Mobile & Tablet Optimized (NO LAG)
========================================= */

(() => {
  const blob = document.querySelector(".cursor-blob");
  if (!blob) return;

  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

  /* ===============================
     TAIL CONFIG (DEVICE AWARE)
  =============================== */

  const TAIL_COUNT = isMobile ? 6 : isTablet ? 7 : 8;

  const FOLLOW_SPEED = isMobile
    ? 0.35
    : isTablet
    ? 0.28
    : 0.18;

  const IDLE_DELAY = 900;

  /* ===============================
     CREATE TAIL ELEMENTS
  =============================== */

  const tails = [];
  for (let i = 0; i < TAIL_COUNT; i++) {
    const t = document.createElement("div");
    t.className = "cursor-tail is-idle";
    document.body.appendChild(t);
    tails.push({
      el: t,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });
  }

  /* ===============================
     POSITION TRACKING
  =============================== */

  let tx = window.innerWidth / 2;
  let ty = window.innerHeight / 2;
  let idleTimer;

  function activate() {
    blob.classList.add("is-active");
    blob.classList.remove("is-idle");

    tails.forEach(t => {
      t.el.classList.add("is-active");
      t.el.classList.remove("is-idle");
    });

    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      blob.classList.add("is-idle");
      tails.forEach(t => t.el.classList.add("is-idle"));
    }, IDLE_DELAY);
  }

  /* ===============================
     MAIN ANIMATION LOOP
  =============================== */

  function animate() {
    let prevX = tx;
    let prevY = ty;

    tails.forEach((t, i) => {
      const delay = (i + 1) * 0.55;

      t.x += (prevX - t.x) * FOLLOW_SPEED;
      t.y += (prevY - t.y) * FOLLOW_SPEED;

      t.el.style.left = t.x + "px";
      t.el.style.top = t.y + "px";
      t.el.style.transform =
        `translate(-50%, -50%) scale(${0.7 - i * 0.05})`;

      prevX = t.x;
      prevY = t.y;
    });

    requestAnimationFrame(animate);
  }

  animate();

  /* ===============================
     INPUT EVENTS
  =============================== */

  window.addEventListener(
    "mousemove",
    e => {
      tx = e.clientX;
      ty = e.clientY;
      activate();
    },
    { passive: true }
  );

  window.addEventListener(
    "touchstart",
    e => {
      const t = e.touches[0];
      tx = t.clientX;
      ty = t.clientY;
      activate();
    },
    { passive: true }
  );

  window.addEventListener(
    "touchmove",
    e => {
      const t = e.touches[0];
      tx = t.clientX;
      ty = t.clientY;
      activate();
    },
    { passive: true }
  );

})();

/*
/* =====================================================
   FAMEIQ — PREMIUM 3D BIRDS BACKGROUND (SAFE TUNED)
   Slower motion + slightly more birds on mobile
===================================================== */

(() => {
  if (document.body.dataset.page !== "home") return;

  let vantaEffect = null;
  let spreadTimeout = null;

  function initBirds() {
    const el = document.getElementById("birds-bg");
    if (!el || !window.VANTA) return;

    const w = window.innerWidth;

    const isMobile = w < 768;
    const isTablet = w >= 768 && w < 1024;
    const isLaptop  = w >= 1024 && w < 1440; // ✅ LAPTOP RANGE
    const isDesktop = w >= 1024;

// Small controlled randomness (NO chaos)
    const randomBirdSize =
      0.95 + Math.random() * 0.25; // 0.95 → 1.20

    const randomWingSpan =
      16 + Math.random() * 6; // 16 → 22
    vantaEffect = VANTA.BIRDS({
      el,

      mouseControls: true,
      touchControls: true,
      gyroControls: false,

      backgroundAlpha: 0.0,

      scale: 1.0,
      scaleMobile: 0.75,

      color1: 0xD8B06A, // GOLD → near birds
      color2: 0xE3E1DE, // SILVER → far birds

       /* ✅ CHANGED HERE — quantity reduced ONLY for laptop */
      quantity: isMobile
        ? 4.5
        : isTablet
        ? 5
        : isLaptop
        ? 4   // 🔻 reduced for laptops
        : 4,    // desktops unchanged

       /* ✅ RANDOMIZED SIZE (NEW) */
      birdSize: randomBirdSize,
      wingSpan: randomWingSpan,

      separation: isMobile ? 72.0 : 56.0,
      alignment: isMobile ? 22.0 : 28.0,
      cohesion: isMobile ? 16.0 : 22.0,

      /* 🔽 FIX: MUCH SLOWER SPEED FOR MOBILE & TABLET */
      speedLimit: isMobile ? 1.9 : isTablet ? 2.4 : 3.2
    });
  }

  /* ===============================
     TOUCH SPREAD (MOBILE / TABLET)
  =============================== */

  function spreadBirds() {
    if (!vantaEffect) return;

    vantaEffect.setOptions({
      separation: 120.0,
      cohesion: 7.0,

      /* 🔽 FIX: SPREAD SPEED ALSO REDUCED */
      speedLimit: 3.0
    });

    clearTimeout(spreadTimeout);
    spreadTimeout = setTimeout(() => {
      if (!vantaEffect) return;
      vantaEffect.setOptions({
        separation: 56.0,
        cohesion: 22.0,

        /* 🔽 FIX: RESET MATCHES NEW BASE SPEED */
        speedLimit: 2.4
      });
    }, 900);
  }

  const isTouch =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;

  if (isTouch) {
    window.addEventListener(
      "touchstart",
      () => {
        spreadBirds();
      },
      { passive: true }
    );
  }

  initBirds();

  SafeViewport.onResize(() => {
  if (vantaEffect) {
    vantaEffect.destroy();
    vantaEffect = null;
  }
  initBirds();
});
})();

window.addEventListener("orientationchange", () => {
  setTimeout(() => {
    if (vantaEffect) {
      vantaEffect.destroy();
      vantaEffect = null;
    }
    initBirds();
  }, 300);
});




function loadScript(src) {
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = resolve;
    document.head.appendChild(s);
  });
}

let vantaGlobe;

(async function () {
  await loadScript("https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js");
  await loadScript("https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js");

  window.addEventListener("load", function () {
    const globeEl = document.querySelector("#globe-bg");
    if (!globeEl || !window.VANTA) return;

    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth <= 1024;

    vantaGlobe = VANTA.GLOBE({
      el: globeEl,
      mouseControls: !isMobile,
      touchControls: true,
      gyroControls: false,

      minHeight: 200,
      minWidth: 200,

      scale: 1.0,
      scaleMobile: 0.65,

      color: 0xffd900,
      backgroundColor: 0x020617,

      size: isMobile ? 0.55 : isTablet ? 0.8 : 1.0,
      spacing: isMobile ? 24 : isTablet ? 20 : 18,
      speed: isMobile ? 0.35 : 0.6,
      zoom: isMobile ? 0.85 : 1.0
    });
  });

  // Prevent re-render lag on resize
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (vantaGlobe && vantaGlobe.resize) vantaGlobe.resize();
    }, 250);
  });
})();


window.addEventListener("load", () => {
  const iframes = document.querySelectorAll(".site-preview iframe");

  iframes.forEach((iframe) => {
    const src = iframe.getAttribute("data-src");
    if (src) {
      setTimeout(() => {
        iframe.src = src;
      }, 600); // load after globe is visible
    }
  });
});





// ===== PORTFOLIO FAST LOAD (All Devices: Mobile, Tablet, Laptop) =====
window.addEventListener("DOMContentLoaded", () => {
  const frames = document.querySelectorAll(".site-preview iframe");

  frames.forEach((iframe, index) => {
    const src = iframe.getAttribute("src");
    if (!src) return;

    // Unload initially to avoid blocking render
    iframe.setAttribute("data-src", src);
    iframe.src = "about:blank";

    // Progressive load (one-by-one)
    const delay = 600 + index * 700; // smooth stagger for all devices

    setTimeout(() => {
      iframe.src = iframe.getAttribute("data-src");
    }, delay);
  });
});






document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector('.btn.btn-primary.btn-full');
  if (!btn) return;

  btn.addEventListener("click", function (e) {
    const name = document.querySelector('input[name="name"]')?.value || "";
    const email = document.querySelector('input[name="email"]')?.value || "";
   const objective =
  document.querySelector('#project-type')?.value ||
  document.querySelector('select[name="growth-objective"]')?.value ||
  document.querySelector('select')?.value ||
  "";

    const details = document.querySelector('textarea[name="message"]')?.value || "";

    const subject = encodeURIComponent("New Strategy Call Request - FAMEIQ");
    const body = encodeURIComponent(
      `Name: ${name}\n` +
      `Email: ${email}\n\n` +
      `Growth Objective: ${objective}\n\n` +
      `Project Details:\n${details}`
    );

    btn.href = `mailto:fameiqmarekting@gmail.com?subject=${subject}&body=${body}`;
  });
});



  /* ===============================
     INIT
  =============================== */
  onReady(() => {
    initPageTransition();
    initScrollReveal();
    initMetricCountUp();
    initFaq();
    initHighlightRollout();
    initFooterYear();
    initAdvancedWebBubble();

  });

})();
