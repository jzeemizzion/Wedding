// Toggle Mobile Menu
function toggleMenu() {
  const nav = document.getElementById('navLinks');
  nav.classList.toggle('active');
}

// Horizontal Scroll Function
function scrollDetails(distance) {
  const container = document.getElementById('detailsContainer');
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

