import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/OrderConfirmation.css';

const CustomerOrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const { orderId, items = [], total = 0, storeName = '', storeSlug } = state;

  return (
    <div className="order-confirmation">
      {/* Success Icon */}
      <div className="success-icon">✅</div>

      <h1>Thank you for your order!</h1>
      {storeName && <h2>{storeName}</h2>}
      {orderId && <p>Order ID: <strong>{orderId}</strong></p>}

      {/* Order Details */}
      <div className="order-details">
        <h2>Order Summary</h2>
        {items.length === 0 ? (
          <p>No items to display.</p>
        ) : (
          <ul className="order-items">
            {items.map((item, index) => {
              const selSize = item.selected_size || item.size || null;
              const selColor = item.selected_color || item.color || null;
              return (
                <li key={index} className="order-item">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="order-item-image"
                    />
                  )}
                  <div>
                    <strong>{item.name}</strong>
                    <p>Qty: {item.quantity}</p>
                    <p>Price: ${(Number(item.price) * Number(item.quantity)).toFixed(2)}</p>

                    {/* Show size if selected */}
                    {selSize && (
                      <p>
                        <strong>Size:</strong> {selSize}
                      </p>
                    )}

                    {/* Show color if selected */}
                    {selColor && (
                      <div className="order-color">
                        <strong>Color:</strong>{' '}
                        <span
                          className="order-color-circle"
                          style={{ background: selColor }}
                          title={selColor}
                        ></span>
                        <span className="order-color-label">{selColor}</span>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <h3 className="total">Total: ${Number(total).toFixed(2)}</h3>
      </div>

      {/* CTA */}
      <button
        onClick={() =>
          navigate(storeSlug ? `/store/${storeSlug}/products` : -1)
        }
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default CustomerOrderConfirmation;
