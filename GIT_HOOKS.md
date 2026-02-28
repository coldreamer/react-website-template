# 🪝 Git Hooks 配置文档

本项目使用 **Husky** 和 **lint-staged** 来自动化代码质量检查和测试流程。

## 📋 配置概览

### 🔍 Pre-commit Hook（提交前）

**触发时机**：每次执行 `git commit` 时

**执行内容**：

- ✅ 对暂存的文件运行 **ESLint** 检查
- ✅ 对暂存的文件运行 **Prettier** 格式化
- ✅ 自动修复可修复的问题
- ✅ 自动格式化代码

**配置文件**：`.husky/pre-commit`

**处理的文件类型**：

- `*.{js,jsx,ts,tsx}` - JavaScript/TypeScript 文件
- `*.{json,md}` - JSON 和 Markdown 文件

---

### 🧪 Pre-push Hook（推送前）

**触发时机**：每次执行 `git push` 时

**执行内容**：

- ✅ 运行完整的 **E2E 测试套件**（Playwright）
- ✅ 如果测试失败，**阻止 push**
- ✅ 确保推送到远程的代码都经过测试

**配置文件**：`.husky/pre-push`

---

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

这会自动运行 `prepare` 脚本，初始化 Husky。

### 2. 验证配置

```bash
# 查看 Git hooks 是否已安装
ls -la .husky/

# 应该看到：
# - pre-commit
# - pre-push
```

---

## 💡 使用示例

### 场景 1：正常提交代码

```bash
# 1. 添加文件到暂存区
git add src/components/MyComponent.tsx

# 2. 提交（会自动运行 eslint 和 prettier）
git commit -m "feat: 添加新组件"

# 输出示例：
# ✔ Preparing lint-staged...
# ✔ Running tasks for staged files...
# ✔ eslint --fix
# ✔ prettier --write
# ✔ git add
# ✔ Applying modifications...
# ✔ Cleaning up...
# [main abc1234] feat: 添加新组件
```

### 场景 2：ESLint 检查失败

```bash
git add src/components/BuggyComponent.tsx
git commit -m "fix: 修复 bug"

# 输出示例：
# ✖ eslint --fix:
#
# /src/components/BuggyComponent.tsx
#   10:5  error  'unused' is assigned a value but never used  @typescript-eslint/no-unused-vars
#
# ✖ 1 problem (1 error, 0 warnings)
#
# ✖ lint-staged failed
#
# 提交被阻止！请修复错误后重试。
```

**解决方案**：修复 ESLint 错误后重新提交。

### 场景 3：推送代码（测试通过）

```bash
git push origin main

# 输出示例：
# 🧪 运行 E2E 测试...
#
# Running 5 tests using 1 worker
#
#   ✓ [chromium] › 应该正确拦截并显示非法邮箱的错误提示
#   ✓ [chromium] › 应该在网络延迟时正确显示 Loading 状态
#   ✓ [chromium] › 应该在提交成功后显示优雅的成功 UI
#   ✓ [chromium] › 移动端表单应该正确显示（响应式测试）
#   ✓ [chromium] › 应该正确验证所有表单字段的边界条件
#
#   5 passed (15s)
#
# ✅ E2E 测试通过，继续 push...
#
# Enumerating objects: 5, done.
# ...
```

### 场景 4：推送代码（测试失败）

```bash
git push origin main

# 输出示例：
# 🧪 运行 E2E 测试...
#
# Running 5 tests using 1 worker
#
#   ✓ [chromium] › 应该正确拦截并显示非法邮箱的错误提示
#   ✘ [chromium] › 应该在网络延迟时正确显示 Loading 状态
#   ...
#
#   4 passed
#   1 failed
#
# ❌ E2E 测试失败，push 已被阻止！
# 💡 请修复测试后再次尝试 push
#
# error: failed to push some refs to 'origin'
```

**解决方案**：修复失败的测试后重新 push。

---

## 🛠️ 可用的脚本

### Lint 相关

```bash
# 运行 ESLint 检查
npm run lint

# 运行 ESLint 并自动修复
npm run lint:fix
```

### 测试相关

```bash
# 运行 E2E 测试
npm run test:e2e

# 使用 UI 模式运行测试
npm run test:e2e:ui

# 显示浏览器运行测试
npm run test:e2e:headed

# 调试模式
npm run test:e2e:debug

# 查看测试报告
npm run test:e2e:report
```

---

## ⚙️ 配置文件

### package.json

```json
{
  "scripts": {
    "lint": "eslint",
    "lint:fix": "eslint --fix",
    "test:e2e": "playwright test",
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "git add"],
    "*.{json,md}": ["prettier --write", "git add"]
  }
}
```

### .husky/pre-commit

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# 运行 lint-staged，对暂存的文件执行 eslint
npx lint-staged
```

### .husky/pre-push

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# 在 push 前运行 E2E 测试
echo "🧪 运行 E2E 测试..."
npx playwright test

# 如果测试失败，阻止 push
if [ $? -ne 0 ]; then
  echo "❌ E2E 测试失败，push 已被阻止！"
  echo "💡 请修复测试后再次尝试 push"
  exit 1
fi

echo "✅ E2E 测试通过，继续 push..."
```

---

## 🔧 高级配置

### 跳过 Git Hooks（不推荐）

如果确实需要跳过 hooks（例如紧急修复）：

```bash
# 跳过 pre-commit hook
git commit -m "fix: 紧急修复" --no-verify

# 跳过 pre-push hook
git push --no-verify
```

**⚠️ 警告**：跳过 hooks 可能导致代码质量问题，请谨慎使用！

### 只对特定文件运行 lint-staged

```bash
# 手动运行 lint-staged
npx lint-staged

# 对特定文件运行
npx lint-staged --files src/components/MyComponent.tsx
```

### 自定义 lint-staged 配置

在 `package.json` 中修改 `lint-staged` 配置：

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write", "git add"],
    "*.css": ["stylelint --fix", "prettier --write", "git add"]
  }
}
```

### 自定义 pre-push 行为

编辑 `.husky/pre-push` 文件：

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# 只运行特定的测试
npx playwright test --grep "关键测试"

# 或者运行其他检查
npm run type-check
npm run test:unit
```

---

## 🐛 常见问题

### 问题 1：Husky hooks 不生效

**原因**：Husky 未正确初始化

**解决方案**：

```bash
# 重新初始化 Husky
npm run prepare

# 或者
npx husky install
```

### 问题 2：lint-staged 找不到文件

**原因**：文件未添加到暂存区

**解决方案**：

```bash
# 确保文件已添加到暂存区
git add <file>
git commit -m "message"
```

### 问题 3：E2E 测试太慢

**原因**：完整的 E2E 测试需要时间

**解决方案**：

**方案 1**：只运行关键测试

```bash
# 编辑 .husky/pre-push
npx playwright test --grep "@critical"
```

**方案 2**：使用并行测试

```bash
# 在 playwright.config.ts 中
workers: process.env.CI ? 1 : 4
```

**方案 3**：临时跳过（不推荐）

```bash
git push --no-verify
```

### 问题 4：权限问题

**错误**：`Permission denied: .husky/pre-commit`

**解决方案**：

```bash
# 添加执行权限
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
```

---

## 📊 工作流程图

```
┌─────────────────────────────────────────────────────────────┐
│                      git add <files>                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      git commit -m "..."                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    🪝 Pre-commit Hook                        │
│                                                               │
│  1. 运行 lint-staged                                         │
│  2. ESLint 检查 + 自动修复                                   │
│  3. Prettier 格式化                                          │
│  4. 自动 git add 修复后的文件                                │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                 失败 ✘               通过 ✓
                    │                   │
            阻止提交，显示错误      提交成功
                    │                   │
                    └─────────┬─────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      git push origin main                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     🪝 Pre-push Hook                         │
│                                                               │
│  1. 运行 E2E 测试套件                                        │
│  2. 检查所有测试是否通过                                     │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                 失败 ✘               通过 ✓
                    │                   │
            阻止 push，显示错误      推送到远程
                    │                   │
                    └─────────┬─────────┘
                              │
                              ▼
                        ✅ 完成！
```

---

## 🎯 最佳实践

### 1. 提交前自测

```bash
# 在提交前手动运行检查
npm run lint:fix
npm run test:e2e
```

### 2. 小步提交

```bash
# 频繁提交小的改动，而不是一次提交大量代码
git add src/components/Button.tsx
git commit -m "feat: 添加 Button 组件"

git add src/components/Input.tsx
git commit -m "feat: 添加 Input 组件"
```

### 3. 使用有意义的提交信息

```bash
# 好的提交信息
git commit -m "feat: 添加用户登录功能"
git commit -m "fix: 修复邮箱验证 bug"
git commit -m "refactor: 重构表单组件"

# 不好的提交信息
git commit -m "update"
git commit -m "fix bug"
git commit -m "changes"
```

### 4. 定期更新依赖

```bash
# 更新 husky 和 lint-staged
npm update husky lint-staged

# 检查过时的依赖
npm outdated
```

---

## 📚 相关文档

- 🪝 [Husky 官方文档](https://typicode.github.io/husky/)
- 🎨 [lint-staged 官方文档](https://github.com/okonet/lint-staged)
- 🔍 [ESLint 官方文档](https://eslint.org/)
- ✨ [Prettier 官方文档](https://prettier.io/)
- 🧪 [Playwright 官方文档](https://playwright.dev/)

---

## 🤝 团队协作

### 新成员入职

1. 克隆仓库

   ```bash
   git clone <repo-url>
   cd react-website-template
   ```

2. 安装依赖

   ```bash
   npm install
   ```

3. 验证 Git hooks

   ```bash
   ls -la .husky/
   ```

4. 测试提交
   ```bash
   echo "test" > test.txt
   git add test.txt
   git commit -m "test: 测试 git hooks"
   ```

### CI/CD 集成

在 CI/CD 流程中也应该运行相同的检查：

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run lint
      - run: npm run test:e2e
```

---

**最后更新**：2026-02-28  
**维护者**：开发团队  
**版本**：1.0.0
