// ==================== "编译成菜" 动画 ====================

// 各语言的编译代码模板
const compileTemplates = {
    python: (recipe) => [
        `>>> import ${recipe.ingredients.main[0]?.split(' ')[0] || '食材'}`,
        `>>> def ${recipe.keyword}():`,
        `...     """${recipe.creativity.substring(0, 30)}..."""`,
        `...     准备(${recipe.ingredients.main.map(i => `'${i}'`).join(', ')})`,
        `...     for step in [${recipe.steps.map((s, i) => `'${s.substring(0, 10)}...'`).join(', ')}]:`,
        `...         execute(step)`,
        `...     return "${recipe.dishName}"`,
        `>>> ${recipe.keyword}()`,
        `'${recipe.dishName}'`,
        `>>> # 编译成功！`
    ],
    java: (recipe) => [
        `$ javac ${recipe.dishName}.java`,
        `$ java ${recipe.dishName}`,
        `[INFO] 正在编译 ${recipe.keyword}...`,
        `[INFO] 导入原料: ${recipe.ingredients.main.map(i => i.split(' ')[0]).join(', ')}`,
        `[INFO] 执行步骤:`,
        ...recipe.steps.map((s, i) => `[STEP ${i + 1}] ${s.substring(0, 25)}...`),
        `[SUCCESS] 构建完成: ${recipe.dishName}`,
        `[SUCCESS] 用时: ${recipe.time}`,
        `$ # 编译成功！`
    ],
    cpp: (recipe) => [
        `$ g++ -std=c++17 -o ${recipe.dishName} main.cpp`,
        `[compiling] ${recipe.keyword}.cpp`,
        `[linking] ${recipe.ingredients.main.map(i => i.split(' ')[0] + '.o').join(' ')}`,
        ...recipe.steps.map((s, i) => `[step${i + 1}] ${s.substring(0, 25)}...`),
        `$ ./${recipe.dishName}`,
        `> ${recipe.dishName} 制作完成！`,
        `> 热量: ${recipe.calories}`,
        `$ # 编译成功！`
    ],
    javascript: (recipe) => [
        `$ node ${recipe.keyword}.js`,
        `> const ingredients = [${recipe.ingredients.main.map(i => `'${i}'`).join(', ')}];`,
        `> const steps = async () => {`,
        ...recipe.steps.map((s, i) => `>   await cook('${s.substring(0, 20)}...');`),
        `>   return '${recipe.dishName}';`,
        `> };`,
        `> steps().then(dish => console.log(dish));`,
        `> ${recipe.dishName}`,
        `$ # 编译成功！`
    ],
    go: (recipe) => [
        `$ go build -o ${recipe.dishName}`,
        `go: downloading ingredients v1.0.0`,
        `go: compiling ${recipe.keyword}.go`,
        ...recipe.steps.map((s, i) => `=> step ${i + 1}: ${s.substring(0, 25)}...`),
        `$ ./${recipe.dishName}`,
        `🍳 ${recipe.dishName} ready!`,
        `$ # 编译成功！`
    ],
    rust: (recipe) => [
        `$ cargo build --release`,
        `   Compiling ${recipe.keyword} v0.1.0`,
        `    Finished release [optimized]`,
        ...recipe.steps.map((s, i) => `    [${i + 1}/${recipe.steps.length}] ${s.substring(0, 30)}...`),
        `$ cargo run`,
        `    Running \`target/release/${recipe.keyword}\``,
        `🦀 ${recipe.dishName} 制作完成！`,
        `$ # 编译成功！`
    ],
    kotlin: (recipe) => [
        `$ kotlinc ${recipe.keyword}.kt -include-runtime -d ${recipe.dishName}.jar`,
        `$ java -jar ${recipe.dishName}.jar`,
        `>> 初始化厨房...`,
        `>> 准备: ${recipe.ingredients.main.map(i => i.split(' ')[0]).join(', ')}`,
        ...recipe.steps.map((s, i) => `>> [${i + 1}] ${s.substring(0, 25)}...`),
        `>> ✓ ${recipe.dishName} 完成！`,
        `$ # 编译成功！`
    ]
};

let compileOverlay = null;

function showCompileAnimation(lang, recipe, onComplete) {
    // 如果已有动画在进行，先移除
    if (compileOverlay) {
        compileOverlay.remove();
        compileOverlay = null;
    }

    const template = compileTemplates[lang] || compileTemplates['python'];
    const lines = template(recipe);

    compileOverlay = document.createElement('div');
    compileOverlay.className = 'compile-overlay';
    compileOverlay.innerHTML = `
        <div class="compile-terminal">
            <div class="compile-header">
                <div class="compile-dots">
                    <span></span><span></span><span></span>
                </div>
                <span class="compile-title">${escapeHtml(langNames[lang] || lang)} Compiler</span>
            </div>
            <div class="compile-body" id="compileBody"></div>
        </div>
    `;
    document.body.appendChild(compileOverlay);
    requestAnimationFrame(() => compileOverlay.classList.add('active'));

    const body = compileOverlay.querySelector('#compileBody');
    let lineIndex = 0;

    function typeNextLine() {
        if (lineIndex >= lines.length) {
            // 所有行显示完毕，延迟后关闭并执行回调
            setTimeout(() => {
                closeCompileAnimation();
                if (onComplete) onComplete();
            }, 800);
            return;
        }

        const line = lines[lineIndex];
        const div = document.createElement('div');
        div.className = 'compile-line';

        // 根据内容设置颜色
        if (line.includes('编译成功') || line.includes('SUCCESS') || line.includes('ready') || line.includes('完成')) {
            div.classList.add('compile-success');
        } else if (line.includes('ERROR') || line.includes('error')) {
            div.classList.add('compile-error');
        } else if (line.startsWith('$') || line.startsWith('>') || line.startsWith('>>>')) {
            div.classList.add('compile-prompt');
        } else if (line.startsWith('[INFO]') || line.startsWith('[STEP]') || line.startsWith('=>') || line.startsWith('>>')) {
            div.classList.add('compile-info');
        }

        body.appendChild(div);

        // 逐字显示效果
        let charIndex = 0;
        const typeChar = () => {
            if (charIndex < line.length) {
                div.textContent += line[charIndex];
                charIndex++;
                setTimeout(typeChar, 15 + Math.random() * 20);
            } else {
                lineIndex++;
                body.scrollTop = body.scrollHeight;
                setTimeout(typeNextLine, 200 + Math.random() * 150);
            }
        };
        typeChar();
    }

    // 开始打字
    setTimeout(typeNextLine, 300);
}

function closeCompileAnimation() {
    if (compileOverlay) {
        compileOverlay.classList.remove('active');
        setTimeout(() => {
            if (compileOverlay) {
                compileOverlay.remove();
                compileOverlay = null;
            }
        }, 400);
    }
}

// 点击外部关闭
function initCompileOverlayClose() {
    document.addEventListener('click', (e) => {
        if (compileOverlay && e.target === compileOverlay) {
            closeCompileAnimation();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && compileOverlay) {
            closeCompileAnimation();
        }
    });
}

initCompileOverlayClose();

// ==================== 编译动画 + 打开详情 ====================
function startCompileThenOpen(lang, index, source) {
    let recipe;
    if (source === 'community') {
        const community = JSON.parse(localStorage.getItem('cookbook_community') || '[]');
        recipe = community[index];
    } else {
        recipe = recipes[lang]?.[index];
    }

    if (!recipe) {
        // 没有 recipe 直接打开
        if (source === 'community') {
            openCommunityDetail(index);
        } else {
            openRecipeDetail(lang, index);
        }
        return;
    }

    // 播放编译动画，完成后打开详情
    showCompileAnimation(lang, recipe, () => {
        if (source === 'community') {
            openCommunityDetail(index);
        } else {
            openRecipeDetail(lang, index);
        }
    });
}
