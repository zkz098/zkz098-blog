---
categories:
  - 网站建设
date: 2022-08-27 12:10:02
keywords: shoka,hexo,jsdelivr
tags:
  - shoka
title: shoka主题速度优化-拆分jsdelivr
---

# 前言

众所周知,jsdelivr在国内的速度可以用慢的一批来形容 \
而shoka主题使用了jsdelivr的combine功能加载第三方js,而combine在国内没有镜像源
并且阻断了使用CDN并发加速的道路,本篇博文会将jsdelivr聚合拆分为几个独立的js,以便使用国内镜像源和异步加载
:::info
此方案相较于本地化而言有较大速度优势,尤其在CDN并发加持下
:::

# 拆分jsdelivr

## 更改模板

打开`shoka\layout\_partials\layout.njk`,找到第144行左右:

```html
<script src="https://cdn.polyfill.io/v3/polyfill.js"></script>
&#123;{ _vendor_js() }&#125; &#123;{ _js('app.js')}&#125; &#123;{
partial('_partials/third-party/baidu-analytics.njk', {}, {cache: true}) }&#125;
```

更改为如下内容:

```html
<script src="https://cdn.polyfill.io/v3/polyfill.js"></script>
&#123;%- if theme.advVendors.enable %&#125; &#123;% for i in _list_vendor_js() %&#125; &#123;{
_adv_vendor_js(i) }&#125; &#123;% endfor %&#125; &#123;%- else %&#125; &#123;{ _vendor_js() }&#125;
&#123;%- endif %&#125; &#123;{ _js('app.js')}&#125; &#123;{
partial('_partials/third-party/baidu-analytics.njk', {}, {cache: true}) }&#125;
```

## 注册helper

打开`shoka\scripts\helpers\asset.js`,最后一行新建空行,增加如下内容:

```javascript
hexo.extend.helper.register("_list_vendor_js", () => {
  return hexo.theme.config.vendorsList.js;
});

hexo.extend.helper.register("_adv_vendor_js", function (js_name) {
  const config = hexo.theme.config.advVendors.js[js_name];
  const src = config["src"];
  let result;
  if (src.indexOf("http") !== -1) {
    result = src;
  } else if (src.indexOf("combine") !== -1) {
    console.log("The combine feature is not recommended!");
    result = hexo.theme.config.advVendors.combine + src;
  } else if (src.indexOf("npm") !== -1) {
    result = hexo.theme.config.advVendors.npm + src.slice(4);
  } else if (src.indexOf("gh") !== -1) {
    result = hexo.theme.config.advVendors.github + src.slice(3);
  } else {
    result = "/" + src;
  }
  let attr = { src: result };
  if (config["async"]) attr["async"] = "async";
  if (config["data-pjax"]) attr["data-pjax"] = "data-pjax";
  if (config["hash-value"]) attr["integrity"] = config["hash-value"];
  if (config["deferLoad"]) {
    return htmlTag(
      "script",
      { "data-pjax": true },
      `
        const script=document.createElement("script");script.src="${result}",script.async=true,document.body.appendChild(script)
        `,
    );
  }
  return htmlTag("script", attr, "");
});
```

## 更改配置

在shoka目录下`_config.yml`增加如下内容:
:::info
推荐内容,可根据自己情况更改
:::

```yaml
advVendors:
  enable: true
  github: "https://cdn.jsdelivr.net/gh/"
  combine: "https://cdn.jsdelivr.net/"
  npm: "https://unpkg.com/"
  js:
    pace:
      src: https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/pace/1.0.2/pace.min.js
    pjax:
      src: https://lib.baomitu.com/pjax/0.2.8/pjax.min.js
    fetch:
      src: npm/whatwg-fetch@3.4.0/dist/fetch.umd.js
    anime:
      src: https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/animejs/3.2.0/anime.min.js
    algolia:
      src: https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/algoliasearch/4.12.1/algoliasearch-lite.umd.min.js
    instantsearch:
      src: https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/instantsearch.js/4.39.0/instantsearch.production.min.js
    lazyload:
      src: https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/lozad.js/1.16.0/lozad.min.js
    quicklink:
      src: https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/quicklink/2.2.0/quicklink.umd.min.js
    fancybox:
      src: https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/??jquery/3.5.1/jquery.min.js,fancybox/3.5.7/jquery.fancybox.min.js,justifiedGallery/3.8.1/js/jquery.justifiedGallery.min.js
      async: true
    copy_tex:
      src: https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/KaTeX/0.12.0/contrib/copy-tex.min.js
      async: true
    chart:
      src: npm/frappe-charts@1.5.0/dist/frappe-charts.min.iife.js

vendorsList:
  js:
    - pace
    - pjax
    - fetch
    - anime
    - algolia
    - instantsearch
    - lazyload
    - quicklink
    - fancybox
    - copy_tex
    - chart
```

下面为结构详解:

```yaml
advVendors:
	enable: true #是否开启,关闭使用主题默认加载
	github: #github使用的加载源,需要协议头和末尾斜杠
	combine: #聚合js使用的加载源(不建议使用)
	npm: #npm的加载源
	js:
		jspackage: #js名,可以与文件名不一致
			src: "资源地址,详情见后面"
			# async: true 异步加载此js
			# data-pjax: true 在pjax加载时刷新此js
			# hash-value: 这个资源的integrity值,用于防XXS
			# deferLoad: true 使用动态DOM节点添加延迟js加载(实验性)

vendorsList:
  js:
  	- jspackage #与上方jspackage一致即可
```

资源地址格式如下:

- `https://example.com/xxx.js` 使用http(s)地址加载js
- `combine/xxx.js,xxx.js`使用jsdelivr的combine功能加载(不推荐)
- `npm/xxx/xxx.js`使用npm源加载js
- `gh/xxx/xxx.js`使用gh源加载js
- `xxx.js`从本地加载js \
  优先级如下: \
  `http>combine>npm>gh>本地`
