document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("is-ready");

  /* Scroll-triggered reveal animations */
  const revealEls = document.querySelectorAll(".reveal, .reveal-scale");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* Sticky nav border + scroll progress bar + moving background gradient */
  const nav = document.querySelector(".site-nav");
  const progress = document.querySelector(".scroll-progress");
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let scrollTicking = false;
  const onScroll = () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle("is-scrolled", y > 8);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (y / max) * 100 : 0;
      progress.style.width = pct + "%";
    }
    if (!reduceMotion) root.style.setProperty("--scroll-shift", y + "px");
    scrollTicking = false;
  };
  onScroll();
  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        requestAnimationFrame(onScroll);
        scrollTicking = true;
      }
    },
    { passive: true }
  );

  /* Cursor-reactive motion: buttons/tags/links nudge toward the pointer, images tilt in 3D */
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    const magneticEls = document.querySelectorAll(
      ".btn, .nav-links a, .tag, .skill-chip, .footer-social a, .contact-info-icon"
    );
    magneticEls.forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });

    const tiltEls = document.querySelectorAll(".ph-image");
    tiltEls.forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rotateX = (0.5 - py) * 8;
        const rotateY = (px - 0.5) * 8;
        el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "perspective(800px)";
      });
    });
  }

  /* Mobile menu */
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".mobile-menu");
  const closeBtn = document.querySelector(".mobile-menu-close");
  if (toggle && menu) {
    toggle.addEventListener("click", () => menu.classList.add("is-open"));
    if (closeBtn) closeBtn.addEventListener("click", () => menu.classList.remove("is-open"));
    menu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => menu.classList.remove("is-open"))
    );
  }

  /* Contact form — submits to Netlify Forms via AJAX so the page doesn't reload */
  const form = document.querySelector(".contact-form");
  if (form) {
    const encode = (data) =>
      Object.keys(data)
        .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
        .join("&");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const status = form.querySelector(".form-status");
      const formData = new FormData(form);

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode(Object.fromEntries(formData)),
      })
        .then(() => {
          if (status) {
            status.textContent = "Thanks — your message has been sent.";
            status.classList.add("is-shown");
          }
          form.reset();
        })
        .catch(() => {
          if (status) {
            status.textContent = "Something went wrong sending that. Please try again or email directly.";
            status.classList.add("is-shown");
          }
        });
    });
  }
});
