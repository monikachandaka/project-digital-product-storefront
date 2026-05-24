import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'

export const createOrder = createAsyncThunk('orders/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/orders', data)
    return res.data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const fetchMyOrders = createAsyncThunk('orders/myOrders', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/orders/my-orders')
    return res.data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})


export const verifyPayment = createAsyncThunk('orders/verify', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/orders/verify-payment', data)
    return res.data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const getDownloadLink = createAsyncThunk('orders/download', async ({ orderId, productId }, { rejectWithValue }) => {
  try {
    const res = await api.get(`/orders/${orderId}/download/${productId}`)
    return res.data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

const orderSlice = createSlice({
  name: 'orders',
  initialState: { orders: [], allOrders: [], currentOrder: null, loading: false, error: null },
  reducers: { clearCurrentOrder: (state) => { state.currentOrder = null } },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => { state.loading = true })
      .addCase(createOrder.fulfilled, (state, action) => { state.loading = false; state.currentOrder = action.payload })
      .addCase(createOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchMyOrders.pending, (state) => { state.loading = true })
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload.orders })
      .addCase(fetchMyOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(verifyPayment.fulfilled, (state, action) => { state.currentOrder = action.payload })
  },
})

export const { clearCurrentOrder } = orderSlice.actions
export default orderSlice.reducer
