// ==================== "编译成菜" 动画 ====================

// 音效管理器
const CompileAudio = {
    ctx: null,
    initialized: false,

    init() {
        if (this.initialized) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        } catch (e) {
            console.warn('[CompileAudio] 音频上下文初始化失败');
        }
    },

    // 打字机音效（短促的机械键盘声）
    playTyping() {
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = 'square';
            // 随机频率模拟不同按键
            osc.frequency.setValueAtTime(600 + Math.random() * 800, this.ctx.currentTime);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(3000, this.ctx.currentTime);

            gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

            osc.start(this.ctx.currentTime);
            osc.stop(this.ctx.currentTime + 0.04);
        } catch (e) {}
    },

    // 回车/换行音效
    playEnter() {
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(200, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.08);

            gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

            osc.start(this.ctx.currentTime);
            osc.stop(this.ctx.currentTime + 0.08);
        } catch (e) {}
    },

    // 编译成功音效（三音阶上升）
    playSuccess() {
        if (!this.ctx) return;
        try {
            const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
            notes.forEach((freq, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.12);

                gain.gain.setValueAtTime(0, this.ctx.currentTime + i * 0.12);
                gain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + i * 0.12 + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.12 + 0.3);

                osc.start(this.ctx.currentTime + i * 0.12);
                osc.stop(this.ctx.currentTime + i * 0.12 + 0.3);
            });
        } catch (e) {}
    },

    // 用户交互后初始化（浏览器策略要求）
    ensureInit() {
        if (!this.initialized) {
            this.init();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }
};

// 全局点击监听，首次交互时初始化音频
document.addEventListener('click', function compileAudioInit() {
    CompileAudio.ensureInit();
    document.removeEventListener('click', compileAudioInit);
}, { once: true });

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

        // 逐字显示效果（带音效）
        let charIndex = 0;
        const typeChar = () => {
            if (charIndex < line.length) {
                div.textContent += line[charIndex];
                charIndex++;
                // 播放打字机音效
                CompileAudio.playTyping();
                setTimeout(typeChar, 15 + Math.random() * 20);
            } else {
                // 行结束播放回车音效
                CompileAudio.playEnter();
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

// ==================== 菜谱详情页伪代码生成 ====================

// 各语言的伪代码模板
const pseudoCodeTemplates = {
    python: (recipe) => {
        const mainItems = recipe.ingredients.main.map(i => `    "${i}"`).join(',\n');
        const stepItems = recipe.steps.map((s, i) => `    # ${i + 1}. ${s.substring(0, 30)}...`).join('\n');
        return `# ${recipe.dishName} — ${recipe.keyword} 风格
# 预计用时: ${recipe.time} | 热量: ${recipe.calories}

def cook_${recipe.keyword.replace(/[^a-zA-Z0-9_]/g, '_')}():
    """${recipe.creativity.substring(0, 40)}..."""
    
    # 导入食材
    ingredients = [
${mainItems}
    ]
    
    # 烹饪步骤
${stepItems}
    
    # 返回美味
    return Dish(name="${recipe.dishName}", delicious=True)

if __name__ == "__main__":
    result = cook_${recipe.keyword.replace(/[^a-zA-Z0-9_]/g, '_')}()
    print(f"✓ {result.name} 制作完成！")`;
    },

    java: (recipe) => {
        const mainItems = recipe.ingredients.main.map(i => `        ingredients.add("${i}");`).join('\n');
        const stepItems = recipe.steps.map((s, i) => `        // ${i + 1}. ${s.substring(0, 30)}...`).join('\n');
        return `// ${recipe.dishName} — ${recipe.keyword} 风格
// 预计用时: ${recipe.time} | 热量: ${recipe.calories}

public class ${recipe.dishName.replace(/[^a-zA-Z0-9]/g, '')} implements Cookable {
    
    @Override
    public Dish cook() {
        // ${recipe.creativity.substring(0, 40)}...
        
        List<String> ingredients = new ArrayList<>();
${mainItems}
        
        // 烹饪步骤
${stepItems}
        
        return new Dish("${recipe.dishName}", true);
    }
    
    public static void main(String[] args) {
        Dish result = new ${recipe.dishName.replace(/[^a-zA-Z0-9]/g, '')}().cook();
        System.out.println("✓ " + result.getName() + " 制作完成！");
    }
}`;
    },

    cpp: (recipe) => {
        const mainItems = recipe.ingredients.main.map(i => `    ingredients.push_back("${i}");`).join('\n');
        const stepItems = recipe.steps.map((s, i) => `    // ${i + 1}. ${s.substring(0, 30)}...`).join('\n');
        return `// ${recipe.dishName} — ${recipe.keyword} 风格
// 预计用时: ${recipe.time} | 热量: ${recipe.calories}

#include <iostream>
#include <vector>
#include <string>

class ${recipe.dishName.replace(/[^a-zA-Z0-9]/g, '')} {
public:
    Dish cook() {
        // ${recipe.creativity.substring(0, 40)}...
        
        std::vector<std::string> ingredients;
${mainItems}
        
        // 烹饪步骤
${stepItems}
        
        return Dish("${recipe.dishName}", true);
    }
};

int main() {
    ${recipe.dishName.replace(/[^a-zA-Z0-9]/g, '')} dish;
    auto result = dish.cook();
    std::cout << "✓ " << result.name << " 制作完成！" << std::endl;
    return 0;
}`;
    },

    javascript: (recipe) => {
        const mainItems = recipe.ingredients.main.map(i => `    "${i}"`).join(',\n');
        const stepItems = recipe.steps.map((s, i) => `    // ${i + 1}. ${s.substring(0, 30)}...`).join('\n');
        return `// ${recipe.dishName} — ${recipe.keyword} 风格
// 预计用时: ${recipe.time} | 热量: ${recipe.calories}

async function cook${recipe.dishName.replace(/[^a-zA-Z0-9]/g, '')}() {
    // ${recipe.creativity.substring(0, 40)}...
    
    const ingredients = [
${mainItems}
    ];
    
    // 烹饪步骤
${stepItems}
    
    return {
        name: "${recipe.dishName}",
        delicious: true
    };
}

// 执行烹饪
cook${recipe.dishName.replace(/[^a-zA-Z0-9]/g, '')}()
    .then(result => console.log(\`✓ \${result.name} 制作完成！\`))
    .catch(err => console.error("烹饪失败:", err));`;
    },

    go: (recipe) => {
        const mainItems = recipe.ingredients.main.map(i => `        "${i}"`).join(',\n');
        const stepItems = recipe.steps.map((s, i) => `    // ${i + 1}. ${s.substring(0, 30)}...`).join('\n');
        return `// ${recipe.dishName} — ${recipe.keyword} 风格
// 预计用时: ${recipe.time} | 热量: ${recipe.calories}

package main

import "fmt"

func Cook${recipe.dishName.replace(/[^a-zA-Z0-9]/g, '')}() Dish {
    // ${recipe.creativity.substring(0, 40)}...
    
    ingredients := []string{
${mainItems}
    }
    
    // 烹饪步骤
${stepItems}
    
    return Dish{
        Name: "${recipe.dishName}",
        Delicious: true,
    }
}

func main() {
    result := Cook${recipe.dishName.replace(/[^a-zA-Z0-9]/g, '')}()
    fmt.Printf("✓ %s 制作完成！\\n", result.Name)
}`;
    },

    rust: (recipe) => {
        const mainItems = recipe.ingredients.main.map(i => `        "${i}"`).join(',\n');
        const stepItems = recipe.steps.map((s, i) => `    // ${i + 1}. ${s.substring(0, 30)}...`).join('\n');
        return `// ${recipe.dishName} — ${recipe.keyword} 风格
// 预计用时: ${recipe.time} | 热量: ${recipe.calories}

pub struct ${recipe.dishName.replace(/[^a-zA-Z0-9]/g, '')};

impl ${recipe.dishName.replace(/[^a-zA-Z0-9]/g, '')} {
    pub fn cook(&self) -> Dish {
        // ${recipe.creativity.substring(0, 40)}...
        
        let ingredients = vec![
${mainItems}
        ];
        
        // 烹饪步骤
${stepItems}
        
        Dish {
            name: "${recipe.dishName}".to_string(),
            delicious: true,
        }
    }
}

fn main() {
    let dish = ${recipe.dishName.replace(/[^a-zA-Z0-9]/g, '')};
    let result = dish.cook();
    println!("✓ {} 制作完成！", result.name);
}`;
    },

    kotlin: (recipe) => {
        const mainItems = recipe.ingredients.main.map(i => `        "${i}"`).join(',\n');
        const stepItems = recipe.steps.map((s, i) => `        // ${i + 1}. ${s.substring(0, 30)}...`).join('\n');
        return `// ${recipe.dishName} — ${recipe.keyword} 风格
// 预计用时: ${recipe.time} | 热量: ${recipe.calories}

class ${recipe.dishName.replace(/[^a-zA-Z0-9]/g, '')} : Cookable {
    
    override fun cook(): Dish {
        // ${recipe.creativity.substring(0, 40)}...
        
        val ingredients = listOf(
${mainItems}
        )
        
        // 烹饪步骤
${stepItems}
        
        return Dish(
            name = "${recipe.dishName}",
            delicious = true
        )
    }
}

fun main() {
    val result = ${recipe.dishName.replace(/[^a-zA-Z0-9]/g, '')}().cook()
    println("✓ ${'$'}{result.name} 制作完成！")
}`;
    }
};

// 生成伪代码 HTML
function generatePseudoCodeHTML(lang, recipe) {
    const template = pseudoCodeTemplates[lang] || pseudoCodeTemplates['python'];
    const code = template(recipe);
    const colors = langColors[lang] || langColors['python'];

    return `
        <div class="pseudo-code-section">
            <div class="pseudo-code-header">
                <i class="ri-code-s-slash-line ${colors.text}"></i>
                <span>运行这道菜</span>
                <button class="pseudo-copy-btn" onclick="copyPseudoCode(this)" title="复制代码">
                    <i class="ri-file-copy-line"></i>
                </button>
            </div>
            <pre class="pseudo-code-block"><code>${escapeHtml(code)}</code></pre>
        </div>
    `;
}

// 复制伪代码
function copyPseudoCode(btn) {
    const code = btn.closest('.pseudo-code-section').querySelector('code').textContent;
    navigator.clipboard.writeText(code).then(() => {
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="ri-check-line"></i>';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.innerHTML = original;
            btn.classList.remove('copied');
        }, 1500);
        showToast('伪代码已复制到剪贴板');
    }).catch(() => {
        showToast('复制失败');
    });
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
