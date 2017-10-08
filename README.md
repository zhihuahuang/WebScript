# WebScript

![version](https://img.shields.io/badge/version-0.4.1-green.svg)

WebScript is a lightweight, simple and semantic mvvm framework.

It is very close to native JavaScript syntax, so you can get started quickly. It use virtual dom, and it only has 40kb+(not gzip).

[中文文档](./README.zhCN.md)

[TOC]

## Simple Example

```html
<body>
    <p id="app">${text}</p>
    <script src="webscript.min.js"></script>
    <script>
  	    new WebScript({
            element: '#app',
                data: {
                    text: 'Hello World'
                }
	        });
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

Condition user `<% ... %>`

#### example

```html
<% if (Date.now() % 2 === 0) { %>
<p>Odd</p>
<% else { %>
<p>Even</p>
<% } %>
```

### Bindings

#### example



### Event

The event uses the `on-event` syntax.

#### example

```html
<div id="app">
    <button on-click="showDialog">Click Me</button>  
</div>
<script>
    new WebScript({
      element: '#app',
      data: {
        showDialog: function() {
            alert('Click Ok');
        }
      }
    });
</script>
```

