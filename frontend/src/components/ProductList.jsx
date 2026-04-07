import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

    const formattedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `http://localhost:5000${formattedPath}`;
  };

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) return product.images[0];
    return product.image || '';
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <Link key={product._id} to={`/product/${product._id}`} className="block">
            <div className="border p-4 rounded overflow-hidden hover:shadow-lg transition-shadow">
              {getProductImage(product) && (
                <img
                  src={getImageUrl(getProductImage(product))}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-3 rounded border border-gray-200"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/400x300?text=Image+Error';
                  }}
                />
              )}
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{product.description}</p>
              <p className="text-lg font-bold text-blue-600 mb-2">${product.price}</p>
              <p className="text-sm text-gray-500 mb-3">Stock: {product.stock}</p>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart(product._id);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded mt-2 w-full hover:bg-blue-700"
              >
                Add to Cart
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductList;