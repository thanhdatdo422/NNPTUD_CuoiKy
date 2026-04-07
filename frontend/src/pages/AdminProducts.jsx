import { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { authService } from '../services/authService';
import { uploadService } from '../services/uploadService';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: '',
  });

  const user = authService.getCurrentUser();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data || []);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let imageUrl = formData.image;

      // Upload image if file selected
      if (imageFile) {
        const uploadResponse = await uploadService.uploadImage(imageFile);
        imageUrl = uploadResponse.file;
      }

      const submitData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        images: imageUrl ? [imageUrl] : [],
      };

      if (editingId) {
        await productService.updateProduct(editingId, submitData);
        setEditingId(null);
      } else {
        await productService.createProduct(submitData);
      }

      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image: '',
      });
      setImageFile(null);
      setImagePreview(null);

      await fetchProducts();
      setError('');
    } catch (err) {
      setError('Failed to save product');
      console.error('Save product error:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category._id,
      stock: product.stock,
      image: product.images && product.images.length > 0 ? product.images[0] : product.image || '',
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await productService.deleteProduct(id);
        await fetchProducts();
      } catch (err) {
        const message = err.response?.data?.message || err.message || 'Failed to delete product';
        setError(message);
        console.error('Delete product error:', err.response?.data || err);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      image: '',
    });
    setImageFile(null);
    setImagePreview(null);
  };

  if (!user || (user.role && user.role.name !== 'admin')) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-red-500">Từ chối truy cập</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin - Quản lý sản phẩm</h1>

      {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}

      <div className="bg-white p-6 rounded shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4 text-black">{editingId ? 'Chỉnh sửa sản phẩm' : 'Tạo sản phẩm'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Tên sản phẩm"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
          <textarea
            name="description"
            placeholder="Mô tả"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded p-2"
          />
          <input
            type="number"
            name="price"
            placeholder="Giá"
            value={formData.price}
            onChange={handleInputChange}
            step="0.01"
            required
            className="w-full border border-gray-300 rounded p-2"
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          >
            <option value="">Chọn thể loại</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="stock"
            placeholder="Số lượng tồn kho"
            value={formData.stock}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
          <div>
            <label className="block text-sm font-medium mb-2">Hình ảnh sản phẩm</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded p-2"
            />
            {imagePreview && (
              <div className="mt-3">
                <img src={imagePreview} alt="Preview" className="max-w-xs h-auto rounded" />
              </div>
            )}
            {!imagePreview && formData.image && (
              <div className="mt-3">
                <img src={formData.image.startsWith('/') ? `http://localhost:5000${formData.image}` : formData.image} alt="Current" className="max-w-xs h-auto rounded" />
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {editingId ? 'Update' : 'Tạo'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Huỷ
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded shadow-md overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Tên</th>
              <th className="p-3 text-left">Thể loại</th>
              <th className="p-3 text-left">Giá</th>
              <th className="p-3 text-left">Số lượng</th>
              <th className="p-3 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-3 text-center">
                  Đang tải...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-3 text-center">
                  Không tìm thấy sản phẩm
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="border-t hover:bg-gray-100">
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.category.name}</td>
                  <td className="p-3">${product.price}</td>
                  <td className="p-3">{product.stock}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
