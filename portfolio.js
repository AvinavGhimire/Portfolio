// ========== STEP 1: ANIMATED SKILL PROGRESS BARS ==========
document.addEventListener("DOMContentLoaded", () => {
  const progressBars = document.querySelectorAll('.progress');
  let hasAnimated = false;

  function animateBars() {
    if (hasAnimated) return;
    progressBars.forEach(bar => {
      const value = bar.getAttribute('data-progress');
      bar.style.width = value + '%';
    });
    hasAnimated = true;
  }

  function checkVisibility() {
    const skills = document.querySelector('#skills');
    if (!skills) return;
    
    const position = skills.getBoundingClientRect();

    if (position.top < window.innerHeight && position.bottom >= 0) {
      animateBars();
      window.removeEventListener('scroll', checkVisibility);
    }
  }

  // Trigger on load if already visible
  checkVisibility();
  window.addEventListener('scroll', checkVisibility);

  // ========== STEP 2: CONTACT FORM HANDLING ==========
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const message = document.getElementById('message')?.value.trim();

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name) {
        alert('Please enter your name.');
        return;
      }

      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      if (!message) {
        alert('Please enter a message.');
        return;
      }

      // Store data in localStorage
      localStorage.setItem('contactData', JSON.stringify({ name, email, message }));
      alert('Form submitted successfully! Redirecting...');
      window.location.href = 'form-details.html';
    });
  }

  // ========== STEP 3: OPEN PORTFOLIO PROJECTS ==========
  document.querySelectorAll('.project-card').forEach(projectCard => {
    projectCard.style.cursor = 'pointer';
    projectCard.addEventListener('click', function () {
      const url = this.getAttribute('data-url');
      if (url) {
        window.open(url, '_blank');
      }
    });
  });

  // ========== STEP 4: CANVAS DRAWING ==========
  const existingCanvas = document.getElementById('drawingCanvas');
  let canvas = existingCanvas;
  
  if (!canvas) {
    // Create canvas if it doesn't exist
    const newCanvas = document.createElement('canvas');
    newCanvas.id = 'drawingCanvas';
    newCanvas.width = 800;
    newCanvas.height = 500;
    const section = document.createElement('section');
    section.className = 'canvas-section';
    section.innerHTML = '<h2>Canvas Drawing</h2>';
    
    // Create simple toolbar
    const toolbar = document.createElement('div');
    toolbar.className = 'canvas-toolbar';
    toolbar.innerHTML = `
      <div class="toolbar-item">
        <label for="colorPicker">Color:</label>
        <input type="color" id="colorPicker" value="#f093fb">
      </div>
      <button id="clearCanvasBtn" class="canvas-btn clear-btn">Clear</button>
    `;
    
    section.appendChild(toolbar);
    section.appendChild(newCanvas);
    document.querySelector('main').appendChild(section);
    canvas = newCanvas;
  }

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let currentColor = '#f093fb';
    
    // Draw initial gradient background
    function drawBackground() {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    drawBackground();
    
    // Color picker
    const colorPicker = document.getElementById('colorPicker');
    if (colorPicker) {
      colorPicker.addEventListener('change', (e) => {
        currentColor = e.target.value;
      });
      colorPicker.addEventListener('input', (e) => {
        currentColor = e.target.value;
      });
    }
    
    // Clear button
    const clearBtn = document.getElementById('clearCanvasBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();
      });
    }
    
    // Mouse events
    canvas.addEventListener('mousedown', (e) => {
      isDrawing = true;
      const rect = canvas.getBoundingClientRect();
      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;
    });
    
    canvas.addEventListener('mousemove', (e) => {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
      
      lastX = x;
      lastY = y;
    });
    
    canvas.addEventListener('mouseup', () => {
      isDrawing = false;
    });
    
    canvas.addEventListener('mouseleave', () => {
      isDrawing = false;
    });
    
    // Touch support for mobile
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      isDrawing = true;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      lastX = touch.clientX - rect.left;
      lastY = touch.clientY - rect.top;
    });
    
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
      
      lastX = x;
      lastY = y;
    });
    
    canvas.addEventListener('touchend', () => {
      isDrawing = false;
    });
  }

  // ========== STEP 5: IMAGE SLIDER ==========
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      if (i === index) {
        slide.style.display = 'block';
        slide.classList.add('active');
      } else {
        slide.style.display = 'none';
      }
    });
  }

  if (slides.length > 0) {
    showSlide(currentSlide);

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
      });
    }

    // Optional: Auto-advance slides every 5 seconds
    setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }, 5000);
  }

  // ========== STEP 6: DARK/LIGHT MODE TOGGLE ==========
  const themeToggleButton = document.getElementById('themeToggle');

  function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    updateThemeIcon(isDarkMode);
  }

  function updateThemeIcon(isDark) {
    const icon = document.querySelector('.theme-icon');
    if (icon) {
      icon.textContent = isDark ? '🌙' : '☀️';
    }
  }

  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', toggleTheme);

    // Load saved theme on page load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      updateThemeIcon(true);
    } else {
      updateThemeIcon(false);
    }
  }

  // ========== STEP 7: BACK-TO-TOP BUTTON ==========
  const backToTopButton = document.getElementById('backToTop');

  if (backToTopButton) {
    backToTopButton.innerHTML = '↑';

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add('show');
      } else {
        backToTopButton.classList.remove('show');
      }
    });

    backToTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

