import { useBrowserContext } from '../core/browser.js'

export async function searchVideos(keyword, limit = 3) {
  const { context } = await useBrowserContext();

  try {
    let pageNumber = 1;
    const videos = [];

    const page = context.pages()[0];
    await page.goto(`https://search.bilibili.com/video?keyword=${encodeURIComponent(keyword)}`);

    while (true) {
      // 只抓取 x 页的视频
      if (limit !== 0 && pageNumber > limit) {
        break;
      }

      // 获取视频列表
      const list = await page
        .waitForSelector('.video-list')
        .catch(() => { throw new Error('搜索失败，请稍后再试') });
      const results = await list.$$eval('.video-list-item', (els) => {
        return els.map((el) => {
          const title = el.querySelector('.bili-video-card__info--tit')?.textContent.trim() || '无';
          const author = el.querySelector('.bili-video-card__info--author')?.textContent.trim() || '无';
          const date = el.querySelector('.bili-video-card__info--date')?.textContent.split(' ')[2] || '无';
          const viewCount = el.querySelectorAll('.bili-video-card__stats--item')[0]?.textContent.trim() || '无';
          const danmakuCount = el.querySelectorAll('.bili-video-card__stats--item')[1]?.textContent.trim() || '无';
          const duration = el.querySelector('.bili-video-card__stats__duration')?.textContent.trim() || '无';
          const url = el.querySelector('.bili-video-card__info--right a')?.getAttribute('href')?.trim() || '无';
          return { title, author, viewCount, danmakuCount, duration, date, url };
        });
      });
      videos.push(...results);

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

    return videos;
  } finally {
    await context.close();
  }
}
