---
published: 2026-06-19
title: opencode运行报错
description: pnpm安装opencode报postinstall未执行问题的修复
sourceLink: "https://blog.locxl.site/posts/opencode运行报错/"
licenseName: "CC BY-SA 4.0"
tags: [AI,报错]
category: 记录
author: locxl
---

# 问题
- 系统: Ubuntu 24.04.4 LTS
- 内核: Linux 6.8.0-124-generic
- node.js版本: 24.14.0
- pnpm版本: 11.8.0
在终端中执行`opencode`命令的时候，出现报错：
```bash
Error: opencode-ai's postinstall script was not run.

This occurs when using --ignore-scripts during installation, or when using a
package manager like pnpm that does not run postinstall scripts by default.

To fix this, run the postinstall script manually:
  cd node_modules/opencode-ai && node postinstall.mjs

Or reinstall opencode-ai without the --ignore-scripts flag.
```

# 原因分析
pnpm 出于安全考虑，默认跳过所有 `postinstall`脚本,这导致`opencode-ai`的`postinstall.mjs`未执行，缺少初始化文件，导致CLI无法正常启动

# 排查流程
1. 确认opencode位置
```bash
which opencode
```

2. 尝试找`node_modules`(失败)
```bash
pnpm root -g
```
输出`/home/locxl/.local/share/pnpm/global/v11`
```bash
ls /home/locxl/.local/share/pnpm/global/v11/
```
输出: 只有哈希命名的目录，没有`node_mudules/opencode-ai`

3. 通过shim脚本找到真实路径
```bash
cat /home/locxl/.local/share/pnpm/opencode
```
输出:
```bash
#!/usr/bin/env bash
NODE_PATH='/home/locxl/.local/share/pnpm/global/5/.pnpm/opencode-ai@1.15.5/node_modules/opencode-ai/node_modules'
...
```
从`NODE_PATH`提取真实包路径:
`/home/locxl/.local/share/pnpm/global/5/.pnpm/opencode-ai@1.15.5/node_modules/opencode-ai`

4. 手动执行postinstall脚本
```bash
cd /home/locxl/.local/share/pnpm/global/5/.pnpm/opencode-ai@1.15.5/node_modules/opencode-ai
node postinstall.mjs
```
执行成功

5. 验证
```bash
opencode --version
```
输出: `1.15.5`
成功

## 或者也可以
启用pnpm脚本后重装
```bash
pnpm config set enable-pre-post-scripts true
pnpm add -g opencode-ai
```
之后所有pnpm全局安装的包都会自动执行`postinstall`，不会再遇到同类问题。

# 后记
后来我发现这似乎是一个opencode 1.15.1版本后才引入的问题，因为v1.15.1起，opencode新增了postinstall.mjs负责下载平台特定Rust二进制，但是pnpm默认跳过了postinstall导致二进制未下载，使得只剩下一个空壳JS包装器，启动时候发现二进制不存在然后报错。
这在GitHub早已有了类似的issue: 
[v1.15.1+ Breaks Bun Installs #27906:](https://github.com/anomalyco/opencode/issues/27906)

[opencode-ai's postinstall script was not run - stuck after upgrade #29270](https://github.com/anomalyco/opencode/issues/29270)