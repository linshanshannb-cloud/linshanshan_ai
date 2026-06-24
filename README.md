# AI 在线简历（Next.js + Coze）

一个可本地运行的 AI 在线简历 MVP。访客可以浏览个人经历，并通过网页中的聊天区向 Coze Bot 提问。

## 数据流

浏览器聊天区 → `POST /api/chat` → Coze Chat API → `/api/chat` 返回答案 → 页面展示

PAT Token、Bot ID 和 User ID 只在服务端读取，不会被打包到浏览器代码中。

## 本地运行

要求：Node.js 20 或更高版本。

```bash
npm install
copy .env.local.example .env.local
npm run dev
```

打开 <http://localhost:3000>。

macOS / Linux 复制环境变量文件时使用：

```bash
cp .env.local.example .env.local
```

## 配置 Coze

编辑 `.env.local`：

```env
COZE_API_BASE_URL=https://api.coze.com
COZE_PAT_TOKEN=你的_PAT_Token
COZE_BOT_ID=你的_Bot_ID
COZE_USER_ID=resume_website_visitor
```

- 国际版 Coze 通常使用 `https://api.coze.com`
- 中国版 Coze 可尝试使用 `https://api.coze.cn`
- Bot 需要先在 Coze 中发布，Token 需要具备调用该 Bot 的权限
- 修改 `.env.local` 后请重启开发服务

## 修改简历内容

个人信息、工作经历、项目经历和快捷问题集中在：

```text
data/resume.ts
```

直接替换示例内容即可。

## 测试

1. 启动项目并打开首页，确认所有简历区块正常显示。
2. 点击快捷问题，确认出现 Loading 动画。
3. 收到回答后继续追问，确认保留同一段 Coze 会话上下文。
4. 临时填写错误的 Token 并重启，确认页面显示明确错误信息。
5. 运行生产构建检查：

```bash
npm run typecheck
npm run build
```

## API 示例

项目运行后也可以直接测试服务端接口：

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"请介绍一下你自己\"}"
```
