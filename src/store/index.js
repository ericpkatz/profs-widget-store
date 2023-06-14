import {configureStore} from "@reduxjs/toolkit";
import logger from 'redux-logger';
import auth from './auth';
import cart from './cart';
import products from './products';
import orders from './orders';
import reviews from './reviews';

const store = configureStore({
  middleware: (defaultMiddleware)=> defaultMiddleware().concat(logger),
  reducer:{
    auth,
    cart,
    products,
    orders,
    reviews
  }
});

export default store;
export * from './auth';
export * from './cart';
export * from './products';
export * from './orders';
export * from './reviews';

