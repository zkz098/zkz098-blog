---
categories:
  - 网站建设
  - shokaX
date: 2023-1-13 20:41:21
keywords: shokaX,shoka,shokaX插件
tags:
  - shokaX
title: shokaX主题插件文档
---

# 什么是shokaX插件

shokaX插件系统提供了一个无需修改主题文件的魔改方法 \
主要基于`hexo filter`功能实现
[awesome-shokaX](https://github.com/zkz098/awesome-shokaX) 中有大部分shokaX插件
:::info
此插件系统高度借鉴于Next,部分Next插件甚至可以直接运行(仅针对部分注入点)
:::

# 如何安装插件

## script式插件

此类插件为文件夹式,一般由一个js文件和一个views文件夹组成,安装步骤如下:

1. 在hexo环境根目录下创建`scripts`文件夹,并将js文件放置于其中
2. 将views文件夹复制到hexo环境根目录下
3. 如有`README.MD`文件请查看其中说明

随后`hexo s`即可

## npm包式

此类插件为npm包,直接使用包管理器安装即可

# 如何编写插件

## 在开始之前

### 导言

shokaX插件的API和NextInjectAPI高度一致,所以本文未覆盖到的点位可以在评论区咨询或者参阅NextInjectsAPI
:::info
shokaX插件基于hexo script实现,因此你应该有一些编写hexo script的经验
:::

### 注入点

shokaX插件在插入模板时需要指定点位,截止本文写就时,可用点位见下表:
模板点位:

| 代码名      | 点位       | 描述                               |
| :---------- | :--------- | :--------------------------------- |
| head        | 文件头部   | 在`</head>`标签前注入模板          |
| sidebar     | 侧栏       | 在social区域上方注入模板           |
| rightNav    | 导航栏右侧 | 在日夜模式切换和搜索的右侧注入模板 |
| postMeta    | 文章信息   | 在card的字数右侧注入模板           |
| postBodyEnd | 文章尾部   | 在文章的尾部注入模板               |
| footer      | 页面底部   | 在页面底部注入模板                 |
| comment     | 评论区     | 在评论区注入模板(在主题评论上方)   |
| bodyEnd     | 文件尾部   | 在`</body>`标签前注入模板          |
| status      | 页脚状态   | 在备案号及版权说明之前             |

样式点位:
:::info
所有样式点位注入时均可覆盖主题样式
:::

| 代码名   | 点位 | 描述        |
| :------- | :--- | :---------- |
| variable | 变量 | 注入CSS变量 |
| mixin    | 混合 | 注入mixin   |
| style    | 样式 | 注入CSS样式 |

## 基础语法

### 注入模板

在一切之前,你应该创建一个js文件,随后写入如下内容:

```javascript
hexo.extend.filter.register("theme_inject", function (injects) {});
```

这段代码的意思是注册一个基于`theme_inject`事件的过滤器 \
然后准备一个pug文件,下面以`example.pug`作为例子

```pug
div(id="test")
	p(id="test1") hello world
```

:::info
如果是js文件式,应将模板和样式放置于`views`文件夹中,npm式与js平级即可
:::
随后修改js文件:

```javascript
hexo.extend.filter.register("theme_inject", function (injects) {
  injects.footer.file("example", "views/example.pug", {}, { cache: true });
});
```

随后启动`hexo s`,你会发现页面底部出现了`hello world`
这行代码的意义如下:

```javascript
injects.footer // 此处为过滤器的传入参数,即为shokaXInjectAPI // 此处为注入点,可参考上文的代码名
  .file(
    // 直接注入一个文件
    "example", // 名称,应当好记且不重复
    "views/example.pug", // 文件,以hexo环境根目录为根目录
    {}, // locals变量
    { cache: true }, // 是否需要缓存(如果组件内容随页面而变动,请填false)
  );
```

此外,还有`raw`方法,格式为:

```javascript
raw(
  "example", //名称
  "<p>hello world</p>", // 模板
);
```

### 注入样式

还是这个js,自己准备一个`example.styl`放置于`views`文件夹,修改代码为:

```javascript
hexo.extend.filter.register("theme_inject", function (injects) {
  injects.footer.file("example", "views/example.pug", {}, { cache: true });
  injects.style.push("views/example.styl");
});
```

代码意义同上,但style点位仅有push方法

## 更高级一点

### 插件格式

这里说明一下shokaX插件格式,以便在`awesome-shokaX`中发布,格式如下:

```text
views //储存模板和样式(文件夹)
xxx.js //插件主程序
README.MD //插件的自述和注意事项
```

npm包只需要发布即可

### 常见问题

在npm中发布的包中,shokaXInjectsAPI的路径应使用如下格式:

```javascript
path.join(__dirname, "file.xxx");
```

# 结语

如果有本文未覆盖到的点位或出现问题,可在评论区询问
