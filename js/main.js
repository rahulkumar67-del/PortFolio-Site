/* =========================================
   Aerovant — main.js
   Nav, contact form, reveal-on-scroll.
   ========================================= */
(function () {
  'use strict';

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    const setOpen = (open) => {
      navMenu.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };

    navToggle.addEventListener('click', () => {
      setOpen(!navMenu.classList.contains('open'));
    });

    navMenu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => setOpen(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        setOpen(false);
        navToggle.focus();
      }
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Contact form ----------
     SET THIS before publishing. Create a free form endpoint at
     formspree.io or web3forms.com and paste the URL here.
     Until it is set, the form falls back to opening a mail client —
     which silently loses leads on mobile, so do not ship without it. */
  const FORM_ENDPOINT = '';           // e.g. 'https://formspree.io/f/xxxxxxxx'
  const CONTACT_EMAIL = 'krindustries966@gmail.com';

  const form = document.getElementById('contact-form');
  const status = document.getElementById('cf-status');

  const say = (msg, ok) => {
    if (!status) return;
    status.style.color = ok ? 'var(--success)' : 'var(--danger)';
    status.textContent = msg;
  };

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const name = (data.name || '').trim();
      const email = (data.email || '').trim();
      const message = (data.message || '').trim();

      if (!name || !email || !message) {
        say('Please fill in your name, email, and a short description.', false);
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        say('That email address does not look right.', false);
        return;
      }

      const subject = `New enquiry — ${data.projectType || 'project'}${data.company ? ' — ' + data.company : ''}`;
      const body =
        `From: ${name} <${email}>\n` +
        `Company: ${data.company || '—'}\n` +
        `Project type: ${data.projectType || '—'}\n` +
        `Budget: ${data.budget || '—'}\n\n${message}`;

      if (FORM_ENDPOINT) {
        try {
          say('Sending…', true);
          status.style.color = 'var(--text-dim)';
          const res = await fetch(FORM_ENDPOINT, {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data, subject })
          });
          if (!res.ok) throw new Error('Bad response');
          say('Thanks — we’ll reply within two working days.', true);
          form.reset();
        } catch (err) {
          say(`Could not send. Please email ${CONTACT_EMAIL} directly.`, false);
        }
      } else {
        window.location.href =
          `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        say('Opening your mail client…', true);
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
        io.unobserve(entry.target);
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.cap, .work, .steps li, .cred').forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity .55s ease, transform .55s ease';
      io.observe(el);
    });
  }
})();
