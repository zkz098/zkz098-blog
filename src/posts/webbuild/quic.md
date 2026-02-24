---
categories:
  - 网站建设
date: 2022-02-03 13:15:13
keywords: http/3,quic,caddy,caddy2
tags:
  - quic
title: 使用caddy2支持QUIC协议
---

:::danger
本文当做caddy2安装教程就行,更换服务器后已更新为nginx-quic
:::

# QUIC与HTTP3

## 什么是QUIC

QUIC 是 Quick UDP Internet Connections 的缩写,目前分为iQUIC和gQUIC两种
QUIC类似于在内核层实现的TCP + TLS + HTTP/2。但QUIC基于UDP,因此绕开了对TCP进行改造的大量成本
QUIC相较于TLS+HTTP2有几点优势：

- 首次握手1-RTT
- 改善了TCP的拥塞
- 前向纠错，减少重传
- 连接平滑迁移，网络状态的变更不会影响连接断线

QUIC与HTTP/2+TLS的示意图：
![100_1.png](https://static.aichat.net/chat/202203/794af7dd-2a5f-45ef-ab23-93f65b045d82.png)

## 为什么部署QUIC

本网站已经部署了HTTP/2+TLS1.3v,理论上可以实现0-RTT握手
但由于QUIC对**弱网环境**的优化所以部署了QUIC!!4次丢1次的离谱传输!!
还有一个次要原因就是速度快和我个人比较喜欢新的协议!!闲的!!

理由写的有!!亿!!点多,进入正题

## QUIC部署

:::info
本站为纯静态网站且近期才开始部署,所以使用方案较为激进
:::
本站直接使用`caddy`进行web服务,并没有使用nginx+caddy的方案

### 安装caddy

:::info
caddy仅支持iQUIC的最新草案,支持gQUIC请使用 [litespeed](https://www.litespeedtech.com/)
:::
本文针对于ubuntu系统,其他系统见[caddy官网](https://caddyserver.com/docs/install)

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo tee /etc/apt/trusted.gpg.d/caddy-stable.asc
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

执行上述命令即可安装caddy

### 配置文件

```bash
sudo vim /etc/caddy/Caddyfile
```

创建一个`caddyfile`然后写入以下内容：

```text
{
    servers {
        protocol {
            experimental_http3
        }
    }
}
```

然后在这段的**下面**写入：

```text
你的域名:443 {
    root * /你的网站根目录
    encode zstd gzip # 开启gzip功能
    tls mail@mail.com # 你的邮件,用于申请ssl证书
    file_server
}
```

域名后的`:443`不带空格,空格是代码自动处理的错误
如果你自带证书,可以将tls后写成这样：

```text
tls key pem # 先是key文件,然后pem证书
```

再在域名这个块内插入以下内容：
:::info
可以不插入试一下,如果可以就无须插入
:::

```text
header {
    alt-svc h3=":443", ma=2592000
}
```

然后执行以下命令：

```bash
sudo caddy run -config=/etc/caddy/Caddyfile # 你的配置文件路径
```

如果没有错误,就成功了

### 验证QUIC

**2022/2/6更新**
今天打开网页,发现HTTP/2 and SPDY indicator插件变成了绿色：
打开开发者工具查看：
发现几乎全部为`http/3`协议,安全页也由`TLS1.3`变成了`QUIC`
后来发现是最开始没有打开UDP443端口导致QUIC握手一直失败,触发了浏览器的冷却期
直到今天才结束,使用了QUIC握手
ubuntu放行`443/udp`端口：

```bash
sudo ufw allow 443/udp
```
