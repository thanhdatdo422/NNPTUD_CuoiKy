import { useState, useEffect } from 'react';
import { cartService } from '../services/cartService';

const Cart = () => {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await cartService.getCart();
        setCart(data);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (itemId, quantity) => {
    try {
      await cartService.updateCartItem(itemId, quantity);
      // Refresh cart
      const data = await cartService.getCart();
      setCart(data);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await cartService.removeFromCart(itemId);
      // Refresh cart
      const data = await cartService.getCart();
      setCart(data);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (!cart) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Cart</h2>
      {cart.items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cart.items.map((item) => (
            <div key={item._id} className="border p-4 rounded mb-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl">{item.product.name}</h3>
                <p>${item.product.price}</p>
              </div>
              <div className="flex items-center">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleUpdateQuantity(item._id, e.target.value)}
                  className="w-16 p-2 border rounded mr-2"
                  min="1"
                />
                <button
                  onClick={() => handleRemoveItem(item._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="text-right">
            <button className="bg-green-600 text-white px-4 py-2 rounded">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;