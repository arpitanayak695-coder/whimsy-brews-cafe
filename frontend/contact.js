
(function () {
  "use strict";

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Navbar scroll state */
  const navbar = $("#navbar");
  const onScrollNav = () => navbar.classList.toggle("scrolled", window.scrollY > 30);
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  /* Mobile drawer */
  const hamburger = $("#hamburger");
  const drawer = $("#mobileDrawer");
  const drawerBackdrop = $("#drawerBackdrop");
  const drawerClose = $("#drawerClose");

  function openDrawer() {
    drawer.classList.add("open");
    drawerBackdrop.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeDrawer() {
    drawer.classList.remove("open");
    drawerBackdrop.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  hamburger.addEventListener("click", openDrawer);
  drawerClose.addEventListener("click", closeDrawer);
  drawerBackdrop.addEventListener("click", closeDrawer);
  $$(".mobile-drawer a").forEach((a) => a.addEventListener("click", closeDrawer));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("open")) closeDrawer();
  });

  /* Toast */
  const toastEl = $("#toast");
  let toastTimer = null;
  function showToast(message, type) {
    toastEl.textContent = message;
    toastEl.classList.toggle("error", type === "error");
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 4200);
  }

  /* Contact form validation + submission */
  const form = $("#contactForm");
  const submitBtn = $("#contactSubmit");
  const formNote = $("#formNote");

  function setFieldError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(errorId);
    field.closest(".field").classList.toggle("invalid", Boolean(message));
    errorEl.textContent = message || "";
  }

  function validate() {
    let valid = true;
    const name = $("#cName").value.trim();
    const phone = $("#cPhone").value.trim();
    const email = $("#cEmail").value.trim();
    const message = $("#cMessage").value.trim();

    if (!name) { setFieldError("cName", "cNameError", "Please enter your full name."); valid = false; }
    else setFieldError("cName", "cNameError", "");

    const phonePattern = /^[0-9+()\-\s]{7,20}$/;
    if (!phone || !phonePattern.test(phone)) { setFieldError("cPhone", "cPhoneError", "Enter a valid mobile number."); valid = false; }
    else setFieldError("cPhone", "cPhoneError", "");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) { setFieldError("cEmail", "cEmailError", "Enter a valid email address."); valid = false; }
    else setFieldError("cEmail", "cEmailError", "");

    if (!message || message.length < 10) { setFieldError("cMessage", "cMessageError", "Message should be at least 10 characters."); valid = false; }
    else setFieldError("cMessage", "cMessageError", "");

    return valid;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    formNote.textContent = "";
    formNote.classList.remove("error");

    if (!validate()) {
      showToast("Please fix the highlighted fields.", "error");
      return;
    }

    submitBtn.classList.add("loading");
    submitBtn.disabled = true;

    const payload = {
      name: $("#cName").value.trim(),
      phone: $("#cPhone").value.trim(),
      email: $("#cEmail").value.trim(),
      message: $("#cMessage").value.trim(),
    };

    const API_BASE = window.WHIMSY_BREWS_API_BASE || window.location.origin ;

    try {
      const res = await fetch(API_BASE + "/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Request failed with status " + res.status);

      showToast("Inquiry sent successfully. We'll be in touch soon!");
      formNote.textContent = "Thanks — your message is on its way to our team.";
      form.reset();
    } catch (err) {
      showToast("We couldn't send your message right now.", "error");
      formNote.textContent = "The contact service isn't reachable at the moment. Please call +1 (555) 123-4287 or email hello@aureliacoffee.com directly.";
      formNote.classList.add("error");
    } finally {
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
    }
  });

  /* Entrance animation */
  if (window.gsap) {
    if (!prefersReducedMotion) {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .to(".contact-hero [data-reveal]", { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, delay: 0.1 });

      if (window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        $$("[data-reveal]").forEach((el) => {
          if (el.closest(".contact-hero")) return;
          gsap.fromTo(el, { opacity: 0, y: 26 }, {
            opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
          });
        });
      }
    } else {
      $$("[data-reveal]").forEach((el) => { el.style.opacity = 1; el.style.transform = "none"; });
    }
  } else {
    $$("[data-reveal]").forEach((el) => { el.style.opacity = 1; el.style.transform = "none"; });
  }
})();
