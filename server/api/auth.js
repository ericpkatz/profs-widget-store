const express = require('express');
const app = express.Router();
const { User } = require('../db');

module.exports = app;

app.post('/', async(req, res, next)=> {
  try {
    res.send(await User.authenticate(req.body));
  }
  catch(ex){
    next(ex);
  }
});

app.get('/', async(req, res, next)=> {
  try {
    res.send(await User.findByToken(req.headers.authorization));
  }
  catch(ex){
    next(ex);
  }
});

app.put('/', async(req, res, next)=> {
  try {
    const user = await User.findByToken(req.headers.authorization);
    await user.update({ avatar: req.body.avatar });
    res.send(user);
  }
  catch(ex){
    next(ex);
  }
});
