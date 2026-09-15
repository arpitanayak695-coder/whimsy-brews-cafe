
(function () {
  "use strict";

  /* ---------- Helpers ---------- */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =========================================================
     NAVBAR — scroll state, active link, mobile drawer
  ========================================================= */
  const navbar = $("#navbar");
  const onScrollNav = () => {
    if (window.scrollY > 30) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  };
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  const navLinks = $$(".nav-link");
  const sections = navLinks
    .map((l) => l.getAttribute("href"))
    .filter((h) => h.startsWith("#"))
    .map((h) => document.getElementById(h.slice(1)))
    .filter(Boolean);

  const setActiveLink = () => {
    let currentId = sections[0] && sections[0].id;
    const scrollPos = window.scrollY + 140;
    sections.forEach((sec) => {
      if (sec.offsetTop <= scrollPos) currentId = sec.id;
    });
    navLinks.forEach((link) => {
      const isMatch = link.getAttribute("href") === "#" + currentId;
      link.classList.toggle("active", isMatch);
    });
  };
  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

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

  /* =========================================================
     SPECIALTY COFFEE CAROUSEL
  ========================================================= */
  const track = $("#carouselTrack");
  const carLeft = $("#carLeft");
  const carRight = $("#carRight");
  function scrollCarousel(dir) {
    const card = track.querySelector(".coffee-card");
    const gap = 22;
    const distance = card ? card.offsetWidth + gap : 250;
    track.scrollBy({ left: dir * distance * 2, behavior: "smooth" });
  }
  carLeft.addEventListener("click", () => scrollCarousel(-1));
  carRight.addEventListener("click", () => scrollCarousel(1));

  /* Coffee info modal */
  const modalBackdrop = document.createElement("div");
  modalBackdrop.className = "coffee-modal-backdrop";
  modalBackdrop.innerHTML = `
    <div class="coffee-modal" role="dialog" aria-modal="true">
      <button class="coffee-modal-close" aria-label="Close">&times;</button>
      <p class="eyebrow" id="cmEyebrow">Specialty Coffee</p>
      <h3 id="cmName"></h3>
      <dl>
        <dt>Origin</dt><dd id="cmOrigin"></dd>
        <dt>Roast</dt><dd id="cmRoast"></dd>
        <dt>Notes</dt><dd id="cmNotes"></dd>
        <dt>Brew Method</dt><dd id="cmBrew"></dd>
        <dt>Price</dt><dd id="cmPrice"></dd>
      </dl>
    </div>`;
  document.body.appendChild(modalBackdrop);

  function openCoffeeModal(card) {
    $("#cmName", modalBackdrop).textContent = card.dataset.name || "";
    $("#cmOrigin", modalBackdrop).textContent = card.dataset.origin || "";
    $("#cmRoast", modalBackdrop).textContent = card.dataset.roast || "";
    $("#cmNotes", modalBackdrop).textContent = card.dataset.notes || "";
    $("#cmBrew", modalBackdrop).textContent = card.dataset.brew || "";
    $("#cmPrice", modalBackdrop).textContent = card.dataset.price || "";
    modalBackdrop.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeCoffeeModal() {
    modalBackdrop.classList.remove("open");
    document.body.style.overflow = "";
  }
  $$(".coffee-card").forEach((card) => {
    card.addEventListener("click", () => openCoffeeModal(card));
  });
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop || e.target.classList.contains("coffee-modal-close")) closeCoffeeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCoffeeModal();
  });

  /* =========================================================
     MENU TABS
  ========================================================= */
  const menuTabs = $$(".menu-tab");
  const menuItems = $$(".menu-item");
  menuTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      menuTabs.forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      const cat = tab.dataset.cat;
      menuItems.forEach((item) => {
        const show = item.dataset.cat === cat;
        item.style.display = show ? "" : "none";
        if (show && !prefersReducedMotion && window.gsap) {
          gsap.fromTo(item, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
        }
      });
    });
  });

  /* =========================================================
     GALLERY LIGHTBOX
  ========================================================= */
  const galleryItems = $$(".gallery-item");
  const lightbox = $("#lightbox");
  const lightboxImg = $("#lightboxImg");
  const lightboxCaption = $("#lightboxCaption");
  let currentGalleryIndex = 0;

  function openLightbox(index) {
    currentGalleryIndex = index;
    const item = galleryItems[index];
    lightboxImg.src = item.dataset.full;
    lightboxImg.alt = item.querySelector("img").alt;
    lightboxCaption.textContent = item.dataset.caption || "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  function navLightbox(dir) {
    currentGalleryIndex = (currentGalleryIndex + dir + galleryItems.length) % galleryItems.length;
    openLightbox(currentGalleryIndex);
  }
  galleryItems.forEach((item, i) => item.addEventListener("click", () => openLightbox(i)));
  $("#lightboxClose").addEventListener("click", closeLightbox);
  $("#lightboxPrev").addEventListener("click", () => navLightbox(-1));
  $("#lightboxNext").addEventListener("click", () => navLightbox(1));
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") navLightbox(-1);
    if (e.key === "ArrowRight") navLightbox(1);
  });

  /* =========================================================
     REVIEWS SLIDER
  ========================================================= */
  const revTrack = $("#revTrack");
  const revCards = $$(".review-card", revTrack);
  const revDotsWrap = $("#revDots");
  let revIndex = 0;
  let revTimer = null;

  revCards.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", "Go to review " + (i + 1));
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToReview(i));
    revDotsWrap.appendChild(dot);
  });
  const revDots = $$("button", revDotsWrap);

  function goToReview(i) {
    revIndex = (i + revCards.length) % revCards.length;
    revTrack.style.transform = `translateX(-${revIndex * 100}%)`;
    revDots.forEach((d, di) => d.classList.toggle("active", di === revIndex));
  }
  function startAutoplay() {
    stopAutoplay();
    revTimer = setInterval(() => goToReview(revIndex + 1), 6000);
  }
  function stopAutoplay() {
    if (revTimer) clearInterval(revTimer);
  }
  $("#revPrev").addEventListener("click", () => { goToReview(revIndex - 1); startAutoplay(); });
  $("#revNext").addEventListener("click", () => { goToReview(revIndex + 1); startAutoplay(); });
  $(".reviews-slider").addEventListener("mouseenter", stopAutoplay);
  $(".reviews-slider").addEventListener("mouseleave", startAutoplay);
  revTrack.style.display = "flex";
  revCards.forEach((c) => (c.style.flex = "0 0 100%"));
  startAutoplay();

  /* touch swipe */
  let touchStartX = 0;
  revTrack.addEventListener("touchstart", (e) => (touchStartX = e.touches[0].clientX), { passive: true });
  revTrack.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) goToReview(revIndex + (dx < 0 ? 1 : -1));
  }, { passive: true });

  /* =========================================================
     TOAST NOTIFICATIONS
  ========================================================= */
  const toastEl = $("#toast");
  let toastTimer = null;
  function showToast(message, type) {
    toastEl.textContent = message;
    toastEl.classList.toggle("error", type === "error");
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 4200);
  }

  /* =========================================================
     RESERVATION FORM VALIDATION
  ========================================================= */
  const reserveForm = $("#reserveForm");
  const reserveSubmit = $("#reserveSubmit");

  function setFieldError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(errorId);
    field.closest(".field").classList.toggle("invalid", Boolean(message));
    errorEl.textContent = message || "";
  }

  function validateReserveForm() {
    let valid = true;
    const name = $("#rName").value.trim();
    const email = $("#rEmail").value.trim();
    const date = $("#rDate").value;
    const time = $("#rTime").value;
    const guests = $("#rGuests").value;

    if (!name) { setFieldError("rName", "rNameError", "Please enter your name."); valid = false; }
    else setFieldError("rName", "rNameError", "");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) { setFieldError("rEmail", "rEmailError", "Enter a valid email address."); valid = false; }
    else setFieldError("rEmail", "rEmailError", "");

    if (!date) { setFieldError("rDate", "rDateError", "Choose a date."); valid = false; }
    else {
      const chosen = new Date(date + "T00:00:00");
      const today = new Date(); today.setHours(0,0,0,0);
      if (chosen < today) { setFieldError("rDate", "rDateError", "Date can't be in the past."); valid = false; }
      else setFieldError("rDate", "rDateError", "");
    }

    if (!time) { setFieldError("rTime", "rTimeError", "Choose a time."); valid = false; }
    else setFieldError("rTime", "rTimeError", "");

    const guestsNum = Number(guests);
    if (!guests || guestsNum < 1 || guestsNum > 20) { setFieldError("rGuests", "rGuestsError", "1–20 guests."); valid = false; }
    else setFieldError("rGuests", "rGuestsError", "");

    return valid;
  }

  reserveForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validateReserveForm()) {
      showToast("Please fix the highlighted fields.", "error");
      return;
    }
    reserveSubmit.classList.add("loading");
    reserveSubmit.disabled = true;

    const payload = {
      name: $("#rName").value.trim(),
      email: $("#rEmail").value.trim(),
      date: $("#rDate").value,
      time: $("#rTime").value,
      guests: $("#rGuests").value,
      request: $("#rRequest").value.trim(),
    };

    try {
      const API_BASE = window.WHIMSY_BREWS_API_BASE || "http://127.0.0.1:5500";
      const res = await fetch(API_BASE + "/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      showToast("Table reserved! We'll email a confirmation shortly.");
      reserveForm.reset();
    } catch (err) {
      showToast("We couldn't reach the reservation service. Please call us instead.", "error");
    } finally {
      reserveSubmit.classList.remove("loading");
      reserveSubmit.disabled = false;
    }
  });

  /* =========================================================
     GSAP SCROLLTRIGGER REVEALS
  ========================================================= */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    document.body.classList.add("gs-ready");

    if (!prefersReducedMotion) {
      // Hero entrance timeline
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .to(".hero-copy [data-reveal]", { opacity: 1, y: 0, duration: 0.9, stagger: 0.14, delay: 0.2 });

      $$("[data-reveal]").forEach((el) => {
        if (el.closest(".hero-copy")) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 28 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 86%" },
          }
        );
      });

      gsap.utils.toArray(".coffee-card").forEach((card, i) => {
        gsap.fromTo(card, { opacity: 0, y: 24 }, {
          opacity: 1, y: 0, duration: 0.6, delay: (i % 5) * 0.05, ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 92%", once: true },
        });
      });

      gsap.utils.toArray(".menu-item").forEach((item, i) => {
        gsap.fromTo(item, { opacity: 0, y: 16 }, {
          opacity: 1, y: 0, duration: 0.5, delay: (i % 6) * 0.05, ease: "power2.out",
          scrollTrigger: { trigger: item, start: "top 94%", once: true },
        });
      });

      gsap.utils.toArray(".gallery-item").forEach((item, i) => {
        gsap.fromTo(item, { opacity: 0, scale: 0.94 }, {
          opacity: 1, scale: 1, duration: 0.6, delay: (i % 4) * 0.06, ease: "power2.out",
          scrollTrigger: { trigger: item, start: "top 92%", once: true },
        });
      });
    } else {
      $$("[data-reveal]").forEach((el) => { el.style.opacity = 1; el.style.transform = "none"; });
    }
  } else {
    $$("[data-reveal]").forEach((el) => { el.style.opacity = 1; el.style.transform = "none"; });
  }

  /* =========================================================
     SMOOTH SCROLL FOR "EXPLORE OUR MENU"
  ========================================================= */
  $("#exploreMenuBtn").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
  });
  $("#scrollCue").addEventListener("click", () => {
    document.getElementById("specials").scrollIntoView({ behavior: "smooth" });
  });

  /* =========================================================
     THREE.JS — HERO COFFEE CUP + FLOATING BEANS
  ========================================================= */
  function initHeroScene() {
    const stage = document.getElementById("heroStage");
    const canvas = document.getElementById("heroCanvas");
    if (!stage || !canvas || !window.THREE) return;

    const isSmall = window.innerWidth < 860;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const dirLight = new THREE.DirectionalLight(0xf3e0b8, 0.8);
    dirLight.position.set(3, 4, 5);
    scene.add(dirLight);

    const loader = new THREE.TextureLoader();
    const cupTexture = loader.load("assets/coffee-cup.png");
    const beanTexture = loader.load("assets/coffee-beans.png");
    const beanTexture2 = loader.load("assets/coffee-beans-1.png");

    function sizeFromTexture(tex, targetHeight) {
      const img = tex.image;
      const ratio = img && img.width ? img.width / img.height : 1;
      return [targetHeight * ratio, targetHeight];
    }

    // Coffee cup — central hero plane
    const cupMat = new THREE.MeshBasicMaterial({ map: cupTexture, transparent: true, depthWrite: false });
    const cupGeo = new THREE.PlaneGeometry(1, 1);
    const cup = new THREE.Mesh(cupGeo, cupMat);
    cup.position.set(0, -0.3, 0);
    scene.add(cup);

    cupTexture.onUpdate = null;
    const fitCup = () => {
      const [w, h] = sizeFromTexture(cupTexture, 6.2);
      cup.scale.set(w, h, 1);
    };
    if (cupTexture.image && cupTexture.image.complete) fitCup();
    cupTexture.onLoad = fitCup;
    loader.manager.onLoad = fitCup;

    // Floating beans
    const beanCount = isSmall ? 5 : 10;
    const beans = [];
    for (let i = 0; i < beanCount; i++) {
      const tex = i % 2 === 0 ? beanTexture : beanTexture2;
      const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false });
      const size = 0.5 + Math.random() * 0.5;
      const geo = new THREE.PlaneGeometry(size, size);
      const bean = new THREE.Mesh(geo, mat);

      const angle = (i / beanCount) * Math.PI * 2;
      const radius = 3.1 + Math.random() * 1.6;
      bean.position.set(
        Math.cos(angle) * radius * 0.9,
        Math.sin(angle) * radius * 0.55 + (Math.random() - 0.5) * 1.2,
        -1 - Math.random() * 2.4
      );
      bean.rotation.z = Math.random() * Math.PI;
      bean.userData = {
        baseY: bean.position.y,
        baseX: bean.position.x,
        speed: 0.4 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.4,
      };
      scene.add(bean);
      beans.push(bean);
    }

    function resize() {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);

    // Cursor interaction — subtle tilt + parallax, NOT full rotation
    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    function onPointerMove(clientX, clientY) {
      const rect = stage.getBoundingClientRect();
      target.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      target.y = ((clientY - rect.top) / rect.height) * 2 - 1;
    }
    stage.addEventListener("mousemove", (e) => onPointerMove(e.clientX, e.clientY));
    stage.addEventListener("mouseleave", () => { target.x = 0; target.y = 0; });
    stage.addEventListener("touchmove", (e) => {
      if (e.touches[0]) onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      pointer.x += (target.x - pointer.x) * 0.06;
      pointer.y += (target.y - pointer.y) * 0.06;

      // Cup: subtle tilt, small vertical bob, gentle depth — never full rotation
      cup.rotation.z = -pointer.x * 0.10;
      cup.rotation.x = pointer.y * 0.06;
      cup.rotation.y = pointer.x * 0.14;
      cup.position.x = pointer.x * 0.35;
      cup.position.y = -0.3 + pointer.y * -0.22 + Math.sin(t * 0.8) * 0.06;
      cup.position.z = pointer.y * 0.2;

      beans.forEach((bean, i) => {
        const d = bean.userData;
        bean.position.y = d.baseY + Math.sin(t * d.speed + d.phase) * 0.35 - pointer.y * 0.5;
        bean.position.x = d.baseX + Math.cos(t * d.speed * 0.6 + d.phase) * 0.18 + pointer.x * (0.3 + i * 0.02);
        bean.rotation.z += d.rotSpeed * 0.01;
      });

      renderer.render(scene, camera);
    }
    animate();
  }

  if (window.THREE) {
    initHeroScene();
  } else {
    window.addEventListener("load", () => { if (window.THREE) initHeroScene(); });
  }
})();
