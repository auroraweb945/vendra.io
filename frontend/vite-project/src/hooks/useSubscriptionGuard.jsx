import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const PUBLIC_ROUTES = ["/login", "/signup", "/store", "/store/:slug", "/order-confirmation", "/create-store"];

export default function useSubscriptionGuard() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // no token → handled by auth guard elsewhere

    // Skip guard on public pages
    if (PUBLIC_ROUTES.some((route) => location.pathname.startsWith(route))) {
      setLoading(false);
      return;
    }

    const checkSubscription = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/subscribe/status", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { status } = res.data;

        if (status === "inactive") {
          navigate("/subscribe-required");
        } else if (status === "expired") {
          navigate("/subscription-expired");
        }
      } catch (err) {
        console.error("Failed to check subscription:", err);
        navigate("/subscribe-required");
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [location.pathname, navigate]);

  return { loading };
}
