import { rm } from 'node:fs/promises'
import { browserCacheDirPath } from '../config/index.js'
import consola from 'consola'
import ora from 'ora'

export async function runLogout() {
  const isConfirm = await consola.prompt('确定要退出登录哔哩哔哩账号吗？', { type: 'confirm' })
  if (!isConfirm)
    return

  const spinner = ora('正在退出登录哔哩哔哩账号...')
    .start();

  await rm(browserCacheDirPath, { recursive: true })
    .then(() => consola.success('已退出登录'))
    .catch((err) => consola.error(err))
    .finally(() => spinner.stop())
}
