/* Ryan Beasley portfolio — tiny vanilla-JS lightbox. No dependencies. */
(function () {
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  var buttons = Array.prototype.slice.call(document.querySelectorAll('.piece-btn'));
  var lb = document.getElementById('lightbox');
  if (!lb || !buttons.length) return;
  var img = lb.querySelector('.lb-img');
  var titleEl = lb.querySelector('.lb-title');
  var mediumEl = lb.querySelector('.lb-medium');
  var closeBtn = lb.querySelector('.lb-close');
  var prevBtn = lb.querySelector('.lb-prev');
  var nextBtn = lb.querySelector('.lb-next');
  var current = 0, lastFocus = null;

  var webp = (function () {
    try { return document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0; }
    catch (e) { return false; }
  })();

  function show(i) {
    current = (i + buttons.length) % buttons.length;
    var b = buttons[current];
    var thumb = b.querySelector('img');
    img.src = webp ? b.dataset.full : (b.dataset.fullJpg || b.dataset.full);
    img.alt = thumb ? thumb.alt : '';
    titleEl.textContent = b.dataset.title || '';
    var m = b.dataset.medium || '';
    if (b.dataset.year) m += (m ? ', ' : '') + b.dataset.year;
    mediumEl.textContent = m;
  }
  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    lb.hidden = false;
    document.body.classList.add('lb-open');
    closeBtn.focus();
  }
  function close() {
    lb.hidden = true;
    document.body.classList.remove('lb-open');
    img.src = '';
    if (lastFocus) lastFocus.focus();
  }

  buttons.forEach(function (b, i) { b.addEventListener('click', function () { open(i); }); });
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', function () { show(current - 1); });
  nextBtn.addEventListener('click', function () { show(current + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-figure')) close(); });

  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
    else if (e.key === 'Tab') { // keep focus inside the dialog
      var f = [closeBtn, prevBtn, nextBtn];
      var idx = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(idx + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });

  // Basic swipe support on touch screens
  var x0 = null;
  lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    x0 = null;
  });
})();
