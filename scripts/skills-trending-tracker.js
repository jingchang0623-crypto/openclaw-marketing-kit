#!/usr/bin/env node
/**
 * OpenClaw Skills Trending Tracker
 * 追踪 GitHub 上热门的 OpenClaw Skills，生成趋势报告
 * 
 * Usage: node scripts/skills-trending-tracker.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// GitHub API 搜索配置
const SEARCH_QUERIES = [
  { q: 'openclaw skill', sort: 'stars', label: '通用 Skills' },
  { q: 'openclaw skills language:TypeScript', sort: 'stars', label: 'TypeScript Skills' },
  { q: 'openclaw skills language:Python', sort: 'stars', label: 'Python Skills' },
  { q: 'openclaw MCP', sort: 'updated', label: 'MCP 相关' }
];

// 已知的优质技能仓库（作为基准）
const BASELINE_REPOS = [
  { owner: 'VoltAgent', repo: 'awesome-openclaw-skills', stars: 46502 },
  { owner: 'clawdbot-ai', repo: 'awesome-openclaw-skills-zh', stars: 3934 },
  { owner: 'hesamsheikh', repo: 'awesome-openclaw-usecases', stars: 29843 }
];

/**
 * 执行 GitHub CLI 搜索
 */
function searchRepos(query, sort = 'stars', limit = 20) {
  try {
    const cmd = `gh search repos "${query}" --sort ${sort} --limit ${limit} --json fullName,description,url,stargazersCount,pushedAt,language`;
    const result = execSync(cmd, { encoding: 'utf8', timeout: 30000 });
    return JSON.parse(result);
  } catch (error) {
    console.error(`搜索失败: ${query}`, error.message);
    return [];
  }
}

/**
 * 获取仓库的最新 release 信息
 */
function getLatestRelease(owner, repo) {
  try {
    const cmd = `gh api repos/${owner}/${repo}/releases/latest --jq '{tag: .tag_name, published: .published_at}'`;
    const result = execSync(cmd, { encoding: 'utf8', timeout: 10000 });
    return JSON.parse(result);
  } catch (error) {
    return null;
  }
}

/**
 * 计算增长热度分数
 */
function calculateTrendScore(repo, daysSinceUpdate) {
  const stars = repo.stargazersCount || 0;
  const recency = Math.max(0, 30 - daysSinceUpdate) / 30; // 越新分越高
  const starWeight = Math.log10(Math.max(10, stars));
  return (starWeight * 0.7 + recency * 0.3) * 100;
}

/**
 * 生成趋势报告
 */
function generateReport(results) {
  const date = new Date().toISOString().split('T')[0];
  const timestamp = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  
  // 合并并去重所有结果
  const allRepos = new Map();
  results.forEach(({ label, repos }) => {
    repos.forEach(repo => {
      if (!allRepos.has(repo.fullName)) {
        allRepos.set(repo.fullName, { ...repo, categories: [label] });
      } else {
        allRepos.get(repo.fullName).categories.push(label);
      }
    });
  });

  // 转换为数组并计算趋势分数
  const repos = Array.from(allRepos.values()).map(repo => {
    const pushedDate = new Date(repo.pushedAt);
    const daysSinceUpdate = Math.floor((Date.now() - pushedDate.getTime()) / (1000 * 60 * 60 * 24));
    return {
      ...repo,
      daysSinceUpdate,
      trendScore: calculateTrendScore(repo, daysSinceUpdate)
    };
  });

  // 按趋势分数排序
  repos.sort((a, b) => b.trendScore - a.trendScore);

  // 分类
  const hotSkills = repos.filter(r => r.stargazersCount >= 1000).slice(0, 10);
  const risingStars = repos.filter(r => r.stargazersCount < 1000 && r.daysSinceUpdate <= 7).slice(0, 10);
  const recentlyUpdated = repos.filter(r => r.daysSinceUpdate <= 3).slice(0, 10);

  // 生成 Markdown 报告
  let markdown = `# 🦞 OpenClaw Skills 趋势报告 - ${date}

> 自动生成于 ${timestamp}
> 
> 数据来源: GitHub API | 追踪 OpenClaw 生态中最热门的 Skills 和工具

---

## 📊 今日概览

| 指标 | 数值 |
|------|------|
| 追踪 Skills 数量 | ${repos.length} |
| 本周更新项目 | ${repos.filter(r => r.daysSinceUpdate <= 7).length} |
| 今日更新项目 | ${repos.filter(r => r.daysSinceUpdate <= 1).length} |
| 热门项目 (>1000⭐) | ${repos.filter(r => r.stargazersCount >= 1000).length} |

---

## 🔥 热门 Skills Top 10

| 排名 | 项目 | 描述 | ⭐ 星标 | 分类 |
|------|------|------|---------|------|
`;

  hotSkills.forEach((repo, index) => {
    const desc = repo.description ? repo.description.substring(0, 60).replace(/\|/g, '/') + '...' : '暂无描述';
    markdown += `| ${index + 1} | [${repo.fullName}](${repo.url}) | ${desc} | ${repo.stargazersCount.toLocaleString()} | ${repo.categories.join(', ')} |\n`;
  });

  markdown += `
---

## 🌟 新星项目 (本周更新 & <1000⭐)

| 排名 | 项目 | 描述 | ⭐ 星标 | 语言 |
|------|------|------|---------|------|
`;

  risingStars.forEach((repo, index) => {
    const desc = repo.description ? repo.description.substring(0, 60).replace(/\|/g, '/') + '...' : '暂无描述';
    const lang = repo.language || '未知';
    markdown += `| ${index + 1} | [${repo.fullName}](${repo.url}) | ${desc} | ${repo.stargazersCount} | ${lang} |\n`;
  });

  markdown += `
---

## 📝 今日更新项目

`;

  recentlyUpdated.forEach(repo => {
    const [owner, name] = repo.fullName.split('/');
    const release = getLatestRelease(owner, name);
    markdown += `### [${repo.fullName}](${repo.url})\n\n`;
    markdown += `- ⭐ ${repo.stargazersCount.toLocaleString()} | 🏷️ ${repo.categories.join(', ')}\n`;
    if (repo.description) {
      markdown += `- ${repo.description}\n`;
    }
    if (release) {
      markdown += `- 📦 最新发布: ${release.tag} (${release.published.split('T')[0]})\n`;
    }
    markdown += `\n`;
  });

  markdown += `
---

## 🏆 基准对比

| 项目 | ⭐ 星标 | 描述 |
|------|---------|------|
`;

  BASELINE_REPOS.forEach(repo => {
    markdown += `| ${repo.owner}/${repo.repo} | ${repo.stars.toLocaleString()} | 基准参考项目 |\n`;
  });

  markdown += `
---

## 🔗 相关链接

- [OpenClaw 官网](https://openclaw.ai)
- [OpenClaw Skills Registry](https://clawdbot.ai/skills)
- [妙趣AI - AI 工具导航](https://miaoquai.com)
- [awesome-openclaw-skills](https://github.com/VoltAgent/awesome-openclaw-skills)

---

*本报告由 [OpenClaw Marketing Kit](https://github.com/jingchang0623-crypto/openclaw-marketing-kit) 自动生成*
`;

  return { markdown, date, repos };
}

/**
 * 保存报告到文件
 */
function saveReport(report) {
  const outputDir = path.join(__dirname, '..', 'reports');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 保存每日报告
  const dailyFile = path.join(outputDir, `skills-trending-${report.date}.md`);
  fs.writeFileSync(dailyFile, report.markdown, 'utf8');
  console.log(`✅ 日报已保存: ${dailyFile}`);

  // 更新最新报告
  const latestFile = path.join(outputDir, 'skills-trending-latest.md');
  fs.writeFileSync(latestFile, report.markdown, 'utf8');
  console.log(`✅ 最新报告已更新: ${latestFile}`);

  // 生成 JSON 数据
  const jsonFile = path.join(outputDir, `skills-trending-${report.date}.json`);
  fs.writeFileSync(jsonFile, JSON.stringify(report.repos, null, 2), 'utf8');
  console.log(`✅ JSON 数据已保存: ${jsonFile}`);

  return { dailyFile, latestFile, jsonFile };
}

/**
 * 主函数
 */
async function main() {
  console.log('🦞 OpenClaw Skills Trending Tracker');
  console.log('=====================================\n');

  const results = [];
  
  for (const { q, sort, label } of SEARCH_QUERIES) {
    console.log(`🔍 搜索: ${label} (${q})...`);
    const repos = searchRepos(q, sort, 20);
    console.log(`   找到 ${repos.length} 个仓库\n`);
    results.push({ label, repos });
  }

  console.log('📊 生成趋势报告...');
  const report = generateReport(results);
  const files = saveReport(report);

  console.log('\n✨ 完成！');
  console.log(`📁 报告位置: ${files.dailyFile}`);
  
  // 输出摘要
  console.log('\n📈 今日热门:');
  const top3 = report.repos.slice(0, 3);
  top3.forEach((repo, i) => {
    console.log(`   ${i + 1}. ${repo.fullName} (${repo.stargazersCount}⭐)`);
  });

  return report;
}

// 运行主程序
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { searchRepos, generateReport, calculateTrendScore };
