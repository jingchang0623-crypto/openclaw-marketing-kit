# 🦞 OpenClaw Skills Trending Tracker

> 自动追踪 GitHub 上热门的 OpenClaw Skills，生成每日趋势报告

## ✨ 功能

- 🔍 多维度搜索：按语言、分类、更新时间筛选 Skills
- 📊 趋势评分：基于星标数和更新频率计算热度
- 📈 自动生成 Markdown/HTML 报告
- 💾 历史数据存档，支持趋势对比
- 🔄 可作为定时任务每日运行

## 🚀 快速开始

```bash
# 克隆仓库
git clone https://github.com/jingchang0623-crypto/openclaw-marketing-kit.git
cd openclaw-marketing-kit

# 安装依赖
npm install

# 运行趋势追踪
npm run skills-track
# 或
node scripts/skills-trending-tracker.js
```

## 📁 输出示例

运行后会在 `reports/` 目录生成：

```
reports/
├── skills-trending-2026-04-19.md      # 每日报告
├── skills-trending-latest.md          # 最新报告（覆盖更新）
└── skills-trending-2026-04-19.json    # 原始数据
```

## 📋 报告内容

1. **今日概览** - 统计数据总览
2. **热门 Skills Top 10** - 星标最多的项目
3. **新星项目** - 本周更新的潜力项目
4. **今日更新** - 最近24小时有更新的项目
5. **基准对比** - 与知名项目的对比

## ⚙️ 配置

编辑脚本顶部的 `SEARCH_QUERIES` 数组来自定义搜索：

```javascript
const SEARCH_QUERIES = [
  { q: 'openclaw skill', sort: 'stars', label: '通用 Skills' },
  { q: 'openclaw skills language:TypeScript', sort: 'stars', label: 'TypeScript' },
  { q: 'openclaw MCP', sort: 'updated', label: 'MCP 相关' }
];
```

## 🔗 相关项目

| 项目 | 星标 | 描述 |
|------|------|------|
| [awesome-openclaw-skills](https://github.com/VoltAgent/awesome-openclaw-skills) | 46K+ | OpenClaw Skills awesome 列表 |
| [awesome-openclaw-usecases](https://github.com/hesamsheikh/awesome-openclaw-usecases) | 29K+ | OpenClaw 用例集合 |
| [openclaw](https://github.com/openclaw/openclaw) | 360K+ | OpenClaw 官方仓库 |

## 🤝 贡献

欢迎提交 Issue 和 PR！

## 📄 许可证

MIT License
