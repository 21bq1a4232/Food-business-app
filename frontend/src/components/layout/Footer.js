import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="font-bold text-2xl">Svadishta Flavours</span>
            </div>
            <p className="text-gray-400">
              Bringing authentic Indian flavours to your table with love and tradition.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <div className="space-y-2.5 text-gray-400">
              <Link to="/menu" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                Menu
              </Link>
              <Link to="/about" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                About
              </Link>
              <Link to="/contact" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
            <div className="space-y-2 text-gray-400">
              <a href="tel:+917893491514" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="h-4 w-4 text-blue-500" />
                <span>+91 78934 91514</span>
              </a>
              <a href="https://wa.me/917893491514" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" className="h-4 w-4">
                  <path fill="#25D366" d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                </svg>
                <span>WhatsApp</span>
              </a>
              <a href="mailto:svadishtaflavours@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <img src={require('../../assets/mail.png')} alt="Email Icon" className="h-5 w-5 rounded-full object-cover" />
                <span>svadishtaflavours@gmail.com</span>
              </a>
              <a href="https://www.instagram.com/svadishta_flavours/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                <img src={require('../../assets/instagram.png')} alt="Instagram Icon" className="h-5 w-5 rounded-full object-cover" />
                <span>@svadishta_flavours</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Delivery Hours</h3>
            <div className="space-y-2 text-gray-400">
              <div>Mon-Sun: 9:00 AM - 06:00 PM</div>
            </div>
            <h3 className="font-semibold text-lg mb-4 mt-6">Location</h3>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-500" />
                <span>Nizampet, Hyderabad, Telangana</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Svadishta Flavours. Made with ❤️ for food lovers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
