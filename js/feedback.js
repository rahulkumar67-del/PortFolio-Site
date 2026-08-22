/* =========================================
   feedback.js — local-storage feedback panel
   ========================================= */
(function () {
  'use strict';

  const STORAGE_KEY = 'rk_portfolio_feedback_v1';

  const elList = document.getElementById('feedback-list');
  const elEmpty = document.getElementById('feedback-empty');
  const elAvg = document.getElementById('avg-rating');
  const elAvgStars = document.getElementById('avg-stars');
  const elCount = document.getElementById('rating-count');
  const btnOpen = document.getElementById('open-feedback-btn');
  const wrap = document.getElementById('feedback-form-wrap');
  const inputName = document.getElementById('fb-name');
  const inputRole = document.getElementById('fb-role');
  const inputMsg = document.getElementById('fb-message');
  const starInput = document.getElementById('star-input');
  const btnSubmit = document.getElementById('fb-submit');
  const btnCancel = document.getElementById('fb-cancel');
  const formMsg = document.getElementById('fb-form-msg');

  if (!elList) return;

  function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch (e) { return []; }
  }
  function save(arr) { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); }

  function stars(n) {
    const full = '★'.repeat(Math.round(n));
    const empty = '☆'.repeat(5 - Math.round(n));
    return full + empty;
  }

  function fmtDate(ts) {
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }

  function render() {
    const arr = load();
    elList.innerHTML = '';
    if (!arr.length) {
      elEmpty.style.display = 'block';
      elAvg.textContent = '0.0';
      elAvgStars.textContent = '';
      elCount.textContent = '0 reviews';
      return;
    }
    elEmpty.style.display = 'none';
    const avg = arr.reduce((s, f) => s + (f.rating || 0), 0) / arr.length;
    elAvg.textContent = avg.toFixed(1);
    elAvgStars.textContent = stars(avg);
    elCount.textContent = arr.length + (arr.length === 1 ? ' review' : ' reviews');

    arr.slice().reverse().forEach((f) => {
      const card = document.createElement('div');
      card.className = 'feedback-card';
      card.innerHTML = `
        <div class="meta">
          <div class="left">
            <span>${escapeHtml(f.name)}</span>
            ${f.role ? `<span class="role">${escapeHtml(f.role)}</span>` : ''}
            <span class="star-display">${stars(f.rating)}</span>
          </div>
          <div class="date">${fmtDate(f.ts)}</div>
        </div>
        <div class="comment">${escapeHtml(f.message)}</div>
      `;
      elList.appendChild(card);
    });
  }

  /* ---------- star input ---------- */
  let rating = 5;
  if (starInput) {
    starInput.querySelectorAll('.star').forEach((s) => {
      s.addEventListener('click', () => {
        rating = Number(s.dataset.value);
        starInput.dataset.rating = String(rating);
        starInput.querySelectorAll('.star').forEach((x) => {
          x.classList.toggle('active', Number(x.dataset.value) <= rating);
          x.textContent = Number(x.dataset.value) <= rating ? '★' : '☆';
        });
      });
    });
    // init all 5 stars
    starInput.querySelectorAll('.star').forEach((x) => { x.classList.add('active'); x.textContent = '★'; });
  }

  /* ---------- open / close ---------- */
  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      wrap.classList.remove('hidden');
      wrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
      inputName.focus();
    });
  }
  if (btnCancel) {
    btnCancel.addEventListener('click', () => {
      wrap.classList.add('hidden');
      formMsg.textContent = '';
    });
  }

  /* ---------- submit ---------- */
  if (btnSubmit) {
    btnSubmit.addEventListener('click', () => {
      const name = (inputName.value || '').trim();
      const role = (inputRole.value || '').trim();
      const message = (inputMsg.value || '').trim();
      if (!name || !message) {
        formMsg.style.color = '#f87171';
        formMsg.textContent = 'Name and message are required.';
        return;
      }
      const arr = load();
      arr.push({ name, role, message, rating, ts: Date.now() });
      save(arr);
      inputName.value = '';
      inputRole.value = '';
      inputMsg.value = '';
      formMsg.style.color = 'var(--success)';
      formMsg.textContent = 'Thanks — your feedback has been added!';
      setTimeout(() => { formMsg.textContent = ''; wrap.classList.add('hidden'); }, 1600);
      render();
    });
  }

  render();
})();
