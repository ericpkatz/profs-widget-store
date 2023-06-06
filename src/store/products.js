import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios';

export const fetchProducts = createAsyncThunk("fetchProducts", async()=>{
  try{
    const response = await axios.get('/api/products');
    return response.data;
  }catch(err){
    console.log(err)
  }
})

const productsSlice = createSlice({
  name:"cart",
  initialState: [],
  reducers: {},
  extraReducers: (builder)=>{
    builder.addCase(fetchProducts.fulfilled, (state, action)=>{
      return action.payload;
    })
  }
})

export default productsSlice.reducer;
