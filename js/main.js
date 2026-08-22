/* =========================================
   main.js — navigation, tabs, contact form
   ========================================= */
(function () {
  'use strict';

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // close on link click
    navMenu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Tabs (About section) ---------- */
  const tabButtons = document.querySelectorAll('.tab-links');
  const tabPanels = document.querySelectorAll('.tab-contents');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      tabButtons.forEach((b) => {
        b.classList.remove('active-link');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach((p) => p.classList.remove('active-tab'));
      btn.classList.add('active-link');
      btn.setAttribute('aria-selected', 'true');
      const panel = document.getElementById(target);
      if (panel) panel.classList.add('active-tab');
    });
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Contact form ----------
     Uses Formspree fallback by default — replace FORM_ENDPOINT
     with your own Formspree / Web3Forms / Getform endpoint.
     Until then, the form opens the user's mail client. */
  const FORM_ENDPOINT = ''; // e.g. 'https://formspree.io/f/xxxxxx'

  const form = document.getElementById('contact-form');
  const status = document.getElementById('cf-status');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = form.elements['name'].value.trim();
      const email = form.elements['email'].value.trim();
      const subject = form.elements['subject'].value.trim() || 'New message from portfolio';
      const message = form.elements['message'].value.trim();

      if (!name || !email || !message) {
        status.style.color = '#f87171';
        status.textContent = 'Please fill in name, email, and message.';
        return;
      }

      if (FORM_ENDPOINT) {
        try {
          status.style.color = 'var(--text-dim)';
          status.textContent = 'Sending…';
          const res = await fetch(FORM_ENDPOINT, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, subject, message })
          });
          if (res.ok) {
            status.style.color = 'var(--success)';
            status.textContent = 'Message sent — I will get back to you soon!';
            form.reset();
          } else {
            throw new Error('Network');
          }
        } catch (err) {
          status.style.color = '#f87171';
          status.textContent = 'Could not send. Email me directly at krindustries966@gmail.com';
        }
      } else {
        // Fallback — open mail client
        const mailto = `mailto:krindustries966@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('From: ' + name + ' <' + email + '>\n\n' + message)}`;
        window.location.href = mailto;
        status.style.color = 'var(--success)';
        status.textContent = 'Opening your mail client…';
      }
    });
  }

  /* ---------- Reveal-on-scroll (subtle) ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('section .sub-title, .work, .services-list article, .exp-item, .edu-item, .skills-grid li').forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity .6s ease, transform .6s ease';
      io.observe(el);
    });
  }
})();
