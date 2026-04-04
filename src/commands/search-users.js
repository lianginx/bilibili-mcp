import { useBrowserContext } from '../core/browser.js'

export async function searchUsers(keyword, limit = 3) {
  const { context } = await useBrowserContext();

  try {
    let pageNumber = 1;
    const users = [];

    const page = context.pages()[0];
    await page.goto(`https://search.bilibili.com/upuser?keyword=${encodeURIComponent(keyword)}`);

    while (true) {
      // 只抓取 x 页的视频
      if (limit !== 0 && pageNumber > limit) {
        break;
      }

      // 获取视频列表
      const list = await page
        .waitForSelector('.media-list')
        .catch(() => { throw new Error('搜索失败，请稍后再试') });
      const results = await list.$$eval('.b-user-info-card', (els) => {
        return els.map((el) => {
          const name = el.querySelector('.i_card_title .text1')?.getAttribute('title')?.trim();
          const url = el.querySelector('.i_card_title .text1')?.getAttribute('href');
          const level = Number(el.querySelector('.level-icon use').getAttribute('xlink:href')?.replace('#lv_', ''))
          const authDom = el.querySelector('.bili-avatar .bili-avatar-icon');
          const authType = authDom.classList.contains('bili-avatar-icon-business')
            ? '机构认证'
            : authDom.classList.contains('bili-avatar-icon-personal')
              ? '个人认证'
              : undefined;
          const [fans, _, videos, __, ...desc] = el.querySelector('.user-content .b_text.fs_5')?.getAttribute('title')?.split(' ');
          return {
            name, url, level, authType, fans, videos,
            desc: desc?.join(' ')?.trim() ?? ''
          };
        });
      });
      users.push(...results);

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

    return users;
  } finally {
    await context.close();
  }
}
