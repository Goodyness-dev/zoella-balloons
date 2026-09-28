// Zoella Balloons - Client Platform Application Script
// Features: GSAP ScrollTrigger Animations, Booking Message Formatter, Maps Venue Lookup, Photo Lightbox

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Year in Footer
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // 2. GSAP Animations Suite (Progressive Enhancement)
  initGsapAnimations();

  // 3. Google Maps Venue Search
  initMapSearch();

  // 4. Booking Enquiry Flow
  initBookingForm();

  // 5. Portfolio Category Filter
  initPortfolioFilters();

  // 6. Lightbox Photo Viewer
  initPhotoDialog();
});

/* ==========================================================================
   GSAP ANIMATIONS SUITE
   ========================================================================== */
function initGsapAnimations() {
  if (typeof gsap === 'undefined') return;

  // Register ScrollTrigger if available
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Animation 1: Hero Text & Element Reveal
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });
  if (document.querySelector('.hero-copy')) {
    heroTl.from('.hero-copy .pulse-badge', { opacity: 0, y: -20, duration: 0.6 })
          .from('.hero-copy h1', { opacity: 0, y: 30, duration: 0.8 }, '-=0.3')
          .from('.hero-copy .intro', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
          .from('.hero-copy .hero-actions', { opacity: 0, y: 15, duration: 0.5 }, '-=0.3')
          .from('.hero-copy .hero-note', { opacity: 0, duration: 0.6 }, '-=0.2')
          .from('.hero-image', { opacity: 0, scale: 0.95, duration: 1 }, '-=0.8')
          .from('.image-caption', { opacity: 0, rotation: 0, y: 15, duration: 0.6 }, '-=0.4');
  }

  // Animation 2: Parallax Hero Image Shift
  if (document.querySelector('.hero-image img') && typeof ScrollTrigger !== 'undefined') {
    gsap.to('.hero-image img', {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    });
  }

  // Animation 3: KPI Counter Number Roll-Up
  const counterElements = document.querySelectorAll('.stat-number[data-target]');
  if (counterElements.length > 0 && typeof ScrollTrigger !== 'undefined') {
    counterElements.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      const isDecimal = target % 1 !== 0;

      ScrollTrigger.create({
        trigger: counter,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: () => {
              counter.textContent = prefix + (isDecimal ? obj.val.toFixed(1) : Math.floor(obj.val)) + suffix;
            }
          });
        }
      });
    });
  }

  // Animation 4: Service Cards & Step Cards Staggered Fade-In
  const animatedCards = document.querySelectorAll('.service-card, .step-card, .gallery-card, .portfolio-card');
  if (animatedCards.length > 0 && typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.batch(animatedCards, {
      start: 'top 88%',
      once: true,
      onEnter: batch => gsap.from(batch, {
        opacity: 0,
        y: 35,
        stagger: 0.15,
        duration: 0.7,
        ease: 'power2.out'
      })
    });
  }

  // Animation 5: Section Heading Architectural Draw-In Line
  const sectionLines = document.querySelectorAll('.section-line');
  if (sectionLines.length > 0 && typeof ScrollTrigger !== 'undefined') {
    sectionLines.forEach(line => {
      ScrollTrigger.create({
        trigger: line,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          line.style.width = '100%';
        }
      });
    });
  }

  // Animation 6: Magnetic Nav Link / Primary Button Effect
  const magneticButtons = document.querySelectorAll('.button:not(.light), .nav-cta');
  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.18, y: y * 0.18, duration: 0.3, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

/* ==========================================================================
   GOOGLE MAPS VENUE SEARCH
   ========================================================================== */
function initMapSearch() {
  const mapSearch = document.querySelector('#map-search');
  if (!mapSearch) return;

  mapSearch.addEventListener('submit', event => {
    event.preventDefault();
    const input = document.querySelector('#map-query');
    const query = input.value.trim();
    if (!query) {
      input.setCustomValidity('Enter a venue, address or Houston neighborhood.');
      input.reportValidity();
      return;
    }
    const encoded = encodeURIComponent(query);
    const mapFrame = document.querySelector('#location-map');
    const mapsLink = document.querySelector('#maps-link');
    const statusText = document.querySelector('#map-status');

    if (mapFrame) {
      mapFrame.src = 'https://maps.google.com/maps?q=' + encoded + '&z=14&output=embed';
    }
    if (mapsLink) {
      mapsLink.href = 'https://www.google.com/maps/search/?api=1&query=' + encoded;
    }
    if (statusText) {
      statusText.textContent = `Showing venue lookup: "${query}". Zoella provides on-site installation across Greater Houston.`;
    }
  });

  const queryInput = document.querySelector('#map-query');
  if (queryInput) {
    queryInput.addEventListener('input', e => e.target.setCustomValidity(''));
  }

  const venueInput = document.querySelector('input[name="location"]');
  const findVenueLink = document.querySelector('#find-booking-venue');
  if (venueInput && findVenueLink) {
    venueInput.addEventListener('input', () => {
      findVenueLink.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(venueInput.value.trim() || 'Houston, Texas');
    });
  }
}

/* ==========================================================================
   BOOKING ENQUIRY & INSTAGRAM GENERATOR
   ========================================================================== */
function initBookingForm() {
  const form = document.querySelector('#booking-form');
  if (!form) return;

  const dateInput = form.elements.date;
  const today = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  if (dateInput) {
    dateInput.min = today();
    dateInput.addEventListener('input', () => dateInput.setCustomValidity(''));
  }

  const reviewPanel = document.querySelector('#enquiry-review');
  const messageArea = document.querySelector('#message');
  const copyStatus = document.querySelector('#copy-status');
  const copyBtn = document.querySelector('#copy-message');
  const editBtn = document.querySelector('#edit-enquiry');

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (dateInput && dateInput.value < today()) {
      dateInput.setCustomValidity('Please select today or a future celebration date.');
      dateInput.reportValidity();
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    if (!data.name || !data.name.trim() || !data.location || !data.location.trim()) {
      const invalid = !data.name.trim() ? form.elements.name : form.elements.location;
      invalid.setCustomValidity('This field is required.');
      invalid.reportValidity();
      return;
    }

    const eventDate = data.date ? new Date(data.date + 'T12:00:00').toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }) : 'Flexible';

    const formattedMessage =
`Hi Zoella Balloons! 🎈✨
I would love to enquire about booking a custom balloon installation for my celebration in Houston.

📋 EVENT DETAILS:
• Host Name: ${data.name.trim()}
${data.handle && data.handle.trim() ? '• Instagram: ' + data.handle.trim() + '\n' : ''}• Occasion: ${data.occasion || 'Celebration'}
• Preferred Date: ${eventDate}
• Venue / Area: ${data.location.trim()}
• Service Desired: ${data.service || 'Bespoke Balloons & Backdrop'}
• Estimated Budget: ${data.budget || 'Exploring options'}
${data.guests ? '• Estimated Guests: ' + data.guests + '\n' : ''}${data.vision && data.vision.trim() ? '\n💭 OUR VISION & COLOR THEME:\n' + data.vision.trim() + '\n' : ''}
Could you please let me know your availability for this date and the next steps for a custom quote? Thank you so much!`;

    if (messageArea) {
      messageArea.value = formattedMessage;
    }
    form.hidden = true;
    if (reviewPanel) {
      reviewPanel.hidden = false;
      reviewPanel.focus();
      reviewPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (copyStatus) {
      copyStatus.textContent = '';
    }
  });

  if (editBtn) {
    editBtn.addEventListener('click', () => {
      if (reviewPanel) reviewPanel.hidden = true;
      form.hidden = false;
      form.elements.name.focus();
    });
  }

  if (copyBtn && messageArea) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(messageArea.value);
        if (copyStatus) {
          copyStatus.textContent = '✓ Copied to clipboard! Now open Instagram and send a direct message to @zoellaballoons.';
          copyStatus.style.color = '#10b981';
          copyStatus.style.fontWeight = '600';
        }
      } catch {
        messageArea.focus();
        messageArea.select();
        if (copyStatus) {
          copyStatus.textContent = 'Select and copy the text above, then paste into Instagram DM.';
        }
      }
    });
  }
}

/* ==========================================================================
   PORTFOLIO CATEGORY FILTERS
   ========================================================================== */
function initPortfolioFilters() {
  const filters = document.querySelectorAll('[data-filter]');
  const cards = document.querySelectorAll('.portfolio-card');
  const countDisplay = document.querySelector('#gallery-count');
  if (filters.length === 0 || cards.length === 0) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      const selected = btn.dataset.filter;
      let visibleCount = 0;

      cards.forEach(card => {
        const matches = selected === 'All' || card.dataset.category === selected;
        card.hidden = !matches;
        if (matches) visibleCount++;
      });

      filters.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      if (countDisplay) {
        countDisplay.textContent = `${visibleCount} celebration installations shown`;
      }
    });
  });
}

/* ==========================================================================
   LIGHTBOX DIALOG VIEWER
   ========================================================================== */
function initPhotoDialog() {
  const dialog = document.querySelector('#photo-dialog');
  if (!dialog) return;

  const fullImg = document.querySelector('#full-photo');
  const caption = document.querySelector('#photo-caption');
  const closeBtn = document.querySelector('.photo-close');

  document.querySelectorAll('.photo-open').forEach(btn => {
    btn.addEventListener('click', () => {
      if (fullImg) {
        fullImg.src = btn.dataset.photo;
        const thumb = btn.querySelector('img');
        fullImg.alt = thumb ? thumb.alt : 'Zoella Balloons Installation';
      }
      if (caption) {
        caption.textContent = btn.dataset.caption || '';
      }
      dialog.showModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => dialog.close());
  }

  dialog.addEventListener('click', e => {
    if (e.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
        dialog.close();
      }
    }
  });
}
