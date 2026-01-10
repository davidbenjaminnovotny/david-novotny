/**
 * Main JavaScript
 * Awwwards-winning portfolio interactions and animations
 * GSAP + Lenis + SplitType
 */

// ========================================
// CONFIGURATION
// ========================================

const CONFIG = {
  preloader: {
    duration: 2.5,
    minDisplayTime: 1500
  },
  cursor: {
    lerpFactor: 0.15,
    outlineLerpFactor: 0.08
  },
  magnetic: {
    strength: 0.3,
    radius: 100
  },
  scroll: {
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
  }
};

// ========================================
// INITIALIZATION
// ========================================

let lenis = null;
let prefersReducedMotion = false;

function init() {
  // Check for reduced motion preference
  prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Wait for all scripts to load
  if (typeof gsap === 'undefined' || typeof Lenis === 'undefined') {
    setTimeout(init, 50);
    return;
  }

  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  // Initialize components
  initLenis();
  initPreloader();
  initCursor();
  initHeroAnimations();
  initAboutAnimations();
  initHorizontalScroll();
  initCapabilitiesAnimations();
  initMagneticButtons();
  initParallaxShapes();

  // Listen for reduced motion changes
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    prefersReducedMotion = e.matches;
  });
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ========================================
// LENIS SMOOTH SCROLL
// ========================================

function initLenis() {
  if (prefersReducedMotion) {
    document.body.classList.remove('loading');
    return;
  }

  lenis = new Lenis({
    duration: CONFIG.scroll.duration,
    easing: CONFIG.scroll.easing,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2
  });

  // Integrate with GSAP ticker
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Update ScrollTrigger on Lenis scroll
  lenis.on('scroll', ScrollTrigger.update);
}

// ========================================
// PRELOADER
// ========================================

function initPreloader() {
  const preloader = document.querySelector('.preloader');
  const preloaderText = document.querySelector('.preloader__text span');
  const progressBar = document.querySelector('.preloader__progress-bar');

  if (!preloader) {
    document.body.classList.remove('loading');
    return;
  }

  if (prefersReducedMotion) {
    // Skip animation for reduced motion
    gsap.set(preloaderText, { y: 0 });
    gsap.set(progressBar, { width: '100%' });
    setTimeout(() => {
      preloader.classList.add('is-complete');
      document.body.classList.remove('loading');
      setTimeout(() => preloader.remove(), 500);
    }, 500);
    return;
  }

  const startTime = Date.now();

  // Animate text reveal
  gsap.to(preloaderText, {
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.2
  });

  // Simulate loading progress
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress > 100) progress = 100;

    gsap.to(progressBar, {
      width: `${progress}%`,
      duration: 0.1,
      ease: 'none'
    });

    if (progress >= 100) {
      clearInterval(progressInterval);

      // Ensure minimum display time
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, CONFIG.preloader.minDisplayTime - elapsed);

      setTimeout(() => {
        completePreloader(preloader);
      }, remaining);
    }
  }, 100);
}

function completePreloader(preloader) {
  // Animate out
  gsap.to(preloader, {
    y: '-100%',
    duration: 1,
    ease: 'power4.inOut',
    onComplete: () => {
      preloader.remove();
      document.body.classList.remove('loading');

      // Trigger hero animations after preloader
      animateHeroContent();
    }
  });
}

// ========================================
// CUSTOM CURSOR
// ========================================

function initCursor() {
  const cursor = document.querySelector('.cursor');
  if (!cursor || prefersReducedMotion) return;

  const dot = cursor.querySelector('.cursor__dot');
  const outline = cursor.querySelector('.cursor__outline');

  let mouseX = 0;
  let mouseY = 0;
  let dotX = 0;
  let dotY = 0;
  let outlineX = 0;
  let outlineY = 0;

  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Animate cursor position with lerp
  function animateCursor() {
    // Dot follows precisely
    dotX += (mouseX - dotX) * CONFIG.cursor.lerpFactor;
    dotY += (mouseY - dotY) * CONFIG.cursor.lerpFactor;

    // Outline follows with more delay
    outlineX += (mouseX - outlineX) * CONFIG.cursor.outlineLerpFactor;
    outlineY += (mouseY - outlineY) * CONFIG.cursor.outlineLerpFactor;

    dot.style.left = `${dotX}px`;
    dot.style.top = `${dotY}px`;
    outline.style.left = `${outlineX}px`;
    outline.style.top = `${outlineY}px`;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  // Hover states
  const hoverElements = document.querySelectorAll('a, button, [data-cursor="pointer"]');
  hoverElements.forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor--hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--hover'));
  });

  // Click states
  document.addEventListener('mousedown', () => cursor.classList.add('cursor--click'));
  document.addEventListener('mouseup', () => cursor.classList.remove('cursor--click'));

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
  });
}

// ========================================
// HERO ANIMATIONS
// ========================================

function initHeroAnimations() {
  // Split text for character animation
  const heroNames = document.querySelectorAll('[data-split="chars"]');

  if (typeof SplitType !== 'undefined') {
    heroNames.forEach((el) => {
      new SplitType(el, { types: 'chars' });
    });
  }
}

function animateHeroContent() {
  if (prefersReducedMotion) {
    // Show everything immediately
    gsap.set('.hero__name .char', { opacity: 1, y: 0 });
    gsap.set('.hero__subtitle', { opacity: 1 });
    gsap.set('.hero__tagline', { opacity: 1 });
    gsap.set('.hero__scroll', { opacity: 1 });
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  // Animate first name characters
  const firstNameChars = document.querySelectorAll('.hero__name--bold .char');
  if (firstNameChars.length) {
    tl.to(firstNameChars, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.03
    });
  }

  // Animate last name characters
  const lastNameChars = document.querySelectorAll('.hero__name--thin .char');
  if (lastNameChars.length) {
    tl.to(lastNameChars, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.03
    }, '-=0.5');
  }

  // Animate subtitle
  tl.to('.hero__subtitle', {
    opacity: 1,
    duration: 0.8
  }, '-=0.4');

  // Animate tagline
  tl.to('.hero__tagline', {
    opacity: 1,
    duration: 0.8
  }, '-=0.6');

  // Animate scroll indicator
  tl.to('.hero__scroll', {
    opacity: 1,
    duration: 0.8
  }, '-=0.4');

  // Animate scroll line
  tl.fromTo('.hero__scroll-line', {
    scaleY: 0
  }, {
    scaleY: 1,
    duration: 1,
    ease: 'power2.out'
  }, '-=0.6');
}

// ========================================
// ABOUT SECTION ANIMATIONS
// ========================================

function initAboutAnimations() {
  if (prefersReducedMotion) return;

  // Split text into lines
  const aboutTexts = document.querySelectorAll('.about__text[data-split="lines"]');

  if (typeof SplitType !== 'undefined') {
    aboutTexts.forEach((el) => {
      const split = new SplitType(el, { types: 'lines' });

      // Wrap lines for animation
      split.lines.forEach((line) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'line';
        line.parentNode.insertBefore(wrapper, line);
        wrapper.appendChild(line);
        line.classList.add('line-inner');
      });
    });
  }

  // Animate lines on scroll
  const lines = document.querySelectorAll('.about__text .line-inner');

  gsap.to(lines, {
    y: 0,
    duration: 0.8,
    stagger: 0.05,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.about',
      start: 'top 70%',
      toggleActions: 'play none none none'
    }
  });

  // Animate about image
  gsap.from('.about__image', {
    scale: 0.9,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.about__image',
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  });
}

// ========================================
// HORIZONTAL SCROLL SECTION
// ========================================

function initHorizontalScroll() {
  const horizontalSection = document.querySelector('[data-horizontal-scroll]');
  if (!horizontalSection) return;

  // Only enable horizontal scroll on desktop
  if (window.innerWidth < 768) return;

  if (prefersReducedMotion) return;

  const track = horizontalSection.querySelector('.work__track');
  if (!track) return;

  // Calculate scroll distance
  const getScrollDistance = () => {
    return track.scrollWidth - horizontalSection.offsetWidth;
  };

  // Create horizontal scroll animation
  gsap.to(track, {
    x: () => -getScrollDistance(),
    ease: 'none',
    scrollTrigger: {
      trigger: '.work',
      start: 'top top',
      end: () => `+=${getScrollDistance()}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      anticipatePin: 1
    }
  });

  // Refresh on resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  });
}

// ========================================
// CAPABILITIES ANIMATIONS
// ========================================

function initCapabilitiesAnimations() {
  const capabilities = document.querySelectorAll('.capability');

  if (prefersReducedMotion) {
    capabilities.forEach((cap) => {
      cap.style.opacity = '1';
      cap.style.transform = 'none';
    });
    return;
  }

  capabilities.forEach((cap, index) => {
    gsap.to(cap, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: index * 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: cap,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });
}

// ========================================
// MAGNETIC BUTTONS
// ========================================

function initMagneticButtons() {
  if (prefersReducedMotion) return;

  const magneticElements = document.querySelectorAll('.magnetic');

  magneticElements.forEach((el) => {
    const child = el.querySelector('a, button');
    if (!child) return;

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance < CONFIG.magnetic.radius) {
        const force = (1 - distance / CONFIG.magnetic.radius) * CONFIG.magnetic.strength;
        gsap.to(child, {
          x: deltaX * force,
          y: deltaY * force,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(child, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)'
      });
    });
  });
}

// ========================================
// PARALLAX SHAPES
// ========================================

function initParallaxShapes() {
  if (prefersReducedMotion) return;

  const shapes = document.querySelectorAll('.hero__shape');

  shapes.forEach((shape, index) => {
    const speed = (index + 1) * 0.1;

    gsap.to(shape, {
      y: () => window.innerHeight * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  });
}

// ========================================
// REVEAL ANIMATIONS
// ========================================

function initRevealAnimations() {
  if (prefersReducedMotion) return;

  const revealElements = document.querySelectorAll('.reveal');

  revealElements.forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => el.classList.add('is-visible'),
      once: true
    });
  });
}

// ========================================
// UTILITIES
// ========================================

/**
 * Debounce function
 */
function debounce(func, wait = 100) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Lerp (Linear Interpolation)
 */
function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

/**
 * Clamp value between min and max
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Map value from one range to another
 */
function mapRange(value, inMin, inMax, outMin, outMax) {
  return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin));
}

// ========================================
// EXPORTS
// ========================================

export { lenis, debounce, lerp, clamp, mapRange };
