const conn = require('./conn');
const { STRING, UUID, UUIDV4 } = conn.Sequelize;

const Review = conn.define('review', {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4
  },
  txt: {
    type: STRING,
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

module.exports = Review;
