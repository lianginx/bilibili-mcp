import { useBrowserContext } from '../core/browser.js'

export async function getHotRank() {
  const { context } = await useBrowserContext();

  try {
    const page = context.pages()[0];
    await page.goto('https://www.bilibili.com/v/popular/rank/all');

    const list = await page
      .waitForSelector('.rank-list', { timeout: 1000 * 10 })
      .catch(() => { throw new Error('获取热门排行榜失败，请稍后再试') });

    const results = await list.$$eval('.rank-item', (els) => {
      return els.map((el) => {
        const title = el.querySelector('.title').textContent.trim();
        const url = el.querySelector('.title').href;
        const author = el.querySelector('.detail .data-box.up-name').textContent.trim();
        const viewCount = el.querySelectorAll('.detail-state .data-box')[0].textContent.trim();
        const danmakuCount = el.querySelectorAll('.detail-state .data-box')[1].textContent.trim();
        return { title, author, viewCount, danmakuCount, url };
      })
    })

    return results;
  } finally {
    await context.close();
  }
}
