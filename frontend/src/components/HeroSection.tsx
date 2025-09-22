import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Heart, Shield, Users, Zap, ArrowRight, Play } from "lucide-react";

interface HeroSectionProps {
  onGetStarted?: () => void;
  onWatchDemo?: () => void;
}

export default function HeroSection({ onGetStarted, onWatchDemo }: HeroSectionProps) {
  const { t } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-8">
            <Zap className="h-4 w-4 mr-2" />
            Revolutionizing Healthcare Access
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Your Health,{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
              Our Priority
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Connecting migrants with healthcare services and providing doctors with advanced tools to deliver exceptional care.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <motion.button
              onClick={onGetStarted}
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Get Started</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              onClick={onWatchDemo}
              className="group px-8 py-4 bg-white text-gray-700 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 border border-gray-200"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="h-5 w-5 text-blue-600" />
              <span>Watch Demo</span>
            </motion.button>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              {
                icon: Heart,
                title: "Health Records",
                description: "Secure digital health records accessible anywhere",
                color: "text-red-500"
              },
              {
                icon: Shield,
                title: "Privacy First",
                description: "Your data is protected with enterprise-grade security",
                color: "text-blue-500"
              },
              {
                icon: Users,
                title: "Expert Care",
                description: "Connect with qualified healthcare professionals",
                color: "text-emerald-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
                variants={floatingVariants}
                animate="animate"
                style={{ animationDelay: `${index * 0.5}s` }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <feature.icon className={`h-12 w-12 ${feature.color} mb-4 mx-auto`} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </motion.div>
    </section>
  );
}