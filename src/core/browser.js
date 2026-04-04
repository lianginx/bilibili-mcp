import { chromium } from 'playwright';
import { browserCacheDirPath } from '../config/index.js'

export async function useBrowserContext(options) {
  const context = await chromium.launchPersistentContext(
    browserCacheDirPath,
    {
      viewport: { width: 1920, height: 1080 },
      headless: options?.headless === undefined
        ? true
        : options.headless
    }
  );

  context.setDefaultTimeout(
    options?.timeout === undefined
      ? 1000 * 10
      : options.timeout
  );

  return { context };
}
