import { Page } from '@playwright/test';

/**
 * 🛠️ 测试辅助工具
 * 
 * 作为一名专业的 QA，我需要一些趁手的工具
 */

/**
 * 填写完整的表单
 */
export async function fillCompleteForm(
  page: Page,
  data: {
    name: string;
    email: string;
    countryCode?: string;
    phone: string;
  }
) {
  await page.getByPlaceholder('请输入您的姓名').fill(data.name);
  await page.getByPlaceholder('example@email.com').fill(data.email);
  
  // 选择国家码
  if (data.countryCode) {
    await page.getByRole('combobox').first().click();
    await page.getByRole('option', { name: new RegExp(data.countryCode) }).click();
  }
  
  await page.getByPlaceholder('请输入手机号').fill(data.phone);
}

/**
 * 等待并验证 Toast 消息
 */
export async function expectToast(
  page: Page,
  type: 'success' | 'error',
  message: string
) {
  const toast = page.locator(`text=${message}`);
  await toast.waitFor({ state: 'visible', timeout: 3000 });
  return toast;
}

/**
 * 等待 Loading 状态
 */
export async function waitForLoading(page: Page) {
  const spinner = page.locator('[role="status"]');
  await spinner.waitFor({ state: 'visible', timeout: 1000 });
  return spinner;
}

/**
 * 等待成功页面
 */
export async function waitForSuccessPage(page: Page) {
  const successHeading = page.getByRole('heading', { name: '提交成功！' });
  await successHeading.waitFor({ state: 'visible', timeout: 5000 });
  return successHeading;
}

/**
 * 模拟网络延迟
 */
export async function mockNetworkDelay(page: Page, delayMs: number) {
  await page.route('**/*', async (route) => {
    await new Promise(resolve => setTimeout(resolve, delayMs));
    await route.continue();
  });
}

/**
 * 截图辅助函数
 */
export async function takeScreenshot(
  page: Page,
  name: string,
  fullPage = true
) {
  await page.screenshot({
    path: `tests/e2e/screenshots/${name}.png`,
    fullPage,
  });
}
