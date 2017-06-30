var tokenizer = require('../src/tokenizer');

console.log(tokenizer('<% if (a == "%>") { %><p>${"}"}</p><% } %><script> var tpl = `${a}`; var out = "</script>" </script>'));