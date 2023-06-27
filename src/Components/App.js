import React, { useEffect, useRef } from 'react';
import Home from './Home';
import Login from './Login';
import Cart from './Cart';
import Profile from './Profile';
import Review from './Review';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReviews, removeFromCart, addToCart, loginWithToken, fetchCart, fetchProducts, fetchOrders } from '../store';
import { Link, Routes, Route } from 'react-router-dom';

const Orders = ()=> {
  const { orders } = useSelector(state => state);
  return (
    <pre>
    {
      JSON.stringify(orders, null, 2)
    }
    </pre>
  );
};

const App = ()=> {
  const { reviews, auth, products, cart, orders } = useSelector(state => state);

  const prevAuth = useRef(auth);

  const dispatch = useDispatch();
  useEffect(()=> {
    dispatch(fetchProducts());
    dispatch(fetchReviews());
    dispatch(loginWithToken());
  }, []);

  const count = cart.lineItems.reduce((acc, item)=> {
    return acc + item.quantity;
  }, 0);

  useEffect(()=> {
    if(!prevAuth.current.id && auth.id){
      console.log('you just logged in');
      dispatch(fetchCart());
      dispatch(fetchOrders());
    }

    if(prevAuth.current.id && !auth.id){
      console.log('you just logged out');
    }
  }, [auth, prevAuth]);

  /*
  useEffect(()=> {
    if(auth.id){
      dispatch(fetchCart());
      dispatch(fetchOrders());
    }
  }, [auth]);
  */

  useEffect(()=> {
    prevAuth.current = auth;
  });

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
              <Link to='/orders'>Orders ({ orders.length })</Link>
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
              <Route path='/orders' element={ <Orders /> } />
              <Route path='/reviews/:id' element={ <Review /> } />
            </Routes>
          </div>
        )
      }
      <ul>
        {
          products.map( product => {
            const productReviews = reviews.filter(review => review.productId === product.id);
            return (
              <li key={ product.id }>
                { product.name }
                <ul>
                  {
                    productReviews.map( review => {
                      return (
                        <li key={ review.id }>
                          { review.txt } by  
                          {' ' }
                          { auth.id === review.userId ? 'YOU' : review.user.username }
                          { auth.id === review.userId ? (
                            <Link to={ `/reviews/${review.id }`}>Edit</Link>
                          ): null } 
                        </li>
                      );
                    })
                  }
                </ul>
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
