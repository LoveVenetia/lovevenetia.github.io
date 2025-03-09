document.addEventListener('DOMContentLoaded', () => {
  // Initialize GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);
  
  // Remove old cursor elements
  const oldCursor = document.querySelector('.cursor');
  const oldCursorFollower = document.querySelector('.cursor-follower');
  if (oldCursor) oldCursor.remove();
  if (oldCursorFollower) oldCursorFollower.remove();
  
  // Create heat trail cursor effect
  const cursorContainer = document.createElement('div');
  cursorContainer.className = 'cursor-container';
  document.body.appendChild(cursorContainer);
  
  // Create cursor dot
  const cursor = document.createElement('div');
  cursor.className = 'cursor-dot';
  document.body.appendChild(cursor);
  
  // Track mouse position
  let mouseX = 0;
  let mouseY = 0;
  
  // Particles array
  const particles = [];
  
  // Tracking previous positions for smoother trail
  const previousPositions = [];
  const maxPrevPositions = 5;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Update cursor dot position
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
    
    // Store previous positions for trail effect
    previousPositions.unshift({ x: mouseX, y: mouseY });
    if (previousPositions.length > maxPrevPositions) {
      previousPositions.pop();
    }
    
    // Create heat particle at an interval
    if (Math.random() < 0.3) {
      createHeatParticle();
    }
  });
  
  // Create heat particle
  function createHeatParticle() {
    // Use a previous position for smoother trail
    const index = Math.floor(Math.random() * Math.min(previousPositions.length, 3));
    const position = previousPositions[index] || { x: mouseX, y: mouseY };
    
    const particle = document.createElement('div');
    particle.className = 'heat-particle';
    
    // Randomize particle properties
    const size = Math.random() * 15 + 5;
    const duration = Math.random() * 1 + 0.5;
    const xOffset = (Math.random() - 0.5) * 20;
    const yOffset = (Math.random() - 0.5) * 20;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${position.x + xOffset}px`;
    particle.style.top = `${position.y + yOffset}px`;
    
    // Add to DOM
    cursorContainer.appendChild(particle);
    
    // Animate and remove
    gsap.to(particle, {
      opacity: 0,
      scale: 0,
      duration: duration,
      onComplete: () => {
        particle.remove();
      }
    });
  }
  
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
  
  // Custom cursor effects on interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .project-card, .stat-card, input, textarea');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
    });
  });
  
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
  
  // Scroll indicator click
  const scrollIndicator = document.querySelector('.scroll-indicator');
  
  scrollIndicator.addEventListener('click', () => {
    scrollContainer.scrollTo({
      top: sections[1].offsetTop,
      behavior: 'smooth'
    });
  });
  
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
  
  // Animate stats counters
  const statNumbers = document.querySelectorAll('.stat-number');
  
  function animateCounter(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16); // 60fps
    
    function updateCounter() {
      start += increment;
      
      if (start >= target) {
        element.textContent = target.toLocaleString();
        return;
      }
      
      element.textContent = Math.floor(start).toLocaleString();
      requestAnimationFrame(updateCounter);
    }
    
    updateCounter();
  }
  
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
          statNumbers.forEach(stat => {
            const targetValue = parseInt(stat.getAttribute('data-count'));
            animateCounter(stat, targetValue, 2000);
          });
        },
        onEnterBack: () => {
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
  glitchElement.setAttribute('data-text', glitchElement.textContent);
  
  // Audio visualizer animation (simulated)
  setInterval(() => {
    const visualizerBars = document.querySelectorAll('.audio-visualizer span');
    visualizerBars.forEach(bar => {
      const randomHeight = Math.floor(Math.random() * 70) + 10;
      bar.style.height = `${randomHeight}px`;
    });
  }, 100);
  
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
