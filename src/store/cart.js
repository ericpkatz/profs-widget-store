import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios';

const initialState={
  lineItems: []
}

export const fetchCart = createAsyncThunk("fetchCart", async()=>{
  try{
    const token = window.localStorage.getItem('token');
    const response = await axios.get('/api/orders/cart', {
      headers: {
        authorization: token
      }
    });
    return response.data;
  }catch(err){
    console.log(err)
  }
})

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

const cartSlice = createSlice({
  name:"cart",
  initialState,
  reducers: {},
  extraReducers: (builder)=>{
    builder.addCase(fetchCart.fulfilled, (state, action)=>{
      return action.payload;
    })
    builder.addCase(addToCart.fulfilled, (state, action)=>{
      return action.payload;
    })
    builder.addCase(removeFromCart.fulfilled, (state, action)=>{
      return action.payload;
    })
  }
})

export default cartSlice.reducer;
