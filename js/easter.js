// ==================== 程序员彩蛋 ====================

// 1. 搜索框彩蛋
function initSearchEasterEggs() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const val = e.target.value.trim().toLowerCase();

        if (val === 'sudo') {
            showToast('🔒 权限不足：需要 root 权限才能烹饪');
            e.target.value = '';
            return;
        }

        if (val === 'rm -rf' || val === 'rm -rf /') {
            showDangerModal();
            e.target.value = '';
            return;
        }

        if (val === 'hello world') {
            showToast('👋 Hello World! 欢迎来到 404食堂');
            return;
        }

        if (val === 'exit' || val === 'quit') {
            showToast('💤 退出成功... 才怪，饿了吗？');
            e.target.value = '';
            return;
        }
    });
}

// rm -rf 危险操作弹窗
function showDangerModal() {
    const overlay = document.createElement('div');
    overlay.className = 'danger-overlay';
    overlay.innerHTML = `
        <div class="danger-card">
            <div class="danger-icon">⚠️</div>
            <h3 class="danger-title">危险操作 detected</h3>
            <p class="danger-desc">你正在尝试执行 <code>rm -rf /</code></p>
            <p class="danger-desc">这将删除所有菜谱数据！</p>
            <div class="danger-btns">
                <button class="danger-btn danger-btn-cancel" onclick="closeDangerModal()">取消</button>
                <button class="danger-btn danger-btn-confirm" onclick="executeRmRf()">确定执行</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('active'));
}

function closeDangerModal() {
    const overlay = document.querySelector('.danger-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    }
}

function executeRmRf() {
    closeDangerModal();
    const overlay = document.createElement('div');
    overlay.className = 'danger-overlay active';
    overlay.innerHTML = `
        <div class="danger-card">
            <div class="danger-icon">😏</div>
            <h3 class="danger-title">开玩笑的</h3>
            <p class="danger-desc">你的菜谱已备份到 <code>/dev/null</code></p>
            <p class="danger-desc">（其实是假的，什么都没删）</p>
            <button class="danger-btn danger-btn-cancel" onclick="this.closest('.danger-overlay').remove()">好吧</button>
        </div>
    `;
    document.body.appendChild(overlay);
}

// 2. 连续点击标题彩蛋
let titleClickCount = 0;
let titleClickTimer = null;

function initTitleEasterEgg() {
    const title = document.getElementById('siteTitle');
    if (!title) return;

    title.addEventListener('click', () => {
        titleClickCount++;
        if (titleClickCount >= 5) {
            triggerEmojiMode();
            titleClickCount = 0;
        }
        clearTimeout(titleClickTimer);
        titleClickTimer = setTimeout(() => { titleClickCount = 0; }, 2000);
    });
}

let emojiMode = false;
function triggerEmojiMode() {
    emojiMode = !emojiMode;
    if (emojiMode) {
        showToast('🎉 彩蛋模式开启！所有菜名已 emoji 化');
    } else {
        showToast('😐 彩蛋模式关闭');
    }
    // 重新渲染当前标签
    if (currentLang && currentLang !== 'community' && currentLang !== 'favorites') {
        renderedSections.delete(currentLang);
        renderCards(currentLang);
    }
}

// 获取 emoji 菜名
function getEmojiDishName(name) {
    const map = {
        '番茄炒蛋': '🍅🍳',
        '红烧肉': '🥩🔥',
        '韭菜鸡蛋饺子': '🥟🥚',
        '酸辣土豆丝': '🥔🌶️',
        '麻婆豆腐': '🌶️🧈',
        '宫保鸡丁': '🐔🥜',
        '炸春卷': '🫔',
        '广式月饼': '🥮',
        '白菜猪肉水饺': '🥟🐷',
        '土豆炖牛肉': '🥔🥩',
        '回锅肉': '🥩🍳',
        '鸳鸯火锅': '🍲',
        '火腿三明治': '🥪',
        '扬州炒饭': '🍚🥚',
        '豪华泡面': '🍜✨',
        '蛋炒饭': '🍳🍚',
        '小笼包': '🥟',
        '旋转寿司': '🍣',
        '三菜一汤': '🍱',
        '手工拉面': '🍜',
        '戚风蛋糕': '🍰',
        '冒菜': '🍲🌶️',
        '意大利披萨': '🍕',
        '卤味拼盘': '🍗🍖',
        '珍珠奶茶': '🧋',
        '沙拉': '🥗',
        '番茄牛腩汤': '🍅🥩',
        '异步火锅': '🍲⚡'
    };
    return map[name] || name;
}

// ==================== 菜谱海报生成 ====================
function generatePoster(lang, index, source) {
    let recipe;
    if (source === 'community') {
        const community = JSON.parse(localStorage.getItem('cookbook_community') || '[]');
        recipe = community[index];
    } else {
        recipe = recipes[lang]?.[index];
    }
    if (!recipe) return;

    const colors = langColors[lang] || langColors['python'];
    const isLight = isLightMode;

    // 创建海报容器
    const poster = document.createElement('div');
    poster.className = 'poster-container';
    poster.innerHTML = `
        <div class="poster-card" style="background: ${isLight ? '#fff' : '#12121a'}; color: ${isLight ? '#333' : '#fff'};">
            <div class="poster-header">
                <span class="poster-badge" style="background: linear-gradient(135deg, #667eea, #764ba2); color: #fff;">404食堂</span>
                <span class="poster-lang" style="color: ${isLight ? '#666' : '#888'};">${escapeHtml(langNames[lang] || lang)}</span>
            </div>
            <div class="poster-keyword" style="color: ${isLight ? '#3b82f6' : '#60a5fa'};">${escapeHtml(recipe.keyword)}</div>
            <div class="poster-arrow">→</div>
            <div class="poster-dish" style="background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${escapeHtml(recipe.dishName)}</div>
            <div class="poster-meta">
                <span>⭐ ${recipe.difficulty}</span>
                <span>⏱ ${recipe.time}</span>
                <span>🔥 ${recipe.calories}</span>
            </div>
            <div class="poster-quote">"${escapeHtml(recipe.creativity.substring(0, 60))}${recipe.creativity.length > 60 ? '...' : ''}"</div>
            <div class="poster-footer">
                <span style="color: ${isLight ? '#999' : '#666'};">扫码查看完整步骤</span>
                <div class="poster-qr">📱</div>
            </div>
        </div>
    `;
    document.body.appendChild(poster);

    // 使用 html2canvas 生成图片
    if (typeof html2canvas !== 'undefined') {
        html2canvas(poster.querySelector('.poster-card'), {
            backgroundColor: isLight ? '#ffffff' : '#12121a',
            scale: 2
        }).then(canvas => {
            showPosterModal(canvas);
            poster.remove();
        }).catch(() => {
            // fallback: 直接显示海报div
            showPosterFallback(poster);
        });
    } else {
        // 没有 html2canvas 时的 fallback
        showPosterFallback(poster);
    }
}

function showPosterModal(canvas) {
    const overlay = document.createElement('div');
    overlay.className = 'poster-overlay';
    overlay.innerHTML = `
        <div class="poster-modal">
            <div class="poster-modal-header">
                <h3>🍳 菜谱海报</h3>
                <button class="modal-close" onclick="this.closest('.poster-overlay').remove()">✕</button>
            </div>
            <div class="poster-modal-body">
                <img src="${canvas.toDataURL()}" class="poster-img" alt="菜谱海报">
            </div>
            <div class="poster-modal-footer">
                <a href="${canvas.toDataURL()}" download="404食堂-菜谱海报.png" class="poster-download-btn">
                    <i class="ri-download-line"></i> 保存海报
                </a>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('active'));

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });
}

function showPosterFallback(poster) {
    const overlay = document.createElement('div');
    overlay.className = 'poster-overlay';
    overlay.appendChild(poster);
    poster.classList.add('poster-fallback');

    // 添加下载按钮
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'poster-download-btn';
    downloadBtn.innerHTML = '<i class="ri-download-line"></i> 长按保存海报';
    downloadBtn.style.marginTop = '16px';
    poster.appendChild(downloadBtn);

    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('active'));

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initSearchEasterEggs();
    initTitleEasterEgg();
});
