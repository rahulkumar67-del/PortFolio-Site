/* =========================================
   projects.js — dynamic project detail page
   ========================================= */
(function () {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const headerEl = document.getElementById('project-header');
  const bodyEl = document.getElementById('project-body');
  const footerEl = document.getElementById('project-footer');

  if (!id) {
    document.querySelector('.project-page').innerHTML = `
      <a href="index.html#portfolio" class="back-btn">
        <i class="fa-solid fa-arrow-left"></i> Back to Portfolio
      </a>
      <h2 style="color:#e6edf7">No project specified.</h2>
    `;
    return;
  }

  fetch('./data/projects.json')
    .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(data => {
      const p = data[id];
      if (!p) {
        document.querySelector('.project-page').innerHTML = `
          <a href="index.html#portfolio" class="back-btn">
            <i class="fa-solid fa-arrow-left"></i> Back to Portfolio
          </a>
          <h2 style="color:#e6edf7">Project not found: ${escapeHtml(id)}</h2>
        `;
        return;
      }

      document.title = `${p.title} — Rahul Kumar`;

      headerEl.innerHTML = `
        <h1>${escapeHtml(p.title)}</h1>
        <div class="project-tags">
          ${Array.isArray(p.tech) ? p.tech.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('') : ''}
        </div>
        <div class="project-meta">
          <span><i class="fa-solid fa-desktop"></i> Platform: ${escapeHtml(p.platform || '—')}</span>
          <span><i class="fa-solid fa-calendar"></i> Year: ${escapeHtml(p.year || '—')}</span>
        </div>
      `;

      let videoHTML = '';
      if (p.video && typeof p.video === 'string' && p.video.includes('drive.google.com')) {
        videoHTML = `<div class="video-container"><iframe src="${p.video}" allow="autoplay; fullscreen" allowfullscreen></iframe></div>`;
      } else if (p.video) {
        videoHTML = `<div class="video-container"><video controls poster="${p.thumbnail || ''}"><source src="${p.video}" type="video/mp4"></video></div>`;
      }

      const downloadAttr = (p.download && !/^#?$/.test(p.download)) ? 'download' : '';
      bodyEl.innerHTML = `
        <h2>Project Description</h2>
        <p>${escapeHtml(p.description || '')}</p>
        ${videoHTML}
        ${p.download ? `<a href="${p.download}" class="download-btn" ${downloadAttr}><i class="fa-solid fa-download"></i> Download Project</a>` : ''}
      `;

      footerEl.innerHTML = `
        <h3>Project Details</h3>
        <ul>
          <li><i class="fa-solid fa-circle-info"></i> Platform: ${escapeHtml(p.platform || '—')}</li>
          <li><i class="fa-solid fa-circle-info"></i> Year: ${escapeHtml(p.year || '—')}</li>
          ${p.github ? `<li><i class="fa-brands fa-github"></i> GitHub: <a href="${p.github}" target="_blank" rel="noopener">${escapeHtml(p.github)}</a></li>` : ''}
        </ul>
      `;
    })
    .catch(err => {
      console.error('Failed to load project:', err);
      document.querySelector('.project-page').innerHTML = `
        <a href="index.html#portfolio" class="back-btn">
          <i class="fa-solid fa-arrow-left"></i> Back to Portfolio
        </a>
        <h2 style="color:#e6edf7">Failed to load project details.</h2>
      `;
    });

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }
})();
