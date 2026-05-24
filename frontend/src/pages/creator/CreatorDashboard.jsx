
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import CreatorDiscountCodes from './CreatorDiscountCodes';
import CreatorAffiliateLinks from './CreatorAffiliateLinks';
import toast from 'react-hot-toast';
import CreatorProductForm from '../../components/creator/CreatorProductForm';
import CreatorProfileForm from '../../components/creator/CreatorProfileForm';
import { FiPlus, FiEdit, FiTrash2, FiTag, FiLayers, FiBox, FiDollarSign } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const summaryCard = (title, value, icon, color) => (
  <div className={`flex items-center gap-4 p-5 rounded-xl shadow bg-gradient-to-br ${color} text-white`}>
    <div className="text-3xl">{icon}</div>
    <div>
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-xs opacity-80">{title}</div>
    </div>
  </div>
);

const CreatorDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [profile, setProfile] = useState(user);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'creator') {
      navigate('/');
      toast.error('Access denied: Creators only');
      return;
    }
    fetchProfile();
    fetchProducts();
    // eslint-disable-next-line
  }, [user]);

  const fetchProfile = async () => {
    setProfileLoading(true);
    try {
      const res = await api.get('/auth/me');
      setProfile(res.data.user);
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setProfileLoading(false);
    }
  };
  const handleProfileSave = async (data) => {
    try {
      await api.put('/auth/profile', data);
      fetchProfile();
    } catch (err) {
      throw err;
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get(`/products?creator=${user._id}`);
      setProducts(res.data.products);
    } catch (err) {
      toast.error('Failed to fetch products');
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleFormClose = (refresh) => {
    setShowForm(false);
    setEditingProduct(null);
    if (refresh) fetchProducts();
  };

  // Dashboard summary
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const totalSales = products.reduce((sum, p) => sum + (p.numSales || 0), 0); // Placeholder, add real sales if available
  const totalRevenue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.numSales || 0)), 0); // Placeholder

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Creator Profile Customization */}
      <div className="mb-8">
        {profileLoading ? (
          <div className="text-center text-gray-400">Loading profile...</div>
        ) : (
          <CreatorProfileForm user={profile} onSave={handleProfileSave} />
        )}
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 mt-8">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900 dark:text-white mb-1">Creator Dashboard</h1>
          <p className="text-stone-500 dark:text-stone-400">Manage your products, view stats, and grow your digital business.</p>
        </div>
        <button
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-2 rounded-lg shadow hover:from-blue-700 hover:to-blue-600 font-semibold transition"
          onClick={handleAdd}
        >
          <FiPlus className="text-lg" /> Add Product
        </button>
      </div>
      {/* Affiliate Links Management */}
      <CreatorAffiliateLinks />
      {/* Discount Codes Management */}
      <CreatorDiscountCodes />
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {summaryCard('Products', totalProducts, <FiBox />, 'from-blue-500 to-blue-400')}
        {summaryCard('Total Stock', totalStock, <FiLayers />, 'from-green-500 to-green-400')}
        {summaryCard('Sales', totalSales, <FiTag />, 'from-pink-500 to-pink-400')}
        {summaryCard('Revenue', `$${totalRevenue}`, <FiDollarSign />, 'from-yellow-500 to-yellow-400')}
      </div>

      {showForm && (
        <CreatorProductForm
          onClose={handleFormClose}
          editingProduct={editingProduct}
        />
      )}

      <h2 className="text-xl font-bold mb-4 mt-8 text-stone-900 dark:text-white">Your Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
        {products.length === 0 && (
          <div className="col-span-full text-center text-stone-400 dark:text-stone-500 py-12">
            <div className="text-6xl mb-2">😶</div>
            <div>No products yet. Click "Add Product" to get started!</div>
          </div>
        )}
        {products.map((product) => {
          // Helper to extract YouTube ID
          const getYoutubeId = (url) => {
            if (!url) return '';
            const match = url.match(/(?:youtu.be\/|youtube.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
            return match ? match[1] : '';
          };
          const imageSrc = product.imageUrl || product.image || '/placeholder.png';
          const youtubeId = getYoutubeId(product.youtubeUrl);
          return (
            <div key={product._id} className="card group flex flex-col overflow-hidden">
              <div className="relative h-44 bg-gradient-to-br from-brand-50 to-white dark:from-brand-900/10 dark:to-transparent flex flex-col items-center justify-center gap-1 border-b border-stone-100 dark:border-stone-800/80">
                <img
                  src={imageSrc}
                  alt={product.title}
                  className="h-24 object-contain mx-auto drop-shadow-lg transition-transform group-hover:scale-105 rounded"
                />
                {youtubeId && (
                  <iframe
                    className="rounded border mt-1"
                    width="100%"
                    height="60"
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title="YouTube video preview"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full p-2 shadow"
                    onClick={() => handleEdit(product)}
                    title="Edit"
                  >
                    <FiEdit />
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow"
                    onClick={() => handleDelete(product._id)}
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-lg mb-1 truncate text-stone-900 dark:text-white" title={product.title}>{product.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 px-2 py-0.5 rounded-full">{product.category}</span>
                  {product.discount > 0 && (
                    <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">-{product.discount}%</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-stone-800 dark:text-white font-bold">${product.price}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs line-through text-stone-400 dark:text-stone-500">${product.originalPrice}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {product.tags && product.tags.map((tag, i) => (
                    <span key={i} className="text-xs bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
                <div className="text-xs text-stone-400 dark:text-stone-500 mt-auto">Stock: {product.stock}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CreatorDashboard;
