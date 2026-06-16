(function () {
  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function updateClock(clockEl) {
    const now = new Date();
    const hh = pad2(now.getHours());
    const mm = pad2(now.getMinutes());
    const ss = pad2(now.getSeconds());
    clockEl.textContent = `${hh}:${mm}:${ss}`;
  }

  function initSidebar() {
    const sidebarClock = document.getElementById('clock');
    if (sidebarClock) {
      updateClock(sidebarClock);
      setInterval(() => updateClock(sidebarClock), 250);
    }

    // Mobile: open/close overlay + drawer
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavClose = document.querySelector('.mobile-nav-close');

    function openMobileNav() {
      if (!mobileNavOverlay || !mobileNav) return;
      mobileNavOverlay.classList.add('active');
      mobileNav.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeMobileNav() {
      if (!mobileNavOverlay || !mobileNav) return;
      mobileNavOverlay.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileNav);
    if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);

    if (mobileNavOverlay) {
      mobileNavOverlay.addEventListener('click', (e) => {
        if (e.target === mobileNavOverlay) closeMobileNav();
      });
    }

    // Active state (simple: highlight based on nearest section id)
    const navLinks = document.querySelectorAll('.nav-item');
    if (navLinks.length) {
      function setActiveBySectionId(id) {
        navLinks.forEach((a) => {
          const isActive = a.getAttribute('data-section') === id;
          a.classList.toggle('active', isActive);
        });
      }

      window.addEventListener('scroll', () => {
        let current = '';
        document.querySelectorAll('section[id]').forEach((section) => {
          const sectionTop = section.getBoundingClientRect().top;
          if (sectionTop <= 140) current = section.id;
        });
        if (current) setActiveBySectionId(current);
      });

      // Initial guess
      const initial = document.querySelector('section[id]');
      if (initial) setActiveBySectionId(initial.id);
    }

    // Optional: close drawer on link click
    const mobileLinks = document.querySelectorAll('.mobile-nav-item');
    mobileLinks.forEach((a) => {
      a.addEventListener('click', () => closeMobileNav());
    });
  }

  window.addEventListener('DOMContentLoaded', initSidebar);
})();

