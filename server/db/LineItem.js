const conn = require('./conn');
const { INTEGER, UUID, UUIDV4 } = conn.Sequelize;

const LineItem = conn.define('lineItem', {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4
  },
  quantity: {
    type: INTEGER,
    defaultValue: 1,
    allowNull: false
  },
  productId: {
    type: UUID,
    allowNull: false
  },
  orderId: {
    type: UUID,
    allowNull: false
  }
});

module.exports = LineItem;
