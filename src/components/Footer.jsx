import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin 
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral text-neutral-content">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Column 1 - Logo & Description */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl text-red-500">🩸</div>
              <h3 className="text-2xl font-black text-red-500">BloodCare</h3>
            </div>
            <p className="text-neutral-content/80 mb-6">
              Connecting blood donors with those in need. 
              Together we can save more lives.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                 className="text-neutral-content/70 hover:text-red-500 transition-colors">
                <Facebook size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                 className="text-neutral-content/70 hover:text-red-500 transition-colors">
                <Twitter size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                 className="text-neutral-content/70 hover:text-red-500 transition-colors">
                <Instagram size={24} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                 className="text-neutral-content/70 hover:text-red-500 transition-colors">
                <Linkedin size={24} />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-neutral-content/70 hover:text-red-500 transition-colors">Home</Link></li>
              <li><Link to="/donation-requests" className="text-neutral-content/70 hover:text-red-500 transition-colors">Donation Requests</Link></li>
              <li><Link to="/about" className="text-neutral-content/70 hover:text-red-500 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-neutral-content/70 hover:text-red-500 transition-colors">Contact</Link></li>
              <li><Link to="/funding" className="text-neutral-content/70 hover:text-red-500 transition-colors">Support Us</Link></li>
            </ul>
          </div>

          {/* Column 3 - For Donors */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">For Donors</h4>
            <ul className="space-y-3">
              <li><Link to="/register" className="text-neutral-content/70 hover:text-red-500 transition-colors">Become a Donor</Link></li>
              <li><Link to="/dashboard" className="text-neutral-content/70 hover:text-red-500 transition-colors">Donor Dashboard</Link></li>
              <li><Link to="/my-profile" className="text-neutral-content/70 hover:text-red-500 transition-colors">My Profile</Link></li>
              <li><a href="#" className="text-neutral-content/70 hover:text-red-500 transition-colors">Donation Guidelines</a></li>
            </ul>
          </div>

          {/* Column 4 - Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-red-500 mt-1 flex-shrink-0" />
                <span className="text-neutral-content/80">
                  Dhaka, Bangladesh<br />
                  (Service available nationwide)
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-red-500" />
                <span className="text-neutral-content/80">+880 1711-XXXXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-red-500" />
                <a href="mailto:support@bloodcare-bd.org" 
                   className="text-neutral-content/80 hover:text-red-500 transition-colors">
                  support@bloodcare-bd.org
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-content/20 mt-12 pt-8 text-center text-sm text-neutral-content/60">
          <p>© {currentYear} BloodCare. All rights reserved.</p>
          <div className="mt-3 flex flex-wrap justify-center gap-6">
            <Link to="/privacy" className="hover:text-red-500 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-red-500 transition-colors">Terms of Service</Link>
            <Link to="/faq" className="hover:text-red-500 transition-colors">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;