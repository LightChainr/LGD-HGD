# 25F 临床医生解释网站

这是一个纯静态网站，不依赖服务器、数据库、Node.js 或外部 CDN。

## 本地查看

由于完整资料库通过 `fetch()` 读取 `source/执行包/` 下的 Markdown/TSV，建议在本目录启动一个静态 HTTP 服务：

```bash
python -m http.server 8000
```

然后访问 `http://localhost:8000/`。直接双击 `index.html` 时，部分浏览器会因 `file://` 安全策略阻止资料库读取，但首页主体仍可显示。

## 部署

可直接部署到任意静态托管：Nginx/Apache、GitHub Pages、Cloudflare Pages、Netlify、Vercel 静态目录或医院内网静态服务器。只需把仓库根目录作为站点根目录。

## 文件结构

- `index.html`：页面结构与临床化内容
- `styles.css`：全部样式
- `app.js`：科室切换、资源闭合演示、启动清单，以及 Markdown/TSV 资料库加载与渲染
- `source/执行包/`：原始修订版执行包的全部 Markdown/TSV 文件，同时也是网站资料库的单一数据源
- `favicon.svg`：站点图标

## 修改建议

临床叙事主要在 `index.html`；视觉风格在 `styles.css`；研究方案和冻结合同直接修改 `source/执行包/` 下对应 Markdown/TSV，网页资料库无需额外同步生成。

## 数据与安全

本网站只包含研究方案与沟通资料，没有患者级数据。交互式启动清单使用浏览器 `localStorage` 本地保存勾选状态，不向外发送数据。

## 研究边界

网站已显式标注：当前为回顾性 FFPE 机制/测量研究，不用于个体诊疗决策；当前仅批准 L0–L2。
