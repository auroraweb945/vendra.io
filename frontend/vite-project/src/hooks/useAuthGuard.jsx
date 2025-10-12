import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const PUBLIC_ROUTES = [
  "/login",
  "/signup",
  "/store",
  "/store/:slug",
  "/order-confirmation",
  "/subscription-plans",
  "/subscribe-required",
  "/subscription-expired"
];

export default function useAuthGuard() {
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Skip auth check for public pages
    if (PUBLIC_ROUTES.some((route) => location.pathname.startsWith(route))) {
      setChecking(false);
      return;
    }

    if (!token) {
      // Not logged in → redirect to login
      navigate("/login");
      return;
    }

    // Validate token and get user info
    const validateAuth = async () => {
      try {
        const res = await axios.get("https://vendra-io.onrender.com/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setUser(res.data);
        setChecking(false);
      } catch (err) {
        console.error("Authentication failed:", err);
        // Token is invalid or expired
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    validateAuth();
  }, [location.pathname, navigate]);

  return { checking, user };
}
