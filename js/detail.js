// ==================== 菜谱详情模态框 ====================
let currentTimer = null;
let timerSeconds = 0;
let timerRunning = false;
let completedSteps = new Set();
let checkedIngredients = new Set();

// 解析时间字符串为分钟数
function parseTimeToMinutes(timeStr) {
    const match = timeStr.match(/(\d+)/);
    return match ? parseInt(match[1]) : 30;
}

// 格式化秒数为 HH:MM:SS
function formatTime(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) {
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// 打开详情模态框
function openRecipeDetail(lang, recipeIndex) {
    const recipe = recipes[lang][recipeIndex];
    if (!recipe) return;

    const colors = langColors[lang] || langColors['python'];
    const totalMinutes = parseTimeToMinutes(recipe.time);

    // 重置状态
    completedSteps = new Set();
    checkedIngredients = new Set();
    if (currentTimer) { clearInterval(currentTimer); currentTimer = null; }
    timerSeconds = totalMinutes * 60;
    timerRunning = false;

    const overlay = document.getElementById('recipeModal');
    const body = overlay.querySelector('.modal-body');

    // 构建模态框内容
    body.innerHTML = `
        <!-- 计时器 -->
        <div class="timer-section">
            <div class="flex justify-between items-center mb-2">
                <span class="text-sm text-gray-400 flex items-center gap-2">
                    <i class="ri-timer-line"></i> 预计总用时
                </span>
                <span class="text-sm text-gray-500">${recipe.time} · ${recipe.calories}</span>
            </div>
            <div class="timer-display" id="timerDisplay">${formatTime(timerSeconds)}</div>
            <div class="timer-controls">
                <button class="timer-btn primary" id="timerStartBtn" onclick="toggleTimer()">
                    <i class="ri-play-fill"></i> 开始计时
                </button>
                <button class="timer-btn" onclick="resetTimer(${totalMinutes})">
                    <i class="ri-refresh-line"></i> 重置
                </button>
            </div>
        </div>

        <!-- 进度条 -->
        <div class="progress-text" id="progressText">已完成 0 / ${recipe.steps.length} 步</div>
        <div class="progress-bar-container">
            <div class="progress-bar-fill" id="progressBar"></div>
        </div>

        <!-- 原料清单 -->
        <div class="mb-5">
            <h3 class="text-base font-bold mb-3 flex items-center gap-2 text-gray-300">
                <i class="ri-shopping-basket-2-line ${colors.text}"></i>
                采购清单
                <span class="text-xs text-gray-500 font-normal" id="ingredientCount">（0/${recipe.ingredients.main.length + recipe.ingredients.auxiliary.length + recipe.ingredients.seasoning.length} 已备齐）</span>
            </h3>
            <div class="space-y-2">
                <div class="text-xs font-semibold text-green-500 mb-1 pl-2">主料</div>
                ${recipe.ingredients.main.map((item, i) => `
                    <div class="ingredient-check-item" onclick="toggleIngredient(this, '${escapeHtml(item)}')">
                        <div class="ingredient-check-box"><i class="ri-check-line"></i></div>
                        <span class="ingredient-name">${escapeHtml(item)}</span>
                    </div>
                `).join('')}
                <div class="text-xs font-semibold text-blue-500 mb-1 mt-2 pl-2">辅料</div>
                ${recipe.ingredients.auxiliary.map((item, i) => `
                    <div class="ingredient-check-item" onclick="toggleIngredient(this, '${escapeHtml(item)}')">
                        <div class="ingredient-check-box"><i class="ri-check-line"></i></div>
                        <span class="ingredient-name">${escapeHtml(item)}</span>
                    </div>
                `).join('')}
                <div class="text-xs font-semibold text-orange-500 mb-1 mt-2 pl-2">调料</div>
                ${recipe.ingredients.seasoning.map((item, i) => `
                    <div class="ingredient-check-item" onclick="toggleIngredient(this, '${escapeHtml(item)}')">
                        <div class="ingredient-check-box"><i class="ri-check-line"></i></div>
                        <span class="ingredient-name">${escapeHtml(item)}</span>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- 烹饪步骤 TodoList -->
        <div>
            <h3 class="text-base font-bold mb-3 flex items-center gap-2 text-gray-300">
                <i class="ri-chef-hat-line ${colors.text}"></i>
                烹饪步骤
            </h3>
            <div class="space-y-2" id="todoSteps">
                ${recipe.steps.map((step, i) => `
                    <div class="todo-step" onclick="toggleStep(this, ${i})" data-step="${i}">
                        <div class="todo-checkbox"><i class="ri-check-line"></i></div>
                        <span class="todo-step-number">${String(i + 1).padStart(2, '0')}</span>
                        <p class="todo-text">${escapeHtml(step)}</p>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- 完成庆祝 -->
        <div class="completion-banner" id="completionBanner">
            <div class="text-3xl mb-2">🎉</div>
            <p class="text-lg font-bold text-green-400 mb-1">大功告成！</p>
            <p class="text-sm text-gray-400">${escapeHtml(recipe.dishName)} 制作完成，享受美食吧！</p>
        </div>
    `;

    // 设置头部信息
    overlay.querySelector('.modal-dish-name').textContent = recipe.dishName;
    overlay.querySelector('.modal-dish-name').className = `modal-dish-name text-xl font-bold bg-gradient-to-r ${colors.bg} bg-clip-text text-transparent`;
    overlay.querySelector('.modal-keyword').textContent = recipe.keyword;
    overlay.querySelector('.modal-keyword').className = `modal-keyword font-code text-sm ${colors.text}`;
    overlay.querySelector('.modal-difficulty').textContent = recipe.difficulty;

    // 显示模态框
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// 关闭模态框
function closeRecipeDetail() {
    const overlay = document.getElementById('recipeModal');
    overlay.classList.remove('active');
    document.body.style.overflow = '';

    // 停止计时器
    if (currentTimer) {
        clearInterval(currentTimer);
        currentTimer = null;
        timerRunning = false;
    }
}

// 切换步骤完成状态
function toggleStep(element, stepIndex) {
    if (completedSteps.has(stepIndex)) {
        completedSteps.delete(stepIndex);
        element.classList.remove('completed');
    } else {
        completedSteps.add(stepIndex);
        element.classList.add('completed');
    }
    updateProgress();
}

// 切换原料勾选
function toggleIngredient(element, name) {
    if (checkedIngredients.has(name)) {
        checkedIngredients.delete(name);
        element.classList.remove('checked');
    } else {
        checkedIngredients.add(name);
        element.classList.add('checked');
    }
    updateIngredientCount();
}

// 更新进度
function updateProgress() {
    const totalSteps = document.querySelectorAll('.todo-step').length;
    const done = completedSteps.size;
    const pct = totalSteps > 0 ? (done / totalSteps * 100) : 0;

    document.getElementById('progressBar').style.width = pct + '%';
    document.getElementById('progressText').textContent = `已完成 ${done} / ${totalSteps} 步`;

    const banner = document.getElementById('completionBanner');
    if (done === totalSteps && totalSteps > 0) {
        banner.classList.add('show');
        // 停止计时器
        if (currentTimer) {
            clearInterval(currentTimer);
            currentTimer = null;
            timerRunning = false;
            updateTimerButton();
        }
    } else {
        banner.classList.remove('show');
    }
}

// 更新原料计数
function updateIngredientCount() {
    const total = document.querySelectorAll('.ingredient-check-item').length;
    const done = checkedIngredients.size;
    document.getElementById('ingredientCount').textContent = `（${done}/${total} 已备齐）`;
}

// 计时器控制
function toggleTimer() {
    if (timerRunning) {
        // 暂停
        clearInterval(currentTimer);
        currentTimer = null;
        timerRunning = false;
    } else {
        // 开始（倒计时）
        timerRunning = true;
        currentTimer = setInterval(() => {
            timerSeconds--;
            if (timerSeconds <= 0) {
                timerSeconds = 0;
                clearInterval(currentTimer);
                currentTimer = null;
                timerRunning = false;
                showToast('⏰ 计时结束！菜应该做好了');
            }
            document.getElementById('timerDisplay').textContent = formatTime(timerSeconds);
        }, 1000);
    }
    updateTimerButton();
}

function updateTimerButton() {
    const btn = document.getElementById('timerStartBtn');
    if (timerRunning) {
        btn.innerHTML = '<i class="ri-pause-fill"></i> 暂停';
        btn.classList.remove('primary');
        btn.classList.add('danger');
    } else {
        btn.innerHTML = '<i class="ri-play-fill"></i> 开始计时';
        btn.classList.remove('danger');
        btn.classList.add('primary');
    }
}

function resetTimer(totalMinutes) {
    if (currentTimer) {
        clearInterval(currentTimer);
        currentTimer = null;
        timerRunning = false;
    }
    timerSeconds = totalMinutes * 60;
    document.getElementById('timerDisplay').textContent = formatTime(timerSeconds);
    updateTimerButton();
}

// 点击模态框外部关闭
document.getElementById('recipeModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        closeRecipeDetail();
    }
});

// ESC 关闭
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeRecipeDetail();
    }
});
