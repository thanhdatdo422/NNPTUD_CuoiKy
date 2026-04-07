import { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div>
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded mb-4">
              <h3 className="text-xl font-semibold">Order ID: {order._id}</h3>
              <p>Total Amount: ${order.totalAmount}</p>
              <p>Status: {order.status}</p>
              <p>Shipping Address: {order.shippingAddress}</p>
              <p>Payment Method: {order.paymentMethod}</p>
              <h4 className="text-lg font-semibold mt-2">Items:</h4>
              <ul>
                {order.items.map((item) => (
                  <li key={item._id} className="flex gap-4 mb-2">
                    {item.product && item.product.image && (
                      <img
                        src={item.product.image.startsWith('/') ? `http://localhost:5000${item.product.image}` : item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div>
                      <p><strong>{item.product ? item.product.name : 'Unknown Product'}</strong></p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ${item.price}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;