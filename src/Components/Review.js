import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { updateReview } from '../store';


const Review = ()=> {
  const { products, reviews } = useSelector(state => state);
  const [txt, setText] = useState('');
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(()=> {
    const review = reviews.find(review => review.id === id);
    if(review){
      setText(review.txt);
    }
  }, [reviews, id]);

  const _updateReview = async(ev)=> {
    ev.preventDefault();
    await dispatch(updateReview({ id, txt }));
    navigate('/');
  };


  return (
    <form onSubmit={ _updateReview }>
      <input value={ txt } onChange={ ev => setText(ev.target.value)}/>
      <Link to='/'>Cancel</Link>
    </form>
  );
};

export default Review;
