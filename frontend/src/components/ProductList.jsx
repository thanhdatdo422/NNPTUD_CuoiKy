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

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded">
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p>{product.description}</p>
            <p className="text-lg font-bold">${product.price}</p>
            <button
              onClick={() => handleAddToCart(product._id)}
              className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
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