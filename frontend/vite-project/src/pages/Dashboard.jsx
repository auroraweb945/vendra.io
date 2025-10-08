import { useEffect, useState } from 'react';
import axios from 'axios';
 
import useAuthGuard from '../hooks/useAuthGuard';
import useSubscriptionGuard from '../hooks/useSubscriptionGuard';
import '../styles/dashboard.css';
import Sidebar from "../components/Sidebar";

 

const Dashboard = () => {
  const { checking: authChecking, user } = useAuthGuard();
  const { loading: subscriptionLoading } = useSubscriptionGuard();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:5000/api/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setStats(res.data))
      .catch(err => setError('Failed to fetch dashboard stats'));
  }, []);

  if (authChecking) return <p>Checking authentication...</p>;
  if (subscriptionLoading) return <p>Checking subscription...</p>;
  if (error) return <p>{error}</p>;
  if (!stats) return <p>Loading dashboard...</p>;

  

  return (
    <div className="page-with-sidebar">
      <Sidebar />
      <div className="page-content">
        <div className="dashboard-container">
          <h2>📊 Dashboard</h2>

          <div className="dashboard-cards">
            <div className="card">🛒 Sales: {stats.salesCount}</div>
            <div className="card">📦 Products: {stats.productCount}</div>
            <div className="card">⚠️ Low Stock: {stats.lowStock.length}</div>
          </div>

          <div className="revenue-box">
            <h3>Revenue (Last 7 Days)</h3>
            <table className="revenue-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Revenue ($)</th>
                </tr>
              </thead>
              <tbody>
                {stats.revenueChart.map((entry, idx) => (
                  <tr key={idx}>
                    <td>{new Date(entry.date).toLocaleDateString()}</td>
                    <td>${entry.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="low-stock-box">
            <h3>Low Stock Products</h3>
            {stats.lowStock.length === 0 ? (
              <p>All products are in good stock.</p>
            ) : (
              <ul>
                {stats.lowStock.map(p => (
                  <li key={p.id}>
                    <span className="product-name">{p.name}</span>
                    <span
                      className={`stock-badge ${
                        p.stock === 0 ? 'stock-out' : 'stock-low'
                      }`}
                    >
                      {p.stock === 0 ? 'Out of Stock' : `${p.stock} left`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="recent-orders-box">
            <h3>Recent Orders</h3>
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map(order => (
                  <tr key={order.id}>
                    <td>{order.customer_name}</td>
                    <td>{order.phone}</td>
                    <td>${order.total_price}</td>
                    <td>
                      <span
                        className={`status-badge status-${order.status}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
