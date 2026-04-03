// Toggle Mobile Menu
function toggleMenu() {
  const nav = document.getElementById('navLinks');
  nav.classList.toggle('active');
}

function updateCountdown() {
  const weddingDate = new Date('2026-11-04T16:00:00');
  const now = new Date();
  const remaining = weddingDate - now;
  const daysElement = document.getElementById('countdownDays');
  const hoursElement = document.getElementById('countdownHours');
  const minutesElement = document.getElementById('countdownMinutes');
  const secondsElement = document.getElementById('countdownSeconds');

  if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
    return;
  }

  if (remaining <= 0) {
    daysElement.textContent = '000';
    hoursElement.textContent = '00';
    minutesElement.textContent = '00';
    secondsElement.textContent = '00';
    return;
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  daysElement.textContent = String(days).padStart(3, '0');
  hoursElement.textContent = String(hours).padStart(2, '0');
  minutesElement.textContent = String(minutes).padStart(2, '0');
  secondsElement.textContent = String(seconds).padStart(2, '0');
}

// Horizontal Scroll Function
function scrollDetails(distance) {
  const container = document.getElementById('detailsContainer');
  if (!container) return;

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const firstCard = container.querySelector('.detail-card');

  if (isMobile && firstCard) {
    const cardStyles = window.getComputedStyle(firstCard);
    const cardGap = parseFloat(cardStyles.marginRight) || 0;
    const cardDistance = firstCard.getBoundingClientRect().width + cardGap;

    container.scrollBy({
      left: Math.sign(distance) * cardDistance,
      behavior: 'smooth'
    });
    return;
  }

  container.scrollBy({
    left: distance,
    behavior: 'smooth'
  });
}

function initDetailsArrows() {
  const container = document.getElementById('detailsContainer');
  const leftArrow = document.getElementById('detailsScrollLeft');
  const rightArrow = document.getElementById('detailsScrollRight');

  if (!container || !leftArrow || !rightArrow) {
    return;
  }

  const updateArrowState = () => {
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    const scrollLeft = container.scrollLeft;
    const edgeBuffer = 4;

    leftArrow.disabled = scrollLeft <= edgeBuffer;
    rightArrow.disabled = scrollLeft >= maxScrollLeft - edgeBuffer;
  };

  const onScroll = () => {
    window.requestAnimationFrame(updateArrowState);
  };

  container.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateArrowState);
  updateArrowState();
}

function canRunEntryAnimations() {
  const reducedMotionQuery = typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

  if (reducedMotionQuery && reducedMotionQuery.matches) {
    return false;
  }

  if (!window.CSS || typeof window.CSS.supports !== 'function') {
    return false;
  }

  return window.CSS.supports('animation-name', 'heroTitleReveal')
    && window.CSS.supports('transform', 'translateY(10px)');
}

function initHeroAnimations() {
  if (!canRunEntryAnimations()) {
    return;
  }

  document.documentElement.classList.add('can-animate');
}

function initScrollReveal() {
  const revealItems = Array.from(document.querySelectorAll('.reveal-on-scroll'));
  if (!revealItems.length) return;

  const reducedMotionQuery = typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;
  const prefersReducedMotion = Boolean(reducedMotionQuery && reducedMotionQuery.matches);

  const revealElement = (element) => {
    if (element.classList.contains('is-visible')) {
      return true;
    }

    const revealDelay = parseFloat(element.dataset.revealDelay || '0');
    if (Number.isFinite(revealDelay) && revealDelay > 0) {
      element.style.transitionDelay = `${revealDelay}s`;
    }

    element.classList.add('is-visible');
    return true;
  };

  if (prefersReducedMotion) {
    revealItems.forEach(revealElement);
    return;
  }

  document.documentElement.classList.add('reveal-ready');

  let remainingItems = revealItems.slice();
  let observer = null;

  const revealVisibleItems = () => {
    remainingItems = remainingItems.filter((item) => {
      const rect = item.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const isVisible = rect.top <= viewportHeight * 0.92 && rect.bottom >= viewportHeight * 0.08;

      if (!isVisible) {
        return true;
      }

      revealElement(item);
      if (observer) {
        observer.unobserve(item);
      }
      return false;
    });

    if (!remainingItems.length) {
      window.removeEventListener('scroll', revealVisibleItems);
      window.removeEventListener('resize', revealVisibleItems);
    }
  };

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        revealElement(entry.target);
        obs.unobserve(entry.target);
        remainingItems = remainingItems.filter((item) => item !== entry.target);
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -8% 0px'
    });

    remainingItems.forEach((item) => observer.observe(item));
  }

  window.addEventListener('scroll', revealVisibleItems, { passive: true });
  window.addEventListener('resize', revealVisibleItems);
  revealVisibleItems();
}

// Card Toggle Function - Mobile tap to transition between front and back
function flipCard(card) {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (!isMobile) return;

  const inner = card.querySelector('.card-inner');
  if (inner) {
    card.classList.toggle('flipped');
    
    // Prevent scroll interference while card transitions
    const container = document.getElementById('detailsContainer');
    container.style.scrollSnapStop = 'always';
    setTimeout(() => {
      container.style.scrollSnapStop = '';
    }, 450);
  }
}

// Close mobile menu when clicking links (already in HTML onclick)

updateCountdown();
setInterval(updateCountdown, 1000);
initDetailsArrows();
initHeroAnimations();
initScrollReveal();

