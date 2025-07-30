import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import '../styles/modern-components.css';
import '../styles/glassmorphism.css';
import '../styles/footer.css';

const Footer = () => (
  <footer className="modern-footer glass-footer">
    <div className="footer-main">
      <div className="footer-brand">
        <div className="footer-title">© 2025 VeritasBot · Powered by Knowledge. Guided by Truth.</div>
        <div className="footer-made">Made by <span className="footer-name">MD Faizan</span></div>
      </div>
      <div className="footer-contact">
        <span>Contact:</span>
        <a href="https://github.com/Faiz-3112?tab=repositories" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <FaGithub size={22} />
        </a>
        <a href="https://www.linkedin.com/in/md-faizan-81113031b/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <FaLinkedin size={22} />
        </a>
        <a href="mailto:dream.md.1256@gmail.com" aria-label="Gmail">
          <FaEnvelope size={22} />
        </a>
        
      </div>
    </div>
  </footer>
);

export default Footer;
