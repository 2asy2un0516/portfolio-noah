/* =====================================================
   황해찬 | 온라인 콘텐츠 관리 포트폴리오 — script.js
   ===================================================== */

(function () {
  'use strict';

  /* ─── Scroll Progress Bar ─── */
  const progressBar = document.getElementById('scrollProgress');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const pct = Math.min((scrollTop / docHeight) * 100, 100);
    if (progressBar) progressBar.style.width = pct + '%';
  }

  /* ─── Navbar scroll shadow ─── */
  const navbar = document.getElementById('navbar');
  function updateNav() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }

  /* ─── Active nav link highlight ─── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .nav-mobile a');
  function updateActiveLink() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 90) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active-link', link.getAttribute('href') === '#' + current);
    });
  }

  /* ─── Throttled scroll handler ─── */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        updateNav();
        updateActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ─── Mobile Hamburger ─── */
  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('navMobile');
  if (hamburger && navMobile) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMobile.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });
    document.querySelectorAll('.nav-mobile a').forEach(link => {
      link.addEventListener('click', () => {
        navMobile.classList.remove('open');
        hamburger.classList.remove('open');
      });
    });
  }

  /* ─── Fade-in on Scroll (IntersectionObserver) ─── */
  const fadeEls = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings
          const siblings = entry.target.closest('.skills-grid, .certs-grid, .about-grid, .philosophy-grid, .contact-cards');
          let delay = 0;
          if (siblings) {
            const idx = Array.from(siblings.children).indexOf(entry.target);
            delay = idx * 80;
          }
          setTimeout(() => entry.target.classList.add('visible'), delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(el => io.observe(el));
  } else {
    // Fallback for older browsers
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ─── Smooth scroll for all anchor links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = document.getElementById('navbar')?.offsetHeight || 64;
      window.scrollTo({
        top: target.offsetTop - offset,
        behavior: 'smooth'
      });
    });
  });

  /* ─── Timeline: add tl-visible class for pulse animation ─── */
  const tlItems = document.querySelectorAll('.timeline-item');
  if ('IntersectionObserver' in window && tlItems.length) {
    const tlObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('tl-visible');
          tlObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    tlItems.forEach(el => tlObs.observe(el));
  }

})();

/* ─── Custom Cursor Glow (pointer device only) ─── */
(function () {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const glow = document.getElementById('cursor-glow');
  const dot  = document.getElementById('cursor-dot');
  if (!glow || !dot) return;

  let mx = 0, my = 0, gx = 0, gy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    document.body.classList.add('cursor-ready');
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    document.body.classList.remove('cursor-ready');
  });

  (function animGlow() {
    gx += (mx - gx) * 0.075;
    gy += (my - gy) * 0.075;
    glow.style.left = gx + 'px';
    glow.style.top  = gy + 'px';
    requestAnimationFrame(animGlow);
  })();

  /* Expand dot on interactive elements */
  document.querySelectorAll('a, button, .skill-card, .cert-card, .phil-card, .fact-item, .chip').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.width  = '18px';
      dot.style.height = '18px';
      dot.style.background = 'rgba(29,78,216,0.45)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.width  = '6px';
      dot.style.height = '6px';
      dot.style.background = '#1D4ED8';
    });
  });
})();

/* ─── Card 3D Tilt on hover ─── */
(function () {
  document.querySelectorAll('.skill-card, .cert-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const x  = e.clientX - r.left;
      const y  = e.clientY - r.top;
      const rx = ((y - r.height / 2) / r.height) * -7;
      const ry = ((x - r.width  / 2) / r.width)  *  7;
      card.style.transform = `translateY(-7px) perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
