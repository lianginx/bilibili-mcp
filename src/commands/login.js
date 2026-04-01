import { useBrowserContext } from '../core/browser.js'

export async function login() {
  const { context } = await useBrowserContext({
    headless: false,
    timeout: 1000 * 60 * 10,
  })

  try {
    const page = context.pages()[0];
    await page.goto('https://www.bilibili.com');

    // 等待登录成功
    await page.waitForSelector('.header-entry-mini');
  } finally {
    await context.close();
  }
}
