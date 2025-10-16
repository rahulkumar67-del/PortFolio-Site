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

}

loadProject();
