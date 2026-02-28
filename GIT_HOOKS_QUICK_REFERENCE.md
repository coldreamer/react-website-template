# 🚀 Git Hooks 快速参考

## 📋 配置总览

| Hook           | 触发时机     | 执行内容          | 耗时   |
| -------------- | ------------ | ----------------- | ------ |
| **pre-commit** | `git commit` | ESLint + Prettier | ~5 秒  |
| **pre-push**   | `git push`   | E2E 测试          | ~15 秒 |

---

## 🎯 常用命令

### 正常流程

```bash
# 1. 添加文件
git add .

# 2. 提交（自动运行 eslint + prettier）
git commit -m "feat: 添加新功能"

# 3. 推送（自动运行 E2E 测试）
git push origin main
```

### 跳过 Hooks（紧急情况）

```bash
# 跳过 pre-commit
git commit -m "fix: 紧急修复" --no-verify

# 跳过 pre-push
git push --no-verify
```

### 手动运行检查

```bash
# 运行 lint-staged
npx lint-staged

# 运行 ESLint
npm run lint
npm run lint:fix

# 运行 E2E 测试
npm run test:e2e
npm run test:e2e:ui
```

---

## 🔧 故障排除

### Hooks 不生效？

```bash
# 重新初始化
npm run prepare

# 检查权限
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
```

### ESLint 报错？

```bash
# 自动修复
npm run lint:fix

# 查看详细错误
npm run lint
```

### E2E 测试失败？

```bash
# 使用 UI 模式调试
npm run test:e2e:ui

# 查看测试报告
npm run test:e2e:report
```

---

## 📁 配置文件位置

```
.husky/
├── pre-commit      # Commit 前运行 lint-staged
└── pre-push        # Push 前运行 E2E 测试

package.json        # lint-staged 配置
.prettierrc         # Prettier 配置
.prettierignore     # Prettier 忽略文件
```

---

## 💡 提示

- ✅ 提交前先运行 `npm run lint:fix`
- ✅ 推送前先运行 `npm run test:e2e`
- ✅ 使用有意义的提交信息
- ✅ 小步提交，频繁推送
- ⚠️ 谨慎使用 `--no-verify`

---

## 📚 详细文档

查看完整文档：[GIT_HOOKS.md](./GIT_HOOKS.md)
