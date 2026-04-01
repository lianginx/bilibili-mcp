import consola from 'consola';
import { login } from '../commands/index.js'
import ora from 'ora'

export async function runLogin() {
  const spinner = ora({ discardStdin: false })
    .start('请在弹出的浏览器窗口中登录哔哩哔哩账号……');

  await login()
    .then(() => consola.success('登录成功'))
    .catch((err) => consola.error(err || '登录失败'))
    .finally(() => spinner.stop())
}
