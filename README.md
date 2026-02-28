# Website Template with Next.js

一个现代化的 Next.js 网站模板，包含完整的表单组件、E2E 测试和 Git Hooks 自动化。

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 📁 项目结构

```
src/
├── components/
│   ├── ui/           # shadcn 组件（Button, Input, Form 等）
│   ├── shared/       # 业务公共组件（Navbar, Footer, SafeImage）
│   └── features/     # 核心功能模块（LandingPage, ConversionForm）
├── hooks/            # 自定义 Hook（useTrack, useIntersectionObserver）
├── lib/              # 工具函数（utils.ts, analytics.ts）
├── app/              # 页面路由
└── .cursorrules      # Cursor 规则
```

## ✨ 主要特性

### 📝 ConversionForm 组件

- ✅ 完整的表单验证（react-hook-form + zod）
- ✅ 优雅的 Loading 状态和成功 UI
- ✅ 响应式设计（移动端 + PC 端）
- ✅ 国际化电话号码支持

📖 [查看详细文档](./CONVERSION_FORM.md)

### 🧪 E2E 测试

- ✅ Playwright 端到端测试
- ✅ 5 个完整的测试用例
- ✅ 自动截图和视频录制
- ✅ 详细的测试报告

📖 [查看测试文档](./tests/e2e/README.md) | [快速开始](./tests/e2e/QUICK_START.md)

### 🪝 Git Hooks 自动化

- ✅ **Pre-commit**：自动运行 ESLint + Prettier
- ✅ **Pre-push**：自动运行 E2E 测试
- ✅ 确保代码质量和测试覆盖

📖 [查看 Git Hooks 文档](./GIT_HOOKS.md) | [快速参考](./GIT_HOOKS_QUICK_REFERENCE.md)

## 🛠️ 可用脚本

### 开发

```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
```

### 代码质量

```bash
npm run lint         # 运行 ESLint 检查
npm run lint:fix     # 运行 ESLint 并自动修复
```

### 测试

```bash
npm run test:e2e           # 运行 E2E 测试
npm run test:e2e:ui        # 使用 UI 模式运行测试
npm run test:e2e:headed    # 显示浏览器运行测试
npm run test:e2e:debug     # 调试模式
npm run test:e2e:report    # 查看测试报告
```

## 🔧 技术栈

- **框架**：Next.js 16 + React 19
- **语言**：TypeScript
- **样式**：Tailwind CSS 4
- **表单**：React Hook Form + Zod
- **UI 组件**：shadcn/ui + Radix UI
- **测试**：Playwright
- **代码质量**：ESLint + Prettier + Husky + lint-staged

## 📚 文档

- 📝 [ConversionForm 组件文档](./CONVERSION_FORM.md)
- 🧪 [E2E 测试文档](./E2E_TESTING_SUMMARY.md)
- 🪝 [Git Hooks 配置文档](./GIT_HOOKS.md)
- 🚀 [测试快速开始](./tests/e2e/QUICK_START.md)
- 🔧 [测试故障排除](./tests/e2e/FIXES_APPLIED.md)

## 🎯 工作流程

```bash
# 1. 开发功能
npm run dev

# 2. 提交代码（自动运行 lint）
git add .
git commit -m "feat: 添加新功能"

# 3. 推送代码（自动运行测试）
git push origin main
```

## 📄 许可证

MIT

---

**最后更新**：2026-02-28
