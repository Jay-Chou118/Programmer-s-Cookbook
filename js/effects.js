// ==================== 全局状态（与 ui.js / main.js 共享） ====================
let isLightMode = false;

// ==================== 自定义光标（已禁用，统一使用系统光标） ====================
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');
if (cursor) cursor.style.display = 'none';
if (cursorDot) cursorDot.style.display = 'none';

// ==================== 粒子背景 ====================
if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80 },
            color: { value: ['#667eea', '#764ba2', '#f093fb'] },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#ffffff',
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: { enable: true, mode: 'repulse' },
                onclick: { enable: true, mode: 'push' }
            }
        },
        retina_detect: true
    });
}

// ==================== 代码雨效果 ====================
const canvas = document.getElementById('code-rain');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const codeChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = [];

for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -100;
}

function drawCodeRain() {
    ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0f0';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const char = codeChars[Math.floor(Math.random() * codeChars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawCodeRain, 50);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ==================== GSAP 入场动画 ====================
function playIntroAnimations() {
    if (typeof gsap !== 'undefined') {
        gsap.from('header > div > h1', {
            y: 30,
            duration: 1,
            ease: 'power2.out'
        });

        gsap.from('header > div > p', {
            y: 20,
            duration: 0.8,
            delay: 0.2,
            ease: 'power2.out'
        });
    }
}

function animateCards(section) {
    if (typeof gsap !== 'undefined' && section) {
        gsap.fromTo(section.querySelectorAll('.glass-card'),
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out'
            }
        );
    }
}
