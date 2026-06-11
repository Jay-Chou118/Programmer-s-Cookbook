#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
404食堂 Demo 录制脚本
使用 Playwright 自动录制网页的所有功能亮点，生成演示视频和截图。

安装依赖:
    pip install playwright
    playwright install chromium

使用方法:
    # 1. 先启动本地服务器
    python3 -m http.server 8080

    # 2. 运行录制脚本
    python3 record_demo.py

    # 3. 输出文件在 output/ 目录下
"""

import asyncio
import os
import sys
from pathlib import Path
from datetime import datetime

from playwright.async_api import async_playwright, Page, BrowserContext

# ==================== 配置 ====================
BASE_URL = "http://localhost:8080"
OUTPUT_DIR = Path("output")
VIEWPORT = {"width": 1920, "height": 1080}

# 确保输出目录存在
OUTPUT_DIR.mkdir(exist_ok=True)


def timestamp():
    """生成时间戳用于文件名"""
    return datetime.now().strftime("%H%M%S")


async def screenshot(page: Page, name: str):
    """截图并保存"""
    path = OUTPUT_DIR / f"{timestamp()}_{name}.png"
    await page.screenshot(path=path, full_page=False)
    print(f"  📸 截图已保存: {path.name}")
    return path


async def record_clip(page: Page, name: str, duration: float = 5.0):
    """录制视频片段"""
    video_path = OUTPUT_DIR / f"{timestamp()}_{name}.webm"
    # Playwright 的 context 会自动录制视频，这里我们主要做截图
    # 如果需要录制视频，可以在 launch 时设置 record_video_dir
    await asyncio.sleep(duration)
    await screenshot(page, name)


# ==================== 录制场景 ====================

async def scene_homepage(page: Page):
    """场景1: 首页展示"""
    print("\n🎬 场景1: 首页展示")
    await page.goto(BASE_URL, wait_until="networkidle")
    await page.wait_for_timeout(2000)

    # 关闭欢迎弹窗（如果有）
    try:
        await page.click("button:has-text('开始探索')", timeout=3000)
        await page.wait_for_timeout(500)
    except:
        pass

    await screenshot(page, "01_homepage")
    await asyncio.sleep(1)


async def scene_theme_switch(page: Page):
    """场景2: 明暗主题切换"""
    print("\n🎬 场景2: 明暗主题切换")
    await page.click("#themeToggle")
    await page.wait_for_timeout(1000)
    await screenshot(page, "02_light_theme")

    await page.click("#themeToggle")
    await page.wait_for_timeout(1000)
    await screenshot(page, "02_dark_theme")


async def scene_language_tabs(page: Page):
    """场景3: 语言标签切换"""
    print("\n🎬 场景3: 语言标签切换")

    languages = [
        ("java", "03_tab_java"),
        ("cpp", "03_tab_cpp"),
        ("javascript", "03_tab_javascript"),
        ("go", "03_tab_go"),
        ("rust", "03_tab_rust"),
        ("kotlin", "03_tab_kotlin"),
        ("python", "03_tab_python"),
    ]

    for lang, name in languages:
        await page.click(f"button[data-lang='{lang}']")
        await page.wait_for_timeout(1200)
        await screenshot(page, name)


async def scene_search(page: Page):
    """场景4: 搜索功能"""
    print("\n🎬 场景4: 搜索功能")
    await page.click("#searchInput")
    await page.fill("#searchInput", "番茄")
    await page.wait_for_timeout(1500)
    await screenshot(page, "04_search_tomato")

    await page.fill("#searchInput", "")
    await page.wait_for_timeout(500)


async def scene_easter_eggs(page: Page):
    """场景5: 程序员彩蛋"""
    print("\n🎬 场景5: 程序员彩蛋")

    # sudo 彩蛋
    await page.click("#searchInput")
    await page.fill("#searchInput", "sudo")
    await page.wait_for_timeout(2000)
    await screenshot(page, "05_easter_sudo")
    await page.fill("#searchInput", "")

    # rm -rf 彩蛋
    await page.fill("#searchInput", "rm -rf")
    await page.wait_for_timeout(2000)
    await screenshot(page, "05_easter_rmrf_danger")

    # 点击确定
    danger_btns = await page.query_selector_all(".danger-btn-confirm")
    if danger_btns:
        await danger_btns[0].click()
        await page.wait_for_timeout(2000)
        await screenshot(page, "05_easter_rmrf_joke")

    await page.fill("#searchInput", "")
    await page.keyboard.press("Escape")
    await page.wait_for_timeout(500)


async def scene_compile_animation(page: Page):
    """场景6: "编译成菜"动画（核心亮点）"""
    print("\n🎬 场景6: 编译成菜动画（核心亮点）")

    # 确保在 Python 标签
    await page.click("button[data-lang='python']")
    await page.wait_for_timeout(1000)

    # 找到第一个卡片的"开始制作"按钮
    make_btns = await page.query_selector_all("button:has-text('开始制作')")
    if make_btns:
        await make_btns[0].click()
        await page.wait_for_timeout(500)

        # 录制动画过程（约 3-5 秒）
        for i in range(8):
            await screenshot(page, f"06_compile_frame_{i}")
            await page.wait_for_timeout(600)

        # 等待动画结束，详情页弹出
        await page.wait_for_timeout(2000)
        await screenshot(page, "06_compile_detail_opened")

        # 关闭详情页
        await page.keyboard.press("Escape")
        await page.wait_for_timeout(500)


async def scene_recipe_detail(page: Page):
    """场景7: 菜谱详情页（计时器 + TodoList + 采购清单）"""
    print("\n🎬 场景7: 菜谱详情页")

    # 打开一个菜谱详情
    cards = await page.query_selector_all(".glass-card")
    if len(cards) > 1:
        await cards[1].click()
        await page.wait_for_timeout(1500)
        await screenshot(page, "07_detail_overview")

        # 尝试勾选几个步骤
        checkboxes = await page.query_selector_all("input[type='checkbox']")
        for cb in checkboxes[:3]:
            try:
                await cb.click()
                await page.wait_for_timeout(500)
            except:
                pass

        await screenshot(page, "07_detail_steps_checked")

        # 关闭详情
        await page.keyboard.press("Escape")
        await page.wait_for_timeout(500)


async def scene_community_submit(page: Page):
    """场景8: 社区投稿"""
    print("\n🎬 场景8: 社区投稿")

    # 点击投稿按钮
    submit_btn = await page.query_selector(".fab-submit")
    if submit_btn:
        await submit_btn.click()
        await page.wait_for_timeout(1500)
        await screenshot(page, "08_submit_form")

        # 关闭弹窗
        await page.keyboard.press("Escape")
        await page.wait_for_timeout(500)


async def scene_ai_generation(page: Page):
    """场景9: AI 菜谱生成"""
    print("\n🎬 场景9: AI 菜谱生成")

    ai_btn = await page.query_selector(".fab-ai")
    if ai_btn:
        await ai_btn.click()
        await page.wait_for_timeout(1500)
        await screenshot(page, "09_ai_modal")

        # 填写关键字
        ai_keyword = await page.query_selector("#aiKeyword")
        if ai_keyword:
            await ai_keyword.fill("async")
            await page.wait_for_timeout(500)

            gen_btn = await page.query_selector("#aiGenBtn")
            if gen_btn:
                await gen_btn.click()
                await page.wait_for_timeout(3000)
                await screenshot(page, "09_ai_generated")

        # 关闭弹窗
        await page.keyboard.press("Escape")
        await page.wait_for_timeout(500)


async def scene_kling_ai(page: Page):
    """场景10: 可灵 AI 配图（快手比赛核心加分项）"""
    print("\n🎬 场景10: 可灵 AI 配图")

    # 回到首页
    await page.goto(BASE_URL, wait_until="networkidle")
    await page.wait_for_timeout(1500)

    # 关闭欢迎弹窗
    try:
        await page.click("button:has-text('开始探索')", timeout=3000)
    except:
        pass

    # 注意：可灵 API 需要真实密钥才能调用
    # 这里展示弹窗 UI 即可
    # 实际录制时如果配置了密钥，可以取消下面的注释

    # 找到第一个卡片的"开始制作"按钮（或添加一个可灵按钮触发）
    # 由于可灵按钮可能在卡片内部，我们需要检查页面结构
    # 这里展示配置状态
    await screenshot(page, "10_kling_ready")

    print("  ℹ️  可灵 AI 需要配置 js/config.js 中的密钥才能实际调用")
    print("  ℹ️  当前展示的是 UI 界面，配置密钥后可录制真实生成过程")


async def scene_favorites(page: Page):
    """场景11: 收藏功能"""
    print("\n🎬 场景11: 收藏功能")

    await page.click("button[data-lang='favorites']")
    await page.wait_for_timeout(1500)
    await screenshot(page, "11_favorites")


async def scene_daily_recommend(page: Page):
    """场景12: 今日推荐"""
    print("\n🎬 场景12: 今日推荐")

    daily_card = await page.query_selector("#dailyCard")
    if daily_card:
        await daily_card.click()
        await page.wait_for_timeout(1500)
        await screenshot(page, "12_daily_recommend")

        await page.keyboard.press("Escape")
        await page.wait_for_timeout(500)


async def scene_title_easter(page: Page):
    """场景13: 标题彩蛋（连续点击5次）"""
    print("\n🎬 场景13: 标题彩蛋")

    title = await page.query_selector("#siteTitle")
    if title:
        for i in range(5):
            await title.click()
            await page.wait_for_timeout(300)

        await page.wait_for_timeout(1500)
        await screenshot(page, "13_emoji_mode")

        # 再点5次关闭
        for i in range(5):
            await title.click()
            await page.wait_for_timeout(300)


async def scene_poster_generation(page: Page):
    """场景14: 海报生成"""
    print("\n🎬 场景14: 海报生成")

    # 确保在 Python 标签
    await page.click("button[data-lang='python']")
    await page.wait_for_timeout(1000)

    # 找到分享按钮
    share_btns = await page.query_selector_all(".share-btn")
    if share_btns:
        await share_btns[0].click()
        await page.wait_for_timeout(2000)
        await screenshot(page, "14_poster")

        # 关闭海报弹窗
        await page.keyboard.press("Escape")
        await page.wait_for_timeout(500)


async def scene_full_page_screenshots(page: Page):
    """场景15: 全页面长截图"""
    print("\n🎬 场景15: 全页面长截图")

    for lang in ["python", "java", "community"]:
        await page.click(f"button[data-lang='{lang}']")
        await page.wait_for_timeout(1500)

        path = OUTPUT_DIR / f"{timestamp()}_fullpage_{lang}.png"
        await page.screenshot(path=path, full_page=True)
        print(f"  📸 长截图已保存: {path.name}")


# ==================== 主录制流程 ====================

async def run_recording():
    """执行完整录制流程"""
    print("=" * 60)
    print("🎥 404食堂 Demo 录制脚本")
    print("=" * 60)
    print(f"\n📁 输出目录: {OUTPUT_DIR.absolute()}")
    print(f"🌐 目标网址: {BASE_URL}")
    print(f"📐 视口尺寸: {VIEWPORT['width']}x{VIEWPORT['height']}")

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=False,  # 设置为 True 可后台运行
            args=["--disable-blink-features=AutomationControlled"]
        )

        context = await browser.new_context(
            viewport=VIEWPORT,
            device_scale_factor=2,  # 高清截图
        )

        page = await context.new_page()

        # 注入脚本隐藏自动化特征
        await page.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
        """)

        try:
            # 按顺序执行所有录制场景
            await scene_homepage(page)
            await scene_theme_switch(page)
            await scene_language_tabs(page)
            await scene_search(page)
            await scene_easter_eggs(page)
            await scene_compile_animation(page)
            await scene_recipe_detail(page)
            await scene_community_submit(page)
            await scene_ai_generation(page)
            await scene_kling_ai(page)
            await scene_favorites(page)
            await scene_daily_recommend(page)
            await scene_title_easter(page)
            await scene_poster_generation(page)
            await scene_full_page_screenshots(page)

            print("\n" + "=" * 60)
            print("✅ 录制完成！")
            print("=" * 60)

            # 列出所有输出文件
            files = sorted(OUTPUT_DIR.glob("*.png")) + sorted(OUTPUT_DIR.glob("*.webm"))
            print(f"\n📂 共生成 {len(files)} 个文件:")
            for f in files:
                size = f.stat().st_size / 1024
                unit = "KB" if size < 1024 else "MB"
                size = size if size < 1024 else size / 1024
                print(f"   • {f.name} ({size:.1f} {unit})")

        except Exception as e:
            print(f"\n❌ 录制出错: {e}")
            import traceback
            traceback.print_exc()

        finally:
            await browser.close()
            print("\n👋 浏览器已关闭")


if __name__ == "__main__":
    # 检查依赖
    try:
        import playwright
    except ImportError:
        print("❌ 请先安装 Playwright:")
        print("   pip install playwright")
        print("   playwright install chromium")
        sys.exit(1)

    # 运行录制
    asyncio.run(run_recording())
