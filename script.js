/**
 * ==========================================================================
 * PERSONAL PORTFOLIO - MODERN DEVELOPER SCRIPTS
 * Vanilla JavaScript (ES6+) with zero external dependencies.
 * Fully defensive: Handles navigation, mobile menu, theme toggle, project filter,
 * form validation, scroll interactions, and preloader dismissal.
 * ==========================================================================
 */

// Enable enhanced styles/animations since JavaScript has executed safely
try {
  document.documentElement.classList.add('js-loaded');
} catch (e) {
  // Graceful fallback
}

// Ensure preloader is dismissed as early as possible
initPreloader();

// Initialize modules when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

function initApp() {
  try { initTheme(); } catch (e) { console.error('Theme init error:', e); }
  try { initNavigation(); } catch (e) { console.error('Navigation init error:', e); }
  try { initScrollEffects(); } catch (e) { console.error('Scroll effects error:', e); }
  try { initProjectFilters(); } catch (e) { console.error('Project filters error:', e); }
  try { initContactForm(); } catch (e) { console.error('Contact form error:', e); }
  try { initClipboardUtils(); } catch (e) { console.error('Clipboard utils error:', e); }
}

/**
 * --------------------------------------------------------------------------
 * 0. Preloader / Loading Screen Safety Handler
 * --------------------------------------------------------------------------
 */
function initPreloader() {
  const dismissLoader = () => {
    const loader = document.querySelector('.loader, #loader, .preloader, #preloader');
    if (loader) {
      loader.classList.add('hidden');
      setTimeout(() => {
        if (loader && loader.parentNode) {
          loader.parentNode.removeChild(loader);
        }
      }, 400);
    }
  };

  if (document.readyState === 'complete') {
    dismissLoader();
  } else {
    window.addEventListener('load', dismissLoader);
  }

  // Safety fallback: Ensure preloader never blocks page indefinitely
  setTimeout(dismissLoader, 1200);
}

/**
 * --------------------------------------------------------------------------
 * 1. Theme Management (Dark / Light Mode)
 * --------------------------------------------------------------------------
 */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');

  const getStoredTheme = () => {
    try {
      return localStorage.getItem('portfolio-theme');
    } catch (e) {
      return null;
    }
  };

  const setStoredTheme = (theme) => {
    try {
      localStorage.setItem('portfolio-theme', theme);
    } catch (e) {
      // Storage unavailable or blocked
    }
  };

  const applyTheme = (theme) => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  // Determine initial theme
  let initialTheme = 'dark';
  const savedTheme = getStoredTheme();
  
  if (savedTheme === 'light' || savedTheme === 'dark') {
    initialTheme = savedTheme;
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    initialTheme = 'light';
  }

  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      setStoredTheme(newTheme);
    });
  }

  // Listen for OS system theme changes if user hasn't set an explicit preference
  if (window.matchMedia) {
    try {
      const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      colorSchemeQuery.addEventListener('change', (e) => {
        if (!getStoredTheme()) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    } catch (e) {
      // matchMedia listener not supported
    }
  }
}

/**
 * --------------------------------------------------------------------------
 * 2. Responsive Navigation & Mobile Menu
 * --------------------------------------------------------------------------
 */
function initNavigation() {
  const hamburger = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (hamburger && navMenu) {
    // Toggle mobile drawer
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      hamburger.classList.toggle('is-active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close mobile drawer when clicking any nav link or menu CTA
    const allMenuLinks = navMenu.querySelectorAll('a');
    allMenuLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('is-open')) {
          navMenu.classList.remove('is-open');
          hamburger.classList.remove('is-active');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close mobile drawer when clicking outside
    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('is-open') &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        navMenu.classList.remove('is-open');
        hamburger.classList.remove('is-active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        navMenu.classList.remove('is-open');
        hamburger.classList.remove('is-active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.focus();
      }
    });
  }

  // --------------------------------------------------------------------------
  // Dynamic Scroll-Spy: Accurately highlights active navigation link based on scroll
  // --------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  let ticking = false;

  const updateActiveNavLink = () => {
    if (!sections.length || !navLinks.length) return;

    const scrollY = window.pageYOffset || window.scrollY || 0;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const navHeight = navbar ? navbar.offsetHeight : 72;
    // Section trigger threshold below the fixed navbar
    const viewOffset = navHeight + 60;

    let activeId = '';

    // 1. Scrolled to the bottom of the page -> activate the last section
    if (windowHeight + scrollY >= docHeight - 40) {
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        activeId = lastSection.getAttribute('id') || '';
      }
    }
    // 2. Scrolled at or near the very top of the page -> activate the home section
    else if (scrollY < 100) {
      activeId = sections[0] ? (sections[0].getAttribute('id') || 'home') : 'home';
    }
    // 3. Middle of page -> determine which section is currently active in the viewport
    else {
      // Find the current section spanning across the reading line (scrollY + viewOffset)
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollY + viewOffset >= sectionTop && scrollY + viewOffset < sectionTop + sectionHeight) {
          activeId = section.getAttribute('id') || '';
          break;
        }
      }

      // Fallback: If in between section gaps, select the closest section whose top was passed
      if (!activeId) {
        for (let i = sections.length - 1; i >= 0; i--) {
          const section = sections[i];
          if (scrollY + viewOffset >= section.offsetTop) {
            activeId = section.getAttribute('id') || '';
            break;
          }
        }
      }
    }

    // Apply active class and accessibility state to matching navigation link
    if (activeId) {
      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href === `#${activeId}`) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        } else {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
        }
      });
    }
  };

  // Immediate click response for smooth UX
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const targetHref = link.getAttribute('href');
      if (targetHref && targetHref.startsWith('#')) {
        navLinks.forEach((l) => {
          if (l === link) {
            l.classList.add('active');
            l.setAttribute('aria-current', 'page');
          } else {
            l.classList.remove('active');
            l.removeAttribute('aria-current');
          }
        });
      }
    });
  });

  // Throttled scroll handler using requestAnimationFrame for optimal 60fps performance
  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveNavLink();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  window.addEventListener('orientationchange', onScroll, { passive: true });

  // Initial calculation on execution
  updateActiveNavLink();
}

/**
 * --------------------------------------------------------------------------
 * 3. Scroll Interactions, Back to Top & Reveal Animations
 * --------------------------------------------------------------------------
 */
function initScrollEffects() {
  const floatBtn = document.getElementById('float-back-to-top');
  const footerBtn = document.getElementById('footer-back-to-top');

  const scrollToTop = () => {
    try {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } catch (e) {
      window.scrollTo(0, 0);
    }
  };

  if (floatBtn) {
    floatBtn.addEventListener('click', scrollToTop);

    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset || window.scrollY || 0;
      if (scrollY > 400) {
        floatBtn.classList.add('show');
      } else {
        floatBtn.classList.remove('show');
      }
    }, { passive: true });
  }

  if (footerBtn) {
    footerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToTop();
    });
  }

  // Scroll reveal animations
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length > 0) {
    if ('IntersectionObserver' in window) {
      try {
        const observer = new IntersectionObserver((entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              obs.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.1,
          rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach((el) => {
          if (el) observer.observe(el);
        });
      } catch (err) {
        // Fallback: reveal all immediately if observer fails
        revealElements.forEach((el) => el && el.classList.add('is-revealed'));
      }
    } else {
      // Fallback for environments without IntersectionObserver
      revealElements.forEach((el) => el && el.classList.add('is-revealed'));
    }

    // Secondary safety: Reveal all elements after 2.5s regardless of scroll
    setTimeout(() => {
      revealElements.forEach((el) => el && el.classList.add('is-revealed'));
    }, 2500);
  }
}

/**
 * --------------------------------------------------------------------------
 * 4. Project Category Filtering
 * --------------------------------------------------------------------------
 */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        if (!card) return;
        const category = card.getAttribute('data-category');

        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/**
 * --------------------------------------------------------------------------
 * 5. Contact Form Validation & Mailto Fallback
 * --------------------------------------------------------------------------
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusContainer = document.getElementById('form-status');

  if (!form || !statusContainer) return;

  const fields = {
    name: {
      input: document.getElementById('name'),
      group: document.getElementById('group-name'),
      error: document.getElementById('error-name'),
      validate: (val) => val.trim().length >= 2,
      msg: 'Please enter your name (at least 2 characters).'
    },
    email: {
      input: document.getElementById('email'),
      group: document.getElementById('group-email'),
      error: document.getElementById('error-email'),
      validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
      msg: 'Please enter a valid email address.'
    },
    subject: {
      input: document.getElementById('subject'),
      group: document.getElementById('group-subject'),
      error: document.getElementById('error-subject'),
      validate: (val) => val.trim().length >= 3,
      msg: 'Please enter a subject (at least 3 characters).'
    },
    message: {
      input: document.getElementById('message'),
      group: document.getElementById('group-message'),
      error: document.getElementById('error-message'),
      validate: (val) => val.trim().length >= 10,
      msg: 'Please enter a message (at least 10 characters).'
    }
  };

  // Real-time error removal on input
  Object.keys(fields).forEach((key) => {
    const item = fields[key];
    if (item && item.input && item.group) {
      item.input.addEventListener('input', () => {
        if (item.validate(item.input.value)) {
          item.group.classList.remove('has-error');
        }
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate all fields
    Object.keys(fields).forEach((key) => {
      const item = fields[key];
      if (item && item.input && item.group && item.error) {
        if (!item.validate(item.input.value)) {
          item.group.classList.add('has-error');
          item.error.textContent = item.msg;
          isValid = false;
        } else {
          item.group.classList.remove('has-error');
        }
      }
    });

    if (!isValid) {
      statusContainer.className = 'form-status error';
      statusContainer.textContent = 'Please correct the highlighted errors above before submitting.';
      statusContainer.style.display = 'block';
      return;
    }

    // Success State - Prepare Mailto action
    const nameVal = fields.name.input ? fields.name.input.value.trim() : '';
    const emailVal = fields.email.input ? fields.email.input.value.trim() : '';
    const subjectVal = fields.subject.input ? fields.subject.input.value.trim() : '';
    const messageVal = fields.message.input ? fields.message.input.value.trim() : '';

    const encodedSubject = encodeURIComponent(`[Portfolio Contact] ${subjectVal}`);
    const encodedBody = encodeURIComponent(
      `Hello DGT,\n\nMy name is ${nameVal} (${emailVal}).\n\n${messageVal}\n\nSent from your portfolio website.`
    );
    const mailtoUrl = `mailto:25d119@psgitech.ac.in?subject=${encodedSubject}&body=${encodedBody}`;

    statusContainer.className = 'form-status success';
    statusContainer.innerHTML = `
      <strong>Message Prepared Successfully!</strong><br>
      Since this is a client-side static site, click below to open your email client, or connect a form service like Formspree (see README).
      <div style="margin-top: 0.85rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <a href="${mailtoUrl}" class="btn btn-sm btn-primary" style="text-decoration: none;">
          Open in Email App
        </a>
        <button type="button" id="btn-reset-form" class="btn btn-sm btn-secondary">
          Reset Form
        </button>
      </div>
    `;
    statusContainer.style.display = 'block';

    const resetBtn = document.getElementById('btn-reset-form');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        form.reset();
        statusContainer.style.display = 'none';
      });
    }
  });
}

/**
 * --------------------------------------------------------------------------
 * 6. Clipboard Utilities (e.g. Copy Email)
 * --------------------------------------------------------------------------
 */
function initClipboardUtils() {
  const copyBtn = document.getElementById('copy-email-btn');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const emailText = copyBtn.getAttribute('data-email') || '25d119@psgitech.ac.in';

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(emailText).then(() => {
        showCopyFeedback(copyBtn);
      }).catch(() => {
        fallbackCopy(emailText, copyBtn);
      });
    } else {
      fallbackCopy(emailText, copyBtn);
    }
  });
}

function showCopyFeedback(btn) {
  if (!btn) return;
  const originalHtml = btn.innerHTML;
  btn.innerHTML = `<span>Copied to clipboard!</span>`;
  btn.classList.add('btn-primary');
  btn.classList.remove('btn-secondary');

  setTimeout(() => {
    btn.innerHTML = originalHtml;
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-secondary');
  }, 2200);
}

function fallbackCopy(text, btn) {
  try {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showCopyFeedback(btn);
  } catch (err) {
    console.error('Could not copy email', err);
  }
}
