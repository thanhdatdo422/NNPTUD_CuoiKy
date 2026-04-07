import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Cart from './pages/Cart';
import AdminProducts from './pages/AdminProducts';
import AdminCategories from './pages/AdminCategories';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/order-success" element={<OrderSuccess />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
