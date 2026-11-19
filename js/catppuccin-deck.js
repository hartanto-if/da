/**
 * catppuccin-deck.js
 * Jaringan Komputer ITERA — Catppuccin Latte Design System
 * Integrates DeckChrome (header + progress + footer) with Reveal.js
 */
(function () {
  'use strict';

  /* ── Wait for Reveal to be ready ─────────────────────────── */
  function init() {
    if (typeof Reveal === 'undefined') {
      // Reveal not loaded yet — retry
      setTimeout(init, 100);
      return;
    }

    if (!Reveal.isReady()) {
      Reveal.addEventListener('ready', onReady);
    } else {
      onReady();
    }
  }

  function onReady() {
    document.body.classList.add('reveal-ready');
    updateProgress();
    updateFooterTopic();
    updateSlideCounter();

    Reveal.addEventListener('slidechanged', function () {
      updateProgress();
      updateFooterTopic();
      updateSlideCounter();
    });

    Reveal.addEventListener('fragmentshown', updateProgress);
    Reveal.addEventListener('fragmenthidden', updateProgress);
  }

  /* ── Progress bar ─────────────────────────────────────────── */
  function updateProgress() {
    var bar = document.getElementById('ctp-progress-bar');
    if (!bar) return;
    var indices = Reveal.getIndices();
    var progress = Reveal.getProgress();
    bar.style.width = (progress * 100) + '%';
  }

  /* ── Footer topic (slide title) ───────────────────────────── */
  function updateFooterTopic() {
    var el = document.getElementById('ctp-footer-topic');
    if (!el) return;

    var currentSlide = Reveal.getCurrentSlide();
    if (!currentSlide) return;

    // Try to get the slide title from heading or data-topic attribute
    var topic = '';
    var dataTopic = currentSlide.getAttribute('data-topic');
    if (dataTopic) {
      topic = dataTopic;
    } else {
      var heading = currentSlide.querySelector('h1, h2, h3');
      if (heading) {
        topic = heading.textContent.trim();
      } else {
        // Try parent section
        var parent = currentSlide.parentElement;
        if (parent && parent.tagName === 'SECTION') {
          var parentHeading = parent.querySelector('h1, h2, h3');
          if (parentHeading) topic = parentHeading.textContent.trim();
        }
      }
    }

    // Truncate if too long
    if (topic.length > 60) topic = topic.substring(0, 57) + '…';
    el.textContent = topic;
  }

  /* ── Slide counter ────────────────────────────────────────── */
  function updateSlideCounter() {
    var el = document.getElementById('ctp-slide-counter');
    if (!el) return;
    var indices = Reveal.getIndices();
    // Use 1-based current slide index and total horizontal slides
    var current = Reveal.getSlidePastCount() + 1;
    var total = Reveal.getTotalSlides();
    el.textContent = current + ' / ' + total;
  }

  /* ── Theme toggle (light / dark) ──────────────────────────── */
  window.ctpToggleTheme = function () {
    var body = document.body;
    var current = body.getAttribute('data-theme') || 'light';
    var next = current === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', next);
    // Also set on :root so tokens.css picks it up
    document.documentElement.setAttribute('data-theme', next);
    // Persist
    try { localStorage.setItem('ctp-theme', next); } catch(e) {}
    // Update toggle button icon
    var btn = document.querySelector('.theme-toggle');
    if (btn) btn.textContent = next === 'dark' ? '☀️' : '🌙';
  };

  /* ── Restore saved theme ──────────────────────────────────── */
  (function restoreTheme() {
    try {
      var saved = localStorage.getItem('ctp-theme');
      if (saved) {
        document.body.setAttribute('data-theme', saved);
        document.documentElement.setAttribute('data-theme', saved);
      }
    } catch(e) {}
  })();

  /* ── Keyboard shortcut: T to toggle theme ─────────────────── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 't' || e.key === 'T') {
      // Only when not in a text input
      if (document.activeElement.tagName !== 'INPUT' &&
          document.activeElement.tagName !== 'TEXTAREA') {
        window.ctpToggleTheme();
      }
    }
  });

  /* ── Bootstrap ───────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
