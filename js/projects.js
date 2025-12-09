/* =========================================
   1. SERVICE MODAL LOGIC
   ========================================= */
const serviceData = {
    game: {
        title: "Game Development",
        desc: "I build high-performance Unity games from scratch, including physics, AI, and UI.",
        deliverables: ["Full Source Code (C#)", "PC & Mobile Optimization", "Custom Enemy AI", "Ads & In-App Purchase Setup"],
        price: "$500 - $2000 (Based on complexity)"
    },
    vr: {
        title: "VR Development",
        desc: "Immersive VR simulation and games for Meta Quest 2/3/Pro using OpenXR.",
        deliverables: ["VR Interaction System", "Hand Tracking Support", "Smooth Locomotion", "Oculus App Lab Build"],
        price: "$800 - $3000"
    },
    blender: {
        title: "3D Modeling (Blender)",
        desc: "Game-ready 3D assets, UV unwrapped and textured with PBR materials.",
        deliverables: ["High/Low Poly Models", "4K PBR Textures", "Rigging & Animation", "Unity/Unreal Export"],
        price: "$50 - $300 per asset"
    }
};

// Open Modal
document.querySelectorAll('.learn-more-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const type = btn.getAttribute('data-service');
        const data = serviceData[type];
        
        if (data) {
            document.getElementById('modal-title').innerText = data.title;
            document.getElementById('modal-desc').innerText = data.desc;
            document.getElementById('modal-price').innerText = data.price;
            
            // Populate List
            const list = document.getElementById('modal-deliverables');
            list.innerHTML = ""; // clear old
            data.deliverables.forEach(item => {
                list.innerHTML += `<li>${item}</li>`;
            });

            document.getElementById('service-modal').classList.add('active');
        }
    });
});

// Close Modal
document.querySelector('.close-modal').addEventListener('click', () => {
    document.getElementById('service-modal').classList.remove('active');
});

// Close on outside click
document.getElementById('service-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('service-modal')) {
        document.getElementById('service-modal').classList.remove('active');
    }
});


/* =========================================
   2. FEEDBACK SYSTEM LOGIC
   ========================================= */

// --- A. Star Rating Visuals ---
const stars = document.querySelectorAll('#star-selector i');
const ratingInput = document.getElementById('rating-input');

stars.forEach(star => {
    star.addEventListener('click', () => {
        const val = star.getAttribute('data-value');
        ratingInput.value = val;
        stars.forEach(s => {
            s.classList.remove('fa-solid', 'active');
            s.classList.add('fa-regular');
            if (s.getAttribute('data-value') <= val) {
                s.classList.remove('fa-regular');
                s.classList.add('fa-solid', 'active');
            }
        });
    });
});

// --- B. Toggle Form ---
const formWrap = document.getElementById('review-form-wrapper');
document.getElementById('leave-review-btn').addEventListener('click', () => formWrap.classList.remove('hidden'));
document.getElementById('cancel-review').addEventListener('click', () => formWrap.classList.add('hidden'));

// --- C. Submit & Load Reviews ---
// REPLACE THIS URL WITH YOUR GOOGLE APPS SCRIPT URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxRZVdNg3fy9lgXnl77X4rmlw-Uh9my_XIfCf8Kv5YP0A0xhQxqBZpYwKL6f9cS4Vy3/exec"; 

const form = document.forms['submit-to-google-sheet'];
const statusMsg = document.getElementById('form-status');
const reviewsContainer = document.getElementById('reviews-container');

// 1. Submit Form
form.addEventListener('submit', e => {
    e.preventDefault();
    statusMsg.innerText = "Posting...";
    
    fetch(SCRIPT_URL, { method: 'POST', body: new FormData(form)})
        .then(response => {
            statusMsg.innerText = "Review Submitted!";
            setTimeout(() => {
                statusMsg.innerText = "";
                form.reset();
                formWrap.classList.add('hidden');
                loadReviews(); // Refresh list
            }, 2000);
        })
        .catch(error => statusMsg.innerText = "Error! Try again.");
});

// 2. Fetch & Display Reviews
function loadReviews() {
    // We add a query param '?action=getReviews' to tell Google Script to send data back
    fetch(SCRIPT_URL + "?action=getReviews") 
        .then(res => res.json())
        .then(data => {
            reviewsContainer.innerHTML = ""; // Clear loading text
            if(data.length === 0) {
                reviewsContainer.innerHTML = "<p>No reviews yet.</p>";
                return;
            }
            
            // Reverse to show newest first
            data.slice().reverse().forEach(row => {
                // row format: [Timestamp, Name, Role, Rating, Message]
                const name = row[1];
                const role = row[2];
                const rating = row[3];
                const msg = row[4];

                // Create Star HTML
                let starsHTML = "";
                for(let i=0; i<5; i++) {
                    starsHTML += i < rating ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>';
                }

                const card = `
                    <div class="review-card">
                        <div class="review-header">
                            <div>
                                <div class="review-name">${name}</div>
                                <div class="review-role">${role}</div>
                            </div>
                            <div class="review-stars">${starsHTML}</div>
                        </div>
                        <div class="review-msg">"${msg}"</div>
                    </div>
                `;
                reviewsContainer.innerHTML += card;
            });
        })
        .catch(err => {
            console.error(err);
            reviewsContainer.innerHTML = "<p>Could not load reviews.</p>";
        });
}

// Load reviews on page load
loadReviews();