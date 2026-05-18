# 每日推送小知识网站

这是一个 Netlify Functions 版本，可以直接打开 `index.html` 预览静态备用内容，也可以部署到 Netlify 后每天自动生成新内容。

## 当前能力

- 按北京时间获取当天日期。
- 显示阳历、农历、干支日和所属五行。
- 按当日地支五行计算今日穿衣吉色。
- 每天 00:00 自动切换当天页面内容。
- 英语、韩语、冷知识、历史内容有本地备用内容。
- 部署到 Netlify Functions 后，会优先读取后台每天 AI 生成的新内容。

## 部署方式

如果只想预览静态版，可以使用 Netlify Drop。

如果要每天 00:00 自动生成新内容，请使用 GitHub 连接 Netlify 或 Netlify CLI 部署，并配置 DeepSeek API 环境变量。详见 `NETLIFY_FUNCTIONS_DEPLOY.md`。

也可以把整个 `daily-knowledge-site` 文件夹上传到服务器，例如：

```bash
/var/www/daily-knowledge-site/
  index.html
  styles.css
  app.js
  assets/header-visual.png
```

用 Nginx 指向这个目录即可。因为页面逻辑都在浏览器里运行，不需要后端服务。

## 后续增强

如果想让词汇、冷知识和历史事件长期不重复，可以在云服务器上增加一个每日 00:00 的生成脚本，把新内容写入 JSON 文件，再由网页读取。

如果想让 Netlify 每天 00:00 自动调用 AI 生成新内容，需要额外配置 Netlify Functions、环境变量和定时任务。直接拖拽上传通常只适合静态站点。
