import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import HeroSection from "../components/HeroSection";
import Footer from "../components/Footer";
import DriverTour from "../components/DriverTour";
import { Heart, Shield, Users, Zap, ArrowRight, Play, Star, CheckCircle } from "lucide-react";
import { useInView } from "react-intersection-observer";
import "./Landing.css";

export default function Landing() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [showTour, setShowTour] = useState(false);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleGetStarted = () => {
    setShowTour(true);
  };

  const handleWatchDemo = () => {
    // Implement demo video modal or redirect
    console.log("Watch demo clicked");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <>
      <DriverTour
        isActive={showTour}
        onComplete={() => setShowTour(false)}
        tourType="landing"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        {/* Navigation */}
        <motion.nav
          className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <motion.div 
                className="landing-logo flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <Heart className="h-8 w-8 text-red-500" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  {t("appName")}
                </span>
              </motion.div>
              
              <div className="flex items-center space-x-4">
                <div className="landing-language-selector">
                  <select
                    value={i18n.language}
                    onChange={(e) => changeLanguage(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                  </select>
                </div>
                
                <motion.button
                  onClick={handleGetStarted}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Help
                </motion.button>
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <HeroSection onGetStarted={handleGetStarted} onWatchDemo={handleWatchDemo} />

        {/* User Type Selection */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Choose Your Path
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Select your role to access personalized features and services
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <motion.div
                className="group relative bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-8 border border-emerald-200 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {t("userType.migrant")}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Access healthcare services, manage your medical records, and connect with doctors
                  </p>
                  <motion.button
                    onClick={() => navigate("/migrant/register")}
                    className="landing-btn-secondary w-full px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Get Started</span>
                    <ArrowRight className="h-5 w-5" />
                  </motion.button>
                </div>
              </motion.div>

              <motion.div
                className="group relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {t("userType.doctor")}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Manage patient records, provide consultations, and access advanced medical tools
                  </p>
                  <motion.button
                    onClick={() => navigate("/doctor/login")}
                    className="landing-btn-primary w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Login</span>
                    <ArrowRight className="h-5 w-5" />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section ref={ref} className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose ArogyaSaathi?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Comprehensive healthcare solutions designed for the modern world
              </p>
            </motion.div>

            <div className="landing-features grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Heart,
                  title: t("landing.feature1"),
                  description: "Secure, digital health records accessible from anywhere",
                  color: "text-red-500",
                  bgColor: "bg-red-50"
                },
                {
                  icon: Shield,
                  title: t("landing.feature2"),
                  description: "Connect with qualified healthcare professionals instantly",
                  color: "text-blue-500",
                  bgColor: "bg-blue-50"
                },
                {
                  icon: Users,
                  title: t("landing.feature3"),
                  description: "Easy appointment scheduling and management system",
                  color: "text-emerald-500",
                  bgColor: "bg-emerald-50"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className={`landing-feature ${feature.bgColor} rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <feature.icon className={`landing-feature-icon h-12 w-12 ${feature.color} mx-auto mb-4`} />
                  <h3 className="landing-feature-title text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {[
                { number: "10K+", label: "Migrants Served" },
                { number: "500+", label: "Healthcare Providers" },
                { number: "50K+", label: "Health Records" },
                { number: "99.9%", label: "Uptime" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-blue-100">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Our Users Say
              </h2>
              <p className="text-xl text-gray-600">
                Real stories from real people
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Rajesh Kumar",
                  role: "Construction Worker",
                  content: "ArogyaSaathi helped me access healthcare services easily. The QR code feature is amazing!",
                  rating: 5
                },
                {
                  name: "Dr. Priya Sharma",
                  role: "General Physician",
                  content: "The platform makes it so easy to access patient records securely. Great for emergency situations.",
                  rating: 5
                },
                {
                  name: "Mohammed Ali",
                  role: "Factory Worker",
                  content: "Finally, a healthcare solution that understands migrant workers' needs. Highly recommended!",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Healthcare Access?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Join thousands of users who trust ArogyaSaathi for their healthcare needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={() => navigate("/migrant/register")}
                  className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Start as Migrant</span>
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
                <motion.button
                  onClick={() => navigate("/doctor/login")}
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Login as Doctor</span>
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
