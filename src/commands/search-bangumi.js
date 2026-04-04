import { useBrowserContext } from '../core/browser.js'

export async function searchBangumi(keyword, limit = 3) {
  const { context } = await useBrowserContext();

  try {
    let pageNumber = 1;
    const bangumi = [];

    const page = context.pages()[0];

    await page.goto(`https://search.bilibili.com/bangumi?keyword=${encodeURIComponent(keyword)}`);

    // 没有搜索结果
    if (await page.$('.search-nodata-container')) {
      throw new Error('没有搜索结果');
    }

    while (true) {
      // 只抓取 x 页的视频
      if (limit !== 0 && pageNumber > limit) {
        break;
      }

      // 获取视频列表
      const list = await page
        .waitForSelector('.media-list')
        .catch(() => { throw new Error('搜索失败，请稍后再试') });
      const results = await list.$$eval('.media-card', (els) => {
        return els.map((el) => {
          const title = el.querySelector('.media-card-content-head-title a')?.getAttribute('title')?.trim();
          const url = el.querySelector('.media-card-content-head-title a')?.getAttribute('href');
          const category = el.querySelector('.media-card-content-head-title .tag')?.textContent?.trim();

          const labels = el.querySelector('.media-card-content-head .media-card-content-head-label')?.textContent.split(' · ');
          let date, tags, episodes;
          if (labels.length === 2) {
            date = labels[0].trim();
            episodes = labels[1].trim();
          } else if (labels.length === 3) {
            tags = labels[0].trim().split('/');
            date = labels[1].trim();
            episodes = labels[2].trim();
          }

          const cv = el.querySelector('.media-card-content-head .media-card-content-head-cv')?.textContent.trim();
          const desc = el.querySelector('.media-card-content-head .media-card-content-head-desc')?.getAttribute('title')?.trim();
          const numberOfRatings = el.querySelector('.media-card-content-footer-score .score-text')?.textContent.trim();
          const score = el.querySelector('.media-card-content-footer-score .score-value')?.textContent.trim();
          const isVIP = el.querySelector('.media-card-image .media-card-image-tag')?.textContent.trim() === '大会员';

          return { title, url, category, date, tags, episodes, cv, desc, numberOfRatings, score, isVIP, };
        });
      });
      bangumi.push(...results);

      // 下一页
      const [_, nextBtn] = await page.$$('button.vui_button.vui_pagenation--btn.vui_pagenation--btn-side');
      if (!nextBtn || await nextBtn.isDisabled()) {
        break;
      }
      await nextBtn.click();
      pageNumber++;

      // 等待页面加载
      await page.waitForTimeout(1000);
    }

    return bangumi;
  } finally {
    await context.close();
  }
}
