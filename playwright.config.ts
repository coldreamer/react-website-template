import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright 配置文件
 * 用于 ConversionForm 的端到端测试
 */
export default defineConfig({
  testDir: './tests/e2e',
  
  // 测试超时时间
  timeout: 30 * 1000,
  
  // 每个测试的重试次数
  retries: process.env.CI ? 2 : 0,
  
  // 并行执行的 worker 数量
  workers: process.env.CI ? 1 : undefined,
  
  // 报告配置
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],
  
  // 全局配置
  use: {
    // 基础 URL
    baseURL: 'http://localhost:3000',
    
    // 截图配置
    screenshot: 'only-on-failure',
    
    // 视频录制
    video: 'retain-on-failure',
    
    // 追踪
    trace: 'on-first-retry',
  },

  // 项目配置
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // 移动端测试（可选，如需测试可取消注释）
    // {
    //   name: 'mobile',
    //   use: { ...devices['iPhone 13'] },
    // },
  ],

  // 开发服务器配置
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
