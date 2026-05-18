# Netlify Functions 版本部署说明

这个版本包含：

- 静态网页
- `/.netlify/functions/daily`：读取当天 AI 生成内容
- `generate-daily` 定时函数：每天北京时间 23:50 生成第二天内容
- Netlify Blobs：保存每天生成的 JSON

## 重要

Netlify Drop 适合上传静态站点。要让定时函数真正运行，建议用以下任一方式部署：

1. GitHub 连接 Netlify 自动部署
2. Netlify CLI 部署

## Netlify 环境变量

进入 Netlify 项目：

`Project configuration` -> `Environment variables`

添加：

```text
OPENAI_API_KEY=你的 OpenAI API Key
OPENAI_MODEL=gpt-4.1-mini
ADMIN_SECRET=自己设置一个复杂一点的密码
```

环境变量作用域需要包含 Functions。

## 定时任务

`netlify.toml` 已配置：

```toml
[functions."generate-daily"]
  schedule = "50 15 * * *"
```

Netlify 的 cron 使用 UTC，所以 `15:50 UTC` 等于北京时间 `23:50`。这样会提前 10 分钟生成第二天内容，保证 00:00 打开页面时已有新内容。

## 部署后测试

部署完成后，到 Netlify 项目的 `Functions` 页面：

1. 找到 `generate-daily`
2. 确认有 `Scheduled` 标记
3. 点 `Run now` 手动生成一次内容
4. 打开网站刷新页面

`Run now` 会生成明天内容。  
如果你想第一次部署后立刻生成今天内容，可以访问：

```text
https://你的网站域名/.netlify/functions/generate-now?secret=你的ADMIN_SECRET
```

也可以指定日期：

```text
https://你的网站域名/.netlify/functions/generate-now?secret=你的ADMIN_SECRET&date=2026-05-18
```

如果当天内容仍未生成，网页会自动使用本地备用内容，不会白屏。

## 前端读取逻辑

网页会请求：

```text
/.netlify/functions/daily?date=YYYY-MM-DD
```

如果后台有当天内容，就展示 AI 生成版；如果没有，就展示本地备用版。
