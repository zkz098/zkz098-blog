---
categories:
  - 网站建设
  - shokaX
date: 2022-12-17 14:59:03
keywords: shokaX,shoka,shokaX-CLI
tags:
  - shokaX
title: Hexo主题shokaX文档
---

# shokaX是什么

一个 [shoka主题](https://github.com/amehime/hexo-theme-shoka) 的二次开发版,截止文章发布时尚无正式版(github中的开发版可供测试使用) \
shokaX的目标是建设一个更易使用和开发的主题,截止此文章写就时支持如下功能:

- 支持twikoo、gitalk、giscus和waline评论系统
- 原生PWA支持
- 注入js和css支持
- 自定义font
- CSS渐变作为文章封面
- 一些小组件
- 现代化的插件系统
- 使用typescript进行类型标注

:::info
shokaX仍在开发中,发现BUG或有建议 [点我](https://github.com/zkz098/hexo-theme-shokaX) 跳转到github仓库
:::
:::info
本主题采用GPL 3协议开源,欢迎fork和提交PR \
npm上的主题包名为`hexo-theme-shokax`
:::

# 如何安装?

## 安装主题

shokaX的安装基本与shoka相同,但是md渲染器需要使用[hexo-renderer-multi-next-markdown-it](https://github.com/zkz098/hexo-renderer-multi-next-markdown-it) \
`shokaX-CLI`只负责安装主题,配置见下文
:::warning
在执行下面的命令前请使用`hexo init`初始化hexo环境
:::

```shell
npm install shokax-cli --location=global
SXC install shokaX
```

:::danger
如果从shoka主题迁移,请卸载`hexo-symbols-count-time`插件
:::

## 更改配置

:::info
更改根目录`_config.yml`中的`theme`为`shokaX`(SXC默认origin或npm安装修改为`shokax`) \
请注意,本主题仅在npm上使用的是`shokax`,其他情况下均为`shokaX`
:::
下面的配置大部分与shoka相同:

```yaml
markdown:
  render: # 渲染器设置
    html: false # 过滤 HTML 标签
    xhtmlOut: true # 使用 '/' 来闭合单标签 （比如 <br />）。
    breaks: true # 转换段落里的 '\n' 到 <br>。
    linkify: true # 将类似 URL 的文本自动转换为链接。
    typographer:
    quotes: "“”‘’"
  plugins: # markdown-it 插件设置
    - plugin:
        name: markdown-it-toc-and-anchor
        enable: true
        options: # 文章目录以及锚点应用的 class 名称，shoka 主题必须设置成这样
          tocClassName: "toc"
          anchorClassName: "anchor"
    - plugin:
        name: markdown-it-multimd-table
        enable: true
        options:
          multiline: true
          rowspan: true
          headerless: true
    - plugin:
        name: ./markdown-it-furigana
        enable: true
        options:
          fallbackParens: "()"
    - plugin:
        name: ./markdown-it-spoiler
        enable: true
        options:
          title: "你知道得太多了"

minify:
  html:
    enable: true
    exclude: # 排除 hexo-feed 用到的模板文件
      - "**/json.ejs"
      - "**/atom.ejs"
      - "**/rss.ejs"
  css:
    enable: true
    exclude:
      - "**/*.min.css"
  js:
    enable: true
    mangle:
      toplevel: true #如果js压缩错误请删除此行
    output:
    compress:
    exclude:
      - "**/*.min.js"

autoprefixer:
  exclude:
    - "*.min.css"

# 请注意,如果使用SXC的默认origin或者npm安装主题,请不要使用下面的feed配置
feed:
  limit: 20
  order_by: "-date"
  tag_dir: false
  category_dir: false
  rss:
    enable: true
    template: "themes/shokaX/layout/_alternate/rss.ejs"
    output: "rss.xml"
  atom:
    enable: true
    template: "themes/shokaX/layout/_alternate/atom.ejs"
    output: "atom.xml"
  jsonFeed:
    enable: true
    template: "themes/shokaX/layout/_alternate/json.ejs"
    output: "feed.json"
```

如果使用SXC的默认origin或者npm安装主题,feed配置如下:

```yaml
feed:
  limit: 20
  order_by: "-date"
  tag_dir: false
  category_dir: false
  rss:
    enable: true
    template: "node_modules/hexo-theme-shokax/layout/_alternate/rss.ejs"
    output: "rss.xml"
  atom:
    enable: true
    template: "node_modules/hexo-theme-shokax/layout/_alternate/atom.ejs"
    output: "atom.xml"
  jsonFeed:
    enable: true
    template: "node_modules/hexo-theme-shokax/layout/_alternate/json.ejs"
    output: "feed.json"
```

停用默认代码高亮(将下面两项更改为`false`):

```yaml
highlight:
  enable: false

prismjs:
  enable: false
```

搜索功能配置:

```yaml
algolia:
  appId: #Your appId
  apiKey: #Your apiKey
  adminApiKey: #Your adminApiKey
  chunkSize: 5000
  indexName: #"shokaX"
  fields:
    - title #必须配置
    - path #必须配置
    - categories #推荐配置
    - content:strip:truncate,0,2000
    - gallery
    - photos
    - tags
```
