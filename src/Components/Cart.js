import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createOrder, fetchCart } from '../store';
import { Link } from 'react-router-dom';

const Cart = ()=> {
  const { cart } = useSelector(state => state);
  const dispatch = useDispatch();
  return (
    <div>
      <h1>Cart</h1>
      <button 
        onClick={
          async()=> {
            await dispatch(createOrder());
            await dispatch(fetchCart());
          }
        }
      >Create Order</button>
      <pre>
        {
          JSON.stringify(cart, null, 2)
        }
      </pre>
    </div>
  );
};

export default Cart;
