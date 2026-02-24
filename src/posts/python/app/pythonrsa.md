---
categories:
  - python
  - 应用篇
date: 2022-04-15 15:13:54
tags:
  - python
  - 非对称加密
title: python实现RSA加密文件
---

# RSA加密的python实现

## RSA库安装

在python中,有一个库已经了RSA加解密的功能,就是rsa库!!库如其名!!
使用pip安装rsa库:

```bash
pip install rsa
```

## RSA库使用

### 生成密钥

```python
import rsa

(pubKey,privKey) = rsa.newkeys(2048)
```

使用`rsa.newkeys`生成密钥对,括号内的参数为RSA位数
:::info
不建议使用RSA1024及位以下的密钥,因为RSA1024及以下已被破解(或较易被破解)
:::
可以加入参数`poolsize=int`来使用多线程计算,!!概率出现程序循环的问题!!
:::warning
3072位以上的RSA秘钥生成可能需要1分钟或更长,请确保你有足够的耐心
:::

### 保存与加载秘钥

```python
import rsa

(pubKey,privKey) = rsa.newkeys(2048)
with open("pubkey.pem", "wb") as f:
	f.write(pubKey.save_pkcs1())

with open("privkey.pem", "wb") as f:
    f.write(privKey.save_pkcs1())
```

:::info
使用`wb`、`rb`等方法读取出来的都是bytes格式,无需二次转换
:::
将pub/privkey对象转换为bytes的方法为`key.save_pkcs1`

```python
import rsa

with open("pubkey.pem", "rb") as f:
    pubKey = rsa.PublicKey.load_pkcs1(f.read())

with open("privkey", "rb") as f:
    privKey = rsa.PrivateKey.load_pkcs1(f.read())
```

使用`rsa.PublicKey(或PrivateKey).load_pkcs1`方法可以加载字节内的秘钥

### 加密和解密

```python
import rsa

(pubKey,privKey) = rsa.newkeys(2048)
text = b"hello world"
print(rsa.encrypt(text, pubKey))
```

会输出一串bytes,这个就是加密后的结果
:::info
公钥加密,私钥解密
:::
:::info
RSA库加密必须使用bytes格式,str可以用`str.encode("utf-8")`转换为bytes
:::

```python
import rsa

(pubKey,privKey) = rsa.newkeys(2048)
text = b"加密后的内容"
print(rsa.decrypt(text, privKey))
```

:::info
python中RSA库的加密是有长度上限的,一般为: RSA位数/8/3(或者2)个中文字符
RSA 4.0后已经删除了bigfile模块,后续可能会出一篇解决方案
:::

# RSA与其他算法

## RSA加密流程

首先,加密双方必须生成一对秘钥对(长度最好一致)
然后互相交换publickey文件:
![加密的理想状态](https://static.aichat.net/chat/202204/00d8d190-b3f2-4db9-a247-6e0042f7c7cb.png)
但假如现在出现了一个中间人,他会保存所有监听到的东西:
![出现中间人](https://static.aichat.net/chat/202204/279c87a2-42b0-480a-ac8a-b1e962cc8a5c.png)
然后双方使用对方的秘钥进行加密,将密文发送给对方,对方使用自己的私钥解密:
![发送数据](https://static.aichat.net/chat/202204/e20b7278-c6ba-4511-9f0e-47a7bfadad8a.png)
此时,双方可以顺利的解密对方发来的数据并进行解密,但中间人呢? \
中间人手里只有密文和公钥,并无法进行解密,且不可能暴力破解 \
这样就实现了信息的安全传输,且私钥并没有外泄

## AES算法

首先,AES算法是对称加密算法,这意味着它加解密使用同一个秘钥
现在有用户A、B,他们会通过网络交换密文:
![image.png](https://static.aichat.net/chat/202204/fecad802-5c72-4393-8021-7db40f599b8c.png)
然后熟悉的中间人又出现了,他还是会监听并保存所有内容:
![image.png](https://static.aichat.net/chat/202204/2b075559-0aef-4fd4-9cfb-582c04a417db.png)
交换秘钥和密文:
![image.png](https://static.aichat.net/chat/202204/a46a7723-0a04-414f-a75f-6d517bbd3043.png)
这时中间人已经可以解密双方的密文了,所以AES并不适合在不安全网络下传播
:::info
算法各有优点,见总结部分
:::

## 总结

AES(对称加密)算法更适用于在安全环境下加密大量数据 \
RSA(非对称加密)算法适用于在不安全环境下加密少量数据
:::info
RSA加密大量数据太慢了,大量数据可以试试ECC(假如真的不想用AES)
:::

:::info
RSA加密原理、大文件下一篇再说
:::
