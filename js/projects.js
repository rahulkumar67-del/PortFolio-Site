// project.js (compatible with your project.html structure)
async function loadProject() {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get("id");
  if (!projectId) {
    document.querySelector(".container").innerHTML = `
      <a href="index.html#portfolio" class="back-btn"><i class="fa-solid fa-arrow-left"></i> Back to Portfolio</a>
      <h2>Project Not Found</h2>
    `;
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
    document.getElementById("project-header").innerHTML = `
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

    document.getElementById("project-body").innerHTML = `
      <h2>Project Description</h2>
      <p>${project.description || ''}</p>
      ${videoHTML}
      <a href="${project.download || '#'}" class="download-btn" ${project.download ? 'download' : ''}>
        <i class="fa-solid fa-download"></i> ${project.download ? 'Download Project' : 'Download (not available)'}
      </a>
    `;

    // Footer
    document.getElementById("project-footer").innerHTML = `
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


  // Service modal module — append to project.js (or include as feedback.js style file)
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
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    modalPoints.innerHTML = data.points.map(p => `<li>${escapeHtml(p)}</li>`).join('');
    modalMeta.textContent = data.meta;
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    // trap focus to close button for accessibility
    setTimeout(()=> modalClose.focus(), 50);
    // prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // click handling (delegation)
  document.addEventListener('click', function (e) {
    const t = e.target;
    // find ancestor with .learn-more or data-service attr
    const lm = t.closest && t.closest('.learn-more');
    if (lm) {
      e.preventDefault();
      const key = lm.dataset.service;
      openModal(key);
      return;
    }
    // close click on overlay background (but not when clicking inside modal)
    if (t === overlay) {
      closeModal();
    }
  });

  // close button
  modalClose.addEventListener('click', closeModal);

  // escape key closes
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('show')) closeModal();
  });

  // simple HTML escape
  function escapeHtml(s) {
    return String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
})();
// ---------- Feedback client script (paste at end of project.js or in feedback.js) ----------
(function () {
  const FEEDBACK_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxRZVdNg3fy9lgXnl77X4rmlw-Uh9my_XIfCf8Kv5YP0A0xhQxqBZpYwKL6f9cS4Vy3/exec"; // <<-- update this

  // wait for DOM
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

    if (!openBtn || !formWrap || !fbSubmit || !feedbackList) return; // early exit if UI missing

    // star input helpers
    function setStarInput(n) {
      const stars = starInput.querySelectorAll('.star');
      stars.forEach(s => {
        const v = Number(s.dataset.value);
        s.classList.toggle('active', v <= n);
        s.textContent = v <= n ? '★' : '☆';
      });
      starInput.dataset.rating = n;
    }
    // init default
    if (starInput) setStarInput(5);

    starInput && starInput.addEventListener('click', (e) => {
      if (!e.target.classList.contains('star')) return;
      setStarInput(Number(e.target.dataset.value));
    });

    // toggle form
    openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      formWrap.classList.toggle('hidden');
      if (!formWrap.classList.contains('hidden')) {
        fbName.focus();
      }
    });
    fbCancel.addEventListener('click', (e) => {
      e.preventDefault();
      formWrap.classList.add('hidden');
    });

    // helper: render star chars for display
    function starsHtml(n) {
      n = Math.max(0, Math.min(5, Math.round(n || 0)));
      let s = '';
      for (let i = 1; i <= 5; i++) s += (i <= n ? '★' : '☆');
      return `<span class="star-display">${s}</span>`;
    }

    // render feedbacks (rows: [Timestamp, Name, Role, Rating, Message])
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

      // compute avg rating (consider only numeric ratings)
      let sum = 0, cnt = 0;
      rows.forEach(r => { const rating = Number(r[3] || 0); if (!isNaN(rating) && rating > 0) { sum += rating; cnt++; }});
      const avg = cnt ? (sum / cnt) : 0;
      avgRatingEl.innerText = (avg ? avg.toFixed(1) : '0.0');
      avgStarsEl.innerHTML = starsHtml(Math.round(avg));
      ratingCountEl.innerText = `${rows.length} review${rows.length>1 ? 's' : ''}`;

      // show newest first
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

    // escape helper
    function escapeHtml(s) {
      if (!s) return '';
      return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
    }

    // fetch feedbacks from Apps Script
    async function fetchFeedbacks() {
      try {
        const url = FEEDBACK_WEBAPP_URL + '?action=getFeedbacks';
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch');
        const rows = await res.json();
        renderFeedbackRows(rows);
      } catch (err) {
        console.error('fetchFeedbacks error', err);
        feedbackEmpty.textContent = "Couldn't load feedbacks.";
      }
    }

    // post feedback to Apps Script
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

    // submit handler
    fbSubmit.addEventListener('click', async (ev) => {
      ev.preventDefault();
      const name = (fbName.value || 'Anonymous').trim();
      const role = (fbRole.value || '').trim();
      const message = (fbMessage.value || '').trim();
      const rating = Number(starInput.dataset.rating || 5);

      if (!message) {
        fbFormMsg.style.color = '#f66';
        fbFormMsg.innerText = 'Please enter feedback message.';
        return;
      }
      fbFormMsg.style.color = '#61b752';
      fbFormMsg.innerText = 'Sending...';
      fbSubmit.disabled = true;

      try {
        const result = await postFeedback(name, role, rating, message);
        if (result && result.status === 'ok') {
          fbFormMsg.style.color = '#61b752';
          fbFormMsg.innerText = 'Thanks — feedback submitted!';
          fbName.value = '';
          fbRole.value = '';
          fbMessage.value = '';
          setStarInput(5);
          await fetchFeedbacks();              // refresh list immediately
          setTimeout(()=> formWrap.classList.add('hidden'), 1000); // auto close form
        } else {
          throw new Error(result && result.message ? result.message : 'Unknown');
        }
      } catch (err) {
        console.error('Submit error', err);
        fbFormMsg.style.color = '#f55';
        fbFormMsg.innerText = 'Could not send feedback. Try again later.';
      } finally {
        fbSubmit.disabled = false;
        setTimeout(()=> fbFormMsg.innerText = '', 4000);
      }
    });

    // initial load
    fetchFeedbacks();
  });
})();

}

loadProject();
