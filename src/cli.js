#!/usr/bin/env node

import { Command } from 'commander';
import { runLogin, runLogout } from './cli/index.js'

const program = new Command();

program
  .command('login')
  .description('登录哔哩哔哩')
  .action(runLogin);

program
  .command('logout')
  .description('退出哔哩哔哩账号')
  .action(runLogout);

program.parse();
