// ==================== 今日推荐 ====================
function getDailyRecommendation() {
    // 基于日期的伪随机，每天固定推荐一道
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    // 收集所有菜谱
    const allRecipes = [];
    for (const lang in recipes) {
        recipes[lang].forEach((r, i) => {
            allRecipes.push({ ...r, lang, _index: i, _source: 'official' });
        });
    }
    const community = JSON.parse(localStorage.getItem('cookbook_community') || '[]');
    community.forEach((r, i) => {
        allRecipes.push({ ...r, lang: r.lang, _index: i, _source: 'community' });
    });

    if (allRecipes.length === 0) return null;

    const index = seed % allRecipes.length;
    return allRecipes[index];
}

function openDailyRecommend() {
    const recipe = getDailyRecommendation();
    if (!recipe) {
        showToast('暂无菜谱可推荐');
        return;
    }

    if (recipe._source === 'community') {
        openCommunityDetail(recipe._index);
    } else {
        openRecipeDetail(recipe.lang, recipe._index);
    }
}

function updateDailyCard() {
    const recipe = getDailyRecommendation();
    if (!recipe) return;

    const colors = langColors[recipe.lang] || langColors['python'];
    const card = document.getElementById('dailyCard');
    if (!card) return;

    card.innerHTML = `
        <div class="daily-card-inner" onclick="openDailyRecommend()" style="cursor:pointer">
            <div class="flex items-center justify-between mb-2">
                <span class="text-xs text-gray-500 flex items-center gap-1"><i class="ri-sparkling-line"></i> 今日推荐</span>
                <span class="px-2 py-0.5 ${colors.light} ${colors.text} rounded-full text-xs">${escapeHtml(langNames[recipe.lang] || recipe.lang)}</span>
            </div>
            <div class="flex items-center gap-3">
                <div class="keyword-glow ${colors.text} text-xl font-code font-bold">${escapeHtml(recipe.keyword)}</div>
                <span class="text-gray-600">→</span>
                <span class="text-lg font-bold bg-gradient-to-r ${colors.bg} bg-clip-text text-transparent">${escapeHtml(recipe.dishName)}</span>
            </div>
            <p class="text-xs text-gray-500 mt-2 line-clamp-1">${escapeHtml(recipe.creativity)}</p>
        </div>
    `;
}

// ==================== 收藏功能 ====================
function getFavorites() {
    return JSON.parse(localStorage.getItem('cookbook_favorites') || '[]');
}

function saveFavorites(favs) {
    localStorage.setItem('cookbook_favorites', JSON.stringify(favs));
}

function isFavorited(lang, index, source) {
    const favs = getFavorites();
    return favs.some(f => f.lang === lang && f.index === index && f.source === source);
}

function toggleFavorite(lang, index, source, event) {
    if (event) event.stopPropagation();

    const favs = getFavorites();
    const existingIndex = favs.findIndex(f => f.lang === lang && f.index === index && f.source === source);

    if (existingIndex >= 0) {
        favs.splice(existingIndex, 1);
        showToast('已取消收藏');
    } else {
        favs.push({ lang, index, source });
        showToast('已收藏');
    }
    saveFavorites(favs);

    // 更新按钮状态
    updateFavoriteButtons();
}

function updateFavoriteButtons() {
    const favs = getFavorites();
    document.querySelectorAll('.fav-btn').forEach(btn => {
        const lang = btn.dataset.lang;
        const index = parseInt(btn.dataset.index);
        const source = btn.dataset.source;
        const isFav = favs.some(f => f.lang === lang && f.index === index && f.source === source);
        if (isFav) {
            btn.classList.add('favorited');
            btn.innerHTML = '<i class="ri-heart-fill"></i>';
        } else {
            btn.classList.remove('favorited');
            btn.innerHTML = '<i class="ri-heart-line"></i>';
        }
    });
}

// ==================== 点赞功能 ====================
function getLikes() {
    return JSON.parse(localStorage.getItem('cookbook_likes') || '{}');
}

function saveLikes(likes) {
    localStorage.setItem('cookbook_likes', JSON.stringify(likes));
}

function getLikeCount(lang, index, source) {
    const likes = getLikes();
    const key = `${lang}_${index}_${source}`;
    return likes[key] || 0;
}

function hasLiked(lang, index, source) {
    const liked = JSON.parse(localStorage.getItem('cookbook_liked') || '[]');
    return liked.includes(`${lang}_${index}_${source}`);
}

function toggleLike(lang, index, source, event) {
    if (event) event.stopPropagation();

    const key = `${lang}_${index}_${source}`;
    const likes = getLikes();
    const liked = JSON.parse(localStorage.getItem('cookbook_liked') || '[]');
    const existIndex = liked.indexOf(key);

    if (existIndex >= 0) {
        // 取消点赞
        liked.splice(existIndex, 1);
        likes[key] = Math.max(0, (likes[key] || 1) - 1);
    } else {
        // 点赞
        liked.push(key);
        likes[key] = (likes[key] || 0) + 1;
    }

    saveLikes(likes);
    localStorage.setItem('cookbook_liked', JSON.stringify(liked));
    updateLikeButtons();
}

function updateLikeButtons() {
    const likes = getLikes();
    const liked = JSON.parse(localStorage.getItem('cookbook_liked') || '[]');

    document.querySelectorAll('.like-btn').forEach(btn => {
        const lang = btn.dataset.lang;
        const index = parseInt(btn.dataset.index);
        const source = btn.dataset.source;
        const key = `${lang}_${index}_${source}`;
        const count = likes[key] || 0;
        const isLiked = liked.includes(key);

        if (isLiked) {
            btn.classList.add('liked');
            btn.innerHTML = `<i class="ri-thumb-up-fill"></i> <span>${count}</span>`;
        } else {
            btn.classList.remove('liked');
            btn.innerHTML = `<i class="ri-thumb-up-line"></i> <span>${count}</span>`;
        }
    });
}

// ==================== 收藏页渲染 ====================
function renderFavorites() {
    const favs = getFavorites();
    const grid = document.querySelector('#section-favorites .recipe-grid');
    grid.innerHTML = '';

    if (favs.length === 0) {
        grid.innerHTML = `
            <div class="community-empty col-span-full">
                <i class="ri-heart-line"></i>
                <p class="text-lg font-bold mb-2">还没有收藏</p>
                <p class="text-sm">浏览菜谱时点击 ♡ 即可收藏</p>
            </div>
        `;
        return;
    }

    favs.forEach(fav => {
        let recipe;
        if (fav.source === 'community') {
            const community = JSON.parse(localStorage.getItem('cookbook_community') || '[]');
            recipe = community[fav.index];
        } else {
            recipe = recipes[fav.lang]?.[fav.index];
        }
        if (!recipe) return;

        const colors = langColors[fav.lang] || langColors['python'];
        const card = document.createElement('div');
        card.className = 'glass-card p-6 cursor-pointer';
        card.innerHTML = `
            <div class="flex items-start justify-between mb-3">
                <div class="keyword-glow ${colors.text} text-2xl font-code font-bold">
                    ${escapeHtml(recipe.keyword)}
                </div>
                <span class="px-3 py-1 ${colors.light} ${colors.text} rounded-full text-xs font-medium">
                    ${recipe.difficulty}
                </span>
            </div>
            <p class="text-2xl font-bold bg-gradient-to-r ${colors.bg} bg-clip-text text-transparent mb-3">
                ${escapeHtml(recipe.dishName)}
            </p>
            <p class="text-sm ${isLightMode ? 'text-gray-600' : 'text-gray-400'} leading-relaxed mb-4 line-clamp-2">
                ${escapeHtml(recipe.creativity)}
            </p>
            <div class="flex gap-4 text-xs text-gray-500 mb-4">
                <span class="flex items-center gap-1"><i class="ri-time-line"></i> ${recipe.time}</span>
                <span class="flex items-center gap-1"><i class="ri-fire-line"></i> ${recipe.calories}</span>
                <span class="flex items-center gap-1"><i class="ri-file-list-3-line"></i> ${recipe.steps.length} 步</span>
            </div>
            <button onclick="event.stopPropagation(); ${fav.source === 'community' ? `openCommunityDetail(${fav.index})` : `openRecipeDetail('${fav.lang}', ${fav.index})`}"
                class="w-full py-3 rounded-2xl font-bold text-sm text-white bg-gradient-to-r ${colors.bg} shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                <i class="ri-play-circle-line"></i>
                开始制作
            </button>
        `;
        card.addEventListener('click', () => {
            if (fav.source === 'community') {
                openCommunityDetail(fav.index);
            } else {
                openRecipeDetail(fav.lang, fav.index);
            }
        });
        grid.appendChild(card);
    });

    if (typeof animateCards === 'function') {
        animateCards(document.getElementById('section-favorites'));
    }
}
