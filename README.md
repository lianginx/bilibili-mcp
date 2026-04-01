# bilibili-mcp

哔哩哔哩 MCP Server，支持获取热门排行榜、搜索视频、获取用户投稿列表等功能

## 前置依赖

安装 `Chromium` 依赖：

```bash
npx playwright install chromium
```

登录哔哩哔哩账号，获取 Cookies：

```bash
# 安装
npm i -g @lianginx/bilibili-mcp

# 登录哔哩哔哩账号
bili-cli login
```

## 功能清单

- [x] 获取热门排行榜
- [x] 搜索视频
- [x] 获取用户投稿列表
- [ ] 获取用户关注列表
- [ ] 获取用户粉丝列表

## MCP Server

以 OpenCode 为例，配置 MCP Server：

```json
// ~/.config/opencode/opencode.json
{
  "mcp": {
    "bilibili": {
      "type": "local",
      "enabled": true,
      "command": ["bili-mcp"]
    }
  }
}
```

配置后重启 OpenCode 即可。

## 卸载清理

清理 `Chromium` 缓存：

```bash
npx playwright uninstall
```

清理 `bilibili-mcp` 缓存：

```bash
rm -rf ~/.config/bilibili-mcp
```
