/* =========================================
   Aerovant — projects.js
   Renders a case study from data/projects.json
   ========================================= */
(function () {
  'use strict';

  const root = document.getElementById('case-root');
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (!root) return;

  const esc = (s) =>
    String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const id = new URLSearchParams(window.location.search).get('id');

  const notFound = (msg) => {
    root.innerHTML =
      '<div class="case-head">' +
        '<p class="kicker">Not found</p>' +
        '<h1>We couldn’t load that case study.</h1>' +
        '<p class="case-summary">' + esc(msg) + '</p>' +
      '</div>' +
      '<a href="index.html#work" class="btn btn-primary">Back to all work</a>';
  };

  if (!id) { notFound('No project was specified in the link.'); return; }

  fetch('data/projects.json', { cache: 'no-cache' })
    .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then((all) => {
      const p = all[id];
      if (!p) { notFound('There is no project with the id “' + id + '”.'); return; }

      document.title = p.title + ' — Aerovant';
      const desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute('content', p.summary || '');

      const metaHtml = Object.entries(p.meta || {})
        .map(([k, v]) => '<div><dt>' + esc(k) + '</dt><dd>' + esc(v) + '</dd></div>')
        .join('');

      const heroHtml = p.hero
        ? '<div class="case-hero"><picture>' +
            (p.heroWebp ? '<source srcset="' + esc(p.heroWebp) + '" type="image/webp" />' : '') +
            '<img src="' + esc(p.hero) + '" alt="' + esc(p.heroAlt || p.title) + '" ' +
            'width="1600" height="900" />' +
          '</picture></div>'
        : '';

      const bodyHtml = (p.sections || [])
        .map((s) => '<h2>' + esc(s.h) + '</h2><p>' + esc(s.p) + '</p>')
        .join('');

      const videoHtml = p.video
        ? '<div class="video-frame"><iframe src="' + esc(p.video) +
          '" title="' + esc(p.title) + ' — demo" allow="autoplay; fullscreen" ' +
          'allowfullscreen loading="lazy"></iframe></div>'
        : '';

      const highlightsHtml = (p.highlights && p.highlights.length)
        ? '<div class="aside-block"><h3>Engineering highlights</h3><ul>' +
          p.highlights.map((h) => '<li>' + esc(h) + '</li>').join('') +
          '</ul></div>'
        : '';

      const techHtml = (p.tech && p.tech.length)
        ? '<div class="aside-block"><h3>Stack</h3><ul class="aside-tags">' +
          p.tech.map((t) => '<li>' + esc(t) + '</li>').join('') +
          '</ul></div>'
        : '';

      root.innerHTML =
        '<div class="case-head">' +
          '<p class="kicker">' + esc(p.kicker || 'Case study') + '</p>' +
          '<h1>' + esc(p.title) + '</h1>' +
          '<p class="case-summary">' + esc(p.summary) + '</p>' +
        '</div>' +
        heroHtml +
        (metaHtml ? '<dl class="case-meta">' + metaHtml + '</dl>' : '') +
        '<div class="case-layout">' +
          '<div class="case-body">' + bodyHtml + videoHtml + '</div>' +
          '<aside class="case-aside">' + highlightsHtml + techHtml + '</aside>' +
        '</div>' +
        '<div class="case-foot">' +
          '<p>Working on something similar?</p>' +
          '<a href="index.html#contact" class="btn btn-primary">Start a project</a>' +
        '</div>';
    })
    .catch(() => {
      notFound('The case-study data could not be loaded. If you are opening this file directly, run a local server instead — fetch() is blocked on file:// URLs.');
    });
})();
