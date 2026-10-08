// Lightweight interactions shared by every page. No build tools or server needed.
document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navAnchors = document.querySelectorAll('.nav-links a');

  // Mark the current page in the shared navigation.
  const currentPage = document.body.dataset.page;
  const currentLink = document.querySelector(`[data-nav="${currentPage}"]`);
  if (currentLink) {
    currentLink.classList.add('active');
    currentLink.setAttribute('aria-current', 'page');
  }

  // Mobile navigation opens as a full-height menu and closes after a selection.
  const closeMenu = () => {
    if (!menuButton || !navLinks) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation menu');
    navLinks.classList.remove('open');
    document.body.classList.remove('menu-open');
  };
  if (menuButton && navLinks) {
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
      navLinks.classList.toggle('open', !isOpen);
      document.body.classList.toggle('menu-open', !isOpen);
    });
    navAnchors.forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
  }

  // The typing effect only appears on the homepage.
  const typedText = document.getElementById('typed-text');
  if (typedText && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const roles = ['B.Tech CSE (AI/ML) Student', 'DSA Enthusiast', 'Aspiring AI Engineer'];
    let roleIndex = 0;
    let charIndex = roles[0].length;
    let deleting = true;
    const typeNext = () => {
      const role = roles[roleIndex];
      charIndex += deleting ? -1 : 1;
      typedText.textContent = role.slice(0, charIndex);
      let delay = deleting ? 38 : 68;
      if (!deleting && charIndex === role.length) { deleting = true; delay = 1500; }
      else if (deleting && charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; delay = 280; }
      window.setTimeout(typeNext, delay);
    };
    window.setTimeout(typeNext, 1800);
  }

  // Fade cards in as they enter the viewport and animate skill bars.
  const revealItems = document.querySelectorAll('.reveal');
  const showItem = (item) => {
    item.classList.add('visible');
    item.querySelectorAll('.skill-track span').forEach((bar) => {
      bar.style.setProperty('--skill-width', bar.dataset.width || '60%');
      bar.classList.add('animated');
    });
  };
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { showItem(entry.target); activeObserver.unobserve(entry.target); }
      });
    }, { threshold: 0.14 });
    revealItems.forEach((item) => observer.observe(item));
  } else revealItems.forEach(showItem);

  // A local static site has no form backend, so prepare an email draft instead.
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const subject = encodeURIComponent(`Portfolio message from ${data.get('name')}`);
      const body = encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`);
      document.getElementById('form-note').textContent = 'Opening your email app…';
      window.location.href = `mailto:aksha.26bcon2092@jecrcu.edu.in?subject=${subject}&body=${body}`;
    });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});
