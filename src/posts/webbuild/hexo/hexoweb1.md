---
categories:
  - 网站建设
  - hexo
date: 2022-08-18 20:24:03
keywords: hexo,hexo博客,hexo博客搭建,shoka主题
tags:
  - shoka
title: 从0搭建hexo博客-环境搭建
---

# hexo的优势

hexo是**静态博客生成器**(SSG),这意味着它不需要服务端来进行渲染,只需要将文件发送给客户端即可 \
因此,hexo脱离了服务器的限制,可以在`github pages`等静态页面托管平台上部署 \
hexo基于NODEJS,具有较强的扩展性,性能也相对较高

# 前期准备工作

需要的软件如下:

## node.js

打开[nodejs官网](http://nodejs.cn/download/),选择自己的平台对应的安装包即可
安装成功后请在命令行输入`node -v`和`npm -v`检验安装是否成功

```bash
# npm install -g cnpm --registry=https://registry.npmmirror.com
npm install -g yarn #安装yarn即可
 yarn config set registry https://registry.npmmirror.com
```

## git

[点我](https://git-scm.com/download/)下载对应版本的git安装包,直接安装即可
右键有`git bash`选项就是成功了

:::info
Markdown编辑软件可以用`Typora`,博主使用的是`IDEA`
:::

# 安装hexo

## 安装并初始化hexo

下面的步骤在你的博客文件夹进行,例如`D:\hexo`
安装hexo框架:

```bash
cnpm install -g hexo-cli
```

初始化hexo框架:

```bash
hexo init #报错换成npx hexo init
```

随后安装对应NPM包:

```bash
cnpm i
```

然后就可以开始启动博客了:

```bash
hexo g # 报错换成 npx hexo g
hexo s # 报错换成 npx hexo s
```

等待控制台输出如下内容:

```bash
INFO  Validating config
INFO  Start processing
INFO  Hexo is running at http://localhost:4000 . Press Ctrl+C to stop.
```

随后打开[http://localhost:4000](http://localhost:4000)就能看到博客了
界面应该如下:
![landscape的图片](https://d33wubrfki0l68.cloudfront.net/5997a40576f3beca7bbbd86fe79a795e9d520d8e/87f88/themes/screenshots/landscape.png)

## hexo的文件结构

在进入下一步前,我们需要先看一下hexo的文件结构:

```text
hexo/
|-- node_modules/
|-- scaffolds/
|-- source/
|-- themes/
|-- _config.xxx.yml
|-- _config.yml
|-- package.json
|-- package-lock.json
```

- `node_modules`用于放置NPM包,无需注意
- `scaffolds`储存文章模板,`hexo new`时会用到
- `source`储存文章和部分资源
- `themes`储存主题
- `_config.xxx.yml`是主题的plus版配置文件(xxx须更改为主题名)
- `_config.yml`是hexo的配置文件
- `package.json`NPM的包json,无需注意

:::info
shoka主题的配置在下一篇
:::
