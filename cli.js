#!/usr/bin/env node
/**
 * OpenClaw Marketing Kit CLI
 * 
 * Usage:
 *   oc-marketing rss       # 运行 RSS 聚合
 *   oc-marketing seo       # 生成 SEO 报告
 *   oc-marketing discord   # 发布到 Discord
 *   oc-marketing skills    # 追踪 Skills 趋势
 */

const { program } = require('commander');
const chalk = require('chalk');
const pkg = require('./package.json');

program
  .name('oc-marketing')
  .description('OpenClaw 营销自动化工具包 CLI')
  .version(pkg.version);

program
  .command('rss')
  .description('运行 RSS 内容聚合')
  .action(() => {
    console.log(chalk.blue('📰 启动 RSS 聚合器...'));
    require('./scripts/rss-aggregator');
  });

program
  .command('seo')
  .description('生成 SEO 报告')
  .action(() => {
    console.log(chalk.green('📊 生成 SEO 报告...'));
    require('./scripts/seo-reporter');
  });

program
  .command('discord')
  .description('发布到 Discord')
  .action(() => {
    console.log(chalk.magenta('💬 发布到 Discord...'));
    require('./scripts/discord-poster');
  });

program
  .command('skills')
  .description('追踪 OpenClaw Skills 趋势')
  .action(() => {
    console.log(chalk.yellow('🦞 追踪 Skills 趋势...'));
    require('./scripts/skills-trending-tracker');
  });

program
  .command('track')
  .description('等同于 skills 命令')
  .action(() => {
    console.log(chalk.yellow('🦞 追踪 Skills 趋势...'));
    require('./scripts/skills-trending-tracker');
  });

// 默认显示帮助
if (process.argv.length === 2) {
  program.help();
}

program.parse();
