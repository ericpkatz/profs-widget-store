const conn = require('./conn');
const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const LineItem  = require('./LineItem');
const Review = require('./Review'); 

Order.belongsTo(User);
LineItem.belongsTo(Order);
Order.hasMany(LineItem);
LineItem.belongsTo(Product);
Review.belongsTo(User);
Review.belongsTo(Product);

const syncAndSeed = async()=> {
  if(process.env.SYNC !== 'SKIP'){
    await conn.sync({ force: true });
    const [moe, lucy, larry, foo, bar, bazz, ethyl] = await Promise.all([
      User.create({ username: 'moe', password: '123' }),
      User.create({ username: 'lucy', password: '123' }),
      User.create({ username: 'larry', password: '123' }),
      Product.create({ name: 'foo' }),
      Product.create({ name: 'bar' }),
      Product.create({ name: 'bazz' }),
      User.create({ username: 'ethyl', password: '123' }),
    ]);

    const cart = await ethyl.getCart();
    await ethyl.addToCart({ product: bazz, quantity: 3});
    await ethyl.addToCart({ product: foo, quantity: 2});
    await ethyl.createOrder();
    await ethyl.addToCart({ product: foo, quantity: 2});
    await ethyl.addToCart({ product: foo, quantity: 2});
    await ethyl.addToCart({ product: foo, quantity: 2});
    await Review.create({ userId: moe.id, productId: foo.id, txt: 'I LOVE FOO'}); 
    await Review.create({ userId: moe.id, productId: bar.id, txt: 'BAR NOT SO GREAT'}); 
    await Review.create({ userId: lucy.id, productId: bar.id, txt: 'BAR GOOD'}); 
    return {
      users: {
        moe,
        lucy,
        larry
      },
      products: {
        foo,
        bar,
        bazz
      }
    };
  }
};


module.exports = {
  syncAndSeed,
  User,
  Product,
  Review
};
