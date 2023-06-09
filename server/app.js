const express = require('express');
const app = express();
const path = require('path');
app.use(express.json());
app.engine('html', require('ejs').renderFile);

app.use('/dist', express.static(path.join(__dirname, '../dist')));
app.use('/static', express.static(path.join(__dirname, '../static')));

app.get('/', (req, res)=> res.render(path.join(__dirname, '../static/index.html'), {
  API_KEY: process.env.API_KEY,
  CLIENT_ID: process.env.CLIENT_ID
}));

app.use('/api/auth', require('./api/auth'));
app.use('/api/orders', require('./api/orders'));
app.use('/api/products', require('./api/products'));
app.use('/api/reviews', require('./api/reviews'));

app.use((err, req, res, next)=> {
  console.log(err);
  res.status(err.status || 500).send({ error: err, message: err.message });
});

module.exports = app;
