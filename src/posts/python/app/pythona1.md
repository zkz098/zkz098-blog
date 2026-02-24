---
categories:
  - python
  - 应用篇
date: 2022-03-18 14:25:21
tags:
  - python
title: python-用企业微信机器人发天气预报
---

:::info
本文实际上是企业微信机器人+天气预报,但拆开有点短,所以组合到一起了
:::

# 企业微信机器人

## 数据和模块准备

请求头:

```py
head = {
    'Content-Type': 'application/json', # 声明为json类型
}
```

数据(负载):

```python
data = '''{
        "msgtype": "markdown",
        "markdown": {
            "content": "暂时留空"
         }'''
```

:::info
这里作者选用了markdown格式,markdown语法可自行百度。
:::
安装requests库:

```bash
pip install requests
```

## 定义post函数

:::info
使用requests自带的post函数,如果数据内有中文会无法编码,需要包装函数
:::
代码如下:

```python
import requests

def post(url, data=None, header=None):
    try:
        data = data.encode("utf-8")
        res = requests.post(url, data=data, headers=header, verify=False)
        return res
    except BaseException as error:
        print("post请求错误，错误原因：%s" % error)
        raise error
```

## 准备运行用代码

```python
res = post("yourwebhook&debug=1",
           header=head, data=data)
print(res.json())
```

:::info
带上`&debug=1`参数是方便排查错误,如果你有信心可以不加
:::

# 天气预报API

:::info
本文选择[和风天气API](https://dev.qweather.com/) 进行开发 \
本文为**现在天气**
:::

## 发送get请求

:::info
请求内容不涉及中文,使用系统get函数即可
:::

```python
r = requests.get(yoururl)
r_dict = r.json()
```

<yoururl>格式如下:

```text
https://devapi.qweather.com/v7/weather/now?key=&location=
```

在key的等号后写入你的应用key,location查询见[这篇文章](https://blog.csdn.net/u013193363/article/details/44851897?spm=1001.2101.3001.6650.2&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-2.pc_relevant_default&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-2.pc_relevant_default&utm_relevant_index=5)

## 结果处理

返回格式应该如下

```json
{
  "code": "200",
  "updateTime": "2022-03-18T09:27+08:00",
  "fxLink": "http://hfx.link/2bp1",
  "now": {
    "obsTime": "2022-03-18T09:13+08:00",
    "temp": "2",
    "feelsLike": "0",
    "icon": "104",
    "text": "阴",
    "wind360": "135",
    "windDir": "东南风",
    "windScale": "1",
    "windSpeed": "4",
    "humidity": "76",
    "precip": "0.0",
    "pressure": "1017",
    "vis": "8",
    "cloud": "100",
    "dew": "",-4""
  },
  "refer": {
    "sources": [
      "QWeather",
      "NMC",
      "ECMWF"
    ],
    "license": [
      "no commercial use"
    ]
  }
}
```

:::info
有可能是单引号的,但不影响使用
:::
上面的`r_dict`变量已经是dict类型了,无需`eval()`

# 发送到企业微信

```python
import requests
def post(url, data=None, file=None, header=None, cookie=None):
    try:
        # data = json.dumps(data)
        data = data.encode("utf-8")
        res = requests.post(url, data=data, files=file, headers=header, cookies=cookie, verify=False)
        return res
    except BaseException as e:
        print("post请求错误，错误原因：%s" % e)
        raise e


def get(url, data=None, file=None, header=None, cookie=None):
    try:
        # data = json.dumps(data)
        data = data.encode("utf-8")
        res = requests.get(url, data=data, files=file, headers=header, cookies=cookie, verify=False)
        return res
    except BaseException as e:
        print("get请求错误，错误原因：%s" % e)
        raise e
head = {
    'Content-Type': 'application/json',
}

r = requests.get("https://devapi.qweather.com/v7/weather/now?key=&location=")
r_dict = r.json()
str1 = f"""
天气beta版 \n
>更新时间:**{r_dict["updateTime"]}**
>观测时间:**{r_dict["now"]["obsTime"]}**
>温度:**{r_dict["now"]["temp"]}**℃
>体感温度:**{r_dict["now"]["feelsLike"]}**℃
>天气:**{r_dict["now"]["text"]}**
>风向:**{r_dict["now"]["windDir"]}**
>风力:**{r_dict["now"]["windScale"]}**级
>湿度:**{r_dict["now"]["humidity"]}**%
>降水量:**{r_dict["now"]["precip"]}**mm
"""
print(str1)
data = '''{
        "msgtype": "markdown",
        "markdown": {
            "content": "%s"
         }'''% str1

bot = post("https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=any&debug=1",
           header=head, data=data)
print(bot.json())
```

这个就是完整代码了,建议使用f-string格式化,在data里**必须使用**`%`格式化
假如一切正常,运行完后会输出:

```json
{
  "errcode": 0,
  "errmsg": "ok. Warning: wrong json format. "
}
```

企业微信里的机器人应该会正确的发出消息!!不正确多半是排版错误!!
