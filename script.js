/* ============================================================
   ORION INFRALABS — MAIN SCRIPT
   Features:
     1. Navbar scroll-shrink & active-link highlighting
     2. Mobile hamburger menu toggle
     3. Scroll-reveal animations (IntersectionObserver)
     4. Smooth-scroll for anchor links
     5. Back-to-Top button
     6. Contact form – client-side validation & success banner
   ============================================================ */

(function () {
  'use strict';

  // ──────────────────────────────────────────
  // 1.  NAVBAR – scroll shrink + active link
  // ──────────────────────────────────────────
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  function handleNavbarScroll() {
    /* Shrink navbar after 50 px */
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    /* Highlight the link whose section is currently in view */
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120; // offset for fixed nav height
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  // ──────────────────────────────────────────
  // 2.  MOBILE HAMBURGER MENU
  // ──────────────────────────────────────────
  const hamburger  = document.getElementById('hamburger');
  const navMenu    = document.getElementById('navLinks');

  function toggleMenu() {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));

    /* Prevent body scroll when menu is open */
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMenu);

  /* Close menu when a nav link is clicked (mobile) */
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) toggleMenu();
    });
  });

  // ──────────────────────────────────────────
  // 3.  SCROLL-REVEAL ANIMATIONS
  // ──────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        /* Unobserve after reveal so delay won't re-trigger */
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,          // trigger when 15 % of element is in viewport
    rootMargin: '0px 0px -40px 0px'  // slight bottom offset
  });

  revealEls.forEach(el => revealObserver.observe(el));

  // ──────────────────────────────────────────
  // 4.  SMOOTH SCROLL FOR ANCHOR LINKS
  // ──────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;

      e.preventDefault();

      const navHeight = navbar.offsetHeight;
      const targetY   = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });

  // ──────────────────────────────────────────
  // 5.  BACK-TO-TOP BUTTON
  // ──────────────────────────────────────────
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    backToTopBtn.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ──────────────────────────────────────────
  // 6.  CONTACT FORM – VALIDATION & SUCCESS
  // ──────────────────────────────────────────
  const form          = document.getElementById('contactForm');
  const successBanner = document.getElementById('successBanner');

  /* --- helper: show / clear an error --- */
  function showError(id, msg) {
    document.getElementById(id).textContent = msg;
  }
  function clearError(id) {
    document.getElementById(id).textContent = '';
  }

  /* --- inline clear-on-input for each field --- */
  ['name','email','phone','service','message'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => clearError(id + 'Error'));
  });

  /* --- validate email with a simple regex --- */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* --- validate Indian / international phone (10-15 digits, optional +91) --- */
  function isValidPhone(phone) {
    const cleaned = phone.replace(/[\s\-()]/g, '');
    return /^\+?(\d{10,15})$/.test(cleaned);
  }

  /* --- main submit handler --- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    let valid = true;

    // Name
    const nameVal = document.getElementById('name').value.trim();
    if (nameVal.length < 2) {
      showError('nameError', 'Please enter your full name (min 2 characters).');
      valid = false;
    } else {
      clearError('nameError');
    }

    // Email
    const emailVal = document.getElementById('email').value.trim();
    if (!emailVal) {
      showError('emailError', 'Email address is required.');
      valid = false;
    } else if (!isValidEmail(emailVal)) {
      showError('emailError', 'Please enter a valid email address.');
      valid = false;
    } else {
      clearError('emailError');
    }

    // Phone
    const phoneVal = document.getElementById('phone').value.trim();
    if (!phoneVal) {
      showError('phoneError', 'Phone number is required.');
      valid = false;
    } else if (!isValidPhone(phoneVal)) {
      showError('phoneError', 'Please enter a valid phone number (10–15 digits).');
      valid = false;
    } else {
      clearError('phoneError');
    }

    // Service dropdown
    const serviceVal = document.getElementById('service').value;
    if (!serviceVal) {
      showError('serviceError', 'Please select a service.');
      valid = false;
    } else {
      clearError('serviceError');
    }

    // Message
    const msgVal = document.getElementById('message').value.trim();
    if (msgVal.length < 10) {
      showError('messageError', 'Please describe your requirement (min 10 characters).');
      valid = false;
    } else {
      clearError('messageError');
    }

    // ── If all valid → show success, reset form ──
    if (valid) {
      // Hide form, show success
      form.style.display = 'none';
      successBanner.classList.add('show');

      // Optionally scroll the banner into view
      successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // After 5 seconds, restore form (cleared)
      setTimeout(() => {
        form.reset();
        form.style.display = 'block';
        successBanner.classList.remove('show');
      }, 5000);
    }
  });

})(); // end IIFE
