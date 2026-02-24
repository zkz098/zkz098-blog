---
categories:
  - 杂项
date: 2024-08-10 22:45:29
tags:
  - 路由器
  - openwrt
title: 小米AX3000T openwrt刷机——从入坑到刷回原厂
---

# 小米AX3000T openwrt刷机——从入坑到刷回原厂

## 前言

作者于前端时间购入一台 AX3000T 作为 Mesh 网络节点，后续发现由于没有弱信号剔除导致设备连到AX3000T之后就回不到主节点了 \
所以想刷入 openwrt 来解决这个问题（最后也没解决）

本文需要硬件设施：

- AX3000T 路由器
- 一个有以太网口的电脑
- 一根网线
- 一个卡针(或者牙签)

软件设施放在下面的蓝奏盘里了，有需要可以自行取用：
[蓝奏盘链接 提取码c8a1](https://kaitaku.lanzouv.com/b002u7i8vi)

## 启用 SSH

### 降级固件(非必需)

如果你的 AX3000T 手动升级了固件到1.0.47以上(不含)，此时需要降级到1.0.47这个脆弱的版本来启用 SSH \
openwrt 文档中说可以手动上传固件后改URL，但作者测试无法降级，会提示找不到固件或不完整，因此只能使用小米官方的救砖工具降级

1.0.47 固件链接：[小米官方CDN](https://cdn.cnbj1.fds.api.mi-img.com/xiaoqiang/rom/rd03/miwifi_rd03_firmware_ef0ee_1.0.47.bin)
工具见上方网盘

打开工具后用网线连接路由器和电脑(理论上路由器任意一个网口即可)，然后启动工具，选择下载的ROM，点击下一步
:::info
工具此时会让你选择网卡，如果你安装了 VMWare / Hyper-V 可能存在很多个虚拟网卡，注意选择物理网卡(一般名称为以太网)
:::
点击下一步，此时给路由器断电，用卡针按住RESET键，按住后插电，继续按住，等到路由器橙灯快速闪烁为止，此时工具会自动刷入 ROM，等待路由器变为蓝灯快速闪烁10秒后断电重启

### 启用 SSH

:::info
注意：下面的代码需要用cmd而不是powershell运行，运行时出现curl参数错误则代表你使用的是powershell \
本文不处理没有curl的情况，请自行必应解决
:::

登录到小米路由器后台，此时的URL应该类似于这样：

```text
http://192.168.31.1/cgi-bin/luci/;stok=123456789qwertyuiop/web/home#router
```

将stok后面的部分(`123456789qwertyuiop`这一块)复制下来，后续使用`<stok>`代替这段文本
在cmd内执行如下命令：

```shell
curl -X POST http://192.168.31.1/cgi-bin/luci/;stok=<stok>/api/misystem/arn_switch -d "open=1&model=1&level=%0Anvram%20set%20ssh_en%3D1%0A"
curl -X POST http://192.168.31.1/cgi-bin/luci/;stok=<stok>/api/misystem/arn_switch -d "open=1&model=1&level=%0Anvram%20commit%0A"
curl -X POST http://192.168.31.1/cgi-bin/luci/;stok=<stok>/api/misystem/arn_switch -d "open=1&model=1&level=%0Ased%20-i%20's%2Fchannel%3D.*%2Fchannel%3D%22debug%22%2Fg'%20%2Fetc%2Finit.d%2Fdropbear%0A"
curl -X POST http://192.168.31.1/cgi-bin/luci/;stok=<stok>/api/misystem/arn_switch -d "open=1&model=1&level=%0A%2Fetc%2Finit.d%2Fdropbear%20start%0A"
```

每行执行完后都会输出`{code：0}`，四条均输出此内容则SSH开启成功，此时可以使用SSH终端登入，为便于后续文件操作，此处使用MobaXterm(可从前文网盘下载)进行登入

### 获取 SSH 密码

登入小米路由器主页后，右下角会有一个`SN`，将下方黑体字内容全部复制后输入[miwifi.dev](https://miwifi.dev/ssh) 右侧的SN中，点击calc，随后点击copy复制密码并保存

### 登入 SSH

因终端而异，提示两点：

1. 登入用户名为root
2. 出现一个提示框时选带ACCEPT的

## 刷入 U-Boot

第一步是刷入UBoot，便于刷入真正的openwrt和防止刷错固件之后被迫售后，同时备份原厂固件便于恢复

### 备份原厂固件

登入 SSH 后，输入`cat /proc/mtd`确定需要备份的内容，如果为mtd0-mtd12可直接使用下文命令，否则请自行参照下文修改：
:::warning
通常来说，因为路由器的ROM通常较小，而备份过程相当于把固件体积x2，因此ROM大概率会爆掉，如果你在备份过程中 SSH 异常中止参照上文重新获取 stok 后激活 SSH 即可 \
当然，为了防止上文情况出现和造成严重后果，备份文件通常放在/tmp中并且备份完成一个就要下载下来后删除，防止ROM空间不足或者不足重启后无法自动修复 \
如果你懒得看上面那段文字：下文的每行执行完之后就把对应的bin下载下来后删掉，不要用终端的多行命令偷懒
:::

```shell
dd if=/dev/mtd1 of=/tmp/BL2.bin
dd if=/dev/mtd2 of=/tmp/Nvram.bin
dd if=/dev/mtd3 of=/tmp/Bdate.bin
dd if=/dev/mtd4 of=/tmp/Factory.bin
dd if=/dev/mtd5 of=/tmp/FIP.bin
dd if=/dev/mtd6 of=/tmp/crash.bin
dd if=/dev/mtd7 of=/tmp/crash_log.bin
dd if=/dev/mtd8 of=/tmp/ubi.bin
dd if=/dev/mtd9 of=/tmp/ubi1.bin
dd if=/dev/mtd10 of=/tmp/overlay.bin
dd if=/dev/mtd11 of=/tmp/date.bin
dd if=/dev/mtd12 of=/tmp/KF.bin
```

每条命令执行完成后会输出带有`in`和`out`字样的提示，备份可能会需要一些时间，此过程中不要断开SSH和电源

### 刷入 UBoot

:::danger
此部分正式进入刷机，在进行下面的任何步骤之前确定你的备份保存完好，他人提供的备份有相当高概率使路由器变砖，务必保存好自己的备份
:::
本文直接使用网盘内的SSH终端说明，其他客户端请自行探索 \
点开左侧绿色文件夹，进入tmp，将UBoot固件拖入其中，等待上传完成
:::info
网上的一些资源仅提供了收费的UBoot，本文不提供这些UBoot的链接。作者自行编译了一份[开源的UBoot](https://www.right.com.cn/forum/thread-8312142-1-1.html) 放在了前文网盘中，可以直接下载使用。有Ubuntu 系统或 WSL 环境的可以自行编译。
:::
`ls`确定存在后，执行下列命令刷入：

```shell
mtd write mt7981_ax3000t-fip-fixed-parts-multi-layout.bin FIP
```

等待刷入完成后，此时UBoot刷入完成

## 刷入 openwrt

### 刷入固件

:::info
理论上很难刷出问题，作者前后刷入了6次各种固件并失败2次仍然能正常进入UBoot并刷回原厂。 \
当然，上文前提是不故意作，例如刷入SoC不正确的固件和刷入不支持AX3000T的固件，如果真成砖了可参考后文的刷回原厂，刷写3次仍然未修复建议返厂维修
:::
网盘中有QWRT和immortalwrt两种固件，作者已测试可刷入，但注意：

- 网盘中的QWRT不能使用WPA3加密

此时使用网线连接到UBoot(如果你把网线拔了)
然后先断路由器电，用卡针按住RESET约3秒后插电，继续按住，等到路由器灯由橙色变蓝色后松开
此时手动配置电脑网卡为手动分配IP模式：

- ip: `192.168.1.2`
- 子网掩码: `255.255.255.0`
- 网关: `192.168.1.1`
- 首选DNS: 填一个能用的国内DNS，例如`114.114.114.114`，不建议开启加密

点击确定后，浏览器访问`192.168.1.1`，应该进入UBoot界面
:::info
双网卡或无线+有线请断开可访问互联网的那个网络，这个网址会和部分家庭网关冲突，可能导致无法访问
:::

选择固件后mtd layout根据固件选择，QWRT选QWRT，immortalwrt选immortalwrt-w112
点击upload后耐心等待，路由器会变为橙灯，随后橙灯快速闪烁，再变为蓝色灯
此时网卡可调整为DHCP(自动)了

### 如果橙灯慢速闪烁

如果观察到路由器的橙灯慢速闪烁(约5秒一次)，此时请等待半分钟，如果仍然保持此状态，可以按照前文重新进入UBoot了。
这个闪烁意味着固件刷入失败，UBoot 会提示 UPDATE FAILED，建议更换固件并选择正确的mtd layout后重试

### 进入 openwrt 后台

不同固件不同，大部分是`192.168.1.1`，自定义固件会有`10.0.0.1`或`192.168.8.1`等，建议查看固件说明
如果和家庭网关冲突，请断开家庭网络，使用网线连接到openwrt后修改LAN IP来解决此问题

## 刷回原厂

网上的一些教程是先UBoot刷入ubi.bin(之前备份的原厂固件)后再解锁SSH恢复UBoot，但作者实验发现UBoot刷入ubi.bin大概率会刷入失败，因而采用先恢复UBoot后使用小米救砖工具刷入固件的方法

### 恢复原厂 UBoot

:::info
接下来的操作中涉及上传文件的，上传后务必使用`ls`确认文件存在再刷入
:::
找到前文的备份文件中的`FIP.bin`，使用SSH工具上传到/tmp目录下，随后：

```shell
mtd write FIP.bin FIP
```

### 恢复原厂固件

等待命令完成(15-30秒左右)后断电重启，此时按照前文的降级方法刷入原厂1.0.47固件(可能需要多次刷入) \
如果刷入成功，橙灯会常亮一会，然后橙灯闪烁，此时可以按照正常新路由器的方法，连接到无密码默认SSID中进入开始使用了 \
此时可以正常升级和使用路由器了
