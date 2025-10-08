import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/BrowseProducts.css';
import CartModal from '../components/CartModal';

const BrowseProducts = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cart state
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Customer info
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    location: '',
    phone: ''
  });

  const [message, setMessage] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);

  // Selected options per product { [productId]: { size: string, color: string } }
  const [selectedOptions, setSelectedOptions] = useState({});

  // Fetch store + products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/storefront/${slug}`);
        setStore(res.data.store);
        setProducts(res.data.products);
      } catch (err) {
        console.error('Error fetching store:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  // (Replaced selects with button-based selectors below)

  // Cart functions
  const addToCart = (product) => {
    const options = selectedOptions[product.id] || {};
    const needsSize = product.available_sizes?.length > 0;
    const needsColor = product.available_colors?.length > 0;

    if ((needsSize && !options.size) || (needsColor && !options.color)) {
      alert("Please select size and color before adding to cart");
      return;
    }

    setCartItems(prev => {
      const existing = prev.find(item =>
        item.id === product.id &&
        item.selected_size === (options.size || null) &&
        item.selected_color === (options.color || null)
      );
      if (existing) {
        return prev.map(item =>
          item.id === product.id &&
          item.selected_size === (options.size || null) &&
          item.selected_color === (options.color || null)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          ...product,
          quantity: 1,
          price: Number(product.price),
          selected_size: options.size || null,
          selected_color: options.color || null
        }
      ];
    });
  };

  const removeFromCart = (id, size, color) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.selected_size === size && item.selected_color === color)));
  };

  const updateQuantity = (id, size, color, qty) => {
    if (qty < 1) return;
    setCartItems(prev =>
      prev.map(item => (item.id === id && item.selected_size === size && item.selected_color === color) ? { ...item, quantity: qty } : item)
    );
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  };

  const clearCart = () => setCartItems([]);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  // Place order
  const handlePlaceOrder = async () => {
    if (!customer.name || !customer.email || !customer.location || !customer.phone) {
      return setMessage('Please fill all customer info fields');
    }
    if (cartItems.length === 0) {
      return setMessage('Cart is empty');
    }

    const items = cartItems.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
      price: Number(item.price),
      selected_size: item.size || null,
      selected_color: item.color || null
    }));

    try {
      setOrderLoading(true);
      setMessage('');

      const payload = {
        store_slug: slug,
        customer_name: customer.name,
        customer_email: customer.email,
        location: customer.location,
        phone: customer.phone,
        payment_method: 'cash_on_delivery',
        items,
        total_price: getTotalPrice()
      };

      const res = await axios.post(`http://localhost:5000/api/orders`, payload);
      const orderId = res.data?.orderId;

      // Redirect to confirmation page with full cart items (includes name/image)
      navigate(`/order-confirmation`, {
        state: {
          orderId,
          items: cartItems,
          total: getTotalPrice(),
          storeName: store?.name || '',
          storeSlug: slug
        }
      });

      clearCart();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to place order');
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!store) return <div>Store not found</div>;

  return (
    <div className="browse-products-container">
      <div className="products-header">
        <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
        <h1 className="store-name">{store.name} – Our Products</h1>
        <button className="view-cart-top-btn" onClick={toggleCart}>
          🛒 View Cart ({cartItems.length})
        </button>
      </div>

      <div className="product-grid">
        {products.map((product) => {
          const selected = selectedOptions[product.id] || {};

          return (
            <div key={product.id} className="product-card">
              <img src={product.image_url} alt={product.name} className="product-image" />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p className="price">${Number(product.price).toFixed(2)}</p>
                {product.stock_alert && <p className="stock-alert">{product.stock_alert}</p>}

                {/* Sizes */}
                {product.available_sizes?.length > 0 && (
                  <div className="options">
                    <p>Select Size:</p>
                    <div className="size-options">
                      {product.available_sizes.map((size, idx) => (
                        <button
                          key={idx}
                          className={`size-btn ${selected.size === size ? "selected" : ""}`}
                          onClick={() =>
                            setSelectedOptions((prev) => ({
                              ...prev,
                              [product.id]: { ...selected, size },
                            }))
                          }
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Colors */}
                {product.available_colors?.length > 0 && (
                  <div className="options">
                    <p>Select Color:</p>
                    <div className="color-options">
                      {product.available_colors.map((color, idx) => (
                        <span
                          key={idx}
                          className={`color-circle ${selected.color === color ? "selected" : ""}`}
                          style={{ background: color }}
                          onClick={() =>
                            setSelectedOptions((prev) => ({
                              ...prev,
                              [product.id]: { ...selected, color },
                            }))
                          }
                          title={color}
                        ></span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  className="add-to-cart-btn"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button className="view-cart-btn" onClick={toggleCart}>
        🛒 View Cart ({cartItems.length})
      </button>

      <CartModal
        isOpen={isCartOpen}
        onClose={toggleCart}
        cartItems={cartItems}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={(id, size, color, qty) => updateQuantity(id, size, color, qty)}
        totalPrice={getTotalPrice()}
        customer={customer}
        setCustomer={setCustomer}
        onPlaceOrder={handlePlaceOrder}
        orderLoading={orderLoading}
        message={message}
      />
    </div>
  );
};

export default BrowseProducts;
