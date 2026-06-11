// ==================== 终端风格加载动画 ====================
// 页面加载时播放终端启动动画，营造"程序员开机"的仪式感

const loadingLines = [
    { text: '> npm init 404食堂', delay: 200, class: 'info' },
    { text: '> 正在安装依赖...', delay: 400, class: 'info' },
    { text: '  ✓ tailwindcss@3.4', delay: 300, class: 'ok' },
    { text: '  ✓ gsap@3.12', delay: 200, class: 'ok' },
    { text: '  ✓ three.js@r128', delay: 200, class: 'ok' },
    { text: '  ✓ particles.js@2.0', delay: 200, class: 'ok' },
    { text: '> 正在导入食材包...', delay: 500, class: 'info' },
    { text: '  ✓ 番茄、鸡蛋、五花肉', delay: 300, class: 'ok' },
    { text: '  ✓ 土豆、牛肉、饺子皮', delay: 200, class: 'ok' },
    { text: '  ✓ 调料、香料、食用油', delay: 200, class: 'ok' },
    { text: '> 正在编译菜谱...', delay: 600, class: 'warn' },
    { text: '  [====>             ] 25%', delay: 400, class: 'info' },
    { text: '  [========>         ] 50%', delay: 400, class: 'info' },
    { text: '  [============>     ] 75%', delay: 400, class: 'info' },
    { text: '  [==================] 100%', delay: 300, class: 'ok' },
    { text: '> 正在预热灶台...', delay: 500, class: 'info' },
    { text: '  ✓ 火候已调至最佳', delay: 300, class: 'ok' },
    { text: '> npm run cook', delay: 400, class: 'info' },
    { text: '> 上菜！', delay: 600, class: 'ok' },
];

let loadingAudioCtx = null;

// 初始化音频上下文（用户交互后）
function initLoadingAudio() {
    if (!loadingAudioCtx) {
        loadingAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// 播放打字机音效
function playTypingSound() {
    if (!loadingAudioCtx) return;
    try {
        const osc = loadingAudioCtx.createOscillator();
        const gain = loadingAudioCtx.createGain();
        osc.connect(gain);
        gain.connect(loadingAudioCtx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(800 + Math.random() * 400, loadingAudioCtx.currentTime);
        gain.gain.setValueAtTime(0.02, loadingAudioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, loadingAudioCtx.currentTime + 0.03);
        osc.start(loadingAudioCtx.currentTime);
        osc.stop(loadingAudioCtx.currentTime + 0.03);
    } catch (e) {
        // 忽略音频错误
    }
}

// 播放成功音效
function playSuccessSound() {
    if (!loadingAudioCtx) return;
    try {
        const osc = loadingAudioCtx.createOscillator();
        const gain = loadingAudioCtx.createGain();
        osc.connect(gain);
        gain.connect(loadingAudioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523, loadingAudioCtx.currentTime);
        osc.frequency.setValueAtTime(659, loadingAudioCtx.currentTime + 0.1);
        osc.frequency.setValueAtTime(784, loadingAudioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.05, loadingAudioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, loadingAudioCtx.currentTime + 0.4);
        osc.start(loadingAudioCtx.currentTime);
        osc.stop(loadingAudioCtx.currentTime + 0.4);
    } catch (e) {
        // 忽略音频错误
    }
}

// 运行加载动画
async function runLoadingAnimation() {
    const overlay = document.getElementById('loadingOverlay');
    const body = document.getElementById('loadingBody');
    const footer = document.getElementById('loadingFooter');

    if (!overlay || !body) return;

    // 等待一小段时间让页面开始渲染
    await new Promise(r => setTimeout(r, 300));

    for (const line of loadingLines) {
        await new Promise(r => setTimeout(r, line.delay));

        const div = document.createElement('div');
        div.className = `loading-line ${line.class || ''}`;
        div.textContent = line.text;
        body.appendChild(div);

        // 播放打字机音效
        playTypingSound();

        // 自动滚动到底部
        body.scrollTop = body.scrollHeight;
    }

    // 播放成功音效
    playSuccessSound();

    // 显示上菜动画
    await new Promise(r => setTimeout(r, 400));
    body.innerHTML = `
        <div class="loading-dish">
            <div class="loading-dish-icon">🍳</div>
            <div class="loading-dish-text">404食堂</div>
            <div class="loading-dish-sub">代码能跑，菜也能做</div>
        </div>
    `;

    // 隐藏 footer 光标
    if (footer) footer.style.display = 'none';

    // 延迟后关闭加载动画
    await new Promise(r => setTimeout(r, 1500));
    overlay.classList.add('hidden');

    // 完全移除（动画结束后）
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 600);
}

// 用户首次点击时初始化音频（浏览器策略要求）
document.addEventListener('click', function initAudioOnFirstClick() {
    initLoadingAudio();
    document.removeEventListener('click', initAudioOnFirstClick);
}, { once: true });

// 页面加载完成后启动动画
// 注意：放在 DOMContentLoaded 之后执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(runLoadingAnimation, 100);
    });
} else {
    setTimeout(runLoadingAnimation, 100);
}
