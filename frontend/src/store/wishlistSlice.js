import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/wishlist')
    return res.data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const toggleWishlist = createAsyncThunk('wishlist/toggle', async (productId, { rejectWithValue }) => {
  try {
    const res = await api.post(`/wishlist/${productId}`)
    return res.data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const removeFromWishlist = createAsyncThunk('wishlist/remove', async (productId, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/wishlist/${productId}`)
    return res.data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    const setWishlist = (state, action) => {
      state.loading = false
      state.items = action.payload.wishlist || []
    }
    builder
      .addCase(fetchWishlist.pending, (state) => { state.loading = true })
      .addCase(fetchWishlist.fulfilled, setWishlist)
      .addCase(fetchWishlist.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(toggleWishlist.fulfilled, setWishlist)
      .addCase(removeFromWishlist.fulfilled, setWishlist)
  },
})

export default wishlistSlice.reducer
