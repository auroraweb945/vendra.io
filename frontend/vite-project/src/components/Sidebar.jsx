// src/components/Sidebar.jsx 
import { Link, useNavigate } from "react-router-dom"; 
import { useEffect, useState } from "react"; 
import axios from "axios"; 
import "../styles/sidebar.css"; 
 
const Sidebar = () => { 
  const navigate = useNavigate(); 
  const [store, setStore] = useState(null); 
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const token = localStorage.getItem("token"); 

  useEffect(() => { 
    const fetchStore = async () => { 
      try { 
        const res = await axios.get("https://vendra-io.onrender.com/api/store", { 
          headers: { Authorization: `Bearer ${token}` }, 
        }); 
        setStore(res.data); // store contains slug, name, etc. 
      } catch (err) { 
        console.log("No store found for this user."); 
      } 
    }; 
    fetchStore(); 
  }, [token]); 

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => { 
    localStorage.removeItem("token"); 
    navigate("/login"); 
  }; 

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return ( 
    <>
      {isMobile && (
        <div className="mobile-top-bar">
          <div className="logo">Vendra</div>
          <div className="mobile-nav">
            <Link to="/dashboard">📊</Link>
            <Link to="/products">📦</Link>
            <Link to="/orders">🛒</Link>
            <Link to="/settings">⚙️</Link>
          </div>
        </div>
      )}
      
      <button 
        className={`hamburger-menu ${sidebarOpen ? 'active' : ''}`}
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <span></span>
      </button>
      
      <div className={`sidebar ${sidebarOpen ? 'active' : ''}`}>
        <h2 className="sidebar-logo">Vendra</h2> 
        <nav className="sidebar-nav"> 
          <Link to="/dashboard" onClick={() => setSidebarOpen(false)}>
            📊 <span>Dashboard</span>
          </Link> 
          <Link to="/products" onClick={() => setSidebarOpen(false)}>
            📦 <span>Products</span>
          </Link> 
          <Link to="/orders" onClick={() => setSidebarOpen(false)}>
            🛒 <span>Orders</span>
          </Link> 
          <Link to="/settings" onClick={() => setSidebarOpen(false)}>
            ⚙️ <span>Settings</span>
          </Link> 
 
          {/* Show only if store exists */} 
          {store?.slug && ( 
            <div className="storefront-links"> 
              <a 
                href={`/store/${store.slug}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => setSidebarOpen(false)}
              > 
                🌐 <span>View Storefront</span>
              </a> 
              <button 
                className="copy-link-btn" 
                onClick={() => { 
                  const url = `${window.location.origin}/store/${store.slug}`; 
                  navigator.clipboard.writeText(url); 
                  alert("✅ Storefront link copied to clipboard!"); 
                  setSidebarOpen(false);
                }} 
              > 
                📋 <span>Copy Your Store Link</span>
              </button> 
            </div> 
          )} 
        </nav> 
        <div className="sidebar-footer"> 
          <button onClick={handleLogout}>
            🚪 <span>Logout</span>
          </button> 
        </div> 
      </div> 
    </>
  );
};

export default Sidebar;