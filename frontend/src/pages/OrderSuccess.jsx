import { useLocation } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return <div>No order information available.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Order Placed Successfully!</h2>
      <div className="border p-4 rounded">
        <h3 className="text-xl font-semibold mb-2">Order Details</h3>
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
        <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <h4 className="text-lg font-semibold mt-4 mb-2">Items:</h4>
        <ul>
          {order.items && order.items.map((item) => (
            <li key={item._id} className="mb-2">
              <div className="flex gap-4">
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
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderSuccess;