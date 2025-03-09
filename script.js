document.addEventListener('DOMContentLoaded', () => {
  // Force scroll to top when page loads
  window.scrollTo(0, 0);
  setTimeout(() => {
    const scrollContainer = document.querySelector('.scroll-container');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }
  }, 50);
  
  // Kill all animations on project cards
  document.querySelectorAll('.project-card').forEach(card => {
    card.style.animation = 'none';
    card.style.transition = 'transform var(--transition-speed) ease, box-shadow var(--transition-speed) ease';
  });
  
  // Loader
  const loaderContainer = document.querySelector('.loader-container');
  
  // Hide loader after page loads
  window.addEventListener('load', () => {
    setTimeout(() => {
      loaderContainer.classList.add('hidden');
    }, 1500);
  });
  
  // Mobile menu
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });
    
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });
  }

  // Initialize GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);
  
  // Create cursor container for heart particles only (no dot)
  const cursorContainer = document.createElement('div');
  cursorContainer.className = 'cursor-container';
  document.body.appendChild(cursorContainer);
  
  // Create heart particle on click
  document.addEventListener('click', (e) => {
    for (let i = 0; i < 5; i++) {
      createHeartParticle(e.clientX, e.clientY);
    }
  });
  
  function createHeartParticle(x, y) {
    const heart = document.createElement('div');
    heart.className = 'heart-particle';
    heart.innerHTML = '♥';
    
    // Randomize properties
    const size = Math.random() * 20 + 10;
    const duration = Math.random() * 1.5 + 1;
    const xOffset = (Math.random() - 0.5) * 60;
    const yOffset = (Math.random() - 0.5) * 60;
    
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.fontSize = `${size}px`;
    
    // Add to DOM
    cursorContainer.appendChild(heart);
    
    // Animate and remove
    gsap.to(heart, {
      x: xOffset,
      y: yOffset - 100,
      opacity: 0,
      duration: duration,
      ease: "power2.out",
      onComplete: () => {
        heart.remove();
      }
    });
  }
  
  // Smooth scroll navigation
  const scrollContainer = document.querySelector('.scroll-container');
  const sections = document.querySelectorAll('.panel');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Get all section positions
  const sectionPositions = Array.from(sections).map(section => {
    return {
      id: section.id,
      top: section.offsetTop
    };
  });
  
  // Update navigation progress bar
  const navProgress = document.querySelector('.nav-progress');
  
  scrollContainer.addEventListener('scroll', () => {
    // Update progress bar
    const scrollPercentage = (scrollContainer.scrollTop / (scrollContainer.scrollHeight - scrollContainer.clientHeight)) * 100;
    navProgress.style.width = `${scrollPercentage}%`;
    
    // Update active nav link
    const currentPosition = scrollContainer.scrollTop;
    
    // Find the current section
    let currentSection = sectionPositions[0].id;
    
    sectionPositions.forEach(section => {
      if (currentPosition >= section.top - 100) {
        currentSection = section.id;
      }
    });
    
    // Update active nav link
    navLinks.forEach(link => {
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  });
  
  // Smooth scroll to sections
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      scrollContainer.scrollTo({
        top: targetSection.offsetTop,
        behavior: 'smooth'
      });
    });
  });
  
  // Smooth scroll for mobile nav links
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      scrollContainer.scrollTo({
        top: targetSection.offsetTop,
        behavior: 'smooth'
      });
    });
  });
  
  // Scroll indicator click
  const scrollIndicator = document.querySelector('.scroll-indicator');
  
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      scrollContainer.scrollTo({
        top: sections[1].offsetTop,
        behavior: 'smooth'
      });
    });
  }
  
  // Auto-scroll to section on mouse wheel
  let isScrolling = false;
  let currentSectionIndex = 0;
  
  scrollContainer.addEventListener('wheel', (e) => {
    e.preventDefault();
    
    if (isScrolling) return;
    
    isScrolling = true;
    
    if (e.deltaY > 0 && currentSectionIndex < sections.length - 1) {
      // Scroll down
      currentSectionIndex++;
    } else if (e.deltaY < 0 && currentSectionIndex > 0) {
      // Scroll up
      currentSectionIndex--;
    }
    
    scrollContainer.scrollTo({
      top: sections[currentSectionIndex].offsetTop,
      behavior: 'smooth'
    });
    
    setTimeout(() => {
      isScrolling = false;
    }, 1000);
  }, { passive: false });
  
  // Update current section index on manual scroll
  scrollContainer.addEventListener('scroll', () => {
    const currentPosition = scrollContainer.scrollTop;
    
    sections.forEach((section, index) => {
      if (Math.abs(section.offsetTop - currentPosition) < 100) {
        currentSectionIndex = index;
      }
    });
  });
  
  // Animate elements on scroll
  sections.forEach((section, index) => {
    const elements = section.querySelectorAll('.content-wrapper > *');
    
    gsap.from(elements, {
      y: 50,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        scroller: scrollContainer,
        start: "top center",
        end: "bottom center",
        toggleActions: "play none none reverse"
      }
    });
    
    // Animate stat counters when stats section is visible
    if (section.id === 'stats') {
      ScrollTrigger.create({
        trigger: section,
        scroller: scrollContainer,
        start: "top center",
        onEnter: () => {
          console.log("Stats section entered, animating counters");
          const statNumbers = document.querySelectorAll('.stat-number');
          statNumbers.forEach(stat => {
            const targetValue = parseInt(stat.getAttribute('data-count'));
            console.log(`Animating counter to: ${targetValue}`);
            animateCounter(stat, targetValue, 2000);
          });
        },
        onEnterBack: () => {
          console.log("Stats section entered (back), animating counters");
          const statNumbers = document.querySelectorAll('.stat-number');
          statNumbers.forEach(stat => {
            const targetValue = parseInt(stat.getAttribute('data-count'));
            animateCounter(stat, targetValue, 2000);
          });
        }
      });
    }
  });
  
  // Initialize glitch effect
  const glitchElement = document.querySelector('.glitch');
  if (glitchElement) {
    glitchElement.setAttribute('data-text', glitchElement.textContent);
  }
  
  // Audio visualizer animation (simulated)
  setInterval(() => {
    const visualizerBars = document.querySelectorAll('.audio-visualizer span');
    visualizerBars.forEach(bar => {
      const randomHeight = Math.floor(Math.random() * 70) + 10;
      bar.style.height = `${randomHeight}px`;
    });
  }, 100);
  
  // Digital Globe Effect
  function initDigitalGlobe() {
    console.log("Initializing digital globe...");
    const globeDotsContainer = document.querySelector('.globe-dots');
    const globeConnectionsContainer = document.querySelector('.globe-connections');
    
    if (!globeDotsContainer || !globeConnectionsContainer) {
      console.log("Globe containers not found, retrying in 500ms");
      setTimeout(initDigitalGlobe, 500);
      return;
    }
    
    // Clear any existing dots
    globeDotsContainer.innerHTML = '';
    globeConnectionsContainer.innerHTML = '';
    
    // Generate random dots on the globe
    const numDots = 60;
    const dots = [];
    const highlightDots = [];
    
    // Generate main highlight dot for Helsinki
    const helsinkiDot = createDotElement(60, 30, true, true);
    dots.push({ x: 60, y: 30, el: helsinkiDot });
    highlightDots.push({ x: 60, y: 30, el: helsinkiDot });
    globeDotsContainer.appendChild(helsinkiDot);
    
    // Generate other highlight dots for key music cities
    const musicCities = [
      { x: 45, y: 50 },  // London
      { x: 20, y: 40 },  // New York
      { x: 75, y: 60 },  // Tokyo
      { x: 50, y: 25 },  // Stockholm
      { x: 48, y: 45 }   // Berlin
    ];
    
    musicCities.forEach(city => {
      const dot = createDotElement(city.x, city.y, true);
      dots.push({ x: city.x, y: city.y, el: dot });
      highlightDots.push({ x: city.x, y: city.y, el: dot });
      globeDotsContainer.appendChild(dot);
    });
    
    // Generate regular dots
    for (let i = 0; i < numDots; i++) {
      // Generate dot within circle bounds
      let x, y, distFromCenter;
      do {
        x = Math.random() * 100;
        y = Math.random() * 100;
        const centerX = 50;
        const centerY = 50;
        distFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      } while (distFromCenter > 45); // Keep dots within radius
      
      const dot = createDotElement(x, y, false);
      dots.push({ x, y, el: dot });
      globeDotsContainer.appendChild(dot);
    }
    
    // Create connections between highlight dots
    highlightDots.forEach((dot1, i) => {
      highlightDots.forEach((dot2, j) => {
        if (i < j) { // Connect each pair only once
          createConnection(dot1, dot2, globeConnectionsContainer);
        }
      });
    });
    
    // Rotate the globe over time
    let angle = 0;
    const rotateGlobe = () => {
      // More pronounced 3D effect with dynamic wobble
      const time = Date.now() / 1000;
      const wobbleX = Math.sin(time * 0.5) * 10;
      const wobbleY = Math.cos(time * 0.3) * 5;
      
      const globe = document.querySelector('.digital-globe');
      if (globe) {
        globe.style.transform = `rotateY(${wobbleX}deg) rotateX(${wobbleY}deg)`;
      }
      
      requestAnimationFrame(rotateGlobe);
    };
    
    rotateGlobe();
    console.log("Digital globe initialized successfully");
  }
  
  function createDotElement(x, y, isHighlight, isHelsinki = false) {
    const dot = document.createElement('div');
    if (isHelsinki) {
      dot.className = 'globe-dot helsinki';
    } else {
      dot.className = isHighlight ? 'globe-dot highlight' : 'globe-dot';
    }
    dot.style.left = `${x}%`;
    dot.style.top = `${y}%`;
    
    if (isHighlight) {
      // Add pulse animation for highlight dots
      dot.style.animation = 'blink 2s infinite';
    }
    
    return dot;
  }
  
  function createConnection(dot1, dot2, container) {
    const connection = document.createElement('div');
    connection.className = 'globe-connection';
    
    // Calculate position and length
    const x1 = dot1.x;
    const y1 = dot1.y;
    const x2 = dot2.x;
    const y2 = dot2.y;
    
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    
    // Set connection style
    connection.style.width = `${length}%`;
    connection.style.left = `${x1}%`;
    connection.style.top = `${y1}%`;
    connection.style.transform = `rotate(${angle}deg)`;
    
    // Set random animation delay
    connection.style.animationDelay = `${Math.random() * 5}s`;
    
    container.appendChild(connection);
    return connection;
  }
  
  // Call the globe initialization
  setTimeout(initDigitalGlobe, 500);
  
  // Project cards modal functionality
  const initModalSystem = () => {
    console.log("Initializing modal system...");
    const projectCards = document.querySelectorAll('.project-card');
    const modalContainer = document.querySelector('.modal-container');
    const modalBackdrop = document.querySelector('.modal-backdrop');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const modalContents = document.querySelectorAll('.modal-content');
    
    if (!projectCards.length || !modalContainer || !modalBackdrop) {
      console.log("Modal elements not found, retrying in 500ms");
      setTimeout(initModalSystem, 500);
      return;
    }
    
    console.log(`Found ${projectCards.length} project cards and modal system elements`);
    
    // Open modal when clicking on project card
    projectCards.forEach(card => {
      card.addEventListener('click', () => {
        const projectType = card.getAttribute('data-project');
        const modal = document.getElementById(`${projectType}-modal`);
        
        console.log(`Card clicked: ${projectType}, Modal found: ${!!modal}`);
        
        if (modal) {
          modalContainer.classList.add('active');
          modal.classList.add('active');
          
          // If it's the music modal, try to reload the Spotify frame
          if (projectType === 'music') {
            const spotifyFrame = modal.querySelector('iframe');
            if (spotifyFrame) {
              const src = spotifyFrame.src;
              spotifyFrame.src = src;
            }
          }
          
          // Disable scroll on body
          document.body.style.overflow = 'hidden';
        }
      });
    });
    
    // Close modal function
    function closeModal() {
      modalContainer.classList.remove('active');
      modalContents.forEach(modal => {
        modal.classList.remove('active');
      });
      
      // Re-enable scroll on body
      document.body.style.overflow = '';
    }
    
    // Close modal when clicking close button
    closeModalButtons.forEach(button => {
      button.addEventListener('click', closeModal);
    });
    
    // Close modal when clicking backdrop
    modalBackdrop.addEventListener('click', closeModal);
    
    // Close modal when pressing Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    });
    
    console.log("Modal system initialized successfully");
  };
  
  // Call the modal initialization with a longer delay
  setTimeout(initModalSystem, 1000);
  
  function animateCounter(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16); // 60fps
    const formatter = new Intl.NumberFormat('en-US');
    
    function updateCounter() {
      start += increment;
      
      if (start >= target) {
        // Format large numbers with + for million+
        if (target >= 1000000) {
          element.textContent = (target / 1000000).toFixed(1) + 'M+';
        } else if (target >= 1000) {
          element.textContent = formatter.format(Math.floor(target));
        } else {
          element.textContent = formatter.format(target);
        }
        return;
      }
      
      // Format large numbers with + for million+
      if (target >= 1000000) {
        if (start >= 1000000) {
          element.textContent = (start / 1000000).toFixed(1) + 'M+';
        } else {
          element.textContent = formatter.format(Math.floor(start));
        }
      } else if (target >= 1000) {
        element.textContent = formatter.format(Math.floor(start));
      } else {
        element.textContent = Math.floor(start);
      }
      
      requestAnimationFrame(updateCounter);
    }
    
    updateCounter();
  }
  
  // Form input animation
  const formInputs = document.querySelectorAll('.form-input, .form-textarea');
  
  formInputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
      if (input.value.trim() === '') {
        input.parentElement.classList.remove('focused');
      }
    });
  });
  
  // Initialize scrolling to first section
  currentSectionIndex = 0;
});
