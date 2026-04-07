import { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';
import { authService } from '../services/authService';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const user = authService.getCurrentUser();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getCategories();
      setCategories(data || []);
    } catch (err) {
      setError('Lỗi khi tải danh mục');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingId) {
        await categoryService.updateCategory(editingId, formData);
        setEditingId(null);
      } else {
        await categoryService.createCategory(formData);
      }

      setFormData({
        name: '',
        description: '',
      });

      await fetchCategories();
      setError('');
    } catch (err) {
      setError('Không thể lưu danh mục');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setFormData({
      name: category.name,
      description: category.description,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa không?')) {
      try {
        await categoryService.deleteCategory(id);
        await fetchCategories();
      } catch (err) {
        setError('Lỗi khi xóa danh mục');
        console.error(err);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
    });
  };

  if (!user || (user.role && user.role.name !== 'admin')) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-red-500 font-bold">Truy cập bị từ chối</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-extrabold mb-6">Admin - Quản lý Danh mục</h1>

      {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}

      <div className="bg-white p-6 rounded shadow-md mb-6">
        <h2 className="text-xl font-extrabold mb-4 text-black">
          {editingId ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Tên danh mục"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded p-2 text-black"
          />
          <textarea
            name="description"
            placeholder="Mô tả danh mục"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded p-2 text-black"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 font-bold"
            >
              {editingId ? 'Cập nhật' : 'Tạo mới'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 font-bold"
              >
                Hủy bỏ
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded shadow-md overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left font-bold text-black">Tên danh mục</th>
              <th className="p-3 text-left font-bold text-black">Mô tả</th>
              <th className="p-3 text-left font-bold text-black">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-black">
            {loading ? (
              <tr>
                <td colSpan="3" className="p-3 text-center">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-3 text-center">
                  Không tìm thấy danh mục nào
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category._id} className="border-t hover:bg-gray-100">
                  <td className="p-3 font-medium">{category.name}</td>
                  <td className="p-3 text-gray-700">{category.description}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 font-bold"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 font-bold"
                    >
                      Xóa
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

export default AdminCategories;