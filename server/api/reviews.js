const express = require('express');
const router = express.Router();
const { Review, User } = require('../db');

router.get('/', async(req, res, next)=> {
  try {
    res.send(await Review.findAll({
      include: [
        {
          model: User,
          attributes: [ 'username', 'id', 'avatar' ]
        }
      ]
    }));
  }
  catch(ex){
    next(ex);
  }
});

router.put('/:id', async(req, res, next)=> {
  try {
    const user = await User.findByToken(req.headers.authorization);
    let review = await Review.findByPk(req.params.id, {
      where: {
        userId: user.id
      }
    });
    await review.update(req.body);
    res.send(await Review.findByPk(review.id, {
      include: [
        {
          model: User,
          attributes: [ 'username', 'id', 'avatar' ]
        }
      ]
    }));
  }
  catch(ex){
    next(ex);
  }
});


module.exports = router;
