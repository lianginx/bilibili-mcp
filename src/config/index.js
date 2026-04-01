import path from 'node:path';
import os from 'node:os';

export const configDirPath = path.join(os.homedir(), '.config/bilibili-mcp');

export const browserCacheDirPath = path.join(configDirPath, 'browser-cache');
