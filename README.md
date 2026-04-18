# 🦞 OpenClaw Marketing Kit

> OpenClaw 营销自动化工具包 - 让你的 AI 助手帮你干活

[English](./README_EN.md) | [中文](./README.md)

## ✨ 功能特性

- 📰 **RSS 内容聚合器** - 自动抓取 OpenClaw/AI 行业资讯，生成中文摘要
- ⏰ **定时任务管理器** - 基于 OpenClaw Cron 的自动化任务调度
- 📊 **SEO 报告生成器** - 批量生成工具页面、术语百科、踩坑实录
- 💬 **Discord 自动发布** - 定时向社区推送热点内容
- 📧 **邮件通知** - 任务执行结果自动邮件通知

## 🚀 快速开始

### 前置要求

- Node.js 18+
- OpenClaw Gateway 已运行
- (可选) SMTP 配置用于邮件通知

### 安装

```bash
git clone https://github.com/jingchang0623-crypto/openclaw-marketing-kit.git
cd openclaw-marketing-kit
npm install
```

### 配置

```bash
cp config.example.json config.json
# 编辑 config.json 填入你的配置
```

### 运行

```bash
# RSS 聚合
node scripts/rss-aggregator.js

# SEO 报告生成
node scripts/seo-reporter.js

# Discord 发布
node scripts/discord-poster.js

# 定时任务 (需要配置 cron)
node index.js
```

## 📁 项目结构

```
openclaw-marketing-kit/
├── config.example.json    # 配置示例
├── index.js              # 入口文件
├── package.json          # 项目配置
├── README.md             # 中文说明
├── README_EN.md          # English README
├── scripts/
│   ├── rss-aggregator.js    # RSS 聚合
│   ├── seo-reporter.js      # SEO 报告
│   ├── discord-poster.js    # Discord 发布
│   └── cron-manager.js      # 定时任务管理
└── templates/
    └── ...
```

## ⚙️ 配置说明

| 配置项 | 说明 | 示例 |
|--------|------|------|
| `rss.sources` | RSS 订阅源列表 | `["https://openai.com/blog/rss.xml"]` |
| `rss.outputDir` | 输出目录 | `/var/www/miaoquai/rss/` |
| `discord.webhook` | Discord Webhook URL | `https://discord.com/api/webhooks/...` |
| `discord.channelId` | 频道 ID | `123456789` |
| `smtp.host` | SMTP 服务器 | `smtp.example.com` |
| `smtp.port` | SMTP 端口 | `587` |
| `smtp.user` | SMTP 用户名 | `user@example.com` |
| `smtp.pass` | SMTP 密码 | `******` |
| `website.url` | 网站 URL | `https://miaoquai.com` |
| `website.outputDir` | 网站输出目录 | `/var/www/miaoquai/` |

## 🔧 OpenClaw 集成

### 创建定时任务

在 OpenClaw 中配置 cron 任务：

```json
{
  "schedule": { "kind": "cron", "expr": "0 2 * * *", "tz": "Asia/Shanghai" },
  "payload": {
    "kind": "agentTurn",
    "message": "执行 RSS 内容聚合任务"
  }
}
```

### 使用 Skills

项目内置以下 Skills：

- `rss-aggregator` - RSS 内容聚合
- `seo-generator` - SEO 内容生成
- `discord-publisher` - Discord 内容发布

## 📝 示例输出

### RSS 摘要页面

```html
<!-- 生成 /var/www/miaoquai/rss/issue-N.html -->
<h1>OpenClaw 玩法资讯 - 第 N 期</h1>
<article>
  <h2>文章标题</h2>
  <p>中文摘要...</p>
  <a href="原文链接">阅读原文</a>
</article>
```

### SEO 工具页面

```html
<!-- 生成 /var/www/miaoquai/tools/tool-name.html -->
<article>
  <h1>工具名称 - 妙趣 AI 工具百科</h1>
  <meta name="description" content="工具介绍...">
  <!-- 完整 SEO 优化内容 -->
</article>
```

## 🤝 贡献

欢迎提交 Issue 和 PR！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/xxx`)
3. 提交更改 (`git commit -m 'Add xxx'`)
4. 推送分支 (`git push origin feature/xxx`)
5. 创建 Pull Request

## 📄 许可证

MIT License - 请随意使用和修改！

## 🔗 相关链接

- [OpenClaw 官网](https://openclaw.ai)
- [OpenClaw 文档](https://docs.openclaw.ai)
- [妙趣 AI](https://miaoquai.com) - AI 工具导航 + 资讯平台

---

## 🔗 链接

- 🏠 [妙趣AI](https://miaoquai.com) - AI 工具导航 + 资讯平台
- 📦 [GitHub](https://github.com/jingchang0623-crypto/openclaw-marketing-kit) - 本仓库
- 🦞 [OpenClaw](https://openclaw.ai) - OpenClaw 官网
- 📖 [OpenClaw 文档](https://docs.openclaw.ai)

---

🦞 *Built with OpenClaw and ❤️ by 妙趣AI*
