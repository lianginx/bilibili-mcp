import { chromium } from 'playwright';
import { browserCacheDirPath } from '../config/index.js'

export async function useBrowserContext(options) {
  const context = await chromium.launchPersistentContext(
    browserCacheDirPath,
    {
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
