/**
 * ==========================================================================
 * PERSONAL PORTFOLIO - MODERN DEVELOPER SCRIPTS
 * Vanilla JavaScript (ES6+) with zero external dependencies.
 * Handles navigation, mobile menu, theme toggle, project filter,
 * form validation, and scroll interactions.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initTheme();
  initNavigation();
  initScrollEffects();
  initProjectFilters();
  initContactForm();
  initClipboardUtils();
});

/**
 * --------------------------------------------------------------------------
 * 1. Theme Management (Dark / Light Mode)
 * --------------------------------------------------------------------------
 */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  // Check saved preference or system preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
  });

  // Listen for OS system theme changes if user hasn't explicitly set one
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('portfolio-theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
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
  const navbar = document.getElementById('navbar');

  if (!hamburger || !navMenu) return;

  // Toggle mobile drawer
  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    hamburger.classList.toggle('is-active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close mobile drawer when clicking any link
  navLinks.forEach((link) => {
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
    if (navMenu.classList.contains('is-open') && 
        !navMenu.contains(e.target) && 
        !hamburger.contains(e.target)) {
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

  // Active section indicator on scroll
  const highlightActiveNav = () => {
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightActiveNav, { passive: true });
  highlightActiveNav();
}

/**
 * --------------------------------------------------------------------------
 * 3. Scroll Interactions & Back to Top
 * --------------------------------------------------------------------------
 */
function initScrollEffects() {
  const floatBtn = document.getElementById('float-back-to-top');
  const footerBtn = document.getElementById('footer-back-to-top');

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (floatBtn) {
    floatBtn.addEventListener('click', scrollToTop);
    
    // Toggle floating button visibility
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 400) {
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
  if ('IntersectionObserver' in window) {
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

    revealElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach((el) => el.classList.add('is-revealed'));
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
      // Update active button state
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
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
    if (item.input) {
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
      if (!item.validate(item.input.value)) {
        item.group.classList.add('has-error');
        item.error.textContent = item.msg;
        isValid = false;
      } else {
        item.group.classList.remove('has-error');
      }
    });

    if (!isValid) {
      statusContainer.className = 'form-status error';
      statusContainer.textContent = 'Please correct the highlighted errors above before submitting.';
      statusContainer.style.display = 'block';
      return;
    }

    // Success State
    const nameVal = fields.name.input.value.trim();
    const emailVal = fields.email.input.value.trim();
    const subjectVal = fields.subject.input.value.trim();
    const messageVal = fields.message.input.value.trim();

    // Generate mailto link for direct client launch
    const encodedSubject = encodeURIComponent(`[Portfolio Contact] ${subjectVal}`);
    const encodedBody = encodeURIComponent(
      `Hello [NAME],\n\nMy name is ${nameVal} (${emailVal}).\n\n${messageVal}\n\nSent from your portfolio website.`
    );
    const mailtoUrl = `mailto:[EMAIL-ADDRESS]?subject=${encodedSubject}&body=${encodedBody}`;

    statusContainer.className = 'form-status success';
    statusContainer.innerHTML = `
      <strong>Message Prepared Successfully!</strong><br>
      Since this is a client-side static site, click below to open your email client, or connect a backend/service like Formspree (see README).
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

    // Hook up reset button
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
    const emailText = copyBtn.getAttribute('data-email') || '[EMAIL-ADDRESS]';
    
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
  const originalText = btn.innerHTML;
  btn.innerHTML = `<span>Copied to clipboard!</span>`;
  btn.classList.add('btn-primary');
  btn.classList.remove('btn-secondary');

  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-secondary');
  }, 2200);
}

function fallbackCopy(text, btn) {
  const tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  try {
    document.execCommand('copy');
    showCopyFeedback(btn);
  } catch (err) {
    console.error('Could not copy email', err);
  }
  document.body.removeChild(tempInput);
}
