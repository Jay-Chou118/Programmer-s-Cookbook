// ==================== 可灵 API 配置模板 ====================
// 使用说明：
// 1. 复制本文件为 js/config.js
//    cp js/config.template.js js/config.js
// 2. 在 js/config.js 中填入你的真实密钥
// 3. js/config.js 已被 .gitignore 排除，不会提交到 GitHub
//
// 获取密钥：
// - 登录可灵开发者平台：https://klingai.com/dev/api-key
// - 创建 API 密钥，获取 Access Key 和 Secret Key
// ===========================================================

const KLING_CONFIG = {
    // 可灵官方 API 域名（国内用户）
    baseURL: 'https://api-beijing.klingai.com',

    // 从可灵开发者平台获取的密钥
    accessKey: 'YOUR_ACCESS_KEY_HERE',
    secretKey: 'YOUR_SECRET_KEY_HERE',

    // 模型名称（可选：kling-v1, kling-v1-5, kling-v2, kling-v2-1, kling-v3）
    model: 'kling-v2-1',

    // 图片纵横比（可选：1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3）
    aspectRatio: '1:1',

    // 清晰度（可选：1k 标清, 2k 高清）
    style: '1k',

    // 生成数量（范围 1-9）
    n: 1,

    // 是否启用水印
    watermark: false,

    // JWT 过期时间（分钟）
    tokenExpireMinutes: 60,
};
