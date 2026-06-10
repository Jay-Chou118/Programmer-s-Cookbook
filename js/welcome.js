// ==================== 欢迎弹窗 ====================
function showWelcome() {
    if (localStorage.getItem('cookbook_welcomed')) return;
    const overlay = document.getElementById('welcomeOverlay');
    if (!overlay) return;
    setTimeout(() => overlay.classList.add('active'), 500);
}

function closeWelcome() {
    const overlay = document.getElementById('welcomeOverlay');
    overlay.classList.remove('active');
    localStorage.setItem('cookbook_welcomed', '1');
}

// ==================== 投稿弹窗 ====================
let submitStepCount = 1;

function openSubmitModal() {
    submitStepCount = 1;
    const overlay = document.getElementById('submitOverlay');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    // 重置表单
    const form = document.getElementById('submitForm');
    if (form) form.reset();
    // 重置步骤为 1 个
    const container = document.getElementById('stepInputs');
    container.innerHTML = createStepInputHTML(1);
}

function closeSubmitModal() {
    const overlay = document.getElementById('submitOverlay');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function createStepInputHTML(num) {
    return `
        <div class="step-input-row" data-step="${num}">
            <span class="step-input-num">${String(num).padStart(2, '0')}</span>
            <input type="text" class="form-input step-input" placeholder="描述这一步的操作..." />
            <button class="step-remove-btn" onclick="removeStep(this)" title="删除此步"><i class="ri-close-line"></i></button>
        </div>
    `;
}

function addStep() {
    submitStepCount++;
    const container = document.getElementById('stepInputs');
    container.insertAdjacentHTML('beforeend', createStepInputHTML(submitStepCount));
}

function removeStep(btn) {
    if (submitStepCount <= 1) return;
    const row = btn.closest('.step-input-row');
    row.remove();
    submitStepCount--;
    // 重新编号
    document.querySelectorAll('#stepInputs .step-input-row').forEach((row, i) => {
        row.querySelector('.step-input-num').textContent = String(i + 1).padStart(2, '0');
    });
}

function submitRecipe() {
    const lang = document.getElementById('submitLang').value;
    const keyword = document.getElementById('submitKeyword').value.trim();
    const definition = document.getElementById('submitDefinition').value.trim();
    const creativity = document.getElementById('submitCreativity').value.trim();
    const dishName = document.getElementById('submitDishName').value.trim();
    const difficulty = document.getElementById('submitDifficulty').value;
    const time = document.getElementById('submitTime').value.trim();
    const calories = document.getElementById('submitCalories').value.trim();
    const mainIngredients = document.getElementById('submitMain').value.trim();
    const auxIngredients = document.getElementById('submitAux').value.trim();
    const seasoning = document.getElementById('submitSeasoning').value.trim();

    // 收集步骤
    const stepInputs = document.querySelectorAll('.step-input');
    const steps = [];
    stepInputs.forEach(input => {
        const val = input.value.trim();
        if (val) steps.push(val);
    });

    // 验证必填项
    if (!keyword || !dishName || !creativity || steps.length === 0) {
        showToast('请填写关键字、菜名、创意描述和至少一个步骤');
        return;
    }

    // 构建菜谱对象
    const recipe = {
        keyword,
        definition: definition || `${lang} 关键字 ${keyword} 的自定义菜谱`,
        creativity,
        dishName,
        difficulty: difficulty || '⭐⭐ 中等',
        time: time || '30分钟',
        calories: calories || '300kcal',
        ingredients: {
            main: mainIngredients ? mainIngredients.split('\n').filter(s => s.trim()) : ['自定义食材'],
            auxiliary: auxIngredients ? auxIngredients.split('\n').filter(s => s.trim()) : [],
            seasoning: seasoning ? seasoning.split('\n').filter(s => s.trim()) : []
        },
        steps
    };

    // 保存到 localStorage
    const communityKey = 'cookbook_community';
    let community = JSON.parse(localStorage.getItem(communityKey) || '[]');
    community.push({ ...recipe, lang, id: Date.now(), author: '匿名程序员' });
    localStorage.setItem(communityKey, JSON.stringify(community));

    // 关闭弹窗
    closeSubmitModal();
    showToast('投稿成功！你的菜谱已添加到社区');

    // 清除对应语言的渲染缓存，让下次切换时重新渲染
    if (typeof renderedSections !== 'undefined') {
        renderedSections.delete(lang);
    }

    // 如果当前在对应语言标签，立即刷新
    if (currentLang === lang) {
        renderCards(lang);
    } else if (currentLang === 'community') {
        renderCommunityRecipes();
    }

    // 更新统计
    updateTotalCount();
}

// ==================== 社区菜谱渲染 ====================
function renderCommunityRecipes() {
    const community = JSON.parse(localStorage.getItem('cookbook_community') || '[]');
    const grid = document.querySelector('#section-community .recipe-grid');
    grid.innerHTML = '';

    if (community.length === 0) {
        grid.innerHTML = `
            <div class="community-empty col-span-full">
                <i class="ri-quill-pen-line"></i>
                <p class="text-lg font-bold mb-2">社区还没有菜谱</p>
                <p class="text-sm">点击右下角的 ✏️ 按钮，成为第一个投稿人！</p>
            </div>
        `;
        return;
    }

    community.forEach((recipe, index) => {
        const colors = langColors[recipe.lang] || langColors['python'];
        const card = document.createElement('div');
        card.className = 'glass-card p-6 cursor-pointer';
        card.innerHTML = `
            <div class="flex items-start justify-between mb-3">
                <div class="keyword-glow ${colors.text} text-2xl font-code font-bold">
                    ${escapeHtml(recipe.keyword)}
                </div>
                <div class="flex gap-2">
                    <span class="px-3 py-1 ${colors.light} ${colors.text} rounded-full text-xs font-medium">
                        ${escapeHtml(recipe.difficulty)}
                    </span>
                </div>
            </div>
            <p class="text-2xl font-bold bg-gradient-to-r ${colors.bg} bg-clip-text text-transparent mb-3">
                ${escapeHtml(recipe.dishName)}
            </p>
            <p class="text-sm ${isLightMode ? 'text-gray-600' : 'text-gray-400'} leading-relaxed mb-4 line-clamp-2">
                ${escapeHtml(recipe.creativity)}
            </p>
            <div class="flex gap-4 text-xs ${isLightMode ? 'text-gray-500' : 'text-gray-500'} mb-2">
                <span class="flex items-center gap-1"><i class="ri-time-line"></i> ${escapeHtml(recipe.time)}</span>
                <span class="flex items-center gap-1"><i class="ri-fire-line"></i> ${escapeHtml(recipe.calories)}</span>
                <span class="flex items-center gap-1"><i class="ri-file-list-3-line"></i> ${recipe.steps.length} 步</span>
            </div>
            <div class="flex items-center gap-2 text-xs text-gray-600 mb-4">
                <i class="ri-user-3-line"></i>
                <span>${escapeHtml(recipe.author || '匿名程序员')}</span>
                <span>·</span>
                <span>${escapeHtml(langNames[recipe.lang] || recipe.lang)}</span>
            </div>
            <button onclick="event.stopPropagation(); openCommunityDetail(${index})"
                class="w-full py-3 rounded-2xl font-bold text-sm text-white bg-gradient-to-r ${colors.bg} shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                <i class="ri-play-circle-line"></i>
                开始制作
            </button>
        `;
        card.addEventListener('click', () => openCommunityDetail(index));
        grid.appendChild(card);
    });

    // 应用动画
    if (typeof animateCards === 'function') {
        animateCards(document.getElementById('section-community'));
    }
}

function openCommunityDetail(index) {
    const community = JSON.parse(localStorage.getItem('cookbook_community') || '[]');
    const recipe = community[index];
    if (!recipe) return;

    // 临时添加到 recipes 对象以复用详情页
    const tempLang = recipe.lang || 'python';
    if (!recipes[tempLang]) recipes[tempLang] = [];
    const tempIndex = recipes[tempLang].length;
    recipes[tempLang].push(recipe);

    openRecipeDetail(tempLang, tempIndex);

    // 渲染后移除临时数据（防止污染）
    setTimeout(() => {
        recipes[tempLang].pop();
    }, 100);
}

function updateTotalCount() {
    const community = JSON.parse(localStorage.getItem('cookbook_community') || '[]');
    let totalRecipes = 0;
    for (const lang in recipes) {
        totalRecipes += recipes[lang].length;
    }
    totalRecipes += community.length;
    document.getElementById('recipeCount').textContent = `共 ${totalRecipes} 道菜谱`;
}

// 点击投稿弹窗外部关闭
document.getElementById('submitOverlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeSubmitModal();
});
