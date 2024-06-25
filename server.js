const express = require("express");
const {
  green,
  white,
  bold,
  italic,
} = require('colors');

const app = express();

app.listen(8080, () => {
  console.log(
    green(bold('[Site]')),
    white(italic('Site Bağlantısı Başarılı'))
  );
})
  