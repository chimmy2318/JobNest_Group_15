import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="footer-links">
        <ul>
          <li><a>About us</a></li>
          <li><a >Terms & Conditions</a></li>
          <li><a >Privacy Policy</a></li>
          <li><a >Contact us</a></li>
        </ul>
      </div>
      <p>&copy; 2025 JobNest. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
