import { Link } from 'react-router-dom';
import { authService } from '../services/authService';

const Header = () => {
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    window.location.reload();
  };

  const isAdmin = user && user.role && user.role.name === 'admin';

  return (
    <header className="bg-blue-600 text-white p-4 w-full">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/" className="text-xl font-bold flex-shrink-0">
          CuaHang36
        </Link>
        <nav className="flex flex-wrap items-center justify-end space-x-4">
          <Link to="/" className="hover:underline">
            Trang chủ
          </Link>
          <Link to="/products" className="hover:underline">
            Sản phẩm
          </Link>
          <Link to="/cart" className="hover:underline">
            Giỏ hàng
          </Link>
          {user && (
            <Link to="/orders" className="hover:underline">
              Đơn hàng của tôi
            </Link>
          )}
          {isAdmin && (
            <>
              <Link to="/admin/products" className="hover:underline">
                Quản lý Sản phẩm
              </Link>
              <Link to="/admin/categories" className="hover:underline">
                Quản lý Danh mục
              </Link>
            </>
          )}
          {user ? (
            <div className="flex items-center space-x-4 ml-4">
              <span className="font-medium text-blue-100">Chào mừng, {user.username}</span>
              <button onClick={handleLogout} className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800 transition">
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="hover:underline">
                Đăng nhập
              </Link>
              <Link to="/register" className="hover:underline border-l pl-4">
                Đăng ký
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;