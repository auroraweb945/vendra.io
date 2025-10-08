// src/components/AuthFormWrapper.jsx
import '../styles/auth.css';

const AuthFormWrapper = ({ title, children }) => {
  return (
    <div className="auth-wrapper">
      <h2>{title}</h2>
      {children}
    </div>
  );
};

export default AuthFormWrapper;
