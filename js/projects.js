/* ----------------- 1. Project Page Logic ----------------- */
async function loadProject() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get("id");
  
    if (!projectId) return; // Not on a project page or no ID
  
    try {
      const res = await fetch("./data/projects.json");
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const projects = await res.json();
      const project = projects[projectId];
  
      if (!project) {
        document.querySelector(".container").innerHTML = `<h2>❌ Project not found</h2>`;
        return;
      }
  
      // Fill Data
      document.getElementById("project-header").innerHTML = `
        <h1>${project.title}</h1>
        <div class="project-tags">${project.tech.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        <div class="project-meta">Platform: ${project.platform} | Year: ${project.year}</div>
      `;
  
      let videoHTML = project.video.includes("drive.google.com") 
        ? `<iframe src="${project.video}" width="100%" height="480" allow="autoplay; fullscreen" allowfullscreen></iframe>`
        : `<video controls poster="${project.thumbnail}"><source src="${project.video}" type="video/mp4"></video>`;
  
      document.getElementById("project-body").innerHTML = `
        <h2>Description</h2><p>${project.description}</p>
        <div class="video-container">${videoHTML}</div>
        <a href="${project.download || '#'}" class="download-btn">Download Project</a>
      `;
  
      document.getElementById("project-footer").innerHTML = `
        <h3>Details</h3>
        <ul>
          <li>GitHub: <a href="${project.github}" target="_blank">Link</a></li>
        </ul>
      `;
    } catch (err) {
      console.error(err);
    }
  }
  
  // Run if on project.html
  if (window.location.pathname.includes('project.html')) {
    loadProject();
  }
  
  /* ----------------- 2. Service Modal Logic (Fixed) ----------------- */
  const serviceDetails = {
    game: {
      title: "Game Development",
      desc: "Full-cycle Unity game development — prototype to polish.",
      points: ["Custom Player Controllers", "Enemy AI", "UI & Optimization", "PC/Android/VR"],
      meta: "Starting at ₹12,000"
    },
    vr: {
      title: "VR Development",
      desc: "Immersive VR apps for Oculus/Meta Quest.",
      points: ["OpenXR Setup", "Smooth Locomotion", "Hand Tracking", "Performance Opt."],
      meta: "Starting at ₹18,000"
    },
    blender: {
      title: "3D Modelling",
      desc: "High-quality 3D assets for games.",
      points: ["Low/High Poly", "UV Unwrapping", "Texturing", "Game Ready Export"],
      meta: "Per asset: ₹2,000+"
    }
  };
  
  document.addEventListener('click', function (e) {
    // Open Modal
    if (e.target.classList.contains('learn-more')) {
      e.preventDefault();
      const service = serviceDetails[e.target.dataset.service];
      if (service) {
        document.getElementById('modal-title').textContent = service.title;
        document.getElementById('modal-desc').textContent = service.desc;
        document.getElementById('modal-points').innerHTML = service.points.map(p => `<li>${p}</li>`).join('');
        document.getElementById('modal-meta').textContent = service.meta;
        document.getElementById('service-modal-overlay').classList.add('show');
      }
    }
    // Close Modal
    if (e.target.id === 'service-modal-overlay' || e.target.id === 'modal-close') {
      document.getElementById('service-modal-overlay').classList.remove('show');
    }
  });
  
  /* ----------------- 3. Portfolio "See More" Logic ----------------- */
  const seeMoreBtn = document.getElementById('see-more-btn');
  if(seeMoreBtn) {
    seeMoreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const hiddenItems = document.querySelectorAll('.hidden-work');
        
        hiddenItems.forEach(item => {
            item.style.display = 'block'; // Show item
            setTimeout(() => item.style.opacity = '1', 50); // Fade in effect
        });
  
        // Hide the button after showing all
        seeMoreBtn.style.display = 'none';
    });
  }
  
  /* ----------------- 4. Feedback System (Google Sheets) ----------------- */
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxRZVdNg3fy9lgXnl77X4rmlw-Uh9my_XIfCf8Kv5YP0A0xhQxqBZpYwKL6f9cS4Vy3/exec";
  
  // Toggle Form Visibility
  const feedbackBtn = document.getElementById('open-feedback-btn');
  const feedbackForm = document.getElementById('feedback-form-wrap');
  const cancelBtn = document.getElementById('fb-cancel');
  
  if(feedbackBtn) {
      feedbackBtn.addEventListener('click', () => feedbackForm.classList.remove('hidden'));
      cancelBtn.addEventListener('click', () => feedbackForm.classList.add('hidden'));
  }
  
  // Star Rating Logic
  const starContainer = document.getElementById('star-input');
  const ratingInput = document.getElementById('rating-value');
  
  if(starContainer) {
    starContainer.addEventListener('click', (e) => {
        if(e.target.classList.contains('star')) {
            const value = e.target.dataset.value;
            ratingInput.value = value;
            // Visual Update
            const stars = starContainer.querySelectorAll('.star');
            stars.forEach(s => {
                s.classList.toggle('active', s.dataset.value <= value);
                s.textContent = s.dataset.value <= value ? '★' : '☆';
            });
        }
    });
  }
  
  // Submit Logic
  const form = document.forms['submit-to-google-sheet'];
  const msg = document.getElementById("fb-form-msg");
  
  if(form) {
      form.addEventListener('submit', e => {
          e.preventDefault();
          msg.textContent = "Sending...";
          msg.style.color = "#61b752";
  
          // Note: This assumes your Google App Script accepts POST requests with these fields
          // Since you want to use the specific URL provided in your logic:
          fetch(SCRIPT_URL, { 
              method: 'POST', 
              body: new FormData(form)
          })
          .then(response => {
              msg.textContent = "Thanks for your feedback!";
              form.reset();
              setTimeout(() => {
                  msg.textContent = "";
                  feedbackForm.classList.add('hidden');
              }, 2000);
              // Optional: Reload feedbacks here if you have a GET method
          })
          .catch(error => {
              console.error('Error!', error.message);
              msg.textContent = "Error sending feedback.";
              msg.style.color = "red";
          });
      });
  }