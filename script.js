document.addEventListener('DOMContentLoaded', () => {
  // Initialize GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);
  
  // Custom cursor
  const cursor = document.querySelector('.cursor');
  const cursorFollower = document.querySelector('.cursor-follower');
  
  document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.1
    });
    
    gsap.to(cursorFollower, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.3
    });
  });
  
  // Custom cursor effects on interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .project-card, .stat-card, input, textarea');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
      cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
      cursorFollower.style.backgroundColor = 'rgba(0, 201, 255, 0.1)';
      cursorFollower.style.border = 'none';
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorFollower.style.backgroundColor = 'transparent';
      cursorFollower.style.border = '1px solid var(--accent-color)';
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
