---
categories:
  - 网站建设
date: 2023-01-20 21:27:18
keywords: nginx,ModSecurity,ModSecurity 3,ubuntu 22
tags:
  - nginx
title: 使用ModSecurity保护Nginx站点
---

# 使用ModSecurity保护Nginx站点

[ModSecurity](https://github.com/SpiderLabs/ModSecurity) 是一个开源的跨平台WAF(WEB应用程序防火墙) \
本次给Nginx安装 ModSecurity WAF 并使用 OWASP ModSecurity 规则集,基于Ubuntu 22(jammy)和宝塔面板 \
命令的默认执行位置都为`~(root目录)`，且均使用root用户执行 \
在执行下列步骤前,请编译安装`nginx 1.23`或更高版本

## 准备工作

执行下列指令安装前置包:

```bash
apt install g++ flex bison curl apache2-dev doxygen libyajl-dev ssdeep liblua5.2-dev libgeoip-dev libtool dh-autoreconf libcurl4-gnutls-dev libxml2 libpcre++-dev libxml2-dev git liblmdb-dev libpkgconf3 lmdb-doc pkgconf zlib1g-dev libssl-dev libfuzzy-dev -y
```

## 编译ssdeep

:::info
此步是因为博主在编译ModSecurity时无法识别apt安装的ssdeep，可以先跳过此步，后续配置时出现问题再执行
:::
执行下列指令即可:

```bash
wget https://github.com/ssdeep-project/ssdeep/releases/download/release-2.14.1/ssdeep-2.14.1.tar.gz
tar zxf ssdeep-2.14.1.tar.gz
cd ssdeep-2.14.1
./configure
make
make install
```

## 编译ModSecurity

```bash
wget https://github.com/SpiderLabs/ModSecurity/releases/download/v3.0.8/modsecurity-v3.0.8.tar.gz
tar xzf modsecurity-v3.0.8.tar.gz
cd modsecurity-v3.0.8
./build.sh
```

出现`fatal: not a git repository (or any of the parent directories): .git`这条信息是可以忽略的

随后:

```shell
./configure
```

等到命令执行完成后，请确保`---`后面的内容冒号后均为`enable`、`disable`和`found` \
如果出现`ssdeep: not found`请参考前面的步骤执行编译安装ssdeep
其他`not found`请使用apt安装对应包(一般不会出现)

然后:

```shell
make
make install
```

即可

## 安装 Nginx ModSecurity 支持模块

```shell
cd /www/server
git clone https://github.com/SpiderLabs/ModSecurity-nginx.git
```

编辑`/www/server/panel/install/nginx.sh`文件,在`./configure`这一行的末端添加:

```bash
--add-module=/www/server/ModSecurity-nginx
```

随后:

```bash
sh /www/server/panel/install/nginx.sh install 1.23
```

## 使用OWASP规则集

### 下载并配置规则集

```bash
mkdir /www/server/nginx/conf/modsecurity
cd ModSecurity
cp modsecurity.conf-recommended /www/server/nginx/conf/modsecurity/modsecurity.conf
cp unicode.mapping /www/server/nginx/conf/modsecurity
```

下载规则:

```bash
wget http://www.modsecurity.cn/download/corerule/owasp-modsecurity-crs-3.3-dev.zip
unzip owasp-modsecurity-crs-3.3-dev.zip
cd owasp-modsecurity-crs-3.3-dev
cp crs-setup.conf.example /www/server/nginx/conf/modsecurity/crs-setup.conf
cp -r rules/ /www/server/nginx/conf/modsecurity
cd /www/server/nginx/conf/modsecurity/rules/

cp REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf.example REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf.example.back
cp RESPONSE-999-EXCLUSION-RULES-AFTER-CRS.conf.example RESPONSE-999-EXCLUSION-RULES-AFTER-CRS.conf.example.back
cp RESPONSE-999-EXCLUSION-RULES-AFTER-CRS.conf.example.back RESPONSE-999-EXCLUSION-RULES-AFTER-CRS.conf
cp REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf.example.back REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf
```

### 修改配置

修改nginx配置，在`http`层添加如下配置:

```nginx
modsecurity on;
modsecurity_rules_file /www/server/nginx/conf/modsecurity/modsecurity.conf;
```

编辑`modsecurity.conf`,将`SecRuleEngine DetectionOnly`修改为`SecRuleEngine On`，并在后面添加如下内容:

```text
Include /www/server/nginx/conf/modsecurity/crs-setup.conf
Include /www/server/nginx/conf/modsecurity/rules/*.conf
```

## 验证安装

打开如下地址:

```text
<url>/?param=*><script>alert(1)</script>
```

请将`<url>`替换为你的测试地址(不需要带括号)
如果出现`403`则安装成功

## 参考文章

- [Install ModSecurity 3 with Nginx on Ubuntu 22.04](https://kifarunix.com/install-modsecurity-3-with-nginx-on-ubuntu/)
- [WAF简介及ModSecurity-nginx搭建](https://blog.csdn.net/qq_38626043/article/details/105027404)
