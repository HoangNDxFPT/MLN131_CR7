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

  const TOTAL_SLIDES = 13;
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

  // ============================================
  // 11. CROSSWORD PUZZLE GAME (Slide 13)
  // ============================================

  const CROSSWORD_DATA = [
    { id: 1, answer: "PHANANH", keyPos: 0, offset: 5, clue: "Quyền của công dân khi gửi thông tin về các dấu hiệu vi phạm, tiêu cực đến cơ quan chức năng hoặc cổng dịch vụ công trực tuyến gọi là gì? (7 chữ cái)", extraHint: "Gợi ý: Khi gặp cán bộ gây khó dễ, người dân có quyền gọi lên đường dây nóng để [...] sai phạm? (Chữ cái đầu: P)" },
    { id: 2, answer: "HOILO", keyPos: 0, offset: 5, clue: "Hành vi đưa tiền hoặc lợi ích vật chất ngoài quy định để được giải quyết công việc nhanh chóng gọi là gì? (5 chữ cái)", extraHint: "Gợi ý: Hành động lén lút đưa tiền phong bì cho cán bộ để được ưu tiên làm nhanh gọi là hành vi đưa [...]? (Chữ cái đầu: H)" },
    { id: 3, answer: "ANTOAN", keyPos: 0, offset: 5, clue: "Yếu tố quan trọng mà Nhà nước cần bảo đảm cho người dân và người tố giác khi họ dũng cảm đứng ra vạch trần sai phạm tham nhũng? (6 chữ cái)", extraHint: "Gợi ý: Khi đứng ra tố cáo tham nhũng, điều người dân lo lắng nhất và cần cơ quan pháp luật bảo vệ chính là sự [...] về tính mạng, tài sản của bản thân? (Chữ cái đầu: A)" },
    { id: 4, answer: "PHONGCHONG", keyPos: 0, offset: 5, clue: "Cụm từ đi liền trước 'tham nhũng' để chỉ các biện pháp ngăn ngừa từ sớm và đấu tranh triệt tiêu sai phạm? (10 chữ cái)", extraHint: "Gợi ý: Hoạt động ngăn chặn từ trước và bài trừ tiêu cực trong bộ máy nhà nước được gọi là công tác [...] tham nhũng? (Chữ cái đầu: P)" },
    { id: 5, answer: "QUYENLUC", keyPos: 0, offset: 5, clue: "Tham nhũng phản ánh sự tha hóa của thứ gì khi không được giám sát và kiểm soát chặt chẽ? (8 chữ cái)", extraHint: "Gợi ý: Kẻ tham nhũng đã lạm dụng và tha hóa thứ [...] nhà nước giao phó vào mục đích tư lợi? (Chữ cái đầu: Q)" },
    { id: 6, answer: "CONGVU", keyPos: 5, offset: 0, clue: "Hoạt động thực thi chức trách, nhiệm vụ của cán bộ, công chức nhà nước nhằm phục vụ nhân dân được gọi chung là gì? (6 chữ cái)", extraHint: "Gợi ý: Quá trình cán bộ làm việc, tiếp dân và giải quyết hồ sơ giấy tờ tại trụ sở nhà nước được gọi là quá trình thực thi [...]? (Chữ cái đầu: C)" },
    { id: 7, answer: "YTHUC", keyPos: 0, offset: 5, clue: "Yếu tố tự giác bên trong của mỗi công dân về việc tuân thủ pháp luật và kiên quyết nói không với 'chi phí bôi trơn' gọi là gì? (5 chữ cái)", extraHint: "Gợi ý: Tinh thần tự giác, không đi đường tắt và không thỏa hiệp với cái sai phản ánh [...] chấp hành pháp luật của mỗi công dân? (Chữ cái đầu: Y)" },
    { id: 8, answer: "ONLINE", keyPos: 5, offset: 0, clue: "Hình thức nộp hồ sơ, giải quyết thủ tục trên môi trường mạng để hạn chế tiếp xúc trực tiếp bằng tiền mặt và giảm tiêu cực? (6 chữ cái)", extraHint: "Gợi ý: Để không phải đến tận nơi gặp trực tiếp cán bộ, người dân nên nộp hồ sơ qua mạng internet theo hình thức [...]? (Chữ cái đầu: O)" },
    { id: 9, answer: "NHUNGNHIEU", keyPos: 0, offset: 5, clue: "Hành vi cán bộ cố tình gây khó khăn, trì hoãn hoặc bắt bẻ lỗi sai không đáng có để ép người dân chi tiền được gọi là gì? (10 chữ cái)", extraHint: "Gợi ý: Tình trạng cán bộ cố ý vẽ thêm lỗi, gây phiền hà để ép dân chi tiền bôi trơn được gọi là tệ nạn [...]? (Chữ cái đầu: N)" }
  ];

  let selectedRowIndex = 0;
  let revealedRows = new Array(CROSSWORD_DATA.length).fill(false);

  const cwBoard = document.getElementById('cwBoard');
  const cwClueBadge = document.getElementById('cwClueBadge');
  const cwClueText = document.getElementById('cwClueText');
  const cwInput = document.getElementById('cwInput');
  const cwBtnCheck = document.getElementById('cwBtnCheck');
  const cwBtnReveal = document.getElementById('cwBtnReveal');
  const cwBtnHint = document.getElementById('cwBtnHint');
  const cwHintBox = document.getElementById('cwHintBox');
  const cwHintText = document.getElementById('cwHintText');
  const cwFeedback = document.getElementById('cwFeedback');
  const cwBtnKey = document.getElementById('cwBtnKey');
  const cwKeySolution = document.getElementById('cwKeySolution');
  const cwKeyDesc = document.getElementById('cwKeyDesc');

  function removeAccents(str) {
    return str.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D')
      .replace(/[^a-zA-Z]/g, '')
      .toUpperCase();
  }

  const TOTAL_GRID_COLS = 15;

  function renderCrosswordBoard() {
    if (!cwBoard) return;
    cwBoard.innerHTML = '';

    CROSSWORD_DATA.forEach((item, index) => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'cw-row' + (index === selectedRowIndex ? ' active' : '');
      rowDiv.dataset.index = index;

      const numDiv = document.createElement('div');
      numDiv.className = 'cw-num';
      numDiv.textContent = item.id;
      rowDiv.appendChild(numDiv);

      const cellsDiv = document.createElement('div');
      cellsDiv.className = 'cw-cells';

      // 1. Empty offset cells before word
      for (let i = 0; i < item.offset; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'cw-cell empty';
        cellsDiv.appendChild(emptyCell);
      }

      // 2. Letter cells
      for (let i = 0; i < item.answer.length; i++) {
        const cell = document.createElement('div');
        const isKeyCell = (i === item.keyPos);
        const isRevealed = revealedRows[index];

        cell.className = 'cw-cell' +
          (isKeyCell ? ' key' : '') +
          (isRevealed ? ' revealed' : '');

        cell.textContent = isRevealed ? item.answer[i] : '';
        cellsDiv.appendChild(cell);
      }

      // 3. Trailing empty cells to ensure all rows are exactly TOTAL_GRID_COLS (15) wide
      const cellsUsed = item.offset + item.answer.length;
      for (let i = cellsUsed; i < TOTAL_GRID_COLS; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'cw-cell empty';
        cellsDiv.appendChild(emptyCell);
      }

      rowDiv.appendChild(cellsDiv);

      rowDiv.addEventListener('click', () => {
        selectRow(index);
      });

      cwBoard.appendChild(rowDiv);
    });
  }

  function selectRow(index) {
    selectedRowIndex = index;
    const item = CROSSWORD_DATA[index];

    cwClueBadge.textContent = 'Hàng ngang số ' + item.id;
    cwClueText.textContent = item.clue;
    cwInput.value = '';
    cwFeedback.style.display = 'none';
    if (cwHintBox) cwHintBox.style.display = 'none';

    renderCrosswordBoard();
  }

  function toggleHint() {
    const item = CROSSWORD_DATA[selectedRowIndex];
    if (!cwHintBox || !cwHintText) return;

    if (cwHintBox.style.display === 'none' || cwHintBox.style.display === '') {
      cwHintText.textContent = item.extraHint;
      cwHintBox.style.display = 'block';
    } else {
      cwHintBox.style.display = 'none';
    }
  }

  function checkCurrentRowAnswer() {
    const item = CROSSWORD_DATA[selectedRowIndex];
    const userVal = removeAccents(cwInput.value.trim());
    const correctVal = removeAccents(item.answer);

    if (userVal === correctVal) {
      revealedRows[selectedRowIndex] = true;
      cwFeedback.textContent = '✓ Chính xác! Đáp án: ' + item.answer;
      cwFeedback.style.color = 'var(--emerald-600)';
      cwFeedback.style.display = 'block';
      if (cwHintBox) cwHintBox.style.display = 'none';
      renderCrosswordBoard();
    } else {
      cwFeedback.textContent = '✕ Chưa chính xác, hãy thử lại!';
      cwFeedback.style.color = 'var(--rose-500)';
      cwFeedback.style.display = 'block';
    }
  }

  function revealCurrentRowAnswer() {
    const item = CROSSWORD_DATA[selectedRowIndex];
    revealedRows[selectedRowIndex] = true;
    cwFeedback.textContent = 'Đáp án: ' + item.answer;
    cwFeedback.style.color = 'var(--teal-600)';
    cwFeedback.style.display = 'block';
    if (cwHintBox) cwHintBox.style.display = 'none';
    renderCrosswordBoard();
  }

  const cwBtnReset = document.getElementById('cwBtnReset');

  function revealVerticalKeyword() {
    revealedRows.fill(true);
    renderCrosswordBoard();

    if (cwKeySolution && cwKeyDesc) {
      cwKeySolution.classList.add('visible');
      cwKeyDesc.style.display = 'block';
    }
  }

  function resetCrosswordGame() {
    revealedRows.fill(false);
    renderCrosswordBoard();
    selectRow(0);

    if (cwKeySolution && cwKeyDesc) {
      cwKeySolution.classList.remove('visible');
      cwKeyDesc.style.display = 'none';
    }
  }

  if (cwBoard) {
    renderCrosswordBoard();
    selectRow(0);

    cwBtnCheck.addEventListener('click', checkCurrentRowAnswer);
    cwBtnReveal.addEventListener('click', revealCurrentRowAnswer);
    if (cwBtnHint) cwBtnHint.addEventListener('click', toggleHint);
    cwBtnKey.addEventListener('click', revealVerticalKeyword);
    if (cwBtnReset) {
      cwBtnReset.addEventListener('click', resetCrosswordGame);
    }

    cwInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        checkCurrentRowAnswer();
      }
    });
  }

  // ============================================
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
