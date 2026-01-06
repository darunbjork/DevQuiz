import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer fade-in">
      <p>&copy; {new Date().getFullYear()} Study AI Assistant. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
