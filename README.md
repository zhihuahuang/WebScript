# WebScript

![version](https://img.shields.io/badge/version-0.3.0-green.svg)

WebScript 是一个灵活、语义化的轻量级前端框架。

*目前仍处于开发阶段，语法等有可能会发生改变。*

## 样例

```html
<body>
    <p>${text}</p>
    <script src="webscript.min.js"></script>
    <script>
      (function() {
          var data = {
              text: 'Hello World'
          };
  	      var webscript = new WebScript({
              data: data
	      });
      }());
  </script>
</body>
```

## 语法

### 变量输出

样例

```html
<% var text = 'Hello World'; %>
<p>${text}</p>
```

结果

```html
<p>Hello World</p>
```

### 条件判断

#### if...else

```html
<% if (Date.now() % 2 === 0) { %>
<p>Odd</p>
<% else { %>
<p>Even</p>
<% } %>
```

#### 三元表达式

```html
<p>${ (Date.now() % 2 === 0) ? 'Odd' : 'Even' }</p>
```

### 循环

#### while

```html
<% while (i++ < 100) { %>
    <p>${i}</p>
<% } %>
```

#### for

```html
<ul>
    <% for (var i=0; i<10; i++) { %>
    <li>${i}</li>
    <% } %>
</ul>
```

## 变量绑定

变量绑定以 `:` 开头，后面接需要绑定的变量名，只支持表单元素的绑定。

### 输入框绑定（草案）

```html
<input type="text" name=":name" value="Hello World">
```

### 单选框绑定（草案）

```html
<input type="radio" name=":type" value="1">
<input type="radio" name=":type" value="2">
<input type="radio" name=":type" value="3">
```

### 复选框绑定（草案）

```html
<input type="checkbox" name=":isopen">
```

## 事件（草案）

```html
<button onclick=":show">Button</button>
```

## 其他
