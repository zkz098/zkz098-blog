---
date: 2025-06-20 22:07:05
tags:
  - 人工智能
title: 在消费级设备上生成 AI 视频 —— FramePack 踩坑记录
---

# 引言

本文主要是研究如何在相对小显存（作者是12GB显存环境）环境下比较快速地生成 AI 视频

由于架构相关问题，本篇文章中采取的优化措施理论上在不早于 Ampere 架构（30系）的 N 卡上都可用，20系或更早的卡可能不适用或需要采取一些措施才能正常运行

# 安装 ComfyUI 和 FramePack

## 安装 ComfyUI

这一部分网上已经有很多教程了，此处不作赘述。建议直接安装 ComfyUI Desktop，后续操作均基于此环境。

因为工作流中部分节点需要通过 Git 方式安装，你需要先安装 [Git](https://git-scm.com/downloads) （但一般而言安装 ComfyUI Desktop 时会要求你安装 Git），并且调整 ComfyUI 的安全等级到“Weak”，否则无法安装，会报错“This action is not allowed with this security level configuration”。

调整安全等级的步骤如下：

1. 打开`<你的ComfyUI安装位置>/user/default/ComfyUI-Manager/config.ini`
2. 找到其中`security_level = normal`
3. 改成`security_level = weak`
4. 退出ComfyUI后重启

此时再使用 ComfyUI-Manager 的 Git 安装就不会有问题了，安装完成后注意将安全等级改回以减少安全风险

## 安装 FramePack 工作流

### 安装自定义节点

在 ComfyUI 的右上角，你可以看到一个拼图图标的“Manager”，点开后，打开“Custom Nodes Manager”，搜索下列插件：

- ComfyUI-KJNodes
- ComfyUI-VideoHelperSuite
- ComfyUI_essentials

然后回到 Manager 界面，点击“Install via Git URL”，输入链接安装下列插件：

- https://github.com/kijai/ComfyUI-FramePackWrapper

安装中出现网络问题自行解决，安装过程中可能需要连接 Github Raw 或 Objects

### 安装工作流

本文出于综合考虑，使用了 Kijai 提供的，由 comfyui-wiki 修改的工作流版本，在此感谢作者的无私奉献

[下载地址](https://kaitaku.lanzoum.com/iscPy30os0sj)，密码 dkib

直接将文件解压后的 json 文件拖入 comfyUI 中即可加载工作流

务必使用 ComfyUI 最新版本，老版本可能存在问题

### 模型安装

不建议使用自带的模型补全，建议在[hf-mirror](https://hf-mirror.com/)上搜索对应模型并使用多线程下载器手动下载，随后在手动放入comfyUI的models中

models下所属的子文件夹为模型名称第一个`/`前的内容，如`diffusion_models/FramePackI2V_HY_fp8_e4m3fn.safetensors`则将对应文件放置在diffusion_models子目录下

运行前确认节点对应的模型是存在的

## 优化及运行

### CLIP 运行设备修改

此部分主要解决“CUDA out of memory”的问题，一般解决方法：
将Dual CLIP加载器（双CLIP加载器）的device（设备）修改为 CPU
会降低推理速度，但可以防止初期加载直接爆显存

### 使用 SageAttn 代替 SDPA

#### 安装 triton 和 SageAttn

据作者实测，sageattn 可以把推理时间减少约 30%，所以还是建议安装一下，毕竟后续推理动辄几个小时，前期安装的几分钟换后面的一个小时还是很值的的

ComfyUI 右上角打开终端，然后默认路径下：

```shell
uv init
uv add sageattention==1.0.6
```

随后把Load FramePackModel中的 attention_mode 改为 sageattn，然后运行
你就会发现：跑不起来。comfyUI 会提示`x = sageattn(q, k, v, tensor_layout='NHD') TypeError: 'NoneType' object is not callable`，但是我们已经安装了 sageattn，为什么是NoneType呢
这时在终端中启动 python 交互式解释器，你会发现 sageattn 根本就导入不进来，**会报缺失包，这时你需要把缺失的包都安装上**
一般是`ml_collections`等几个依赖，然后你装到了一个叫`triton`的依赖，你发现windows下pypi里没有这个包

在这里我要批评某些博客里的内容，高度不负责任，居然直接让手动编译 triton，但凡他真操作过就知道新版本 triton 根本就没有 win32 的 target，都到不了编译那步就报错了

~~至于我为什么知道就不要管了~~

正确的操作方法是安装`triton-windows`:

```shell
uv add triton-windows
```

请注意参照[triton-windows的README](https://github.com/woct0rdho/triton-windows)来确定自己应该使用哪个版本的，作者使用的是50系显卡，所以默认安装最新版了

随后你再去运行 comfyUI 的工作流，就会发现一切正常了

#### 使用 sageattn2

理论上 sageattn2 比 1 更快一点，但我直接用的 2 所以没测试差距

sageattn 2 需要手动编译，确保你安装了Visual Studio和“C++桌面开发”工作负载，并且安装了完整的CUDA驱动：

```shell
git clone https://github.com/thu-ml/SageAttention.git
cd SageAttention
python setup.py install
```

#### 预防 VAE 解码失败

如果你的显卡是显存极小的显卡（例如4GB或者6GB），那么你需要降低 VAE 分块大小，否则最后大概率会得到黑图

在VAE解码（分块）节点中将VAE解码大小修改为 128 即可预防此问题

#### 部分参数说明

转到 FramePackSampler 的节点，我们来看一些参数：

- `total_second_length`：视频的秒数
- `gpu_memory_preservation`：预留 GPU 显存，消费级显卡都不太用管，设置为1-2即可，因为你无论怎么保留GPU都不可能完全装下模型
- `steps`：步数，和SD的步数很像，适当加减

其他的一般没啥影响也很难调整，这里不作说明

# 参考资料

1. [SageAttention](https://github.com/thu-ml/SageAttention)
2. [triton-windows](https://github.com/woct0rdho/triton-windows)
3. [ComfyUI Frame Pack 工作流完整逐步教程](https://comfyui-wiki.com/zh/tutorial/advanced/video/frame-pack)
4. [如何在Linux上安装ComfyUI](https://comfyui-wiki.com/zh/install/install-comfyui/install-comfyui-on-linux)
