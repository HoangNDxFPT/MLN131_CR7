/* ============================================
   SCRIPT.JS — Navigation, Animation & Interactivity
   Teal & Emerald Theme + Crossword Game
   ============================================ */

(function () {
  'use strict';

  // ============================================
  // 1. INITIALIZATION
  // ============================================

  lucide.createIcons();

  const TOTAL_SLIDES = 12;
  let currentSlide = 1;
  let isScrolling = false;

  const slides = document.querySelectorAll('.slide');
  const navDotsContainer = document.getElementById('navDots');
  const slideCounter = document.getElementById('slideCounter');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');

  // ============================================
  // 2. NAVIGATION DOTS
  // ============================================

  function createNavDots() {
    for (let i = 1; i <= TOTAL_SLIDES; i++) {
      const dot = document.createElement('button');
      dot.className = 'nav-dot' + (i === 1 ? ' active' : '');
      dot.setAttribute('aria-label', 'Slide ' + i);
      dot.dataset.slide = i;
      dot.addEventListener('click', function () {
        goToSlide(i);
      });
      navDotsContainer.appendChild(dot);
    }
  }

  createNavDots();

  // ============================================
  // 3. SLIDE NAVIGATION
  // ============================================

  function goToSlide(slideNum) {
    if (slideNum < 1 || slideNum > TOTAL_SLIDES || isScrolling) return;

    currentSlide = slideNum;
    const target = document.getElementById('slide-' + slideNum);

    if (target) {
      isScrolling = true;
      target.scrollIntoView({ behavior: 'smooth' });
      setTimeout(function () { isScrolling = false; }, 800);
    }

    updateNavUI();
  }

  function goNext() {
    if (currentSlide < TOTAL_SLIDES) goToSlide(currentSlide + 1);
  }

  function goPrev() {
    if (currentSlide > 1) goToSlide(currentSlide - 1);
  }

  // ============================================
  // 4. UPDATE NAVIGATION UI
  // ============================================

  function updateNavUI() {
    slideCounter.textContent = currentSlide + ' / ' + TOTAL_SLIDES;

    navDotsContainer.querySelectorAll('.nav-dot').forEach(function (dot) {
      dot.classList.toggle('active', parseInt(dot.dataset.slide, 10) === currentSlide);
    });

    btnPrev.disabled = currentSlide === 1;
    btnNext.disabled = currentSlide === TOTAL_SLIDES;
  }

  // ============================================
  // 5. BUTTON LISTENERS
  // ============================================

  btnPrev.addEventListener('click', goPrev);
  btnNext.addEventListener('click', goNext);

  // ============================================
  // 6. KEYBOARD NAVIGATION
  // ============================================

  document.addEventListener('keydown', function (e) {
    // Disable slide arrow navigation if typing inside an input field
    if (document.activeElement && document.activeElement.tagName === 'INPUT') {
      return;
    }

    switch (e.key) {
      case 'ArrowDown': case 'ArrowRight': case 'PageDown': case ' ':
        e.preventDefault(); goNext(); break;
      case 'ArrowUp': case 'ArrowLeft': case 'PageUp':
        e.preventDefault(); goPrev(); break;
      case 'Home':
        e.preventDefault(); goToSlide(1); break;
      case 'End':
        e.preventDefault(); goToSlide(TOTAL_SLIDES); break;
    }
  });

  // ============================================
  // 7. SCROLL DETECTION (Intersection Observer)
  // ============================================

  var slideObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var num = parseInt(entry.target.dataset.slide, 10);
        if (num !== currentSlide) {
          currentSlide = num;
          updateNavUI();
        }
      }
    });
  }, { threshold: 0.55 });

  slides.forEach(function (slide) { slideObserver.observe(slide); });

  // ============================================
  // 8. SCROLL ANIMATIONS
  // ============================================

  var animElements = document.querySelectorAll('.anim');

  var animObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  animElements.forEach(function (el) { animObserver.observe(el); });

  // ============================================
  // 9. HERO ANIMATION ON LOAD
  // ============================================

  window.addEventListener('load', function () {
    setTimeout(function () {
      document.querySelectorAll('.hero-a').forEach(function (el) {
        el.classList.add('loaded');
      });
    }, 150);
  });

  // ============================================
  // 10. INTERACTIVE POLL (Slide 12)
  // ============================================

  var pollYes = document.getElementById('pollYes');
  var pollNo = document.getElementById('pollNo');
  var responseYes = document.getElementById('responseYes');
  var responseNo = document.getElementById('responseNo');

  if (pollYes && pollNo) {
    pollYes.addEventListener('click', function () {
      responseYes.classList.remove('visible');
      responseNo.classList.remove('visible');
      setTimeout(function () { responseYes.classList.add('visible'); }, 100);

      pollYes.style.borderColor = 'var(--emerald-500)';
      pollYes.style.background = 'var(--emerald-50)';
      pollYes.style.color = 'var(--emerald-600)';
      pollNo.style.borderColor = '';
      pollNo.style.background = '';
      pollNo.style.color = '';
    });

    pollNo.addEventListener('click', function () {
      responseYes.classList.remove('visible');
      responseNo.classList.remove('visible');
      setTimeout(function () { responseNo.classList.add('visible'); }, 100);

      pollNo.style.borderColor = 'var(--rose-500)';
      pollNo.style.background = 'var(--rose-50)';
      pollNo.style.color = 'var(--rose-600)';
      pollYes.style.borderColor = '';
      pollYes.style.background = '';
      pollYes.style.color = '';
    });
  }


  // 12. TOUCH SUPPORT
  // ============================================

  var touchStartY = 0;
  var SWIPE_THRESHOLD = 50;

  document.addEventListener('touchstart', function (e) {
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  document.addEventListener('touchend', function (e) {
    var diff = touchStartY - e.changedTouches[0].screenY;
    if (Math.abs(diff) < SWIPE_THRESHOLD) return;
    diff > 0 ? goNext() : goPrev();
  }, { passive: true });

})();
