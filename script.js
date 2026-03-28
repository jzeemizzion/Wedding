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
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const firstCard = container.querySelector('.detail-card');

  if (isMobile && firstCard) {
    const cardStyles = window.getComputedStyle(firstCard);
    const cardGap = parseFloat(cardStyles.marginRight) || 0;
    const cardDistance = firstCard.getBoundingClientRect().width + cardGap;

    // Slightly reduce step size on mobile so swipe/buttons feel less jumpy.
    container.scrollBy({
      left: Math.sign(distance) * (cardDistance * 0.85),
      behavior: 'smooth'
    });
    return;
  }

  container.scrollBy({
    left: distance,
    behavior: 'smooth'
  });
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

