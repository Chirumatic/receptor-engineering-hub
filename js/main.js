/* ===== HERO SLIDESHOW ===== */
const slides = document.querySelectorAll('.hero-slide');
if (slides.length) {
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 4000);
}

/* ===== WHY US & PAGE HERO SLIDESHOW ===== */
function initSlideshow(selector) {
  const items = document.querySelectorAll(selector);
  if (items.length > 1) {
    let current = 0;
    setInterval(() => {
      items[current].classList.remove('active');
      current = (current + 1) % items.length;
      items[current].classList.add('active');
    }, 4500);
  }
}
initSlideshow('.why-slide');
initSlideshow('.page-hero-slide');

/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

/* ===== HAMBURGER MENU ===== */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

/* ===== AOS (Animate On Scroll) ===== */
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.aosDelay || 0);
        setTimeout(() => entry.target.classList.add('aos-animate'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  elements.forEach(el => observer.observe(el));
}
document.addEventListener('DOMContentLoaded', initAOS);

/* ===== PORTFOLIO FILTER ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card, .gallery-item');
if (filterBtns.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      portfolioCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ===== COUNTER ANIMATION ===== */
function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current);
  }, 16);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-count]').forEach(animateCounter);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-grid');
if (statsSection) statObserver.observe(statsSection);

/* ===== CONTACT FORM VALIDATION ===== */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    // Reset errors
    ['name', 'email', 'message'].forEach(id => {
      document.getElementById(id).classList.remove('error');
      document.getElementById(id + 'Error').textContent = '';
    });

    if (!name.value.trim()) {
      name.classList.add('error');
      document.getElementById('nameError').textContent = 'Please enter your name.';
      valid = false;
    }
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.classList.add('error');
      document.getElementById('emailError').textContent = 'Please enter a valid email address.';
      valid = false;
    }
    if (!message.value.trim()) {
      message.classList.add('error');
      document.getElementById('messageError').textContent = 'Please enter your message.';
      valid = false;
    }

    if (valid) {
      const submitText = document.getElementById('submitText');
      const submitLoading = document.getElementById('submitLoading');
      const formSuccess = document.getElementById('formSuccess');
      submitText.style.display = 'none';
      submitLoading.style.display = 'inline-flex';

      const data = new FormData(contactForm);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        const result = await response.json();

        if (result.success) {
          formSuccess.style.display = 'flex';
          contactForm.reset();
          setTimeout(() => { formSuccess.style.display = 'none'; }, 6000);
        } else {
          alert('Error: ' + (result.message || 'Submission failed. Please try again.'));
        }
      } catch (err) {
        alert('Network error. Please check your connection and try again.');
      } finally {
        submitText.style.display = 'inline-flex';
        submitLoading.style.display = 'none';
      }
    }
  });
}

/* ===== SMOOTH SCROLL FOR ANCHOR LINKS ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

/* ===== GALLERY LIGHTBOX ===== */
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
let currentIndex = 0;
let visibleItems = [];

if (galleryItems.length && lightbox) {
  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => {
      visibleItems = [...document.querySelectorAll('.gallery-item:not(.hidden)')];
      currentIndex = visibleItems.indexOf(item);
      openLightbox(visibleItems[currentIndex]);
    });
  });

  function openLightbox(item) {
    lightboxImg.src = item.querySelector('img').src;
    lightboxCaption.textContent = item.querySelector('.gallery-caption p').textContent;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  });

  lightboxPrev.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    openLightbox(visibleItems[currentIndex]);
  });

  lightboxNext.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % visibleItems.length;
    openLightbox(visibleItems[currentIndex]);
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}
