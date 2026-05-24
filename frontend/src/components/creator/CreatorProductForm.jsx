import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const categories = [
  'eBooks',
  'Templates',
  'Design Assets',
  'Software Tools',
  'Study Materials',
];
const CreatorProductForm = ({ onClose, editingProduct }) => {
  const [form, setForm] = useState({
    title: '',
    price: '',
    category: '',
    imageUrl: '',
    youtubeUrl: '',
    description: '',
    tags: '',
    file: null,
  });

  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setForm({
        ...form,
        ...editingProduct,
        tags: editingProduct.tags ? editingProduct.tags.join(', ') : '',
        imageUrl: editingProduct.imageUrl || '',
        youtubeUrl: editingProduct.youtubeUrl || '',
      });
      setPreview(editingProduct.imageUrl || editingProduct.image || '');
    }
    // eslint-disable-next-line
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setForm({ ...form, file: files[0] });
    } else if (name === 'imageUrl') {
      setForm({ ...form, imageUrl: value });
      setPreview(value);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validate = () => {
    if (!form.title || !form.price || !form.category || !form.description) {
      toast.error('Please fill all required fields');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== undefined) data.append(key, value);
      });
      if (form.tags) data.set('tags', form.tags);
      const method = editingProduct ? 'put' : 'post';
      const url = editingProduct ? `/products/${editingProduct._id}` : '/products';
      await api[method](url, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(`Product ${editingProduct ? 'updated' : 'created'}!`);
      onClose(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error saving product');
    } finally {
      setLoading(false);
    }
  };

  // Extract YouTube video ID
  const getYoutubeId = (url) => {
    if (!url) return '';
    const match = url.match(/(?:youtu.be\/|youtube.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : '';
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-xl relative overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
          <h2 className="text-xl font-bold text-stone-900 dark:text-white">{editingProduct ? 'Edit' : 'Add'} Product</h2>
          <button
            className="text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
            onClick={() => onClose(false)}
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block font-medium text-sm text-stone-700 dark:text-stone-300 mb-1.5">Product Name *</label>
            <input
              type="text"
              name="title"
              className="input-field"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-medium text-sm text-stone-700 dark:text-stone-300 mb-1.5">Description *</label>
            <textarea
              name="description"
              className="input-field min-h-[100px]"
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-medium text-sm text-stone-700 dark:text-stone-300 mb-1.5">Price *</label>
              <input
                type="number"
                name="price"
                className="input-field"
                value={form.price}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
            <div>
              <label className="block font-medium text-sm text-stone-700 dark:text-stone-300 mb-1.5">Category *</label>
              <select
                name="category"
                className="input-field"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-sm text-stone-700 dark:text-stone-300 mb-1.5">
              Digital File Upload
            </label>
            <input
              type="file"
              name="file"
              accept=".zip,.pdf,.mp3,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.epub,.mobi,.azw,.wav,.ogg,.mp4,.mov,.avi,.rar,.7z,.tar,.gz,.json,.xml,.psd,.ai,.sketch,.xd,.fig,.indd,.svg,.ttf,.otf,.woff,.woff2"
              className="input-field cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/10 file:text-emerald-500 hover:file:bg-emerald-500/20"
              onChange={handleChange}
            />
            {form.file && (
              <div className="text-xs text-stone-500 dark:text-stone-400 mt-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Selected: {form.file.name}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-medium text-sm text-stone-700 dark:text-stone-300 mb-1.5">Image URL</label>
              <input
                type="url"
                name="imageUrl"
                className="input-field"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block font-medium text-sm text-stone-700 dark:text-stone-300 mb-1.5">YouTube Video URL</label>
              <input
                type="url"
                name="youtubeUrl"
                className="input-field"
                value={form.youtubeUrl}
                onChange={handleChange}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>
          <div>
            <label className="block font-medium text-sm text-stone-700 dark:text-stone-300 mb-1.5">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              className="input-field"
              value={form.tags}
              onChange={handleChange}
            />
          </div>
          {/* Preview */}
          {(preview || form.youtubeUrl) && (
            <div className="flex flex-col gap-3 mt-4">
              {preview && (
                <img src={preview} alt="Preview" className="h-32 w-full rounded-lg object-cover border border-stone-200 dark:border-stone-700 shadow-sm" />
              )}
              {getYoutubeId(form.youtubeUrl) && (
                <iframe
                  className="rounded-lg border border-stone-200 dark:border-stone-700 shadow-sm w-full"
                  height="200"
                  src={`https://www.youtube.com/embed/${getYoutubeId(form.youtubeUrl)}`}
                  title="YouTube video preview"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          )}
          
          <div className="flex justify-end gap-3 pt-6 border-t border-stone-200 dark:border-stone-800 mt-6">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => onClose(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatorProductForm;
