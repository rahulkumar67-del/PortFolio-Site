// project.js (fixed structure)
// 1) loadProject() only handles project.html details
// 2) service modal + feedback + toggle/debug live outside loadProject so they run on index.html

async function loadProject() {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get("id");
  if (!projectId) {
    // If no project id — do nothing (don't overwrite .container on other pages)
    console.log('[loadProject] no project id, skipping project load.');
    return;
  }

  try {
    const res = await fetch("./data/projects.json");
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const projects = await res.json();

    if (!projects[projectId]) {
      document.querySelector(".container").innerHTML = `
        <a href="index.html#portfolio" class="back-btn"><i class="fa-solid fa-arrow-left"></i> Back to Portfolio</a>
        <h2>Invalid Project ID</h2>
      `;
      return;
    }

    const project = projects[projectId];

    // Header
    const headerEl = document.getElementById("project-header");
    const bodyEl = document.getElementById("project-body");
    const footerEl = document.getElementById("project-footer");

    if (!headerEl || !bodyEl || !footerEl) {
      console.warn('[loadProject] project elements not found — are you on project.html?');
      return;
    }

    headerEl.innerHTML = `
      <h1>${project.title}</h1>
      <div class="project-tags">
        ${Array.isArray(project.tech) ? project.tech.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
      </div>
      <div class="project-meta">
        <i class="fa-solid fa-desktop"></i> Platform: ${project.platform || '—'} &nbsp; | &nbsp;
        <i class="fa-solid fa-calendar"></i> Year: ${project.year || '—'}
      </div>
    `;

    // Video / Body
    let videoHTML = "";
    if (project.video && project.video.includes("drive.google.com")) {
      videoHTML = `<div class="video-container"><iframe src="${project.video}" width="100%" height="480" allow="autoplay; fullscreen" allowfullscreen></iframe></div>`;
    } else if (project.video) {
      videoHTML = `<div class="video-container"><video controls poster="${project.thumbnail || ''}"><source src="${project.video}" type="video/mp4">Your browser does not support the video tag.</video></div>`;
    }

    bodyEl.innerHTML = `
      <h2>Project Description</h2>
      <p>${project.description || ''}</p>
      ${videoHTML}
      <a href="${project.download || '#'}" class="download-btn" ${project.download ? 'download' : ''}>
        <i class="fa-solid fa-download"></i> ${project.download ? 'Download Project' : 'Download (not available)'}
      </a>
    `;

    // Footer
    footerEl.innerHTML = `
      <h3>Project Details</h3>
      <ul>
        <li><i class="fa-solid fa-circle-info"></i> Platform: ${project.platform || '—'}</li>
        <li><i class="fa-solid fa-circle-info"></i> Year: ${project.year || '—'}</li>
        <li><i class="fa-solid fa-circle-info"></i> GitHub: ${project.github ? `<a href="${project.github}" target="_blank">${project.github}</a>` : '—'}</li>
      </ul>
    `;
  } catch (err) {
    console.error("Error loading project:", err);
    document.querySelector(".container").innerHTML = `
      <a href="index.html#portfolio" class="back-btn"><i class="fa-solid fa-arrow-left"></i> Back to Portfolio</a>
      <h2>⚠️ Error loading project. See console.</h2>
    `;
  }
}

// Call loadProject only if URL has id or pathname ends with project.html
(function callLoadProjectIfNeeded() {
  const params = new URLSearchParams(window.location.search);
  const hasId = params.has('id');
  const path = window.location.pathname || '';
  const isProjectPage = path.toLowerCase().endsWith('project.html');
  if (hasId || isProjectPage) {
    loadProject();
  } else {
    console.log('[project.js] Not on project page — loadProject skipped.');
  }
})();


/* ----------------- Service modal module (kept global) ----------------- */
(function () {
  // map service ids to content
  const serviceDetails = {
    game: {
      title: "Game Development",
      desc: "Full-cycle Unity game development — prototype → core gameplay → polish. I build controllers, AI, weapons, UI and optimization for PC/VR.",
      points: [
        "Custom player controller & input system",
        "Enemy AI and combat mechanics",
        "UI, menus and HUD integration",
        "Performance optimisation & build pipeline"
      ],
      meta: "Starting at: ₹12,000 • Delivery: 2–4 weeks"
    },
    vr: {
      title: "VR Development",
      desc: "VR apps and controllers with tracked input and smooth locomotion. Headset-ready builds, comfort optimisations and testing.",
      points: [
        "Oculus / OpenXR setup & input mapping",
        "Comfort-first locomotion (teleport/smooth/adaptive)",
        "Camera streaming & rendering optimization",
        "Multiplayer/Networking (optional add-on)"
      ],
      meta: "Starting at: ₹18,000 • Delivery: 3–6 weeks"
    },
    blender: {
      title: "Blender 3D Modelling",
      desc: "High-quality 3D assets, models and textures for integration into games or for portfolio renders.",
      points: [
        "Low/High poly modelling & UV unwrapping",
        "PBR texturing and bake maps",
        "Rigging & simple animations (if needed)",
        "Export setup for Unity/Unreal"
      ],
      meta: "Per asset: ₹2,000+ • Delivery: 3–7 days"
    }
  };

  // elements
  const overlay = document.getElementById('service-modal-overlay');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalPoints = document.getElementById('modal-points');
  const modalMeta = document.getElementById('modal-meta');
  const modalClose = document.getElementById('modal-close');

  // open modal with data-service key
  function openModal(serviceKey) {
    const data = serviceDetails[serviceKey];
    if (!data) return;
    if (!overlay) return;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    modalPoints.innerHTML = data.points.map(p => `<li>${escapeHtml(p)}</li>`).join('');
    modalMeta.textContent = data.meta;
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    setTimeout(()=> modalClose && modalClose.focus(), 50);
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!overlay) return;
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // click handling (delegation)
  document.addEventListener('click', function (e) {
    const t = e.target;
    const lm = t.closest && t.closest('.learn-more');
    if (lm) {
      e.preventDefault();
      const key = lm.dataset.service;
      openModal(key);
      return;
    }
    if (t === overlay) {
      closeModal();
    }
  });

  // close button
  modalClose && modalClose.addEventListener('click', closeModal);

  // escape key closes
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('show')) closeModal();
  });

  function escapeHtml(s) {
    return String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
})();


/* ----------------- Feedback client script (global) ----------------- */
(function () {
  const FEEDBACK_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxRZVdNg3fy9lgXnl77X4rmlw-Uh9my_XIfCf8Kv5YP0A0xhQxqBZpYwKL6f9cS4Vy3/exec";

  document.addEventListener('DOMContentLoaded', () => {
    // elements
    const openBtn = document.getElementById('open-feedback-btn');
    const formWrap = document.getElementById('feedback-form-wrap');
    const fbCancel = document.getElementById('fb-cancel');
    const fbSubmit = document.getElementById('fb-submit');
    const fbName = document.getElementById('fb-name');
    const fbRole = document.getElementById('fb-role');
    const fbMessage = document.getElementById('fb-message');
    const fbFormMsg = document.getElementById('fb-form-msg');
    const feedbackList = document.getElementById('feedback-list');
    const feedbackEmpty = document.getElementById('feedback-empty');
    const avgRatingEl = document.getElementById('avg-rating');
    const avgStarsEl = document.getElementById('avg-stars');
    const ratingCountEl = document.getElementById('rating-count');
    const starInput = document.getElementById('star-input');

    // If page doesn't contain feedback UI, stop gracefully
    if (!openBtn || !feedbackList) {
      console.log('[feedback] feedback UI not present on this page — skipping feedback init');
      return;
    }

    // ensure formWrap exists (if not, create fallback)
    if (!formWrap) {
      console.warn('[feedback] feedback-form-wrap missing — appending fallback');
      const fallback = document.createElement('div');
      fallback.id = 'feedback-form-wrap';
      fallback.className = 'feedback-form-wrap hidden';
      fallback.innerHTML = `
        <h2 style="margin-bottom:10px;color:#fff">Leave Feedback</h2>
        <input id="fb-name" type="text" placeholder="Your name (required)" />
        <input id="fb-role" type="text" placeholder="Your role / company (optional)" />
        <div class="rating-input"><label style="color:#fff;margin-right:8px;">Your rating:</label>
          <div id="star-input" class="star-input" data-rating="5">
            <span data-value="1" class="star">☆</span><span data-value="2" class="star">☆</span>
            <span data-value="3" class="star">☆</span><span data-value="4" class="star">☆</span>
            <span data-value="5" class="star">☆</span>
          </div>
        </div>
        <textarea id="fb-message" rows="5" placeholder="Write your feedback (required)"></textarea>
        <div style="display:flex;gap:10px;align-items:center;margin-top:8px;">
          <button id="fb-submit" class="btn btn2">Submit</button>
          <button id="fb-cancel" class="btn" style="background:transparent;border-color:#666">Cancel</button>
          <div id="fb-form-msg" style="margin-left:12px;color:#61b752"></div>
        </div>
      `;
      const panel = document.getElementById('feedback-panel') || document.body;
      panel.appendChild(fallback);
    }

    // re-query required elements (since fallback may have been created)
    const _formWrap = document.getElementById('feedback-form-wrap');
    const _fbSubmit = document.getElementById('fb-submit');
    const _fbCancel = document.getElementById('fb-cancel');
    const _fbName = document.getElementById('fb-name');
    const _fbRole = document.getElementById('fb-role');
    const _fbMessage = document.getElementById('fb-message');
    const _starInput = document.getElementById('star-input');

    function setStarInput(n) {
      const stars = (_starInput && _starInput.querySelectorAll('.star')) || [];
      stars.forEach(s => {
        const v = Number(s.dataset.value);
        s.classList.toggle('active', v <= n);
        s.textContent = v <= n ? '★' : '☆';
      });
      if (_starInput) _starInput.dataset.rating = n;
    }

    if (_starInput) setStarInput(5);
    if (_starInput) _starInput.addEventListener('click', (e) => {
      if (!e.target.classList.contains('star')) return;
      setStarInput(Number(e.target.dataset.value));
    });

    // toggle form behavior
    openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!_formWrap) return;
      _formWrap.classList.toggle('hidden');
      const nameInput = document.getElementById('fb-name');
      if (!_formWrap.classList.contains('hidden') && nameInput) nameInput.focus();
    });

    if (_fbCancel) _fbCancel.addEventListener('click', (e) => {
      e.preventDefault();
      if (_formWrap) _formWrap.classList.add('hidden');
    });

    function starsHtml(n) {
      n = Math.max(0, Math.min(5, Math.round(n || 0)));
      let s = '';
      for (let i = 1; i <= 5; i++) s += (i <= n ? '★' : '☆');
      return `<span class="star-display">${s}</span>`;
    }

    function renderFeedbackRows(rows) {
      feedbackList.innerHTML = '';
      if (!rows || rows.length === 0) {
        feedbackEmpty.style.display = 'block';
        avgRatingEl.innerText = '0.0';
        avgStarsEl.innerHTML = '';
        ratingCountEl.innerText = '0 reviews';
        return;
      }
      feedbackEmpty.style.display = 'none';
      let sum = 0, cnt = 0;
      rows.forEach(r => { const rating = Number(r[3] || 0); if (!isNaN(rating) && rating > 0) { sum += rating; cnt++; }});
      const avg = cnt ? (sum / cnt) : 0;
      avgRatingEl.innerText = (avg ? avg.toFixed(1) : '0.0');
      avgStarsEl.innerHTML = starsHtml(Math.round(avg));
      ratingCountEl.innerText = `${rows.length} review${rows.length>1 ? 's' : ''}`;

      rows.slice().reverse().forEach(r => {
        const time = r[0] ? new Date(r[0]).toLocaleString() : '';
        const name = r[1] || 'Anonymous';
        const role = r[2] ? ` • ${r[2]}` : '';
        const rating = Number(r[3] || 0);
        const message = r[4] || '';

        const card = document.createElement('div');
        card.className = 'feedback-card';
        card.innerHTML = `
          <div class="meta">
            <div class="left">${escapeHtml(name)}<span class="role">${escapeHtml(role)}</span> <span class="star-display">${starsHtml(rating)}</span></div>
            <div class="date">${escapeHtml(time)}</div>
          </div>
          <div class="comment">${escapeHtml(message)}</div>
        `;
        feedbackList.appendChild(card);
      });
    }

    function escapeHtml(s) {
      if (!s) return '';
      return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
    }

    async function fetchFeedbacks() {
      try {
        const url = FEEDBACK_WEBAPP_URL + '?action=getFeedbacks';
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch');
        const rows = await res.json();
        renderFeedbackRows(rows);
      } catch (err) {
        console.error('fetchFeedbacks error', err);
        if (feedbackEmpty) feedbackEmpty.textContent = "Couldn't load feedbacks.";
      }
    }

    async function postFeedback(name, role, rating, message) {
      const payload = { action: 'saveFeedback', name, role, rating, message };
      const res = await fetch(FEEDBACK_WEBAPP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to save');
      return res.json();
    }

    if (_fbSubmit) {
      _fbSubmit.addEventListener('click', async (ev) => {
        ev.preventDefault();
        const name = (_fbName && _fbName.value || 'Anonymous').trim();
        const role = (_fbRole && _fbRole.value || '').trim();
        const message = (_fbMessage && _fbMessage.value || '').trim();
        const rating = Number((_starInput && _starInput.dataset.rating) || 5);

        const formMsgEl = document.getElementById('fb-form-msg');
        if (!message) {
          if (formMsgEl) { formMsgEl.style.color = '#f66'; formMsgEl.innerText = 'Please enter feedback message.'; }
          return;
        }
        if (formMsgEl) { formMsgEl.style.color = '#61b752'; formMsgEl.innerText = 'Sending...'; }
        _fbSubmit.disabled = true;

        try {
          const result = await postFeedback(name, role, rating, message);
          if (result && result.status === 'ok') {
            if (formMsgEl) { formMsgEl.style.color = '#61b752'; formMsgEl.innerText = 'Thanks — feedback submitted!'; }
            if (_fbName) _fbName.value = '';
            if (_fbRole) _fbRole.value = '';
            if (_fbMessage) _fbMessage.value = '';
            if (_starInput) setStarInput(5);
            await fetchFeedbacks();
            setTimeout(()=> { if (_formWrap) _formWrap.classList.add('hidden'); }, 1000);
          } else {
            throw new Error(result && result.message ? result.message : 'Unknown');
          }
        } catch (err) {
          console.error('Submit error', err);
          if (formMsgEl) { formMsgEl.style.color = '#f55'; formMsgEl.innerText = 'Could not send feedback. Try again later.'; }
        } finally {
          _fbSubmit.disabled = false;
          setTimeout(()=> { const f = document.getElementById('fb-form-msg'); if (f) f.innerText = ''; }, 4000);
        }
      });
    }

    // initial load
    fetchFeedbacks();
  });
})();

/* ----------------- Reliable feedback toggle & debug helper (global) ----------------- */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('open-feedback-btn');
    let formEl = document.getElementById('feedback-form-wrap');

    console.log('[feedback-debug] init toggle script');

    if (!openBtn) {
      console.error('[feedback-debug] open-feedback-btn NOT found');
      return;
    } else {
      console.log('[feedback-debug] open-feedback-btn found');
    }

    if (!formEl) {
      console.warn('[feedback-debug] feedback-form-wrap NOT found — creating fallback form inline');

      const fallback = document.createElement('div');
      fallback.id = 'feedback-form-wrap';
      fallback.className = 'feedback-form-wrap hidden';
      fallback.innerHTML = `
        <h2 style="margin-bottom:10px;color:#fff">Leave Feedback</h2>
        <input id="fb-name" type="text" placeholder="Your name (required)" />
        <input id="fb-role" type="text" placeholder="Your role / company (optional)" />
        <div class="rating-input"><label style="color:#fff;margin-right:8px;">Your rating:</label>
          <div id="star-input" class="star-input" data-rating="5">
            <span data-value="1" class="star">☆</span><span data-value="2" class="star">☆</span>
            <span data-value="3" class="star">☆</span><span data-value="4" class="star">☆</span>
            <span data-value="5" class="star">☆</span>
          </div>
        </div>
        <textarea id="fb-message" rows="5" placeholder="Write your feedback (required)"></textarea>
        <div style="display:flex;gap:10px;align-items:center;margin-top:8px;">
          <button id="fb-submit" class="btn btn2">Submit</button>
          <button id="fb-cancel" class="btn" style="background:transparent;border-color:#666">Cancel</button>
          <div id="fb-form-msg" style="margin-left:12px;color:#61b752"></div>
        </div>
      `;
      const panel = document.getElementById('feedback-panel') || document.body;
      panel.appendChild(fallback);
      console.log('[feedback-debug] fallback form appended');
      formEl = document.getElementById('feedback-form-wrap');
    }

    const cancelBtn = document.getElementById('fb-cancel');

    function hideForm() {
      if (formEl.classList) formEl.classList.add('hidden');
      else formEl.style.display = 'none';
      console.log('[feedback-debug] form hidden');
    }
    function showForm() {
      if (formEl.classList) formEl.classList.remove('hidden');
      else formEl.style.display = 'block';
      const nameInput = document.getElementById('fb-name');
      if (nameInput) nameInput.focus();
      console.log('[feedback-debug] form shown & focused');
    }

    hideForm(); // ensure hidden initially

    openBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      if (formEl.classList && formEl.classList.contains('hidden')) {
        showForm();
      } else if (formEl.style && formEl.style.display === 'none') {
        showForm();
      } else {
        hideForm();
      }
    });

    if (cancelBtn) {
      cancelBtn.addEventListener('click', (ev) => {
        ev.preventDefault();
        hideForm();
      });
    }

    console.log('[feedback-debug] Ready. If clicking does nothing, run: document.getElementById("feedback-form-wrap")');
  });
})();
