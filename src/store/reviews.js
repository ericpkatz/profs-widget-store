import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios';

export const fetchReviews = createAsyncThunk("fetchReviews", async()=>{
  try{
    const response = await axios.get('/api/reviews');
    return response.data;
  }catch(err){
    console.log(err)
  }
})

export const updateReview = createAsyncThunk("updateReview", async(review)=>{
  try{
    const response = await axios.put(`/api/reviews/${review.id}`, review, {
      headers: {
        authorization: window.localStorage.getItem('token')
      }
    });
    return response.data;
  }catch(err){
    console.log(err)
  }
})
/*

export const addToCart = createAsyncThunk("addToCart", async(payload)=>{
  try{
    const token = window.localStorage.getItem('token');
    const response = await axios.post('/api/orders/cart', payload, {
      headers: {
        authorization: token
      }
    });
    return response.data;
  }catch(err){
    console.log(err)
  }
})

export const removeFromCart = createAsyncThunk("removeFromCart", async(payload)=>{
  try{
    const token = window.localStorage.getItem('token');
    const response = await axios.put('/api/orders/cart', payload, {
      headers: {
        authorization: token
      }
    });
    return response.data;
  }catch(err){
    console.log(err)
  }
})
*/

const reviewsSlice = createSlice({
  name:"reviews",
  initialState: [],
  reducers: {},
  extraReducers: (builder)=>{
    builder.addCase(fetchReviews.fulfilled, (state, action)=>{
      return action.payload;
    })
    builder.addCase(updateReview.fulfilled, (state, action)=>{
      return state.map(review => review.id === action.payload.id ? action.payload : review);
      //return action.payload;
    })
    /*
    builder.addCase(removeFromCart.fulfilled, (state, action)=>{
      return action.payload;
    })
    */
  }
})

export default reviewsSlice.reducer;
