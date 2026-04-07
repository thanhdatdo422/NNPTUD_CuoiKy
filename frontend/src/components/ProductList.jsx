import { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { cartService } from '../services/cartService';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      await cartService.addToCart(productId, 1);
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://placehold.co/400x300?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    
    // Đảm bảo luôn có dấu '/' ở đầu trước khi nối với localhost
    const formattedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `http://localhost:5000${formattedPath}`;
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded overflow-hidden">
            {product.image && (
              <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="w-full h-48 object-cover mb-3 rounded border border-gray-200"
              onError={(e) => {
                // Đề phòng trường hợp URL đúng nhưng backend mất file
                e.target.src = 'https://placehold.co/400x300?text=Image+Error'; 
              }}
            />
            )}
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{product.description}</p>
            <p className="text-lg font-bold text-blue-600 mb-2">{product.image}</p>
            <p className="text-lg font-bold text-blue-600 mb-2">${product.price}</p>
            <p className="text-sm text-gray-500 mb-3">Stock: {product.stock}</p>
            <button
              onClick={() => handleAddToCart(product._id)}
              className="bg-blue-600 text-white px-4 py-2 rounded mt-2 w-full hover:bg-blue-700"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;