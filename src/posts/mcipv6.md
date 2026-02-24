---
categories:
  - MC
date: 2022-01-13 20:39:43
tags:
  - MC
title: MC-IPV6联机
---

# 开始前的准备

## 游戏本体

首先,双方需要使用一样的游戏版本和ModLoader
推荐直接将游戏打包后发给对方
:::info
玩原版也需要安装Forge/Fabric(后续步骤需要使用)
:::
如果需要安装模组,需要查看模组安装需求(建议在[MCMOD百科](https://www.mcmod.cn/)查看)
分为以下几种情况：

1. 客户端需装,服务端需装
2. 客户端选装,服务端需装
3. 客户端需装,服务端选装
4. 客户端需装,服务端无效
5. 客户端无效,服务端需装

1.2.3情况建议双方都安装此模组
:::info 2.情况主机端必装,其他人不装可能有影响3.情况所有人最好都装
:::
4.5情况无效端不需要装

:::primary
那么,什么是服务端和客户端? \
假设S为存档拥有者,C为加入的玩家 \
即S为服务端+客户端,C为客户端
:::

## 游戏模组

版本截至2022-8-2 \
安装对应版本的模组(服务端,客户端均需)：

- 1.15.2-1.19.1(forge/fabric/Quilt)
- [MCMOD百科](https://www.mcmod.cn/class/4498.html)
- [modrinth](https://modrinth.com/mod/mcwifipnp)
- 1.12.2-1.19(forge)/1.14.4-1.19(fabric)
- [MCMOD百科](https://www.mcmod.cn/class/2754.html)
- [CurseForge](https://www.curseforge.com/minecraft/mc-mods/lan-server-properties)
- 1.7.2-1.12.2(forge)
- [MCMOD百科](https://www.mcmod.cn/class/1158.html)
- [CurseForge](https://minecraft.curseforge.com/projects/server-properties-for-lan),

如果你是离线登录,需要将`OnlineMode`更改为`false`,具体配置文件更改请参阅MCMOD百科
建议安装第一个模组,有GUI页面

## IPV6

访问 [ipv6test](http://testipv6.cn/) 来检测双方的IPV6
如果一切正常,你看到的页面应该类似于这样：
![b.png](https://s2.loli.net/2022/01/13/BTxRUH26vQDN7yC.png)
底部应该是10/10,作者的DNSv6不太正常
然后检查IPV6的IP,以下有几个IP开头的意义：

- fe80开头的无法用于上网,作用就是有个IP
- 2001开头为teredo,不建议用于联机
- 240e、2409、2408为国内三大运营商的IPV6,非常正常
- 其他开头请见下一步

如果属于fe80或2001开头建议使用`内网穿透`而非IPV6
!!内网穿透短期不考虑出教程!!

确定IP后使用`ping`指令ping一下对方,格式：

```text
ping 对方IP
```

如果有链接超时或多数大于250ms就不建议使用此方法了
如果可以链接成功,就可以进入下一步了

# 加入世界

这一步非常的简单：
服务端:单人游戏,进入存档后点击对局域网开放,记录下端口号
客户端:启动游戏后,点击多人游戏,直接连接,使用以下格式连接：

```text
[ipv6地址]:端口号
```

然后应该就可以快乐的联机了,出现错误请评论或自行百度解决
