---
categories:
  - 杂项
date: 2022-04-09 18:18:49
tags:
  - windbg
  - windows
title: 记一次用windbg分析蓝屏原因
---

# 前言

这次帮一个朋友解决蓝屏,但无法进行现场检测!!懒得出去!!,远程也看不到蓝屏代码
只能使用windbg来分析内存文件检测蓝屏原因

# windbg使用

## 下载和安装

本文使用windowsSDK进行安装,安装地址[点我](https://developer.microsoft.com/zh-cn/windows/downloads/windows-sdk/)
进入后选择下载应用程序:
![微软官网界面](https://static.aichat.net/chat/202204/9c3d11ff-6a92-4904-adbb-321b64c3b475.png)
选择下载路径:
![SDK位置](https://static.aichat.net/chat/202204/47b26ffb-9d54-4298-9a6f-860eb9d3ea60.png)
勾选第二项即可:
![选择安装部分](https://static.aichat.net/chat/202204/b05d765c-ca9d-4e69-a168-c5b12f4aa2a2.png)
安装完成后到下载路径(下载路径/Installers/X64 Debuggers And Tools-x64_en-us.msi)双击安装即可

## 配置符号表

在开始菜单内找到windbg,打开后界面点击file->Symbol File Path
在弹出来的对话框内填入如下内容:

```text
srv*c:\symbols*https://msdl.microsoft.com/download/symbols
```

选择OK

## 开始分析崩溃文件

首先,你需要从目标电脑的%SystemRoot%(一般为C:/windows)下找到MEMORY.DMP文件
将其放到合适位置后,点击File -> Open Crash Dump 选择崩溃文件
弹出来的界面应该如下(这个崩溃文件是win7 SP1的文件)
![image.png](https://static.aichat.net/chat/202204/504b5ca4-35ee-485a-b7a6-5154aecabf02.png)
然后输入`!analyze -v`对文件进行深入分析
然后看输出的内容:

```text
*******************************************************************************
*                                                                             *
*                        Bugcheck Analysis                                    *
*                                                                             *
*******************************************************************************

PAGE_FAULT_IN_NONPAGED_AREA (50)
Invalid system memory was referenced.  This cannot be protected by try-except.
Typically the address is just plain bad or it is pointing at freed memory.
Arguments:
Arg1: fffff8817cdadbc0, memory referenced.
Arg2: 0000000000000000, value 0 = read operation, 1 = write operation.
Arg3: fffff880088da185, If non-zero, the instruction address which referenced the bad memory
	address.
Arg4: 0000000000000005, (reserved)

```

输出的第一行为崩溃原因,一般和win10的蓝屏代码是一致的
:::info
括号内的为win7版本,本案例就是`0x0000050`
:::
:::warning
这个代码的本意为崩溃原因和代码,并不只针对于windows
:::
然后就可以去搜索此错误代码了,一般有对应的解决方案
:::info
本案例到最后也没查到根本原因:rofl:
:::

但是,在下面还有一!!亿!!些内容,在里面有两条比较重要的

```text
Unable to load image \SystemRoot\system32\DRIVERS\igdpmd64.sys, Win32 error 0n2
Unable to load image \SystemRoot\system32\DRIVERS\atikmpag.sys, Win32 error 0n2
```

这两条代表`igdpmd64.sys`和`atikmpag.sys`驱动是概率存在问题的
后来收到了对方发来的蓝屏图片,里面的关键内容如下:

```text
STOP: 0x00000050
igdpmd64.sys - Address FFFFF88007AE0185 base at XXXX...
```

证实了是`igdpmd64.sys`导致的蓝屏,并且代码为50
后查询得知这个是AMD显卡的驱动文件,结合蓝屏的使用经历(屏幕共享功能导致),基本可以得出是显卡驱动导致蓝屏
:::info
电脑上的显卡是ATI radeon HD 7450M,确实有亿点老
:::
