import { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

interface DriverTourProps {
  isActive: boolean;
  onComplete?: () => void;
  tourType: 'landing' | 'migrant' | 'doctor';
}

export default function DriverTour({ isActive, onComplete, tourType }: DriverTourProps) {
  useEffect(() => {
    if (!isActive) return;

    const driverObj = driver({
      showProgress: true,
      steps: getTourSteps(tourType),
      onDestroyStarted: () => {
        driverObj.destroy();
        onComplete?.();
      },
    });

    driverObj.drive();

    return () => {
      driverObj.destroy();
    };
  }, [isActive, tourType, onComplete]);

  return null;
}

function getTourSteps(tourType: string) {
  switch (tourType) {
    case 'landing':
      return [
        {
          element: '.landing-logo',
          popover: {
            title: 'Welcome to ArogyaSaathi! 👋',
            description: 'Your comprehensive healthcare companion for migrants and healthcare providers.',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '.landing-language-selector',
          popover: {
            title: 'Choose Your Language 🌐',
            description: 'Select your preferred language for a personalized experience.',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '.landing-btn-secondary',
          popover: {
            title: 'For Migrants 👥',
            description: 'Click here if you are a migrant worker looking to access healthcare services.',
            side: 'top',
            align: 'center'
          }
        },
        {
          element: '.landing-btn-primary',
          popover: {
            title: 'For Healthcare Providers 👨‍⚕️',
            description: 'Click here if you are a doctor or healthcare professional.',
            side: 'top',
            align: 'center'
          }
        },
        {
          element: '.landing-features',
          popover: {
            title: 'Our Key Features ✨',
            description: 'Explore the main features that make ArogyaSaathi special.',
            side: 'top',
            align: 'center'
          }
        }
      ];

    case 'migrant':
      return [
        {
          element: '.dashboard-sidebar-logo',
          popover: {
            title: 'Welcome to Your Dashboard! 🏠',
            description: 'This is your personal health portal where you can manage all your healthcare needs.',
            side: 'right',
            align: 'center'
          }
        },
        {
          element: '.dashboard-user-profile',
          popover: {
            title: 'Your Profile 👤',
            description: 'Click here to view and edit your personal information.',
            side: 'right',
            align: 'center'
          }
        },
        {
          element: '.dashboard-nav',
          popover: {
            title: 'Navigation Menu 📋',
            description: 'Use this menu to navigate between different sections of your dashboard.',
            side: 'right',
            align: 'center'
          }
        },
        {
          element: '.dashboard-stats-grid',
          popover: {
            title: 'Health Overview 📊',
            description: 'Quick overview of your health records, appointments, and medications.',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '.dashboard-qr-container',
          popover: {
            title: 'Your QR Code 📱',
            description: 'Show this QR code to healthcare providers for quick access to your records.',
            side: 'top',
            align: 'center'
          }
        }
      ];

    case 'doctor':
      return [
        {
          element: '.doctor-sidebar-logo',
          popover: {
            title: 'Doctor Dashboard 👨‍⚕️',
            description: 'Welcome to your medical dashboard for managing patient care.',
            side: 'right',
            align: 'center'
          }
        },
        {
          element: '.doctor-nav',
          popover: {
            title: 'Navigation 🧭',
            description: 'Navigate between dashboard sections and patient management tools.',
            side: 'right',
            align: 'center'
          }
        },
        {
          element: '.doctor-btn-primary',
          popover: {
            title: 'Scan QR Code 📷',
            description: 'Scan a patient\'s QR code to request access to their health records.',
            side: 'top',
            align: 'center'
          }
        },
        {
          element: '.doctor-card',
          popover: {
            title: 'Patient Access 🔐',
            description: 'This section helps you securely access patient records with their consent.',
            side: 'bottom',
            align: 'center'
          }
        }
      ];

    default:
      return [];
  }
}