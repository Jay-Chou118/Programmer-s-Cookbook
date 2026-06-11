// ==================== 可灵 AI 图片生成（快手官方 API）====================
// 可灵 AI 是快手自研的视觉生成大模型，支持文生图、图生视频
// 比赛时使用可灵 API 可以展示对快手生态的了解和技术深度
//
// 认证方式：JWT (HS256/HMAC-SHA256)
// API 模式：异步任务（提交 → 轮询 → 获取结果）
// 配置文件：js/config.js（已被 .gitignore 排除，不提交到 GitHub）
//
// 安全说明：
// - config.js 包含真实密钥，已被 .gitignore 排除
// - 前端直接调用仅适用于演示/比赛场景
// - 生产环境应通过后端代理转发请求
// ===================================================================

// ==================== 配置管理 ====================

// 默认配置
const KLING_DEFAULTS = {
    baseURL: 'https://api-beijing.klingai.com',
    accessKey: '',
    secretKey: '',
    model: 'kling-v2-1',
    aspectRatio: '1:1',
    style: '1k',
    n: 1,
    watermark: false,
    tokenExpireMinutes: 60,
};

// 合并配置（config.js 优先）
function getKlingConfig() {
    if (typeof KLING_CONFIG !== 'undefined') {
        return { ...KLING_DEFAULTS, ...KLING_CONFIG };
    }
    return KLING_DEFAULTS;
}

// 检查 API 是否可用
function isKlingAvailable() {
    const cfg = getKlingConfig();
    return cfg.accessKey && cfg.secretKey &&
           cfg.accessKey !== 'YOUR_ACCESS_KEY_HERE' &&
           cfg.secretKey !== 'YOUR_SECRET_KEY_HERE';
}

// ==================== JWT Token 生成（纯前端实现）====================

// Base64URL 编码
function base64UrlEncode(str) {
    // 处理 Unicode 字符
    const utf8Bytes = new TextEncoder().encode(str);
    let binary = '';
    utf8Bytes.forEach(b => binary += String.fromCharCode(b));
    return btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

// HMAC-SHA256 签名（使用 Web Crypto API）
async function hmacSHA256(secret, message) {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const msgData = encoder.encode(message);

    const key = await crypto.subtle.importKey(
        'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', key, msgData);
    // 转换为 Base64URL
    const signatureArray = new Uint8Array(signature);
    let binary = '';
    signatureArray.forEach(b => binary += String.fromCharCode(b));
    return btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

// 生成 JWT Token
async function generateJWTToken() {
    const cfg = getKlingConfig();
    const now = Math.floor(Date.now() / 1000);
    const expire = now + cfg.tokenExpireMinutes * 60;

    // JWT Header
    const header = base64UrlEncode(JSON.stringify({
        alg: 'HS256',
        typ: 'JWT',
    }));

    // JWT Payload
    const payload = base64UrlEncode(JSON.stringify({
        iss: cfg.accessKey,       // 签发者 = Access Key
        iat: now,                  // 签发时间
        exp: expire,               // 过期时间
        nbf: now,                   // 生效时间
    }));

    // JWT Signature
    const signingInput = `${header}.${payload}`;
    const signature = await hmacSHA256(cfg.secretKey, signingInput);

    return `${header}.${payload}.${signature}`;
}

// ==================== 核心 API 调用 ====================

// 提交文生图任务
async function submitImageTask(prompt, negativePrompt = '') {
    const cfg = getKlingConfig();
    const token = await generateJWTToken();

    const requestBody = {
        model_name: cfg.model,
        prompt: prompt,
        negative_prompt: negativePrompt,
        n: cfg.n,
        aspect_ratio: cfg.aspectRatio,
        style: cfg.style,
        watermark: { enabled: cfg.watermark },
    };

    console.log('[可灵 AI] 提交任务:', requestBody);

    const response = await fetch(`${cfg.baseURL}/v1/images/generations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API 错误 ${response.status}: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('[可灵 AI] 任务已提交, task_id:', data.task_id);
    return data;
}

// 查询任务结果（带轮询）
async function pollTaskResult(taskId, maxAttempts = 30, intervalMs = 3000) {
    const cfg = getKlingConfig();
    const token = await generateJWTToken();

    for (let i = 0; i < maxAttempts; i++) {
        await new Promise(r => setTimeout(r, intervalMs));

        try {
            const response = await fetch(
                `${cfg.baseURL}/v1/images/generations/${taskId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`查询错误 ${response.status}: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            console.log(`[可灵 AI] 轮询 #${i + 1}, 状态:`, data.state || data.task_status);

            // 检查任务状态
            const state = data.state || data.task_status;

            if (state === 'succeed' || data.success === true) {
                // 提取图片 URL
                if (data.images && data.images[0] && data.images[0].url) {
                    return data.images[0].url;
                }
                if (data.data && data.data[0] && data.data[0].url) {
                    return data.data[0].url;
                }
                throw new Error('任务成功但未找到图片 URL');
            }

            if (state === 'failed') {
                throw new Error(`任务失败: ${data.error?.message || JSON.stringify(data)}`);
            }

            // 状态为 processing，继续轮询
        } catch (e) {
            if (e.message.startsWith('查询错误') || e.message.startsWith('任务失败')) {
                throw e;
            }
            console.warn(`[可灵 AI] 轮询 #${i + 1} 出错:`, e);
        }
    }

    throw new Error('任务超时（超过 90 秒未完成）');
}

// 生成菜谱配图（完整流程：提交 → 轮询 → 返回图片 URL）
async function generateDishImageWithKling(dishName, keyword, lang) {
    const prompt = generateKlingPrompt(dishName, keyword, lang);

    // 如果 API 未配置，返回占位图
    if (!isKlingAvailable()) {
        console.warn('[可灵 AI] API 密钥未配置，使用占位图。请在 js/config.js 中设置 accessKey 和 secretKey。');
        return generatePlaceholderImage(dishName, keyword);
    }

    try {
        // Step 1: 提交任务
        const submitResult = await submitImageTask(prompt);
        const taskId = submitResult.task_id;

        if (!taskId) {
            throw new Error('未获取到 task_id');
        }

        // Step 2: 轮询等待结果
        const imageUrl = await pollTaskResult(taskId);
        console.log('[可灵 AI] 图片生成成功:', imageUrl);
        return imageUrl;

    } catch (e) {
        console.error('[可灵 AI] 生成失败:', e);
        showToast(`可灵 AI 生成失败: ${e.message}`);
        return generatePlaceholderImage(dishName, keyword);
    }
}

// ==================== 提示词生成 ====================

// 生成可灵优化的提示词
function generateKlingPrompt(dishName, keyword, lang) {
    const stylePrompts = {
        python: '清新明亮风格，简约现代摆盘，蓝绿色调',
        java: '经典商务风格，精致优雅的餐具，暖橙色调',
        cpp: '工业风格，金属质感背景，冷蓝色调',
        javascript: '活力多彩风格，创意摆盘，明亮黄色调',
        go: '极简主义风格，干净利落的构图，天蓝色调',
        rust: '复古温暖风格，木质桌面背景，铁锈红色调',
        kotlin: '时尚现代风格，精致细节，紫色调',
    };

    const style = stylePrompts[lang] || stylePrompts['python'];

    return `一张精美的${dishName}美食摄影照片，${style}。菜品色泽诱人，蒸汽袅袅，专业美食摄影灯光，浅景深效果，俯拍角度，高清细节，背景有淡淡的代码元素装饰（如"${keyword}"字样隐约浮现），整体氛围温暖治愈，让人食欲大开，8K超高清画质。`;
}

// ==================== 占位图（API 不可用时降级）====================

// 生成占位图
function generatePlaceholderImage(dishName, keyword) {
    const colors = ['667eea', '764ba2', 'f093fb', 'f5576c', '4facfe', '00f2fe', 'fa709a', 'fee140'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const text = encodeURIComponent(`${dishName}\n[${keyword}]`);
    return `https://placehold.co/400x400/${color}/ffffff?text=${text}`;
}

// ==================== UI 集成 ====================

// 为菜谱卡片添加图片
async function addDishImageToCard(card, dishName, keyword, lang) {
    const imgContainer = card.querySelector('.dish-image-container');
    if (!imgContainer) return;

    imgContainer.innerHTML = '<div class="dish-image-loading"><i class="ri-loader-4-line ri-spin"></i></div>';

    const imageUrl = await generateDishImageWithKling(dishName, keyword, lang);

    if (imageUrl) {
        imgContainer.innerHTML = `<img src="${imageUrl}" alt="${escapeHtml(dishName)}" class="dish-image" loading="lazy" onerror="this.onerror=null;this.parentElement.innerHTML='<div class=\\'dish-image-fallback\\'><i class=\\'ri-image-line\\'></i></div>';">`;
    } else {
        imgContainer.innerHTML = `<div class="dish-image-fallback"><i class="ri-image-line"></i></div>`;
    }
}

// 批量生成所有菜谱图片（后台预生成）
async function preGenerateAllImages() {
    const allRecipes = [];
    for (const lang in recipes) {
        recipes[lang].forEach((r, i) => {
            allRecipes.push({ ...r, lang, index: i });
        });
    }

    for (const recipe of allRecipes) {
        await generateDishImageWithKling(recipe.dishName, recipe.keyword, recipe.lang);
        await new Promise(r => setTimeout(r, 500));
    }
}

// ==================== 可灵生成弹窗 ====================

// 显示可灵生成弹窗
function openKlingGenModal(dishName, keyword, lang) {
    const overlay = document.createElement('div');
    overlay.className = 'kling-overlay';
    overlay.id = 'klingOverlay';

    const isAvailable = isKlingAvailable();
    const apiStatus = isAvailable
        ? '<span class="kling-status kling-status-ok"><i class="ri-check-line"></i> API 已配置</span>'
        : '<span class="kling-status kling-status-warn"><i class="ri-alert-line"></i> API 未配置（将显示占位图）</span>';

    overlay.innerHTML = `
        <div class="kling-card">
            <div class="kling-header">
                <h2><i class="ri-magic-line"></i> 可灵 AI 生成配图</h2>
                <button class="modal-close" onclick="closeKlingModal()">✕</button>
            </div>
            <div class="kling-body">
                <p class="kling-dish">${escapeHtml(dishName)}</p>
                <div class="kling-meta">
                    <span class="kling-keyword">${escapeHtml(keyword)}</span>
                    ${apiStatus}
                </div>
                <p class="kling-prompt">${escapeHtml(generateKlingPrompt(dishName, keyword, lang))}</p>
                <div class="kling-preview" id="klingPreview">
                    <div class="kling-generating">
                        <i class="ri-loader-4-line ri-spin"></i>
                        <p>可灵 AI 正在生成美食图片...</p>
                        <p class="kling-hint" id="klingStatusText">提交任务中...</p>
                    </div>
                </div>
                <button class="kling-regen-btn" onclick="regenerateKlingImage('${escapeHtml(dishName)}', '${escapeHtml(keyword)}', '${lang}')">
                    <i class="ri-refresh-line"></i> 重新生成
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('active'));

    generateAndShowKlingImage(dishName, keyword, lang);
}

async function generateAndShowKlingImage(dishName, keyword, lang) {
    const preview = document.getElementById('klingPreview');
    const statusText = document.getElementById('klingStatusText');
    const prompt = generateKlingPrompt(dishName, keyword, lang);

    // 如果 API 未配置，直接显示占位图
    if (!isKlingAvailable()) {
        if (preview) {
            const fallbackUrl = generatePlaceholderImage(dishName, keyword);
            preview.innerHTML = `<img src="${fallbackUrl}" alt="${escapeHtml(dishName)}" class="kling-result-img">`;
        }
        return;
    }

    try {
        // Step 1: 提交任务
        if (statusText) statusText.textContent = '提交任务中...';
        const submitResult = await submitImageTask(prompt);
        const taskId = submitResult.task_id;

        if (!taskId) {
            throw new Error('未获取到 task_id');
        }

        // Step 2: 轮询等待结果
        if (statusText) statusText.textContent = 'AI 生成中，请稍候...';

        const cfg = getKlingConfig();
        const token = await generateJWTToken();
        let imageUrl = null;

        for (let i = 0; i < 30; i++) {
            await new Promise(r => setTimeout(r, 3000));

            if (statusText) statusText.textContent = `AI 生成中... (${(i + 1) * 3}s)`;

            try {
                const response = await fetch(
                    `${cfg.baseURL}/v1/images/generations/${taskId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) continue;

                const data = await response.json();
                const state = data.state || data.task_status;

                if (state === 'succeed' || data.success === true) {
                    if (data.images && data.images[0] && data.images[0].url) {
                        imageUrl = data.images[0].url;
                    } else if (data.data && data.data[0] && data.data[0].url) {
                        imageUrl = data.data[0].url;
                    }
                    if (imageUrl) break;
                }

                if (state === 'failed') {
                    throw new Error(`任务失败: ${data.error?.message || '未知错误'}`);
                }
            } catch (e) {
                if (e.message.startsWith('任务失败')) throw e;
            }
        }

        if (imageUrl && preview) {
            preview.innerHTML = `<img src="${imageUrl}" alt="${escapeHtml(dishName)}" class="kling-result-img" onerror="this.onerror=null;this.parentElement.innerHTML='<div class=\\'kling-error\\'><i class=\\'ri-error-warning-line\\'></i><p>图片加载失败</p></div>';">`;
        } else if (preview) {
            preview.innerHTML = `
                <div class="kling-error">
                    <i class="ri-error-warning-line"></i>
                    <p>生成超时，请重试</p>
                    <p class="kling-hint">AI 生成可能需要较长时间</p>
                </div>
            `;
        }
    } catch (e) {
        console.error('[可灵 AI] 生成失败:', e);
        if (preview) {
            preview.innerHTML = `
                <div class="kling-error">
                    <i class="ri-error-warning-line"></i>
                    <p>生成失败: ${escapeHtml(e.message)}</p>
                    <p class="kling-hint">请检查 js/config.js 中的密钥配置</p>
                </div>
            `;
        }
    }
}

function regenerateKlingImage(dishName, keyword, lang) {
    const preview = document.getElementById('klingPreview');
    if (preview) {
        preview.innerHTML = `
            <div class="kling-generating">
                <i class="ri-loader-4-line ri-spin"></i>
                <p>可灵 AI 正在生成美食图片...</p>
                <p class="kling-hint" id="klingStatusText">提交任务中...</p>
            </div>
        `;
    }
    generateAndShowKlingImage(dishName, keyword, lang);
}

function closeKlingModal() {
    const overlay = document.getElementById('klingOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    }
}

// 点击外部关闭
document.addEventListener('click', (e) => {
    const overlay = document.getElementById('klingOverlay');
    if (overlay && e.target === overlay) {
        closeKlingModal();
    }
});
