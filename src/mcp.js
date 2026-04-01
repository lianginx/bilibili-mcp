#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { getHotRank, searchVideos, getFollows, getVideos } from './commands/index.js'

const server = new McpServer({
  name: 'bili-mcp',
  version: '1.0.0'
})

server.registerTool('get_hot_rank',
  { description: '获取哔哩哔哩热门排行', },
  async () => {
    const results = await getHotRank()
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(results, null, 2)
      }]
    }
  }
)

server.registerTool('search_videos',
  {
    description: '搜索哔哩哔哩视频',
    inputSchema: z.object({
      keyword: z.string().describe('搜索关键词'),
      limit: z.number().default(3).describe('获取页数，每页约 42 个'),
    }),
  },
  async ({ keyword, limit }) => {
    const results = await searchVideos(keyword, limit)
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(results, null, 2)
      }]
    }
  }
)

server.registerTool('get_video_list',
  {
    description: '获取用户投稿列表',
    inputSchema: z.object({
      userId: z.string().describe('用户 UID'),
      limit: z.number().default(5).describe('获取页数，每页约 40 个'),
    }),
  },
  async ({ userId, limit }) => {
    const results = await getVideos(userId, limit)
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(results, null, 2)
      }]
    }
  }
)

// server.registerTool('get_follows',
//   {
//     description: '获取用户关注列表',
//     inputSchema: z.object({ userId: z.string().describe('用户 UID') }),
//   },
//   async ({ userId }) => {
//     const results = await getFollows(userId)
//     return {
//       content: [{
//         type: 'text',
//         text: JSON.stringify(results, null, 2)
//       }]
//     }
//   }
// )

const transport = new StdioServerTransport()
await server.connect(transport)
