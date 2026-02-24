---
categories:
  - python
  - 基础篇
date: 2022-01-14 15:06:58
tags:
  - python
title: python-容器数据类型与常用方法
---

# 容器类型

## 列表

```python
list1 = [1,2,3,4,5]
list2 = ["a",1,2,"c"]
```

python中的list可以存储相同(list1)或不同的数据(list2)
列表结构类似于C++的数组,但区别是python列表存放的是指针
:::info
如果你认真看了第4篇,那你应该知道python中的变量大部分都是指针
:::
这里有一段代码：

```python
list1 = [1,2,3,4]
list2 = list1
list1.append(5)
print(list2) # 会输出什么?
```

答案是`[1, 2, 3, 4, 5]`,这里就是python的一个坑了,list2在目标改变后并不会改变指针(或者说指向list1这个目标没有改变)
所以list1会与list2同步 \
解决方法就是使用下面的方法：

```python
list1 = [1,2,3,4]
list2 = list1[::] # 在目标列表后加一个[::]
list1.append(5)
print(list2)
```

:::info
切片同样适用于列表,`[::]`表示返回所有内容
:::

```python
list1 = [[1,2],[1,2]]
```

list1就是一个`二维列表`,访问第一个列表的第二个数据需要使用下列方法：

```python
list1[0][1]
```

## 切片补充

切片可以使用`list[索引]`来返回特定位置的数据
同样可以使用切片来更改数据：

```python
list1 = [1, 2, 3, 4]
list1[0] = 7
print(list1) # [7, 2, 3, 4]
# 更改多个数据
list1 = [1, 2, 3, 4]
list1[0:2] = [7,8]
print(list1) # [7, 8, 3, 4]
```

:::info
更改多个数据等号后必须为**可迭代数据**
python的切片**含头不含尾**
:::

## 成员判断符

在python中可以使用`in`来判断元素是否位于目标容器中

```python
list1 = [1,2,3]
if 1 in list1:
    print("yes")
else:
    print("no")
# 输出yes
```

## 元组

```python
tuple1=(1,2,3)
tuple2=("a",1,2,"b")
```

python中的元组(tuple)与list基本一致,但元组内的数据不可变
列表基本操作**增删改查**元组只支持**查**,举个栗子：

```python mark:2
tuple1 = (1,2,3)
tuple1[0] = 2
print(tuple1)
# 在第2行会报错:TypeError: 'tuple' object does not support item assignment
```

:::info
增删改查的方法会在后面的部分讲到
:::

## 字典

```python
dict1 = {"a":1,"b":2}
print(dict1["a"])
```

字典是一种**哈希结构**,查询效率非常高(接近O(1))
字典通过键值对来储存对象,像dict1中,`"a"`对应`1`
列表和元组都可以转换为字典
列表转为字典：

```python
list1 = [["a",1],["b",2]]
print(dict(list1)) # {'a': 1, 'b': 2}
```

:::info
二维嵌套列表的0位为键,1位为值 \
例如第一个键值对中`a`为键,`1`为值
:::
对字典添加或赋值：

```python
dict1 = {"a": 1}
dict1["b"] = 2 # 左侧为键,右侧为值
print(dict1)
```

## 集合

```python
set1 = {"apple","banana","orange"}
print(set1) # 输出{'orange', 'banana', 'apple'}
```

集合是无序、无索引的,不可以执行**改**这个操作

```python
set1 = {3,4,1,2,3,5}
print(set1)
```

:::info
集合会自动对数字进行排序,去除重复项
:::

# 常用方法

## 通用方法

`print() input()`控制台的输出/入 \
`len()`返回参数的长度(仅可用于可迭代对象) \
`max() min()`返回参数的最大/小值 \
`str() int()...(对应的类型名称)`把对象转换为对应类型 \
`type()` 返回对象类型 \
`del obj`删除对象(全局命令)

## 容器类型方法

### 列表,元组

:::info
元组仅适用于**查询**
:::

#### 增加

`append()`在末尾添加一个元素,能且只能添加一个元素 \
`extend()`在末尾添加多个元素,必须以可迭代形式填入 \
`insert()`在指定位置添加一个元素,可迭代元素会以嵌套的形式填入
如果在添加方法内添加本身,会发生什么?

```python
list1 = [1,2,3]
list1.append(list1)
print(list1)
list1 = [1,2,3]
list1.extend(list1)
print(list1)
list1 = [1,2,3]
list1.insert(-1,list1)
print(list1)
```

输出如下:

```text
[1, 2, 3, [...]]
[1, 2, 3, 1, 2, 3]
[1, 2, [...], 3]
```

可以看出,extend会解包列表并填入,而append和insert会加入`...`来避免一直添加
:::info
这个`...`别名Ellipsis,是python里的特殊数据类型
:::

#### 删除

`remove()`删除列表中的指定**值**,不存在会返回错误 \
`pop()`删除列表中的指定**索引**(不指定删除-1位元素),并**返回**这个元素 \
`del 对象[索引]`删除指定索引的元素,索引超出列表会报错 \
`clear()`情空整个列表

#### 修改

`对象[索引] = 变量`修改指定索引的元素 \
`sort()`对列表进行排序

#### 查询

`index()`返回查询值的索引,不存在会报错
`count()`统计固定值的出现次数

### 字典

#### 增加,修改

`dict[键]=值`对指定对象赋值(不存在创建新键值对) \
`update()`使用键值对更新字典
:::info
字典和列表的复制一样,需要使用`copy`进行复制
:::

#### 删除

`pop()`删除指定键的键值对 \
`popitem()`删除最后添加的项目(3.7之前会删除随机项目) \
`del dict[键]`删除指定键的键值对
`clear()`清除这个字典

#### 查询

`get()`获取指定键的值
`values() keys()`获取所有的键/值
`items()`返回所有键值对

### 集合

#### 增加

`add()`添加一个元素 \
`update()`添加多个元素(可迭代)

#### 删除

`remove()`删除列表中的指定**值**,不存在会返回错误 \
`discard()`删除列表中的指定**值**,不会返回错误
`pop()`删除并返回随机元素
`clear()`清除这个集合

:::info
集合只能遍历,无法查询和使用索引
:::
