import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-blue-950 text-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <p className="text-3xl mb-2.5 "><strong><i>Pharmaceuticals</i></strong></p>
            <p className="text-sm">
            "Pharmaceuticals" represents purity and quality—offering minimalistic, natural cosmetics with essential ingredients for the finest beauty solutions. We provide quality products.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:text-blue-300 transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-blue-300 transition-colors">Contact Us</a></li>
              <li><a href="/privacyPolicy" className="hover:text-blue-300 transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-blue-300 transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FaPhone className="text-blue-100" />
                <span>+91 84310 10081</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-blue-100" />
                <span>khushboosoni.35@gmail.com </span>
              </div>
              <div className="flex items-center space-x-3">
                {/* <img src="/location.png" alt="Logo" width="18" /> */}
                <FaMapMarkerAlt className="text-blue-100" />
                <span>Thindlu, Vidyaranyapura, Bangalore - 560097</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Newsletter</h4>
            <div className="space-y-4">
              <p className="text-sm">Subscribe to our newsletter for updates and exclusive offers.</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-l-md focus:outline-none text-blue-100 focus:text-blue-200"
                />
                <button className="bg-blue-900 px-4 py-2 rounded-r-md hover:bg-blue-800 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-blue-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a href="#" className="hover:text-blue-300 transition-colors"><FaYoutube size={20} /></a>
              <a href="#" className="hover:text-blue-300 transition-colors"><FaFacebook size={20} /></a>
              <a href="#" className="hover:text-blue-300 transition-colors"><FaTwitter size={20} /></a>
              <a href="#" className="hover:text-blue-300 transition-colors"><FaInstagram size={20} /></a>
              <a href="#" className="hover:text-blue-300 transition-colors"><FaLinkedin size={20} /></a>
            </div>
            <div className="text-sm text-blue-300">
              © {new Date().getFullYear()} Pharmaceuticals. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
