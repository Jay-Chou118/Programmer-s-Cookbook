// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    // 渲染默认的 Python 标签页（用 switchTab 确保颜色正确）
    switchTab('python');

    // 页面加载动画
    if (typeof playIntroAnimations === 'function') {
        playIntroAnimations();
    }

    // 统计信息（含社区）
    let totalRecipes = 0;
    for (const lang in recipes) {
        totalRecipes += recipes[lang].length;
    }
    const community = JSON.parse(localStorage.getItem('cookbook_community') || '[]');
    totalRecipes += community.length;
    document.getElementById('recipeCount').textContent = `共 ${totalRecipes} 道菜谱`;

    // 首次访问欢迎弹窗
    if (typeof showWelcome === 'function') {
        showWelcome();
    }

    // 初始化今日推荐卡片
    if (typeof updateDailyCard === 'function') {
        updateDailyCard();
    }
});

// ==================== 键盘快捷键 ====================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K 聚焦搜索框
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }

    // 数字键切换标签
    const langKeys = { '1': 'python', '2': 'java', '3': 'cpp', '4': 'javascript', '5': 'go', '6': 'rust', '7': 'kotlin' };
    if (langKeys[e.key] && !e.ctrlKey && !e.metaKey) {
        switchTab(langKeys[e.key]);
    }
});
