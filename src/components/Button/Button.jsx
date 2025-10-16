// src/components/Button/Button.jsx
import React from "react";
import "./Button.scss";

const Button = ({ children, variant = "primary", className = "", ...props }) => {
  return (
    <button className={`btn btn-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
