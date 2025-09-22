import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();

  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.footer
      className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white"
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-red-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                {t("appName")}
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Connecting migrants with healthcare services and providing doctors with tools to serve better.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              {['About Us', 'Services', 'Privacy Policy', 'Terms of Service'].map((link, index) => (
                <motion.li key={index} whileHover={{ x: 5 }}>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                    {link}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Services</h3>
            <ul className="space-y-2">
              {['Health Records', 'Doctor Consultations', 'Appointment Booking', 'Emergency Care'].map((service, index) => (
                <motion.li key={index} whileHover={{ x: 5 }}>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                    {service}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300 text-sm">support@arogyasaathi.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300 text-sm">+91 1800-123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300 text-sm">New Delhi, India</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          variants={itemVariants}
          className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-400 text-sm">
            © 2025 ArogyaSaathi. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2 md:mt-0">
            Made with <Heart className="h-4 w-4 text-red-500 inline mx-1" /> for better healthcare
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}