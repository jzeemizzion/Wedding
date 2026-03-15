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

function adjustRsvpEmbedHeight() {
  const rsvpEmbed = document.getElementById('rsvpEmbed');
  if (!rsvpEmbed) {
    return;
  }

  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const baseHeight = isMobile ? Math.round(viewportHeight * 0.88) : Math.round(viewportHeight * 0.85);
  const minHeight = isMobile ? 760 : 720;
  const maxHeight = isMobile ? 1200 : 1100;
  const targetHeight = Math.max(minHeight, Math.min(maxHeight, baseHeight));

  rsvpEmbed.style.height = `${targetHeight}px`;
}

function handleRsvpEmbedMessage(event) {
  if (!event.origin.includes('google.com')) {
    return;
  }

  const rsvpEmbed = document.getElementById('rsvpEmbed');
  if (!rsvpEmbed) {
    return;
  }

  if (typeof event.data === 'object' && event.data !== null && typeof event.data.height === 'number') {
    const safeHeight = Math.max(700, Math.min(1600, Math.round(event.data.height)));
    rsvpEmbed.style.height = `${safeHeight}px`;
    return;
  }

  if (typeof event.data === 'string') {
    const numericMatch = event.data.match(/height\D*(\d{3,4})/i);
    if (numericMatch && numericMatch[1]) {
      const parsedHeight = Number(numericMatch[1]);
      if (!Number.isNaN(parsedHeight)) {
        const safeHeight = Math.max(700, Math.min(1600, parsedHeight));
        rsvpEmbed.style.height = `${safeHeight}px`;
      }
    }
  }
}

// Horizontal Scroll Function
function scrollDetails(distance) {
  const container = document.getElementById('detailsContainer');
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

// Flip Card Function - Mobile only (tap to flip), desktop uses hover popup
function flipCard(card) {
  // Check if mobile/touch device
  const isMobile = window.matchMedia('(max-width: 768px)').matches || 
                   'ontouchstart' in window || 
                   navigator.maxTouchPoints > 0;
  
  if (!isMobile) return; // Desktop: no flip, use hover popup
  
  const inner = card.querySelector('.card-inner');
  if (inner) {
    card.classList.toggle('flipped');
    
    // Prevent scroll interference on mobile
    const container = document.getElementById('detailsContainer');
    container.style.scrollSnapStop = 'always';
    setTimeout(() => {
      container.style.scrollSnapStop = '';
    }, 800);
  }
}

// Close mobile menu when clicking links (already in HTML onclick)

updateCountdown();
setInterval(updateCountdown, 1000);
adjustRsvpEmbedHeight();

window.addEventListener('resize', adjustRsvpEmbedHeight);
window.addEventListener('orientationchange', adjustRsvpEmbedHeight);
window.addEventListener('message', handleRsvpEmbedMessage);

