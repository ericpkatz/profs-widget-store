const express = require('express');
const router = express.Router();
const { Product } = require('../db');

router.get('/', async(req, res, next)=> {
  try {
    res.send(await Product.findAll());
  }
  catch(ex){
    next(ex);
  }
});


module.exports = router;
