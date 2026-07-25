# 糖果外海发行剧社官网

首版为无构建依赖的静态网站，可直接由任意 HTTP 静态服务器部署。

## 本地预览

```powershell
cd "E:\voiceclon\web site\candy-overseas-studio"
python -m http.server 4173
```

浏览器访问 `http://127.0.0.1:4173/`。

## 结构

- `index.html`：官网页面与可访问性结构。
- `styles.css`：响应式视觉与交互动效。
- `app.js`：导航、滚动揭示、视频弹窗、环境轮播与表单演示逻辑。
- `design/frame.md`：品牌视觉规范。
- `design/figma-tokens.json`：可导入 Figma Tokens 的设计变量。
- `hyperframes-brand-film/`：HyperFrames 品牌动效工程。
