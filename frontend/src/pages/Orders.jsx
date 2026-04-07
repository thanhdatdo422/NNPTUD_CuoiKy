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
      <h2 className="text-2xl font-bold mb-4">Đơn hàng của tôi</h2>
      {orders.length === 0 ? (
        <p>Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div>
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded mb-4">
              <h3 className="text-xl font-semibold">Order ID: {order._id}</h3>
              <p>Tổng tiền: ${order.totalAmount}</p>
              <p>Trạng thái: {order.status}</p>
              <p>Địa chỉ giao hàng: {order.shippingAddress}</p>
              <p>Phương thức thanh toán: {order.paymentMethod}</p>
              <h4 className="text-lg font-semibold mt-2">Sản phẩm:</h4>
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
                      <p>SL: {item.quantity}</p>
                      <p>Giá: ${item.price}</p>
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