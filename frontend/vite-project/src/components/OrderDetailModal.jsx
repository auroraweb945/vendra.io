import React from 'react';
import '../styles/orderDetailModal.css';

const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Order Details</h2>
        

        <div className="info-section">
          <p>
            <strong>Customer:</strong> {order.customer_name}
          </p>
          <p>
            <strong>Email:</strong> {order.customer_email}
          </p>
          <p>
            <strong>Phone:</strong> {order.phone}
          </p>
          <p>
            <strong>Location:</strong> {order.location}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Payment:</strong>{' '}
            {order.payment_method.replace(/_/g, ' ')}
          </p>
          <p>
            <strong>Date:</strong>{' '}
            {new Date(order.created_at).toLocaleString()}
          </p>
          <p>
            <strong>Total Price:</strong> ${order.total_price}
          </p>
        </div>

        <div className="items-section">
          <h3>Items</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Size</th>
                <th>Color</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.product_id}>
                  <td>{item.product_name}</td>
                  <td>{item.selected_size || '-'}</td>
                  <td>
                    {item.selected_color ? (
                      <div className="order-color-cell">
                        <span
                          className="order-color-circle"
                          style={{ background: item.selected_color }}
                          title={item.selected_color}
                        ></span>
                        <span>{item.selected_color}</span>
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>{item.quantity}</td>
                  <td>${item.price}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default OrderDetailModal;
