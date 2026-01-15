const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function initParticles() {
    canvas.width = window.innerWidth;
    canvas.height = 500;
    particles = [];
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 15 : 45;
    
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.5 + 0.5,
            speedY: Math.random() * 0.4 + 0.1,
            opacity: Math.random() * 0.25
        });
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const color = getComputedStyle(document.body).getPropertyValue('--md-sys-color-primary');
    ctx.fillStyle = color;
    
    particles.forEach(p => {
        p.y -= p.speedY;
        if (p.y < 0) p.y = canvas.height;
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
    requestAnimationFrame(animateParticles);
}

const themeBtn = document.getElementById('theme-toggle');

function toggleTheme(e) {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    const x = e ? e.clientX : window.innerWidth / 2;
    const y = e ? e.clientY : 0;

    if (!document.startViewTransition) {
        document.documentElement.setAttribute('data-theme', newTheme);
        updateIcon(newTheme === 'dark');
        return;
    }

    const transition = document.startViewTransition(() => {
        document.documentElement.setAttribute('data-theme', newTheme);
        updateIcon(newTheme === 'dark');
    });

    transition.ready.then(() => {
        const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
        document.documentElement.animate(
            { clipPath: [`circle(0% at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
            {
                duration: 650,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                pseudoElement: '::view-transition-new(root)'
            }
        );
    });
}

function updateIcon(isDark) {
    const icon = themeBtn.querySelector('.material-symbols-outlined');
    icon.textContent = isDark ? 'dark_mode' : 'light_mode';
}

window.addEventListener('load', () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateIcon(true);
    }
    
    initParticles();
    animateParticles();
});

themeBtn.addEventListener('click', toggleTheme);

window.addEventListener('resize', initParticles);
