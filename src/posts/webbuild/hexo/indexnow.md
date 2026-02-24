---
categories:
  - 网站建设
  - hexo
date: 2022-09-28 12:04:20
keywords: hexo,indexnow,hexo-indexnow
tags:
  - shoka
title: hexo-indexnow插件使用教程
---

# hexo-indexnow插件

:::info
此插件仅提供了`indexnow`链接推送功能,建议搭配其他插件使用
:::
:::primary
目前只有`1.0.6+`和`1.0.3`可以正常运行,请勿安装`1.0.5` \
`1.0.3+`均有fetch兼容支持
:::

## 安装插件和获取apikey

安装此插件:

```bash
yarn add hexo-indexnow
# 或
npm i hexo-indexnow --save
```

随后打开一个搜索引擎的indexnow界面,例如[微软必应](https://www.bing.com/indexnow) \
向下滑界面,找到`Generate API Key`,将值复制下来

## 配置hexo

在根目录`_config.yml`添加如下配置:

```yaml
hexo_indexnow:
  count: latest # 数字或者"latest"(=1)
  txt_name: indexnow.txt # 链接文件名
  apikey: xxxxxx # 你的apikey
  server: bing # indexnow服务器,可选值有:bing、yandex、indexnow

deploy:
  - type: indexnow_url_submitter
```

随后`hexo d`即可
