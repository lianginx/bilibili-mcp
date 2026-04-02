import { useBrowserContext } from '../core/browser.js'

export async function getUesr(uid) {
  const { context } = await useBrowserContext();

  try {
    const page = context.pages()[0];

    const url = `https://space.bilibili.com/${uid}`;

    await page.goto(url);

    // 等待异步数据加载完成
    await page.locator('.content').waitFor();

    // 自己看自己的主页
    const own = page.locator('.upinfo-section');
    if (await own.isVisible()) {
      await own.click();
      await page.locator('.vui_popover.vui_popover-is-bottom .menu-popover__panel-item').nth(1).click();
    }

    const name = await extractName(page);
    const level = await extractLevel(page);
    const isLiving = await page.locator('.live-ani').isVisible();
    const desc = await page.locator('.upinfo-detail__bottom .pure-text').getAttribute('title');
    const announcement = await page.locator('.ann-section .show-text').textContent();
    const auth = await extractAuth(page);
    const birthday = await extractBirthday(page);

    const follows = await extractFollows(page);
    const fans = await extractFans(page);
    const likes = await extractLikes(page);
    const plays = await extractPlays(page);

    const videos = await extractVideos(page);

    return {
      name,
      uid,
      level,
      isLiving,
      desc,
      announcement,
      auth,
      birthday,
      follows,
      fans,
      likes,
      plays,
      videos,
      url,
    };

  } finally {
    await context.close();
  }
}

/**
 * @param {import('playwright').Page} page 
 */
async function extractName(page) {
  const title = await page.title();
  return title.split('的')[0];
}

/**
 * @param {import('playwright').Page} page 
 */
async function extractAuth(page) {
  const locator = page.locator('.auth-section .auth-title > p');
  if (!await locator.first().isVisible()) {
    return null;
  }

  const typeText = await locator.first().textContent();
  const type = typeText.replace('：', '');

  const titleText = await locator.nth(1).textContent();
  const titles = titleText.split('、');

  return { type, titles };
}

/**
 * @param {import('playwright').Page} page 
 */
async function extractLevel(page) {
  const locator = page.locator('.level > i.vui_icon');
  const className = await locator.getAttribute('class');
  const match = className.match(/user_level_(\d+)/);
  const level = match ? Number(match[1]) : null;
  return level;
}

/**
 * @param {import('playwright').Page} page 
 */
async function extractFollows(page) {
  const locator = page.locator('.nav-statistics__item .nav-statistics__item-num');
  const num = await locator.nth(0).getAttribute('title');
  const follows = Number(num.replaceAll(/,/g, ''));
  return follows;
}

/**
 * @param {import('playwright').Page} page 
 */
async function extractFans(page) {
  const locator = page.locator('.nav-statistics__item .nav-statistics__item-num');
  const num = await locator.nth(1).getAttribute('title');
  const fans = Number(num.replaceAll(/,/g, ''));
  return fans;
}

/**
 * @param {import('playwright').Page} page 
 */
async function extractLikes(page) {
  const locator = page.locator('.nav-statistics__item .nav-statistics__item-num');
  const num = await locator.nth(2).textContent();
  const likes = num.replaceAll(/,/g, '');
  return likes;
}

/**
 * @param {import('playwright').Page} page 
 */
async function extractPlays(page) {
  const locator = page.locator('.nav-statistics__item .nav-statistics__item-num');
  const num = await locator.nth(3).textContent();
  const plays = num.replaceAll(/,/g, '');
  return plays;
}

/**
 * @param {import('playwright').Page} page 
 */
async function extractVideos(page) {
  const locator = page.locator('.section-wrap__desc').first();
  const textContent = await locator.textContent();
  const videos = Number(textContent.replace('·', ''));
  return videos;
}

/**
 * @param {import('playwright').Page} page 
 */
async function extractBirthday(page) {
  const locator = page.locator('.info-section .vui_ellipsis').nth(1);
  if (!await locator.isVisible()) {
    return null;
  }
  const birthday = await locator.textContent();
  return birthday;
}
