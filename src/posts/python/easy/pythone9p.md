---
categories:
  - python
  - 基础篇
date: 2022-01-29 19:49:46
tags:
  - python
title: python-第三方库
---

# 安装第三方库

## 安装

首先在PowerShell执行以下命令：

```bash
pip -V
```

如果返回值类似这样：

```text
pip 21.2.4 from C:\Users\你的用户名\AppData\Local\Programs\Python\Python310\lib\site-packages\pip (python 3.10)
```

那证明python安装无误,如果出现`无法将“pip”项识别为 cmdlet、函数、脚本文件或可运行程序的名称。请检查名称的拼写，如果包括路径，请确保路径正确
，然后再试一次。` \
请重新安装python或将pip添加到path中 \
:::info
安装python时务必勾选ADD PYTHON3.10 TO PATH \
添加环境变量可自行百度
:::
可以安装一个numpy试一下：

```bash
pip install numpy
```

出现`Collecting numpy`则代表安装已经开始
然后就会发现：这玩意的下载速度慢的离谱!!堪比百毒网盘!!
如何加速它是下一节的内容,先看一下安装完成后!!可能需要10分钟左右!!
:::info
出现Successfully installed ...就是安装完成
:::
如果出现：

```text
WARNING: You are using pip version 21.2.4; however, version 21.3.1 is available.
You should consider upgrading via the 'C:\Users\zkz20\AppData\Local\Programs\Python\Python310\python.exe -m pip install --upgrade pip' command.
```

则代表你的pip版本较低,可以使用提示中的代码升级,但在win10部分版本只要命令中有`python`就会跳转到Microsoft Store
所以可以试一下另一种办法：

```bash
pip install --user -U pip
# 以下为说明
# --user 代表使用用户级权限(一般为标准管理员)
# -U 代表下载最新的版本(不然会不更新)
```

:::warning
如果你的系统输入python后不会跳转,请使用`python -m pip install --upgrade pip`
这种使用pip直接安装pip的方法仅为应急之举
:::

## 加速

刚刚就发现了pip下载很慢,这是因为它会从国外的Pypi进行索引
然后从github进行下载,在国内会导致无法下载或速度近乎为零
但阿里提供了pypi和"轮子"的镜像源,可以使用它进行加速 \
首先在资源管理器内进入`C:\用户(users)\你的用户名\pip`
如果没有pip文件夹就新建一个,然后在文件夹内新建`pip.ini`(新建文本文档然后更改后缀名即可)
然后写入以下内容：

```ini
[global]
index-url = https://pypi.tuna.tsinghua.edu.cn/simple
[install]
trusted-host=mirrors.aliyun.com
```

随后保存,重启电脑,再进行安装,速度就上来了

# 创建自己的python包

## 创建一个python包

使用pycharm可以快速创建一个python包:
![image.png](https://static.aichat.net/chat/202206/73d859fe-d29f-4039-8f05-5544d086fb9d.png)
:::info
测试包名为test,文件为demo.py,内容如下:

```python
def hello():
    print("hello")
```

:::
如果没有pycharm也可以手动创建文件夹,然后创建一个`__init__.py`
这个文件中通常不包含代码,仅包含以下两部分内容:

```python
"""
此包的描述(可选)
"""
import xxx # 需要带上对应模块名调用,例如 test.demo.hello()
# 或者
from xxx import * # 不需要带上模块名,例如 test.hello()
```

## 打包python包

先运行以下命令,确保setuptools和wheel安装正常:

```bash
pip install --user --upgrade setuptools wheel
```

在包目录下,新建`setup.py`,内容如下(可参照注释更改):

```python
import setuptools

setuptools.setup(
    name="test",  # 软件包发布名
    version="1.0.0",  # 版本号
    author="kaitaku",  # 作者名
    author_email="test@kaitaku.xyz", # 作者邮箱
    description="这里应该是一段描述",  # 包的短描述
    long_description="这里应该是一段长描述",  # 完整描述
    long_description_content_type="text", # 完整描述文本类型
    url="https://www.kaitaku.xyz",  # 包的网站主页
    packages=setuptools.find_packages(), # 自动补全依赖
    classifiers=[
        "Programming Language :: Python :: 3", # 包所用语言、版本
        "License :: OSI Approved :: MIT License",  # 包的开源许可证
        "Operating System :: OS Independent"  # 包的操作系统
    ]
)
```

然后打开终端,在对应文件夹下输入下列命令:

```bash
python setup.py sdist bdist_wheel
```

当出现`removing 'test-1.0.0' (and everything under it)`时,你的包就创建好了
它应该在对应文件夹的`dist/<packageName>-<packageVersion>.tar.gz`这个位置
:::info
还有一个whl结尾的文件,这是安装和发布时会用到的
:::

输入如下命令安装它:

```bash
pip install dist/test-1.0.0.tar.gz
```

随后应该会出现`Successfully installed test-1.0.0`,此时,你的包就安装完毕了
现在你可以直接`import test`,删除也很简单,和标准pip包一样

## 发布你的python包

现在你应该已经创建了一个python包,现在可以把它发布到pypi上了 \
:::info
pypi就是`Python Package Index`,所有python第三方包的索引
:::
前往[pypi](https://pypi.org/account/register/) 注册一个账号
然后创建`README.rst`和`LICENSE.txt`,内容如下:

- `README.rst`就是你的python包的长描述,遵循[markup](https://rest-sphinx-memo.readthedocs.io/en/latest/ReST.html) 语法
- `LICENSE.txt`就是你的包的许可证内容,一般有MIT、BSD、GPL等

然后更改一下setup.py的内容:

```python
import setuptools

with open("README.rst","r",encoding="utf-8") as f:
    longDescription = f.read()
setuptools.setup(
    name="test",  # 软件包发布名
    version="1.0.0",  # 版本号
    author="kaitaku",  # 作者名
    author_email="test@kaitaku.xyz", # 作者邮箱
    description="这里应该是一段描述",  # 包的短描述
    long_description=longDescription,  # 完整描述
    url="https://www.kaitaku.xyz",  # 包的网站主页
    packages=setuptools.find_packages(), # 自动补全依赖
    classifiers=[
        "Programming Language :: Python :: 3", # 包所用语言、版本
        "License :: OSI Approved :: MIT License",  # 包的开源许可证
        "Operating System :: OS Independent"  # 包的操作系统
    ]
)
```

然后安装`twine`包:

```bash
pip install twine
```

然后执行下列命令上传库:

```bash
twine upload dist/*
```

然后会要求输入你的pypi账号密码,直接输入后等待上传即可
现在,你可以用pip命令安装你的python包了
