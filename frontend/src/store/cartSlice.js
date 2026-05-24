import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/cart')
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const addToCart = createAsyncThunk('cart/add', async ({ productId, quantity = 1 }, { rejectWithValue }) => {
  try {
    const res = await api.post('/cart', { productId, quantity })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const updateCartItem = createAsyncThunk('cart/update', async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/cart/${productId}`, { quantity })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const removeFromCart = createAsyncThunk('cart/remove', async (productId, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/cart/${productId}`)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const clearCartAPI = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
  try {
    const res = await api.delete('/cart')
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], totalAmount: 0, totalItems: 0, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    const setCart = (state, action) => {
      state.loading = false
      state.items = action.payload.cart?.items || []
      state.totalAmount = action.payload.cart?.totalAmount || 0
      state.totalItems = action.payload.cart?.items?.length || 0
    }
    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true })
      .addCase(fetchCart.fulfilled, setCart)
      .addCase(fetchCart.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(addToCart.fulfilled, setCart)
      .addCase(updateCartItem.fulfilled, setCart)
      .addCase(removeFromCart.fulfilled, setCart)
      .addCase(clearCartAPI.fulfilled, (state) => { state.items = []; state.totalAmount = 0; state.totalItems = 0 })
  },
})

export default cartSlice.reducer
