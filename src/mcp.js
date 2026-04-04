#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { getHotRank, searchVideos, searchUsers, searchBangumi, getVideos, getUesr } from './commands/index.js'

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

server.registerTool('search_users',
  {
    description: '搜索哔哩哔哩用户、UP主',
    inputSchema: z.object({
      keyword: z.string().describe('搜索关键词'),
      limit: z.number().default(3).describe('获取页数，每页约 36 个'),
    }),
  },
  async ({ keyword, limit }) => {
    const results = await searchUsers(keyword, limit)
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(results, null, 2)
      }]
    }
  }
)

server.registerTool('search_bangumi',
  {
    description: '搜索哔哩哔哩番剧',
    inputSchema: z.object({
      keyword: z.string().describe('搜索关键词'),
      limit: z.number().default(3).describe('获取页数，每页约 12 个'),
    }),
  },
  async ({ keyword, limit }) => {
    const results = await searchBangumi(keyword, limit)
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(results, null, 2)
      }]
    }
  }
)

server.registerTool('get_videos',
  {
    description: '获取用户投稿列表',
    inputSchema: z.object({
      uid: z.string().describe('用户 UID'),
      limit: z.number().default(5).describe('获取页数，每页约 40 个'),
    }),
  },
  async ({ uid, limit }) => {
    const results = await getVideos(uid, limit)
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(results, null, 2)
      }]
    }
  }
)

server.registerTool('get_user',
  {
    description: '获取用户信息',
    inputSchema: z.object({
      uid: z.string().describe('用户 UID'),
    }),
  },
  async ({ uid }) => {
    const results = await getUesr(uid)
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(results, null, 2)
      }]
    }
  }
)

const transport = new StdioServerTransport()
await server.connect(transport)
