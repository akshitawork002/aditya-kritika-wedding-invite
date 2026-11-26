// --- STARDUST & SMOOTH STEADY INTERACTIVE TOUCH SHIMMER CANVAS ---
const canvas = document.getElementById('stardust-canvas');
const ctx = canvas.getContext('2d');
let ambientParticles = [];
let touchTrails = [];
let burstParticles = [];
let lastSpawnTime = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

for (let i = 0; i < 110; i++) {
    ambientParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2.2 + 0.7,
        alpha: Math.random(),
        speedY: Math.random() * 0.75 + 0.25,
        speedX: (Math.random() - 0.5) * 0.35,
        speedAlpha: Math.random() * 0.02 + 0.008
    });
}

function spawnSmoothShimmer(x, y) {
    const now = performance.now();
    if (now - lastSpawnTime < 28) return;
    lastSpawnTime = now;

    for (let i = 0; i < 2; i++) {
        touchTrails.push({
            x: x + (Math.random() - 0.5) * 14,
            y: y + (Math.random() - 0.5) * 14,
            vx: (Math.random() - 0.5) * 0.45,
            vy: (Math.random() - 0.5) * 0.45 - 0.25,
            radius: Math.random() * 2.5 + 1.2,
            alpha: 0.95,
            decay: 0.016
        });
    }
}

window.addEventListener('mousemove', (e) => {
    spawnSmoothShimmer(e.clientX, e.clientY);
});

window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
        spawnSmoothShimmer(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: true });

window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        spawnSmoothShimmer(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: true });

function triggerScratchBurst(centerX, centerY) {
    for (let i = 0; i < 65; i++) {
        const angle = (Math.PI * 2 * i) / 65 + (Math.random() - 0.5) * 0.2;
        const speed = Math.random() * 1.6 + 0.5;
        burstParticles.push({
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: Math.random() * 3.2 + 1.4,
            alpha: 1,
            decay: 0.009
        });
    }
}

function animateStardust() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ambientParticles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        
        if (p.y > canvas.height) {
            p.y = 0;
            p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width || p.x < 0) {
            p.x = Math.random() * canvas.width;
        }

        p.alpha += p.speedAlpha;
        if (p.alpha > 1 || p.alpha < 0) p.speedAlpha = -p.speedAlpha;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 241, 176, ${Math.abs(p.alpha)})`;
        ctx.shadowColor = '#fff1b0';
        ctx.shadowBlur = 7;
        ctx.fill();
    });

    for (let i = touchTrails.length - 1; i >= 0; i--) {
        const t = touchTrails[i];
        t.x += t.vx;
        t.y += t.vy;
        t.alpha -= t.decay;
        t.radius *= 0.992;

        if (t.alpha <= 0) {
            touchTrails.splice(i, 1);
            continue;
        }

        ctx.beginPath();
        ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 243, 185, ${t.alpha})`;
        ctx.shadowColor = '#f5d76c';
        ctx.shadowBlur = 10;
        ctx.fill();
    }

    for (let i = burstParticles.length - 1; i >= 0; i--) {
        const b = burstParticles[i];
        b.x += b.vx;
        b.y += b.vy;
        b.vx *= 0.985;
        b.vy *= 0.985;
        b.alpha -= b.decay;

        if (b.alpha <= 0) {
            burstParticles.splice(i, 1);
            continue;
        }

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 241, 176, ${b.alpha})`;
        ctx.shadowColor = '#dfb13c';
        ctx.shadowBlur = 12;
        ctx.fill();
    }

    requestAnimationFrame(animateStardust);
}
animateStardust();

// --- 3D SYMMETRICAL 4-FOLD OUTWARD UNFOLDING LOGIC (GSAP) ---
const seal = document.getElementById('open-seal');
const overlay = document.getElementById('envelope-overlay');
const audio = document.getElementById('bg-audio');

seal.addEventListener('click', () => {
    audio.play().catch(e => console.log("Audio autoplay restricted"));

    const tl = gsap.timeline({
        onComplete: () => {
            overlay.style.visibility = 'hidden';
        }
    });

    // All 4 flaps hinge outward cleanly from their respective screen edges
    tl.to(seal, { scale: 1.5, opacity: 0, duration: 0.45, ease: "power2.in" })
      .to('.flap-top', { rotationX: 115, opacity: 0, duration: 2.8, ease: "power2.inOut" }, 0.2)
      .to('.flap-bottom', { rotationX: -115, opacity: 0, duration: 2.8, ease: "power2.inOut" }, 0.2)
      .to('.flap-left', { rotationY: -115, opacity: 0, duration: 2.8, ease: "power2.inOut" }, 0.2)
      .to('.flap-right', { rotationY: 115, opacity: 0, duration: 2.8, ease: "power2.inOut" }, 0.2)
      .to(overlay, { opacity: 0, duration: 0.7, ease: "power2.out" }, 2.4);
});

// --- SCROLL PROMPT DISMISSAL ---
window.addEventListener('scroll', () => {
    const prompt = document.getElementById('scroll-prompt');
    if (window.scrollY > 50) {
        gsap.to(prompt, { opacity: 0, duration: 0.5, pointerEvents: 'none' });
    } else {
        gsap.to(prompt, { opacity: 1, duration: 0.5 });
    }
});

// --- INTERACTIVE SCRATCH CARD WITH SLOW & STEADY SHIMMER BURST ---
const scratchCanvas = document.getElementById('scratch-canvas');
const scratchContainer = document.getElementById('scratch-container');
const sCtx = scratchCanvas.getContext('2d');

const gradient = sCtx.createLinearGradient(0, 0, scratchCanvas.width, scratchCanvas.height);
gradient.addColorStop(0, '#dfb13c');
gradient.addColorStop(0.3, '#fff1b0');
gradient.addColorStop(0.6, '#f5d76c');
gradient.addColorStop(1, '#dfb13c');
sCtx.fillStyle = gradient;
sCtx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);

sCtx.font = "bold 14px Cinzel, serif";
sCtx.fillStyle = "#0b192c";
sCtx.textAlign = "center";
sCtx.fillText("✨ Swipe to Reveal ✨", scratchCanvas.width / 2, scratchCanvas.height / 2 + 5);

let isDragging = false;
let swipeCount = 0;
let autoRevealed = false;

function scratch(e) {
    if (!isDragging || autoRevealed) return;
    const rect = scratchCanvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    sCtx.globalCompositeOperation = 'destination-out';
    sCtx.beginPath();
    sCtx.arc(x, y, 65, 0, Math.PI * 2);
    sCtx.fill();

    swipeCount++;
    if (swipeCount >= 2) {
        autoRevealed = true;
        
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        triggerScratchBurst(centerX, centerY);
        scratchContainer.classList.add('burst-glow');

        gsap.to(scratchCanvas, {
            opacity: 0,
            duration: 1.6,
            ease: "power2.out",
            onComplete: () => {
                scratchCanvas.style.display = 'none';
            }
        });
    }
}

scratchCanvas.addEventListener('mousedown', () => isDragging = true);
scratchCanvas.addEventListener('mousemove', scratch);
window.addEventListener('mouseup', () => isDragging = false);

scratchCanvas.addEventListener('touchstart', () => isDragging = true);
scratchCanvas.addEventListener('touchmove', scratch);
window.addEventListener('touchend', () => isDragging = false);

// --- GOOGLE CALENDAR FUNCTION ---
function addToCalendar() {
    const title = encodeURIComponent("Aditya & Kritika Wedding Celebration");
    const details = encodeURIComponent("Wedding celebrations of Aditya & Kritika at Signature Resort, Nagpur.");
    const location = encodeURIComponent("Signature Resort, Nagpur");
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(url, '_blank');
}