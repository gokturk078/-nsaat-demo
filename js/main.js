/* ==========================================================================
   KARA İNŞAAT MÜHENDİSLİK - Main JavaScript
   Ultra-Premium Construction Website
   ========================================================================== */

(function() {
  'use strict';
  
  // ========================================================================
  // INITIALIZATION
  // ========================================================================
  
  document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initCounterAnimation();
    initParallax();
    initCurrentYear();
  });
  
  // ========================================================================
  // NAVIGATION
  // ========================================================================
  
  function initNavigation() {
    const nav = document.getElementById('mainNav');
    if (!nav) return;
    
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateNav() {
      const scrollY = window.scrollY;
      
      // Add scrolled class after 100px
      if (scrollY > 100) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      
      ticking = false;
    }
    
    window.addEventListener('scroll', function() {
      lastScrollY = window.scrollY;
      
      if (!ticking) {
        window.requestAnimationFrame(function() {
          updateNav();
        });
        ticking = true;
      }
    }, { passive: true });
    
    // Initial check
    updateNav();
  }
  
  // ========================================================================
  // MOBILE MENU
  // ========================================================================
  
  function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const overlay = document.getElementById('mobileMenu');
    const closeBtn = document.getElementById('mobileMenuClose');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (!toggle || !overlay) return;
    
    function openMenu() {
      toggle.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
      overlay.classList.add('active');
      document.body.classList.add('menu-open');
      
      // Focus trap
      const firstFocusable = overlay.querySelector('a, button');
      if (firstFocusable) firstFocusable.focus();
    }
    
    function closeMenu() {
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      overlay.classList.remove('active');
      document.body.classList.remove('menu-open');
      toggle.focus();
    }
    
    toggle.addEventListener('click', function() {
      if (overlay.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
    
    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }
    
    // Close on overlay click
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        closeMenu();
      }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        closeMenu();
      }
    });
    
    // Close menu when clicking a link
    mobileLinks.forEach(function(link) {
      link.addEventListener('click', closeMenu);
    });
  }
  
  // ========================================================================
  // SMOOTH SCROLL
  // ========================================================================
  
  function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if just "#"
        if (href === '#') return;
        
        const target = document.querySelector(href);
        
        if (target) {
          e.preventDefault();
          
          const navHeight = document.getElementById('mainNav')?.offsetHeight || 80;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL without jumping
          history.pushState(null, null, href);
        }
      });
    });
  }
  
  // ========================================================================
  // SCROLL-BASED ANIMATIONS (Intersection Observer)
  // ========================================================================
  
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    if (!animatedElements.length) return;
    
    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: show all elements
      animatedElements.forEach(function(el) {
        el.classList.add('aos-animate');
      });
      return;
    }
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          // Get delay from data attribute
          const delay = entry.target.dataset.aosDelay || 0;
          
          setTimeout(function() {
            entry.target.classList.add('aos-animate');
          }, parseInt(delay));
          
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    animatedElements.forEach(function(el) {
      observer.observe(el);
    });
  }
  
  // ========================================================================
  // COUNTER ANIMATION
  // ========================================================================
  
  function initCounterAnimation() {
    const counters = document.querySelectorAll('.indicator-number, .hero-stat-number');
    
    if (!counters.length) return;
    
    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: show final numbers
      counters.forEach(function(counter) {
        const target = parseInt(counter.dataset.target || counter.dataset.count || 0);
        counter.textContent = target;
      });
      return;
    }
    
    function animateCounter(element) {
      const target = parseInt(element.dataset.target || element.dataset.count || 0);
      const duration = 2000; // 2 seconds
      const startTime = performance.now();
      
      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * target);
        
        element.textContent = current;
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = target;
        }
      }
      
      requestAnimationFrame(updateCounter);
    }
    
    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          // Small delay for visual effect
          setTimeout(function() {
            animateCounter(entry.target);
          }, 100);
          
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    counters.forEach(function(counter) {
      observer.observe(counter);
    });
  }
  
  // ========================================================================
  // PARALLAX EFFECT
  // ========================================================================
  
  function initParallax() {
    const heroImage = document.getElementById('heroImage');
    const heroContent = document.querySelector('.hero-content');
    
    if (!heroImage) return;
    
    let ticking = false;
    
    function updateParallax() {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      
      // Only apply effect in hero section
      if (scrollY <= heroHeight) {
        // Parallax: image moves slower than scroll
        heroImage.style.transform = `translateY(${scrollY * 0.4}px)`;
        
        // Fade out hero content as user scrolls
        if (heroContent) {
          const opacity = Math.max(0, 1 - (scrollY / (heroHeight * 0.6)));
          heroContent.style.opacity = opacity;
        }
      }
      
      ticking = false;
    }
    
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          updateParallax();
        });
        ticking = true;
      }
    }, { passive: true });
  }
  
  // ========================================================================
  // DYNAMIC YEAR
  // ========================================================================
  
  function initCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }
  
  // ========================================================================
  // FORM VALIDATION (for contact page)
  // ========================================================================
  
  window.initFormValidation = function() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(function(form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const inputs = form.querySelectorAll('[required]');
        
        inputs.forEach(function(input) {
          const errorEl = input.parentElement.querySelector('.error-message');
          
          // Remove previous error state
          input.classList.remove('error');
          if (errorEl) errorEl.remove();
          
          // Validate
          if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
            
            const errorMsg = document.createElement('span');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Bu alan zorunludur';
            input.parentElement.appendChild(errorMsg);
          } else if (input.type === 'email' && !isValidEmail(input.value)) {
            isValid = false;
            input.classList.add('error');
            
            const errorMsg = document.createElement('span');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Geçerli bir e-posta adresi girin';
            input.parentElement.appendChild(errorMsg);
          }
        });
        
        if (isValid) {
          // Show success message
          const successMsg = document.createElement('div');
          successMsg.className = 'form-success';
          successMsg.innerHTML = '<strong>Teşekkürler!</strong> Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.';
          
          form.innerHTML = '';
          form.appendChild(successMsg);
        }
      });
    });
  };
  
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
})();
