import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { updateReview } from '../store';


const Review = ()=> {
  const { products, reviews } = useSelector(state => state);
  const [txt, setText] = useState('');
  const [error, setError] = useState('');
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(()=> {
    const review = reviews.find(review => review.id === id);
    if(review){
      setText(review.txt);
      setError('');
    }
  }, [reviews, id]);

  const _updateReview = async(ev)=> {
    ev.preventDefault();
    const response = await dispatch(updateReview({ id, txt }));
    if(response.error){
      setError(response.payload.message);
    }
    else {
      navigate('/');
    }
  };

  const review = reviews.find(review => review.id === id);
  if(!review){
    return null;
  }
  const product = products.find(product => product.id === review.productId);



  return (
    <div>
      <h2>Review for { product.name }</h2>
      { !!error && <div style={{ color: 'red'}}>{ error }</div> }
      <form onSubmit={ _updateReview }>
        <input value={ txt } onChange={ ev => setText(ev.target.value)}/>
        <button disabled={ review.txt === txt }>Update</button>
        <Link to='/'>Cancel</Link>
      </form>
    </div>
  );
};

export default Review;
