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
}

loadProject();
