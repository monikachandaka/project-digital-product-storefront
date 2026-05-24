import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/products', { params })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch products')
  }
})

export const fetchProductById = createAsyncThunk('products/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/products/${id}`)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch product')
  }
})

export const fetchRelatedProducts = createAsyncThunk('products/fetchRelated', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/products/related?productId=${id}`)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch related products')
  }
})

export const createProduct = createAsyncThunk('products/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create product')
  }
})

export const updateProduct = createAsyncThunk('products/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update product')
  }
})

export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/products/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete product')
  }
})

export const addReview = createAsyncThunk('products/addReview', async ({ productId, data }, { rejectWithValue }) => {
  try {
    const res = await api.post(`/products/${productId}/reviews`, data)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add review')
  }
})

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    relatedProducts: [],
    product: null,
    totalProducts: 0,
    totalPages: 0,
    currentPage: 1,
    loading: false,
    error: null,
  },
  reducers: {
    clearProduct: (state) => { state.product = null },
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.products
        state.totalProducts = action.payload.total
        state.totalPages = action.payload.totalPages
        state.currentPage = action.payload.currentPage
      })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchProductById.pending, (state) => { state.loading = true })
      .addCase(fetchProductById.fulfilled, (state, action) => { state.loading = false; state.product = action.payload.product })
      .addCase(fetchProductById.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => { state.relatedProducts = action.payload })
      .addCase(createProduct.fulfilled, (state, action) => { state.products.unshift(action.payload.product) })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.products.findIndex(p => p._id === action.payload.product._id)
        if (idx !== -1) state.products[idx] = action.payload.product
        if (state.product?._id === action.payload.product._id) state.product = action.payload.product
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p._id !== action.payload)
      })
      .addCase(addReview.fulfilled, (state, action) => { state.product = action.payload.product })
  },
})

export const { clearProduct, clearError } = productSlice.actions
export default productSlice.reducer
