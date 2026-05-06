import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-[#50312F] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <i className="fas fa-phone text-[#FF6B35]"></i>
                <div>
                  <p className="text-gray-300">Phone</p>
                  <a href="tel:+919876543210" className="text-white hover:text-[#FF6B35] transition">
                    +91 98765 43210
                  </a>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <i className="fas fa-envelope text-[#FF6B35]"></i>
                <div>
                  <p className="text-gray-300">Email</p>
                  <a href="mailto:info@nainaland.com" className="text-white hover:text-[#FF6B35] transition">
                    info@nainaland.com
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <i className="fas fa-map-marker-alt text-[#FF6B35] mt-1"></i>
                <div>
                  <p className="text-gray-300">Address</p>
                  <p className="text-white">
                    123 Real Estate Avenue<br />
                    Bangalore, Karnataka 560001<br />
                    India
                  </p>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <i className="fas fa-clock text-[#FF6B35]"></i>
                <div>
                  <p className="text-gray-300">Business Hours</p>
                  <p className="text-white">
                    Monday - Saturday: 9:00 AM - 6:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6">Connect With Us</h3>
            <p className="text-gray-300 mb-6">
              Follow us on social media for the latest updates on new properties and real estate insights.
            </p>
            <div className="flex space-x-4 mb-8">
              <a href="#" className="w-10 h-10 rounded-full bg-[#3C2523] flex items-center justify-center text-white hover:bg-[#FF6B35] transition">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#3C2523] flex items-center justify-center text-white hover:bg-[#FF6B35] transition">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#3C2523] flex items-center justify-center text-white hover:bg-[#FF6B35] transition">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#3C2523] flex items-center justify-center text-white hover:bg-[#FF6B35] transition">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <div className="space-y-2">
              <p className="text-gray-300">Download Our App</p>
              <div className="flex space-x-4">
                <a href="#" className="hover:opacity-80 transition">
                  <img src="/app-store.png" alt="Download on App Store" className="h-10" />
                </a>
                <a href="#" className="hover:opacity-80 transition">
                  <img src="/play-store.png" alt="Get it on Google Play" className="h-10" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-[#3C2523] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Nainaland Deals. All rights reserved.
            </p>
            <div className="flex space-x-4 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
              <a href="#" className="hover:text-white transition">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
