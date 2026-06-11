// ==================== AI 辅助菜谱生成 ====================

// 使用免费的 Hugging Face 模型或模拟 AI 生成
// 实际比赛中可以接入 OpenAI/文心一言/通义千问 API

const aiPrompts = {
    python: "Python 风格：简洁优雅，强调可读性和简洁的语法",
    java: "Java 风格：面向对象，强调类和接口的设计，企业级规范",
    cpp: "C++ 风格：高性能，底层控制，模板元编程的严谨",
    javascript: "JavaScript 风格：异步编程，事件驱动，灵活多变",
    go: "Go 风格：并发编程，简洁高效，强调通道和协程",
    rust: "Rust 风格：内存安全，零成本抽象，模式匹配的严谨",
    kotlin: "Kotlin 风格：空安全，简洁语法，协程和函数式编程"
};

// 模拟 AI 生成（基于规则 + 随机组合）
// 实际使用时替换为真实 API 调用
async function generateRecipeWithAI(lang, keyword) {
    // 模拟 API 延迟
    await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));

    const style = aiPrompts[lang] || aiPrompts['python'];

    // 基于关键字和语言生成菜谱内容
    const dishNames = generateDishNames(keyword, lang);
    const creativity = generateCreativity(keyword, lang);
    const ingredients = generateIngredients(keyword, lang);
    const steps = generateSteps(keyword, lang);

    return {
        keyword: keyword,
        definition: `${keyword} 是 ${langNames[lang] || lang} 中的关键字`,
        creativity: creativity,
        dishName: dishNames[Math.floor(Math.random() * dishNames.length)],
        difficulty: ['⭐ 简单', '⭐⭐ 中等', '⭐⭐⭐ 较难'][Math.floor(Math.random() * 3)],
        time: ['15分钟', '30分钟', '45分钟', '60分钟'][Math.floor(Math.random() * 4)],
        calories: ['200kcal', '350kcal', '500kcal', '650kcal'][Math.floor(Math.random() * 4)],
        ingredients: ingredients,
        steps: steps
    };
}

function generateDishNames(keyword, lang) {
    const prefixes = {
        python: ['Pythonic', '优雅', '简洁'],
        java: ['企业级', '面向对象', 'Java'],
        cpp: ['高性能', '底层', 'C++'],
        javascript: ['异步', '回调', 'JS'],
        go: ['并发', '协程', 'Go'],
        rust: ['安全', '零成本', 'Rust'],
        kotlin: ['空安全', '协程', 'Kotlin']
    };
    const prefix = prefixes[lang] || prefixes['python'];
    const foods = ['炒饭', '面条', '汤', '煎饼', '包子', '饺子', '烧烤', '沙拉', '蛋糕', '奶茶'];

    return prefix.flatMap(p => foods.map(f => `${p}${f}`)).slice(0, 5);
}

function generateCreativity(keyword, lang) {
    const templates = [
        `${keyword} 就像做这道菜——需要精确的步骤和恰到好处的时机。每一个${keyword}操作，都对应着烹饪中的一个关键动作。`,
        `在 ${langNames[lang] || lang} 中，${keyword} 代表着一种编程哲学。而这道菜，正是这种哲学在厨房中的完美体现。`,
        `如果把 ${keyword} 比作烹饪，那么它就像是${['切菜', '调味', '翻炒', '装盘'][Math.floor(Math.random() * 4)]}——看似简单，却决定了整道菜的成败。`,
        `${keyword} 的精髓在于${['顺序', '时机', '组合', '平衡'][Math.floor(Math.random() * 4)]}。做这道菜也一样，每一步都要恰到好处。`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
}

function generateIngredients(keyword, lang) {
    const mains = [
        ['鸡胸肉 200g', '西兰花 150g'],
        ['五花肉 300g', '土豆 2个'],
        ['虾仁 200g', '鸡蛋 3个'],
        ['牛肉 250g', '青椒 3个'],
        ['豆腐 1块', '肉末 100g']
    ];
    const auxs = [
        ['生姜 3片', '大蒜 2瓣'],
        ['葱花 适量', '香菜 少许'],
        ['洋葱 半个', '胡萝卜 1根'],
        ['芹菜 2根', '红椒 1个']
    ];
    const seasonings = [
        ['盐 适量', '生抽 1汤匙', '料酒 1汤匙'],
        ['糖 1茶匙', '醋 1汤匙', '蚝油 1汤匙'],
        ['胡椒粉 少许', '香油 1茶匙', '淀粉 1汤匙'],
        ['豆瓣酱 1汤匙', '辣椒油 1茶匙', '花椒粉 少许']
    ];

    return {
        main: mains[Math.floor(Math.random() * mains.length)],
        auxiliary: auxs[Math.floor(Math.random() * auxs.length)],
        seasoning: seasonings[Math.floor(Math.random() * seasonings.length)]
    };
}

function generateSteps(keyword, lang) {
    const stepTemplates = [
        ['准备食材，洗净切好备用', '热锅凉油，爆香葱姜蒜', '放入主料翻炒至变色', '加入调料调味', '翻炒均匀后出锅装盘'],
        ['食材预处理，切成合适大小', '调制酱汁备用', '热锅下油，煎至两面金黄', '倒入酱汁，小火慢炖', '大火收汁，装盘即可'],
        ['所有食材切丁备用', '锅中烧水，焯烫食材', '捞出沥干，过凉水', '调制凉拌汁', '拌匀装盘，撒上葱花']
    ];
    return stepTemplates[Math.floor(Math.random() * stepTemplates.length)];
}

// ==================== AI 生成弹窗 ====================
function openAIGenModal() {
    const overlay = document.createElement('div');
    overlay.className = 'ai-overlay';
    overlay.id = 'aiGenOverlay';
    overlay.innerHTML = `
        <div class="ai-card">
            <div class="ai-header">
                <h2><i class="ri-robot-2-line"></i> AI 菜谱生成器</h2>
                <button class="modal-close" onclick="closeAIGenModal()">✕</button>
            </div>
            <div class="ai-body">
                <div class="form-group">
                    <label class="form-label">编程语言</label>
                    <select class="form-select" id="aiLang">
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                        <option value="javascript">JavaScript</option>
                        <option value="go">Go</option>
                        <option value="rust">Rust</option>
                        <option value="kotlin">Kotlin</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">关键字 <span class="required">*</span></label>
                    <input type="text" class="form-input" id="aiKeyword" placeholder="如：async, map, try, lambda...">
                </div>
                <button class="ai-gen-btn" id="aiGenBtn" onclick="startAIGeneration()">
                    <i class="ri-magic-line"></i> 生成菜谱
                </button>
                <div class="ai-result" id="aiResult" style="display:none"></div>
                <div class="ai-actions" id="aiActions" style="display:none">
                    <button class="submit-btn" onclick="submitAIGeneratedRecipe()">
                        <i class="ri-send-plane-fill"></i> 投稿到社区
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('active'));
    document.body.style.overflow = 'hidden';
}

function closeAIGenModal() {
    const overlay = document.getElementById('aiGenOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

let lastGeneratedRecipe = null;
let lastGeneratedLang = null;

async function startAIGeneration() {
    const lang = document.getElementById('aiLang').value;
    const keyword = document.getElementById('aiKeyword').value.trim();

    if (!keyword) {
        showToast('请输入关键字');
        return;
    }

    const btn = document.getElementById('aiGenBtn');
    const result = document.getElementById('aiResult');
    const actions = document.getElementById('aiActions');

    btn.disabled = true;
    btn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> AI 正在思考...';
    result.style.display = 'none';
    actions.style.display = 'none';

    try {
        const recipe = await generateRecipeWithAI(lang, keyword);
        lastGeneratedRecipe = recipe;
        lastGeneratedLang = lang;

        const colors = langColors[lang] || langColors['python'];

        result.innerHTML = `
            <div class="ai-recipe-preview">
                <div class="flex items-start justify-between mb-2">
                    <div class="keyword-glow ${colors.text} text-xl font-code font-bold">${escapeHtml(recipe.keyword)}</div>
                    <span class="px-2 py-1 ${colors.light} ${colors.text} rounded-full text-xs">${recipe.difficulty}</span>
                </div>
                <p class="text-lg font-bold bg-gradient-to-r ${colors.bg} bg-clip-text text-transparent mb-2">${escapeHtml(recipe.dishName)}</p>
                <p class="text-sm text-gray-400 mb-3">${escapeHtml(recipe.creativity)}</p>
                <div class="flex gap-3 text-xs text-gray-500 mb-3">
                    <span>⏱ ${recipe.time}</span>
                    <span>🔥 ${recipe.calories}</span>
                    <span>📋 ${recipe.steps.length} 步</span>
                </div>
                <div class="ai-ingredients">
                    <p class="text-xs font-semibold text-green-500 mb-1">主料</p>
                    <p class="text-xs text-gray-400">${recipe.ingredients.main.join('、')}</p>
                </div>
            </div>
        `;
        result.style.display = 'block';
        actions.style.display = 'block';
        showToast('AI 生成成功！');
    } catch (e) {
        showToast('生成失败，请重试');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="ri-magic-line"></i> 生成菜谱';
    }
}

function submitAIGeneratedRecipe() {
    if (!lastGeneratedRecipe || !lastGeneratedLang) return;

    const community = JSON.parse(localStorage.getItem('cookbook_community') || '[]');
    community.push({
        ...lastGeneratedRecipe,
        lang: lastGeneratedLang,
        id: Date.now(),
        author: 'AI 大厨'
    });
    localStorage.setItem('cookbook_community', JSON.stringify(community));

    closeAIGenModal();
    showToast('AI 生成的菜谱已投稿到社区！');

    // 刷新社区和对应语言
    if (typeof renderedSections !== 'undefined') {
        renderedSections.delete(lastGeneratedLang);
        renderedSections.delete('community');
    }
    if (currentLang === lastGeneratedLang) {
        renderCards(lastGeneratedLang);
    } else if (currentLang === 'community') {
        renderCommunityRecipes();
    }

    updateTotalCount();
}

// 点击外部关闭
document.addEventListener('click', (e) => {
    const overlay = document.getElementById('aiGenOverlay');
    if (overlay && e.target === overlay) {
        closeAIGenModal();
    }
});
