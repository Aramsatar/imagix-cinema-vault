
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-cinema-navy border-t border-border pt-12 pb-6">
      <div className="cinema-container">
        {/* Upper footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-cinema-white">CIHAN</span>
              <span className="text-sm text-cinema-red uppercase tracking-wider">Cinema</span>
            </div>
            <p className="text-cinema-gray max-w-md mb-6">
              Experience movies like never before with CIHAN Cinema's state-of-the-art technology and premium seating for the ultimate cinematic experience.
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="text-cinema-white font-medium mb-4">Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-cinema-gray hover:text-cinema-red transition-colors">Home</Link></li>
              <li><Link to="/movies" className="text-cinema-gray hover:text-cinema-red transition-colors">Movies</Link></li>
              <li><Link to="/news" className="text-cinema-gray hover:text-cinema-red transition-colors">News</Link></li>
              <li><Link to="/about" className="text-cinema-gray hover:text-cinema-red transition-colors">About Us</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-cinema-white font-medium mb-4">Contact</h4>
            <ul className="space-y-2 text-cinema-gray">
              <li>Jihan University Erbil</li>
              <li>contact@cihancinema.com</li>
              <li>+9647518163369</li>
            </ul>
          </div>
        </div>
        
        {/* Bottom footer */}
        <div className="pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cinema-gray text-sm">© 2025 CIHAN Cinema. All rights reserved.</p>
          <div className="flex space-x-4">
            <Link to="/terms" className="text-cinema-gray hover:text-cinema-red text-sm transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="text-cinema-gray hover:text-cinema-red text-sm transition-colors">Privacy Policy</Link>
            <Link to="/faq" className="text-cinema-gray hover:text-cinema-red text-sm transition-colors">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
