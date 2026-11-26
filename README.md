# Qoder_careerplanning

职业规划辅助项目，当前包含 PathMap 纯前端 MVP。

## 项目结构

- `apps/web`：React + Vite + TypeScript 用户前端。
- `docs/TECH_STACK.md`：技术栈、产品链路和演示能力边界。
- `apps/server`、`apps/admin`、`packages/shared`：规划中的后端、管理端和共享包，尚未实现。

## 环境要求

- Node.js 22.12+（或 Node.js 24 LTS）。
- pnpm 9.0.0，与 `package.json` 中的 `packageManager` 一致。

## 本地启动

```bash
pnpm install --frozen-lockfile
pnpm --filter web dev
```

## 验证与构建

```bash
pnpm --filter web test
pnpm --filter web build
pnpm --filter web preview
```

用户资料仅保存在当前浏览器。职业数据和本地职业助手均为演示内容，不提供实时市场信息或真实服务预约。
