# WebScript

![version](https://img.shields.io/badge/version-0.4.1-green.svg)

WebScript is a lightweight and semantic mvvm framework.

It is very close to native JS syntax, so you can get started quickly. It use virtual dom, and it only has 20kb+(not gzip).

[中文文档](./README.zhCN.md)

## Simple Example

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

## Syntax

### Template

变量输出的格式为 `${var}` 。（语法参考 ES6 模板字符串）

example

```html
<% var text = 'Hello World'; %>
<p>${text}</p>
```

output

```html
<p>Hello World</p>
```

### Condition

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

### Iteration

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

## Bindings

变量绑定以 `::` 开头，后面接需要绑定的变量名，只支持表单元素的绑定。(语法参考 ES7 函数绑定)

### Inputbox bindings

```html
<input type="text" name="::name" value="Hello World">
```

### Radio bindings

```html
<input type="radio" name="::type" value="1">
<input type="radio" name="::type" value="2">
<input type="radio" name="::type" value="3">
```

### Checkbox bindings

```html
<input type="checkbox" name=":isOpen">
```

## Event

事件以 `on-` 开头，后面接事件名称，如点击事件为 `on-click`

```html
<button on-click="show">Button</button>
```

## Other

作为一个
