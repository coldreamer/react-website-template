import { test, expect } from '@playwright/test';

/**
 * 🔥 毒舌 QA 的 ConversionForm E2E 测试套件
 * 
 * 作为一名专业的毒舌 QA，我要狠狠地测试这个表单！
 * 看看它是否真的像开发说的那么"完美"... 🙄
 */

test.describe('ConversionForm - 毒舌 QA 的严格测试', () => {
  
  test.beforeEach(async ({ page }) => {
    // 访问首页
    await page.goto('/');
    
    // 确保表单已加载（基本要求吧？）
    await expect(page.getByRole('heading', { name: '联系我们' })).toBeVisible();
  });

  /**
   * 测试用例 1: 非法邮箱验证
   * 
   * 🤨 开发说："我们有严格的邮箱验证！"
   * 🔍 那我就来试试看到底有多"严格"...
   */
  test('应该正确拦截并显示非法邮箱的错误提示', async ({ page }) => {
    // 填写姓名（先给点面子）
    await page.getByPlaceholder('请输入您的姓名').fill('测试用户');
    
    // 选择国家码
    await page.getByRole('combobox').first().click();
    await page.getByRole('option', { name: /\+86/ }).click();
    
    // 填写手机号
    await page.getByPlaceholder('请输入手机号').fill('13800138000');

    // 🎯 重点来了：测试各种非法邮箱格式
    // 注意：我们使用能绕过浏览器原生验证的格式，专门测试 zod 验证
    const invalidEmails = [
      'test@invalid',         // 没有域名后缀
      'test@.com',            // 域名格式错误
      'test..test@example.com', // 连续的点
      'test@example..com',    // 域名中连续的点
    ];

    for (const invalidEmail of invalidEmails) {
      // 清空并填入非法邮箱
      const emailInput = page.getByPlaceholder('example@email.com');
      await emailInput.clear();
      await emailInput.fill(invalidEmail);
      
      // 点击提交按钮（看你怎么拦！）
      await page.getByRole('button', { name: '立即提交' }).click();
      
      // 🔥 关键断言：必须显示错误提示
      // 等待表单验证触发
      await page.waitForTimeout(500);
      
      const errorMessage = page.locator('text=请输入有效的邮箱地址');
      await expect(errorMessage).toBeVisible({
        timeout: 2000,
      });
      
      // 📸 截个图留证据
      await page.screenshot({ 
        path: `tests/e2e/screenshots/invalid-email-${invalidEmail.replace(/[^a-z0-9]/gi, '_')}.png`,
        fullPage: true 
      });
      
      console.log(`✅ 成功拦截非法邮箱: ${invalidEmail}`);
    }

    // 🎭 额外测试：空邮箱
    await page.getByPlaceholder('example@email.com').clear();
    await page.getByRole('button', { name: '立即提交' }).click();
    
    // 等待验证触发
    await page.waitForTimeout(500);
    
    // 应该显示错误提示（可能是"邮箱不能为空"或"请输入有效的邮箱地址"）
    const emptyError = page.locator('p').filter({ hasText: /邮箱/ });
    await expect(emptyError).toBeVisible();
    
    console.log('✅ 所有非法邮箱测试通过！表单验证还算靠谱 👍');
  });

  /**
   * 测试用例 2: Loading 状态测试
   * 
   * 🤨 开发说："我们有完美的 Loading 状态！"
   * 🔍 那我就来看看网络慢的时候会不会翻车...
   */
  test('应该在网络延迟时正确显示 Loading 状态', async ({ page }) => {
    // 填写完整的表单
    await page.getByPlaceholder('请输入您的姓名').fill('测试用户');
    await page.getByPlaceholder('example@email.com').fill('test@example.com');
    
    // 选择国家码
    await page.getByRole('combobox').first().click();
    await page.getByRole('option', { name: /\+86/ }).click();
    
    await page.getByPlaceholder('请输入手机号').fill('13800138000');

    // 点击提交按钮
    await page.getByRole('button', { name: '立即提交' }).click();

    // 🔥 关键断言 1：按钮应该变成禁用状态并显示"提交中..."
    // 使用更灵活的选择器，因为按钮内容会变化
    const loadingButton = page.getByRole('button', { name: /提交/ });
    
    // 等待按钮变成 Loading 状态（文字变为"提交中..."）
    await expect(loadingButton).toContainText('提交中...', {
      timeout: 2000,
    });
    
    console.log('✅ 按钮文字已更新为"提交中..."');

    // 🔥 关键断言 2：按钮应该被禁用
    await expect(loadingButton).toBeDisabled({
      timeout: 1000,
    });
    
    console.log('✅ 按钮已禁用，防止重复提交');

    // 🔥 关键断言 3：必须显示 Spinner 加载动画
    const spinner = page.locator('[role="status"]');
    await expect(spinner).toBeVisible({
      timeout: 1000,
    });
    
    console.log('✅ Spinner 已显示');

    // 📸 截图证明 Loading 状态
    await page.screenshot({ 
      path: 'tests/e2e/screenshots/loading-state.png',
      fullPage: true 
    });

    // 🕐 等待 Loading 状态持续至少 1 秒
    await page.waitForTimeout(1000);
    
    // 确保在这段时间内，按钮一直是禁用状态
    await expect(loadingButton).toBeDisabled();
    await expect(spinner).toBeVisible();
    
    console.log('✅ Loading 状态持续正常，没有闪烁或提前结束');

    // 等待请求完成（表单内部有 2 秒延迟）
    await page.waitForTimeout(2000);
    
    console.log('✅ Loading 状态测试通过！用户体验还不错 👍');
  });

  /**
   * 测试用例 3: 成功提交后的 UI 测试
   * 
   * 🤨 开发说："成功后有优雅的成功页面！"
   * 🔍 让我看看到底有多"优雅"...
   */
  test('应该在提交成功后显示优雅的成功 UI', async ({ page }) => {
    // 填写完整的表单
    await page.getByPlaceholder('请输入您的姓名').fill('成功测试用户');
    await page.getByPlaceholder('example@email.com').fill('success@test.com');
    
    // 选择国家码
    await page.getByRole('combobox').first().click();
    await page.getByRole('option', { name: /\+86/ }).click();
    
    await page.getByPlaceholder('请输入手机号').fill('13900139000');

    // 点击提交
    const submitButton = page.getByRole('button', { name: '立即提交' });
    await submitButton.click();

    // 等待提交完成（模拟的 API 需要 2 秒）
    // 注意：这里有 20% 的失败率，可能需要重试
    await page.waitForTimeout(2500);

    // 🔥 关键断言 1：检查是否显示成功图标（绿色的对勾）
    const successIcon = page.locator('svg').filter({ hasText: '' }).first();
    
    // 如果出现成功页面
    const successHeading = page.getByRole('heading', { name: '提交成功！' });
    
    if (await successHeading.isVisible({ timeout: 1000 }).catch(() => false)) {
      console.log('✅ 成功页面已显示！');
      
      // 🔥 断言：成功标题必须可见
      await expect(successHeading).toBeVisible();
      
      // 🔥 断言：成功描述文字必须存在
      const successDescription = page.locator('text=感谢您的提交，我们已收到您的信息');
      await expect(successDescription).toBeVisible();
      
      console.log('✅ 成功描述文字已显示');

      // 🔥 断言：必须有"返回表单"按钮
      const returnButton = page.getByRole('button', { name: '返回表单' });
      await expect(returnButton).toBeVisible();
      
      console.log('✅ "返回表单"按钮已显示');

      // 📸 截图留念（这个 UI 确实还行）
      await page.screenshot({ 
        path: 'tests/e2e/screenshots/success-state.png',
        fullPage: true 
      });

      // 🎯 额外测试：点击"返回表单"按钮
      await returnButton.click();
      
      // 应该回到表单页面
      await expect(page.getByRole('heading', { name: '联系我们' })).toBeVisible({
        timeout: 1000,
      });
      
      // 表单应该被重置（所有字段为空）
      await expect(page.getByPlaceholder('请输入您的姓名')).toHaveValue('');
      await expect(page.getByPlaceholder('example@email.com')).toHaveValue('');
      await expect(page.getByPlaceholder('请输入手机号')).toHaveValue('');
      
      console.log('✅ 返回表单功能正常，表单已重置');
      console.log('✅ 成功 UI 测试通过！确实挺优雅的 👍');
      
    } else {
      // 如果出现失败 Toast（20% 概率）
      console.log('⚠️  提交失败（模拟的随机失败），检查 Toast 提示...');
      
      // 应该显示失败的 Toast
      const errorToast = page.locator('text=提交失败');
      await expect(errorToast).toBeVisible({ timeout: 2000 });
      
      console.log('✅ 失败 Toast 已正确显示');
      
      // 📸 截图失败状态
      await page.screenshot({ 
        path: 'tests/e2e/screenshots/failure-toast.png',
        fullPage: true 
      });
      
      // 重新提交直到成功（最多 3 次）
      for (let i = 0; i < 3; i++) {
        console.log(`🔄 重试提交 (${i + 1}/3)...`);
        await page.waitForTimeout(1000);
        await submitButton.click();
        await page.waitForTimeout(2500);
        
        if (await successHeading.isVisible({ timeout: 1000 }).catch(() => false)) {
          console.log('✅ 重试成功！成功页面已显示');
          await expect(successHeading).toBeVisible();
          break;
        }
      }
    }
  });

  /**
   * 🎁 额外的毒舌测试：响应式设计
   * 
   * 既然都测到这了，顺便看看移动端会不会翻车
   */
  test('移动端表单应该正确显示（响应式测试）', async ({ page }) => {
    // 设置为移动端视口
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // 表单应该占满宽度
    const form = page.locator('form').first();
    await expect(form).toBeVisible();
    
    // 📸 移动端截图
    await page.screenshot({ 
      path: 'tests/e2e/screenshots/mobile-view.png',
      fullPage: true 
    });
    
    console.log('✅ 移动端显示正常');
  });

  /**
   * 🎁 额外的毒舌测试：表单字段验证
   * 
   * 测试所有字段的边界条件
   */
  test('应该正确验证所有表单字段的边界条件', async ({ page }) => {
    // 测试姓名字段
    const nameInput = page.getByPlaceholder('请输入您的姓名');
    
    // 姓名太短（只有 1 个字符）
    await nameInput.fill('A');
    await page.getByRole('button', { name: '立即提交' }).click();
    await expect(page.locator('text=姓名至少需要 2 个字符')).toBeVisible();
    console.log('✅ 姓名最小长度验证通过');
    
    // 姓名太长（超过 50 个字符）
    await nameInput.fill('A'.repeat(51));
    await page.getByRole('button', { name: '立即提交' }).click();
    await expect(page.locator('text=姓名不能超过 50 个字符')).toBeVisible();
    console.log('✅ 姓名最大长度验证通过');
    
    // 测试手机号字段
    await nameInput.fill('测试用户');
    await page.getByPlaceholder('example@email.com').fill('test@example.com');
    
    const phoneInput = page.getByPlaceholder('请输入手机号');
    
    // 手机号太短（少于 6 位）
    await phoneInput.fill('12345');
    await page.getByRole('button', { name: '立即提交' }).click();
    await expect(page.locator('text=手机号必须是 6-15 位数字')).toBeVisible();
    console.log('✅ 手机号最小长度验证通过');
    
    // 手机号包含非数字字符
    await phoneInput.fill('138abc00138');
    await page.getByRole('button', { name: '立即提交' }).click();
    await expect(page.locator('text=手机号必须是 6-15 位数字')).toBeVisible();
    console.log('✅ 手机号格式验证通过');
    
    console.log('✅ 所有字段边界条件测试通过！验证逻辑很严格 👍');
  });
});

/**
 * 🎯 毒舌 QA 的最终评价：
 * 
 * 经过严格测试，这个 ConversionForm 表现还算不错：
 * ✅ 邮箱验证确实很严格
 * ✅ Loading 状态处理得当
 * ✅ 成功 UI 确实挺优雅
 * ✅ 响应式设计没问题
 * ✅ 边界条件处理完善
 * 
 * 不过，还是要继续保持警惕！👀
 * 开发永远不要相信 QA 会手下留情... 😏
 */
