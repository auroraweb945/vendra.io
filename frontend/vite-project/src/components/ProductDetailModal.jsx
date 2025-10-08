// src/components/ProductDetailModal.jsx
import React from "react";
import "../styles/modal.css";

const ProductDetailModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Product Details</h3>
        <img
          src={product.image_url || "https://via.placeholder.com/100"}
          alt={product.name}
          style={{ width: "120px", marginBottom: "10px", borderRadius: "8px" }}
        />

        <p><strong>Name:</strong> {product.name}</p>
        <p><strong>Price:</strong> ${Number(product.price).toFixed(2)}</p>
        <p><strong>Stock:</strong> {product.stock}</p>
        <p><strong>Description:</strong> {product.description || "—"}</p>

        <div>
          <strong>Sizes:</strong>{" "}
          {product.available_sizes?.length > 0 ? (
            product.available_sizes.map((size, idx) => (
              <span key={idx} className="size-badge">{size}</span>
            ))
          ) : (
            <span className="muted">—</span>
          )}
        </div>

        <div style={{ marginTop: "10px" }}>
          <strong>Colors:</strong>{" "}
          {product.available_colors?.length > 0 ? (
            product.available_colors.map((color, idx) => (
              <span
                key={idx}
                className="color-circle"
                title={color}
                style={{
                  display: "inline-block",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  background: color,
                  margin: "0 4px",
                  border: "1px solid #ccc"
                }}
              ></span>
            ))
          ) : (
            <span className="muted">—</span>
          )}
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
