import React from 'react';
import '../styles/CartModal.css';

const CartModal = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  totalPrice,
  customer,
  setCustomer,
  onPlaceOrder,
  orderLoading,
  message
}) => {
  if (!isOpen) return null;

  return (
    <div className="cart-modal-overlay">
      <div className="cart-modal">
        <div className="cart-content">
        <button className="close-btn" onClick={onClose}>Close</button>
        <h2>Your Cart</h2>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul className="cart-list">
              {cartItems.map((item, index) => {
                const selSize = item.selected_size || item.size || null;
                const selColor = item.selected_color || item.color || null;
                return (
                  <li key={index} className="cart-item">
                    <img src={item.image_url} alt={item.name} />
                    <div>
                      <h4>{item.name}</h4>
                      <p>Price: ${Number(item.price).toFixed(2)}</p>

                      {/* Show size if selected */}
                      {selSize && (
                        <p><strong>Size:</strong> {selSize}</p>
                      )}

                      {/* Show color if selected */}
                      {selColor && (
                        <div className="cart-color">
                          <strong>Color:</strong>
                          <span
                            className="cart-color-circle"
                            style={{ background: selColor }}
                            title={selColor}
                          ></span>
                          <span className="cart-color-label">{selColor}</span>
                        </div>
                      )}

                      <label>
                        Qty:
                        <input
                          type="number"
                          value={item.quantity}
                          min="1"
                          onChange={(e) => 
                             onUpdateQuantity( 
                               item.id, 
                               selSize, 
                               selColor,
                               parseInt(e.target.value) || 1 // qty
                             ) 
                           }
                        />
                      </label>
                      <button
                        onClick={() => onRemoveItem(item.id, selSize, selColor)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <h3>Total: ${totalPrice.toFixed(2)}</h3>

            <div className="customer-form">
              <h3>Customer Info</h3>
              <input
                placeholder="Name"
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              />
              <input
                placeholder="Email"
                value={customer.email}
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
              />
              <input
                placeholder="Phone"
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
              />
              <input
                placeholder="Location"
                value={customer.location}
                onChange={(e) => setCustomer({ ...customer, location: e.target.value })}
              />

              <button
                className="checkout-btn"
                onClick={onPlaceOrder}
                disabled={orderLoading}
              >
                {orderLoading ? 'Placing Order...' : 'Place Order (Cash on Delivery)'}
              </button>
              {message && <p className="message">{message}</p>}
            </div>
          </>
        )}
        </div>

      </div>
    </div>
  );
};

export default CartModal;
