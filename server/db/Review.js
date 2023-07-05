const conn = require('./conn');
const { STRING, UUID, UUIDV4 } = conn.Sequelize;
const { socketMap } = require('../io');

const Review = conn.define('review', {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4
  },
  txt: {
    type: STRING(20),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  productId: {
    type: UUID,
    allowNull: false
  },
  userId: {
    type: UUID,
    allowNull: false
  }
});

Review.addHook('afterCreate', async(review)=> {
  review = await Review.findByPk(review.id, {
    include: [
      {
        model: conn.models.user,
        attributes: [ 'username', 'id', 'avatar' ]
      }
    ]
  });
  const sockets = Object.entries(socketMap)
    .filter(([ key, value])=> {
      return key !== review.userId;
    })
    .map(([key, socket])=> socket);


  sockets.forEach( socket => {
    socket.emit('reviewCreated', review);
  });
});

Review.addHook('afterDestroy', (review)=> {
  const sockets = Object.entries(socketMap)
    .filter(([ key, value])=> {
      return key !== review.userId;
    })
    .map(([key, socket])=> socket);

  sockets.forEach( socket => {
    socket.emit('reviewDestroyed', review);
  });
});

module.exports = Review;
