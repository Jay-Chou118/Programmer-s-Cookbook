// ==================== 全局状态 ====================
let currentLang = 'python';
let renderedSections = new Set();

// ==================== 工具函数 ====================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== 语言配色 ====================
const langColors = {
    python:    { bg: 'from-blue-500 to-blue-700', text: 'text-blue-400', border: 'border-blue-500', light: 'bg-blue-500/10' },
    java:      { bg: 'from-orange-500 to-orange-700', text: 'text-orange-400', border: 'border-orange-500', light: 'bg-orange-500/10' },
    cpp:       { bg: 'from-cyan-500 to-cyan-700', text: 'text-cyan-400', border: 'border-cyan-500', light: 'bg-cyan-500/10' },
    javascript:{ bg: 'from-yellow-400 to-yellow-600', text: 'text-yellow-400', border: 'border-yellow-500', light: 'bg-yellow-500/10' },
    go:        { bg: 'from-sky-400 to-sky-600', text: 'text-sky-400', border: 'border-sky-500', light: 'bg-sky-500/10' },
    rust:      { bg: 'from-red-500 to-orange-600', text: 'text-red-400', border: 'border-red-500', light: 'bg-red-500/10' },
    kotlin:    { bg: 'from-violet-500 to-purple-600', text: 'text-violet-400', border: 'border-violet-500', light: 'bg-violet-500/10' },
    community: { bg: 'from-pink-500 to-rose-600', text: 'text-pink-400', border: 'border-pink-500', light: 'bg-pink-500/10' },
    favorites: { bg: 'from-rose-500 to-red-600', text: 'text-rose-400', border: 'border-rose-500', light: 'bg-rose-500/10' }
};

const langNames = { python: 'Python', java: 'Java', cpp: 'C++', javascript: 'JavaScript', go: 'Go', rust: 'Rust', kotlin: 'Kotlin', community: '社区', favorites: '收藏' };

// ==================== 渲染菜谱卡片 ====================
function renderCards(lang) {
    const section = document.getElementById(`section-${lang}`);
    if (!section) return;
    const grid = section.querySelector('.recipe-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const colors = langColors[lang] || langColors['python'];

    // 合并官方菜谱 + 用户投稿
    const community = JSON.parse(localStorage.getItem('cookbook_community') || '[]');
    const communityForLang = community.filter(r => r.lang === lang);
    const allRecipes = [
        ...recipes[lang].map((r, i) => ({ ...r, _index: i, _source: 'official' })),
        ...communityForLang.map((r, i) => ({ ...r, _index: i, _source: 'community' }))
    ];

    allRecipes.forEach((recipe, displayIndex) => {
        const isCommunity = recipe._source === 'community';
        const card = document.createElement('div');
        card.className = 'glass-card p-6 cursor-pointer';
        card.style.animationDelay = `${displayIndex * 0.1}s`;

        if (isCommunity) {
            card.addEventListener('click', () => openCommunityDetail(recipe._index));
        } else {
            card.addEventListener('click', () => openRecipeDetail(lang, recipe._index));
        }

        card.innerHTML = `
            <div class="flex items-start justify-between mb-3">
                <div class="keyword-glow ${colors.text} text-2xl font-code font-bold">
                    ${escapeHtml(recipe.keyword)}
                </div>
                <div class="flex gap-2">
                    ${isCommunity ? `<span class="px-2 py-1 bg-pink-500/15 text-pink-400 rounded-full text-xs font-medium flex items-center gap-1"><i class="ri-user-heart-line"></i> 投稿</span>` : ''}
                    <span class="px-3 py-1 ${colors.light} ${colors.text} rounded-full text-xs font-medium">
                        ${recipe.difficulty}
                    </span>
                </div>
            </div>

            <p class="text-2xl font-bold bg-gradient-to-r ${colors.bg} bg-clip-text text-transparent mb-3">
                ${escapeHtml(recipe.dishName)}
            </p>

            <p class="text-sm ${isLightMode ? 'text-gray-600' : 'text-gray-400'} leading-relaxed mb-4 line-clamp-2">
                ${escapeHtml(recipe.creativity)}
            </p>

            <div class="flex gap-4 text-xs ${isLightMode ? 'text-gray-500' : 'text-gray-500'} mb-5">
                <span class="flex items-center gap-1"><i class="ri-time-line"></i> ${recipe.time}</span>
                <span class="flex items-center gap-1"><i class="ri-fire-line"></i> ${recipe.calories}</span>
                <span class="flex items-center gap-1"><i class="ri-file-list-3-line"></i> ${recipe.steps.length} 步</span>
            </div>

            ${isCommunity ? `
                <div class="flex items-center gap-2 text-xs text-gray-600 mb-3">
                    <i class="ri-user-3-line"></i>
                    <span>${escapeHtml(recipe.author || '匿名程序员')}</span>
                </div>
            ` : ''}

            <div class="card-actions">
                <div class="card-actions-left">
                    <button class="fav-btn ${isFavorited(lang, recipe._index, isCommunity ? 'community' : 'official') ? 'favorited' : ''}"
                        data-lang="${lang}" data-index="${recipe._index}" data-source="${isCommunity ? 'community' : 'official'}"
                        onclick="event.stopPropagation(); toggleFavorite('${lang}', ${recipe._index}, '${isCommunity ? 'community' : 'official'}', event)">
                        <i class="${isFavorited(lang, recipe._index, isCommunity ? 'community' : 'official') ? 'ri-heart-fill' : 'ri-heart-line'}"></i>
                    </button>
                    <button class="like-btn ${hasLiked(lang, recipe._index, isCommunity ? 'community' : 'official') ? 'liked' : ''}"
                        data-lang="${lang}" data-index="${recipe._index}" data-source="${isCommunity ? 'community' : 'official'}"
                        onclick="event.stopPropagation(); toggleLike('${lang}', ${recipe._index}, '${isCommunity ? 'community' : 'official'}', event)">
                        <i class="${hasLiked(lang, recipe._index, isCommunity ? 'community' : 'official') ? 'ri-thumb-up-fill' : 'ri-thumb-up-line'}"></i>
                        <span>${getLikeCount(lang, recipe._index, isCommunity ? 'community' : 'official')}</span>
                    </button>
                </div>
                <button class="share-btn"
                    onclick="event.stopPropagation(); generatePoster('${lang}', ${recipe._index}, '${isCommunity ? 'community' : 'official'}')">
                    <i class="ri-share-line"></i> 分享
                </button>
            </div>

            <button onclick="event.stopPropagation(); ${isCommunity ? `startCompileThenOpen('${lang}', ${recipe._index}, 'community')` : `startCompileThenOpen('${lang}', ${recipe._index}, 'official')`}"
                class="w-full py-3 rounded-2xl font-bold text-sm text-white bg-gradient-to-r ${colors.bg} shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                <i class="ri-play-circle-line"></i>
                开始制作
            </button>
        `;

        grid.appendChild(card);
    });

    renderedSections.add(lang);

    // 触发动画
    if (typeof animateCards === 'function') {
        animateCards(section);
    }
}

// ==================== 标签切换 ====================
function switchTab(lang) {
    currentLang = lang;

    // 更新标签状态和颜色
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        // 重置为默认灰色样式
        btn.classList.remove('border-blue-500', 'border-orange-500', 'border-cyan-500', 'border-yellow-500', 'border-sky-500', 'border-red-500', 'border-violet-500', 'border-pink-500', 'border-rose-500');
        btn.classList.remove('text-blue-300', 'text-orange-300', 'text-cyan-300', 'text-yellow-300', 'text-sky-300', 'text-red-300', 'text-violet-300', 'text-pink-300', 'text-rose-300');
        btn.classList.remove('bg-blue-500/15', 'bg-orange-500/15', 'bg-cyan-500/15', 'bg-yellow-500/15', 'bg-sky-500/15', 'bg-red-500/15', 'bg-violet-500/15', 'bg-pink-500/15', 'bg-rose-500/15');
        btn.classList.remove('shadow-blue-500/20', 'shadow-orange-500/20', 'shadow-cyan-500/20', 'shadow-yellow-500/20', 'shadow-sky-500/20', 'shadow-red-500/20', 'shadow-violet-500/20', 'shadow-pink-500/20', 'shadow-rose-500/20');
        btn.classList.add('border-gray-600', 'text-gray-300');
    });

    // 激活当前标签，应用对应语言色
    const activeBtn = document.querySelector(`[data-lang="${lang}"]`);
    activeBtn.classList.add('active');
    activeBtn.classList.remove('border-gray-600', 'text-gray-300');
    const ab = activeBtn.dataset.activeBorder;
    const at = activeBtn.dataset.activeText;
    const abg = activeBtn.dataset.activeBg;
    const as = activeBtn.dataset.activeShadow;
    if (ab) activeBtn.classList.add(ab);
    if (at) activeBtn.classList.add(at);
    if (abg) activeBtn.classList.add(abg);
    if (as) activeBtn.classList.add(as);

    // 更新内容区
    document.querySelectorAll('[id^="section-"]').forEach(section => {
        section.classList.add('hidden');
    });
    const targetSection = document.getElementById(`section-${lang}`);
    targetSection.classList.remove('hidden');

    // 渲染内容
    if (lang === 'community') {
        renderCommunityRecipes();
    } else if (lang === 'favorites') {
        renderFavorites();
    } else {
        renderCards(lang);
    }

    // 更新统计
    document.getElementById('currentLang').textContent = `当前：${langNames[lang]} 专区`;

    // 滚动到内容区
    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ==================== 搜索功能 ====================
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    if (!query) {
        document.querySelectorAll('.glass-card').forEach(card => {
            card.style.display = '';
        });
        document.getElementById('noResults').classList.add('hidden');
        return;
    }

    let foundCount = 0;

    for (const lang in recipes) {
        recipes[lang].forEach(recipe => {
            const card = findCardByRecipe(recipe);
            if (card) {
                const match =
                    recipe.keyword.toLowerCase().includes(query) ||
                    recipe.dishName.toLowerCase().includes(query) ||
                    recipe.definition.toLowerCase().includes(query) ||
                    lang.toLowerCase().includes(query);

                if (match) {
                    card.style.display = '';
                    foundCount++;
                } else {
                    card.style.display = 'none';
                }
            }
        });
    }

    document.getElementById('noResults').classList.toggle('hidden', foundCount > 0);
});

function findCardByRecipe(recipe) {
    const cards = document.querySelectorAll('.glass-card');
    for (const card of cards) {
        const keyword = card.querySelector('.keyword-glow');
        if (keyword && keyword.textContent.trim() === recipe.keyword) {
            return card;
        }
    }
    return null;
}

// ==================== 复制菜谱 ====================
function copyRecipe(event, dishName) {
    event.stopPropagation();
    const btn = event.currentTarget;

    let recipeData = null;
    let langKey = null;
    for (const lang in recipes) {
        const found = recipes[lang].find(r => r.dishName === dishName);
        if (found) {
            recipeData = found;
            langKey = lang;
            break;
        }
    }

    if (!recipeData) return;

    let text = `【${recipeData.keyword} · ${recipeData.dishName}】\n`;
    text += `难度：${recipeData.difficulty} | 时间：${recipeData.time} | 热量：${recipeData.calories}\n\n`;
    text += `📖 关键字释义：${recipeData.definition}\n\n`;
    text += `💡 取名创意：${recipeData.creativity}\n\n`;
    text += `🥬 原料：\n`;
    text += `  主料：${recipeData.ingredients.main.join('、')}\n`;
    text += `  辅料：${recipeData.ingredients.auxiliary.join('、')}\n`;
    text += `  调料：${recipeData.ingredients.seasoning.join('、')}\n\n`;
    text += `👨‍🍳 做法：\n`;
    recipeData.steps.forEach((step, i) => {
        text += `  ${i + 1}. ${step}\n`;
    });

    navigator.clipboard.writeText(text).then(() => {
        btn.innerHTML = '<i class="ri-check-line"></i> 已复制！';
        showToast(`✅ "${dishName}" 菜谱已复制到剪贴板`);
        setTimeout(() => {
            btn.innerHTML = '<i class="ri-file-copy-line"></i> 复制菜谱';
        }, 2000);
    }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        btn.innerHTML = '<i class="ri-check-line"></i> 已复制！';
        showToast(`✅ "${dishName}" 菜谱已复制到剪贴板`);
        setTimeout(() => {
            btn.innerHTML = '<i class="ri-file-copy-line"></i> 复制菜谱';
        }, 2000);
    });
}

// ==================== Toast 通知 ====================
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    toastMessage.textContent = message;
    toast.classList.remove('opacity-0', 'translate-y-4');

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-4');
    }, 3000);
}

// ==================== 主题切换 ====================
const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('click', () => {
    isLightMode = !isLightMode;
    themeToggle.classList.toggle('light');

    if (isLightMode) {
        document.body.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
        document.body.style.color = '#1a1a2e';
    } else {
        document.body.style.background = '#0a0a0f';
        document.body.style.color = '#e0e0e0';
    }

    // 重新渲染当前标签页
    renderedSections.delete(currentLang);
    renderCards(currentLang);
    showToast(isLightMode ? '☀️ 已切换为浅色模式' : '🌙 已切换为深色模式');
});
