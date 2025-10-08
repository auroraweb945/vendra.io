import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Product from './pages/Product';
import Settings from './pages/Settings';
import CreateStore from './pages/CreateStore';
import SubscribeRequired from './pages/SubscribeRequired';
import Storefront from './pages/Storefront';
import BrowseProducts from './pages/BrowseProducts';
import CustomerOrderConfirmation from './pages/CustomerOrderConfirmation';
import SubscriptionPlans from './pages/SubscriptionPlans';
import SubscriptionExpired from './pages/SubscriptionExpired';
import SubscribeFailed from './pages/SubscribeFailed';







function App() {
  return (
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/products" element={<Product />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/create-store" element={<CreateStore />} />
          <Route path="/subscribe-required" element={<SubscribeRequired />} />
          <Route path="/subscription-plans" element={<SubscriptionPlans />} />
          <Route path="/subscription-expired" element={<SubscriptionExpired />} />
          <Route path="/subscribe-failed" element={<SubscribeFailed />} />
          <Route path="/store/:slug" element={<Storefront />} />
          <Route path="/store/:slug/products" element={<BrowseProducts />} />
          <Route path="/order-confirmation" element={<CustomerOrderConfirmation />} />






          {/* Dashboard and others will come next */}
        </Routes>
      </Router>
  );
}

export default App;
