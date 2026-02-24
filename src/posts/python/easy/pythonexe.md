---
categories:
  - python
  - 基础篇
date: 2022-06-01 13:15:31
keywords: python,pyinstaller,nuitka
tags:
  - python
title: python打包exe-pyinstaller和nuitka
---

# 引言

python的编写十分简单,而且linux内置python解释器,无需额外安装
但windows系统需要手动安装python解释器,一般来说会提高用户上手难度
本文会介绍两种python文件打包为exe的方式

# pyinstaller

## 基础操作

pyinstaller是最常见的python文件打包器,也是最易于使用的
先使用pip安装:

```bash
pip install pyinstaller
```

然后cd到你的python项目目录下,本次使用作者的网络工具箱测试:
:::info
工具箱包含了requests、os、socket等库,大约300行左右
:::
假设这个文件为`main.py`,下面进行打包:

```bash
pyinstaller -c main.py
```

随后开始漫长的打包,等到出现:

```text
XXXXX INFO: Building COLLECT COLLECT-00.toc completed successfully.
```

打包就完成了,可以前往dist文件夹下查看`main.exe`

## 进阶玩法

### 打包成单个exe

刚刚打包出来的文件是一个文件夹,还需要二次压缩,可以变更一下指令:

```bash
pyinstaller -F -c main.py
```

这样打包出来的就是一个exe文件了,体积会大一点

### upx压缩

前往[upx官网](https://upx.github.io/) 下载upx,将`upx.exe`放在项目目录下
然后执行`pyinstaller -F -c main.py`即可
:::info
upx压缩后占用空间会小很多,但执行速度会慢一点 \
如果使用numpy等底层为C的第三方库,请不要使用upx
:::

# nuitka

pyinstaller打包十分简便,但也存在以下问题:

- python本身执行速度就很慢
- 执行速度较慢,比python还慢
- 反编译非常容易!!一条龙pyinstaller反编译产业链了属于是!!

而本次的`nuitka`便可以解决上述的问题,它的会先将python文件转成`C++`代码,随后进行编译 \
这就让`nuitka`编译出的文件具有`C++`的速度和反反编译能力 \

## 安装

先安装nuitka:

```bash
pip install nuitka
```

然后安装[winlibs](https://github.com/brechtsanders/winlibs_mingw/releases/tag/12.1.0-10.0.0-msvcrt-r1)
注意事项:

- i686=32位,x86_64=64位
- 选择7z结尾的文件
- 如果太慢了,可以使用[moeyy的github加速](https://moeyy.cn/gh-proxy/) 进行加速

然后将这个文件夹放在任意位置,自行添加path到`mingw64\bin`目录
输入`gcc --version`,如果有正常输出,就是成功了

## 使用

打开你的项目文件,运行下列命令:

```bash
nuitka --mingw64 --standalone --show-progress --show-memory --output-dir=out main.py
```

选项的用途:

|      选项       |               用途                |
| :-------------: | :-------------------------------: |
|    --mingw64    | 指定mingw64编译器编译,默认为msvc  |
|  --standalone   | 指定独立环境运行,不然无法独立运行 |
| --show-progress |           显示编译进度            |
|  --show-memory  |           显示占用内存            |
|  --output-dir   |           指定输出目录            |

随后,你的终端会和这个一样:
![image.png](https://static.aichat.net/chat/202206/454346ba-e5fa-49cc-8418-fe0cb9c6cf1f.png)
在这里会弹出来一个选择,问你需不需要ccache进行加速,如果你的网络环境良好(github下载2MB/S以上)可以输入yes,反之选no
:::info
如果不是ccache可以参考第一步重新下载winlibs
:::
选择过后:
![image.png](https://static.aichat.net/chat/202206/bc433154-3802-4727-823e-f6ac805184ca.png)
还会弹出一个选项,应该是DLL分析的,选YES
随后等一段时间,编译就完成了,可以到`out/main.dist`下找到EXE文件

## 单文件打包与压缩

`nuitka`支持使用`zstd`算法进行压缩,可以通过`pip`安装

```bash
pip install zstandard
```

随后更改命令行:

```bash
nuitka --mingw64 --standalone --show-progress --show-memory --output-dir=out --onefile main.py
```

:::info
可以加入`--lto=yes`来启用LTO优化
:::
随后在执行时会输出:

```text
Nuitka-Scons:INFO: Onefile C compiler: gcc (gcc).
Nuitka-Scons:INFO: Onefile linking program (no progress information available).
Nuitka-Onefile:INFO: Using compression for onefile payload.
Nuitka-Onefile:INFO: Onefile payload compression ratio (30.72%) size 24183275 to 7429408.
```

这代表单文件打包和文件压缩已经完成,文件会输出在`out`目录下
