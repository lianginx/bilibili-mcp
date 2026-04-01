import { useBrowserContext } from '../core/browser.js'

export async function getVideos(userId, limit = 5) {
  const { context } = await useBrowserContext();

  try {
    let pageNumber = 1;
    const videos = [];

    const page = context.pages()[0];

    // 访问用户视频列表页面
    await page.goto(`https://space.bilibili.com/${userId}/upload/video`);

    // 切换列表视图
    const switchListView = await page.waitForSelector('.lists-view-mode__action')
    await switchListView.click();

    while (true) {
      // 只抓取 x 页的视频
      if (limit !== 0 && pageNumber > limit) {
        break;
      }

      // 获取视频列表
      const list = await page
        .waitForSelector('.video-list.list-mode')
        .catch(() => { throw new Error('触发频率限制，请稍后再试') });
      const results = await list.$$eval('.upload-video-card', (els) => {
        return els.map((el) => {
          const title = el.querySelector('.title')?.getAttribute('title')?.trim() || '无';
          const desc = el.querySelector('.desc')?.textContent.trim() || '无';
          const url = el.querySelector('.title')?.getAttribute('href')?.trim() || '无';
          const viewCount = el.querySelectorAll('.upload-video-card__stats .stat')[0]?.textContent.trim() || '无';
          const danmakuCount = el.querySelectorAll('.upload-video-card__stats .stat')[1]?.textContent.trim() || '无';
          const date = el.querySelectorAll('.upload-video-card__stats .stat')[2]?.textContent.trim() || '无';
          const duration = el.querySelector('.bili-cover-card__stats .bili-cover-card__stat')?.textContent.trim() || '无';
          return { title, desc, url, viewCount, danmakuCount, date, duration };
        })
      })
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
