import React from 'react';
import { FaInstagram, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Contact Info */}
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <h2 className="text-xl font-semibold text-yellow-400 mb-2">Contact Me</h2>
          <p className="flex items-center justify-center md:justify-start gap-2">
            <FaPhoneAlt /> <span>+92 349 1844421  </span>
          </p>
          <p className="flex items-center justify-center md:justify-start gap-2">
            <FaEnvelope /> <span>rajahaider7896@gmail.com</span>
          </p>
          <p className="flex items-center justify-center md:justify-start gap-2">
            <FaMapMarkerAlt /> <span>GUJRAT,PAKISTAN</span>
          </p>
        </div>

        {/* Social Links */}
        <div className="text-center md:text-right">
          <h2 className="text-xl font-semibold text-yellow-400 mb-2">Follow Me</h2>
          <div className="flex justify-center md:justify-end gap-4">
            <a
              href="https://instagram.com/hayder_alyy__"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-400 transition"
            >
              <FaInstagram size={28} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="mt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Haider Ali. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
