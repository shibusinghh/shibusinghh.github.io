/* Reveal-on-scroll, animated counters, expandable case studies */

(function () {
  "use strict";

  /* ---------- reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- animated counters ---------- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.target);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();

    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll(".count").forEach((el) => countObserver.observe(el));

  /* ---------- expandable case studies ---------- */
  document.querySelectorAll(".case").forEach((caseEl) => {
    const header = caseEl.querySelector(".case-header");
    const body = caseEl.querySelector(".case-body");

    header.addEventListener("click", () => {
      const isOpen = caseEl.classList.contains("open");

      // close any other open case
      document.querySelectorAll(".case.open").forEach((other) => {
        if (other !== caseEl) {
          other.classList.remove("open");
          other.querySelector(".case-header").setAttribute("aria-expanded", "false");
          other.querySelector(".case-body").style.maxHeight = "0px";
        }
      });

      if (isOpen) {
        caseEl.classList.remove("open");
        header.setAttribute("aria-expanded", "false");
        body.style.maxHeight = "0px";
      } else {
        caseEl.classList.add("open");
        header.setAttribute("aria-expanded", "true");
        body.style.maxHeight = body.scrollHeight + "px";
      }
    });
  });

  // keep open case heights correct on resize
  window.addEventListener("resize", () => {
    document.querySelectorAll(".case.open .case-body").forEach((body) => {
      body.style.maxHeight = body.scrollHeight + "px";
    });
  });
})();
