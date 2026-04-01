import { useBrowserContext } from '../core/browser.js'

export async function getFollows(userId) {
  const { context } = await useBrowserContext();

  try {
    const page = context.pages()[0];
    await page.goto(`https://space.bilibili.com/${userId}/relation/follow`);

    const fans = [];

    while (true) {
      const list = await page.waitForSelector('section.relation-content .items', { timeout: 5000 }).catch(() => null);
      if (!list) break;

      const nextfans = await list.$$eval('div.item', (els) => {
        return els.map((el) => {
          const name = el.querySelector('a.relation-card-info__uname')?.title || '';
          const avatar = el.querySelector('div.relation-card-info__sign')?.title || '';
          return { name, avatar };
        });
      });
      fans.push(...nextfans);

      const [_, nextBtn] = await page.$$('button.vui_button.vui_pagenation--btn.vui_pagenation--btn-side');
      if (!nextBtn || await nextBtn.isDisabled()) {
        break;
      }
      await nextBtn.click();
      await page.waitForTimeout(1000);
    }

    return fans;
  } finally {
    await context.close();
  }
}
