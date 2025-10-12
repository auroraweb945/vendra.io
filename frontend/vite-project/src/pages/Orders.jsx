import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OrderDetailModal from '../components/OrderDetailModal';
import useAuthGuard from '../hooks/useAuthGuard';
import useSubscriptionGuard from '../hooks/useSubscriptionGuard';
import '../styles/orders.css';
import Sidebar from "../components/Sidebar";

const Orders = () => {
  const { checking: authChecking, user } = useAuthGuard();
  const { loading: subscriptionLoading } = useSubscriptionGuard();
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({ customer_name: '', customer_phone: '', status: '' });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    axios
      .get('https://vendra-io.onrender.com/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      })
      .then(res => {
        setOrders(res.data.orders);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = (id, status) => {
    const token = localStorage.getItem('token');
    axios
      .put(`https://vendra-io.onrender.com/api/orders/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => fetchOrders());
  };

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  if (authChecking) return <p>Checking authentication...</p>;
  if (subscriptionLoading) return <p>Checking subscription...</p>;

  return (
    <div className="page-with-sidebar">
      <Sidebar />
      <div className="page-content">
        <div className="orders-container">
          <h2>📦 Orders</h2>

          <form className="filters" onSubmit={handleFilterSubmit}>
            <input name="customer_name" placeholder="Customer Name" onChange={handleFilterChange} />
            <input name="customer_phone" placeholder="Phone" onChange={handleFilterChange} />
            <select name="status" onChange={handleFilterChange}>
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
            <button type="submit">Filter</button>
          </form>

          {loading ? (
            <p>Loading orders...</p>
          ) : (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Total ($)</th>
                  <th>Date</th>
                  <th>Update</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.customer_name}</td>
                    <td>{order.phone}</td>
                    <td>{order.customer_email}</td>
                    <td>{order.location}</td>
                    <td>
                      <span className={`status-badge status-${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{order.total_price}</td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>
                      <select
                        defaultValue={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={() => {
                        const token = localStorage.getItem('token');
                        axios
                          .get(`https://vendra-io.onrender.com/api/orders/${order.id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                          })
                          .then(res => setSelectedOrder(res.data.order));
                      }}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {selectedOrder && (
            <OrderDetailModal
              order={selectedOrder}
              onClose={() => setSelectedOrder(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
