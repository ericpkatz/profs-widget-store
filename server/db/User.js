const conn = require('./conn');
const { JSON, TEXT, STRING, UUID, UUIDV4 } = conn.Sequelize;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT;
const axios = require('axios');


const User = conn.define('user', {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4
  },
  login: {
    type: STRING,
    unique: true
  },
  username: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    },
    unique: true
  },
  password: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  place: {
    type: JSON,
    defaultValue: {}
  },
  avatar: {
    type: TEXT
  }
});

User.prototype.createOrder = async function(){
  const cart = await this.getCart();
  cart.isCart = false;
  await cart.save();
  return cart;

}

User.prototype.getOrders = function(){
    return conn.models.order.findAll(
      {
        where: {
          userId: this.id,
          isCart: false
        },
        include: [
          {
            model: conn.models.lineItem,
            include: [
              conn.models.product
            ]
          }
        ]
      }
    );
}

User.prototype.getCart = async function(){
  let cart = await conn.models.order.findOne({
    where: {
      userId: this.id,
      isCart: true
    }
  });
  if(!cart){
    cart = await conn.models.order.create({
      userId: this.id
    });
  }
  cart = await conn.models.order.findByPk(
    cart.id,
    {
      include: [
        {
          model: conn.models.lineItem,
          include: [
            conn.models.product
          ]
        }
      ]
    }
  );
  return cart;
}

User.prototype.addToCart = async function({ product, quantity}){
  const cart = await this.getCart();
  let lineItem = cart.lineItems.find( lineItem => {
    return lineItem.productId === product.id; 
  });
  if(lineItem){
    lineItem.quantity += quantity;
    await lineItem.save();
  }
  else {
    await conn.models.lineItem.create({ orderId: cart.id, productId: product.id, quantity });
  }
  return this.getCart();
};

User.prototype.removeFromCart = async function({ product, quantityToRemove}){
  const cart = await this.getCart();
  const lineItem = cart.lineItems.find( lineItem => {
    return lineItem.productId === product.id; 
  });
  lineItem.quantity = lineItem.quantity - quantityToRemove;
  if(lineItem.quantity > 0){
    await lineItem.save();
  }
  else {
    await lineItem.destroy();
  }
  return this.getCart();
};


User.addHook('beforeSave', async(user)=> {
  if(user.changed('password')){
    user.password = await bcrypt.hash(user.password, 5);
  }
});

User.findByToken = async function(token){
  try {
    const { id } = jwt.verify(token, process.env.JWT);
    const user = await this.findByPk(id);
    if(user){
      return user;
    }
    throw 'user not found';
  }
  catch(ex){
    const error = new Error('bad credentials');
    error.status = 401;
    throw error;
  }
}

User.prototype.generateToken = function(){
  return jwt.sign({ id: this.id }, JWT);
};

User.authenticate = async function({ username, password }){
  const user = await this.findOne({
    where: {
      username
    }
  });
  if(user && await bcrypt.compare(password, user.password)){
    return jwt.sign({ id: user.id }, JWT);
  }
  const error = new Error('bad credentials');
  error.status = 401;
  throw error;
}

User.authenticateGithub = async function(code){
  let response = await axios.post(
    'https://github.com/login/oauth/access_token', {
      code,
      client_secret: process.env.CLIENT_SECRET,
      client_id: process.env.CLIENT_ID
    }, {
      headers: {
        accept: 'application/json'
      }
    }
  );
  const { access_token, error } = response.data;
  if(error){
    const _error = Error(error);
    _error.status = 401;
    throw _error;
  }

  response = await axios.get('https://api.github.com/user', {
    headers: {
      authorization: `Bearer ${ access_token }`
    }
  });

  const { login } = response.data;

  let user = await User.findOne({
    where: { login }
  });

  if(!user){
    user = await User.create({
      login,
      username: `Github-${ login }`,
      password: `random-${ Math.random() }`
    });
  }

  await user.update({
      username: `Github-${ login }`
  });


  return user.generateToken();
}

module.exports = User;

