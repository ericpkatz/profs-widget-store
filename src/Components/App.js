import React, { useEffect } from 'react';
import Home from './Home';
import Login from './Login';
import Cart from './Cart';
import Profile from './Profile';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, addToCart, loginWithToken, fetchCart, fetchProducts } from '../store';
import { Link, Routes, Route } from 'react-router-dom';

const App = ()=> {
  const { auth, products, cart } = useSelector(state => state);
  const dispatch = useDispatch();
  useEffect(()=> {
    dispatch(fetchProducts());
    dispatch(loginWithToken());
  }, []);

  const count = cart.lineItems.reduce((acc, item)=> {
    return acc + item.quantity;
  }, 0);

  useEffect(()=> {
    if(auth.id){
      dispatch(fetchCart());
    }
  }, [auth]);
  return (
    <div>
      <h1>Acme Shopping</h1>
      {
        auth.id ? <Home /> : <Login />
      }
      {
        !!auth.id  && (
          <div>
            <nav>
              <Link to='/'>Home</Link>
              <Link to='/cart'>Cart ({  count })</Link>
              <Link to='/profile'>Profile</Link>
              {
                auth.avatar ? (
                  <img src={ auth.avatar } />
                ): null
              }
            </nav>
            <Routes>
              <Route path='/cart' element={ <Cart /> } />
              <Route path='/profile' element={ <Profile /> } />
            </Routes>
          </div>
        )
      }
      <ul>
        {
          products.map( product => {
            return (
              <li key={ product.id }>
                { product.name }
                {
                  auth.id ? (
                    <button onClick={ ()=> dispatch(addToCart({product, quantity: 1}))}>Add to Your Cart</button>
                  ): null
                }
                {
                  !!auth.id && cart.lineItems.find(lineItem => lineItem.productId === product.id ) && <button onClick={ ()=> dispatch(removeFromCart({ product, quantityToRemove: 1}))}>Remove from Your Cart</button>
                }
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};

export default App;
