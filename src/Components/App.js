import React, { useEffect } from 'react';
import Home from './Home';
import Login from './Login';
import Cart from './Cart';
import { useSelector, useDispatch } from 'react-redux';
import { loginWithToken, fetchCart, fetchProducts } from '../store';
import { Link, Routes, Route } from 'react-router-dom';

const App = ()=> {
  const { auth, products } = useSelector(state => state);
  const dispatch = useDispatch();
  useEffect(()=> {
    dispatch(fetchProducts());
    dispatch(loginWithToken());
  }, []);

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
              <Link to='/cart'>Cart</Link>
            </nav>
            <Routes>
              <Route path='/cart' element={ <Cart /> } />
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
                    <button>Add to Your Cart</button>
                  ): null
                }
                {
                  !!auth.id && <button>Add to Your Cart</button>
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
