# WebScript（开发中）

WebScript 是一个语义化的前端框架。

*目前仍处于开发阶段，语法等有可能会发生改变。*

## 语法

### 变量输出

样例

```html
< var text = 'Hello World'; >
<p>${text}</p>
```

结果

```html
<p>Hello World</p>
```

### 条件判断

#### if...else

```html
< if (Date.now() % 2 === 0) { >
<p>Odd</p>
< else { >
<p>Even</p>
< } >
```

#### 三元表达式

```html
<p>${ (Date.now() % 2 === 0) ? 'Odd' : 'Even' }</p>
```

### 循环

#### while

```html
< while (i++ < 100) { >
	<p>${i}</p>
< } >
```

#### for

```html
<ul>
    < for (var i=0; i<10; i++) { >
	<li>${i}</li>
	< } >
</ul>
```

## 变量绑定

```html
<input type="text" value=":name">
```

## 事件

## 草案

## 废弃
