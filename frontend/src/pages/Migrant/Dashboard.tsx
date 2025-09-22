import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import DriverTour from "../../components/DriverTour";
import { Heart, FileText, Calendar, Pill, Hospital, User, Home, LogOut, Menu, X } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import "./Dashboard.css";

interface Migrant {
  _id: string;
  name: string;
  phone: string;
  dob: string;
  gender: string;
  language: string;
  qrData: string;
  uniqueId: string;
}

interface HealthRecord {
  _id: string;
  migrantId: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
  version: number;
}

export default function Dashboard() {
  const [migrant, setMigrant] = useState<Migrant | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [records, setRecords] = useState<HealthRecord[]>([]);

  // Dummy stats data
  const statsData = [
    {
      label: t("migrant.dashboard.myRecords"),
      value: "12",
      icon: FileText,
      color: "blue",
    },
    {
      label: t("migrant.dashboard.upcomingAppointments"),
      value: "2",
      icon: Calendar,
      color: "green",
    },
    {
      label: t("migrant.dashboard.medications"),
      value: "5",
      icon: Pill,
      color: "purple",
    },
    {
      label: t("migrant.dashboard.recentVisits"),
      value: "3",
      icon: Hospital,
      color: "orange",
    },
  ];

  const fetchRecords = async () => {
    try {
      const response = await axiosInstance.get(`/health/${migrant?.uniqueId}`);
      setRecords(response.data.records || []);
    } catch (error) {
      console.error("Error fetching health records:", error);
      toast.error(t("errors.fetchRecordsFailed"));
    }
  };

  useEffect(() => {
    const savedAuth = localStorage.getItem("auth");
    if (savedAuth && savedAuth !== "undefined") {
      try {
        const parsed = JSON.parse(savedAuth);
        if (parsed.migrant) {
          setMigrant(parsed.migrant);
        }
      } catch (err) {
        console.error("Error parsing auth data:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (migrant?.uniqueId) {
      fetchRecords();
    }
  }, [migrant]);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("token");
    navigate("/migrant/login");
  };

  const startTour = () => {
    setShowTour(true);
  };

  if (!migrant) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">{t("loading")}</p>
        </motion.div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <>
            <motion.div
              className="dashboard-stats-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {statsData.map((stat, index) => (
                <motion.div
                  key={index}
                  className="dashboard-stat-card bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={`dashboard-stat-icon w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    stat.color === 'green' ? 'bg-emerald-100 text-emerald-600' :
                    stat.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="dashboard-stat-info">
                    <div className="dashboard-stat-value text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="dashboard-stat-label text-sm text-gray-600">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="dashboard-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="dashboard-card-title">
                <Heart className="h-5 w-5 text-red-500" />
                {t("migrant.dashboard.qrCode")}
              </h3>
              <div className="dashboard-qr-container bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 text-center">
                <p className="dashboard-qr-title">
                  {t("migrant.dashboard.yourQrCode")}
                </p>
                <motion.div
                  className="inline-block"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={migrant.qrData}
                    alt={t("migrant.dashboard.qrCode")}
                    className="dashboard-qr-code w-40 h-40 mx-auto rounded-xl shadow-lg border-4 border-white"
                  />
                </motion.div>
                <div className="dashboard-qr-id mt-4 px-4 py-2 bg-white rounded-full text-sm font-mono text-gray-700 inline-block">
                  {migrant.uniqueId}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="dashboard-section-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <FileText className="h-5 w-5 text-blue-600" />
              {t("migrant.dashboard.recentRecords")}
            </motion.div>

            <motion.div
              className="dashboard-records-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {records.map((record: any, index: any) => (
                <motion.div
                  key={record._id}
                  className="dashboard-record-card bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
                  whileHover={{ scale: 1.03 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <div className="dashboard-record-header">
                    <h4 className="dashboard-record-title text-lg font-semibold text-gray-900">{record.title}</h4>
                    <span className="dashboard-record-date text-sm text-gray-500">{new Date(record.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="dashboard-record-details text-gray-600 mt-3 line-clamp-3">
                    {record.content}
                  </p>
                  <div className="dashboard-record-type mt-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium inline-block">
                    Medical Record
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        );

      case "profile":
        return (
          <motion.div
            className="dashboard-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="dashboard-card-title">
              <User className="h-5 w-5 text-blue-600" />
              {t("profile")}
            </h3>
            <div className="dashboard-profile-grid grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="dashboard-profile-item">
                <span className="dashboard-profile-label text-sm font-medium text-gray-500 mb-1 block">
                  {t("migrantRegister.name")}
                </span>
                <span className="dashboard-profile-value text-lg font-semibold text-gray-900">{migrant.name}</span>
              </div>
              <div className="dashboard-profile-item">
                <span className="dashboard-profile-label text-sm font-medium text-gray-500 mb-1 block">
                  {t("phoneNumber")}
                </span>
                <span className="dashboard-profile-value text-lg font-semibold text-gray-900">{migrant.phone}</span>
              </div>
              <div className="dashboard-profile-item">
                <span className="dashboard-profile-label text-sm font-medium text-gray-500 mb-1 block">
                  {t("migrantRegister.gender")}
                </span>
                <span className="dashboard-profile-value text-lg font-semibold text-gray-900">
                  {t(`migrantRegister.${migrant.gender.toLowerCase()}`)}
                </span>
              </div>
              <div className="dashboard-profile-item">
                <span className="dashboard-profile-label text-sm font-medium text-gray-500 mb-1 block">
                  {t("migrantRegister.dob")}
                </span>
                <span className="dashboard-profile-value text-lg font-semibold text-gray-900">
                  {new Date(migrant.dob).toLocaleDateString()}
                </span>
              </div>
              <div className="dashboard-profile-item">
                <span className="dashboard-profile-label text-sm font-medium text-gray-500 mb-1 block">
                  {t("migrantRegister.language")}
                </span>
                <span className="dashboard-profile-value text-lg font-semibold text-gray-900">
                  {migrant.language}
                </span>
              </div>
              <div className="dashboard-profile-item">
                <span className="dashboard-profile-label text-sm font-medium text-gray-500 mb-1 block">ID</span>
                <span className="dashboard-profile-value text-lg font-semibold text-gray-900 font-mono">
                  {migrant.uniqueId}
                </span>
              </div>
            </div>
          </motion.div>
        );

      case "records":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="dashboard-section-title">
              <i className="fas fa-file-medical"></i>
              {t("migrant.dashboard.myRecords")}
            </div>

            <div className="dashboard-records-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {records.map((record, index) => (
                <motion.div
                  key={record._id}
                  className="dashboard-record-card bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
                  whileHover={{ scale: 1.03 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <div className="dashboard-record-header">
                    <h4 className="dashboard-record-title text-lg font-semibold text-gray-900">{record.title}</h4>
                    <span className="dashboard-record-date text-sm text-gray-500">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="dashboard-record-details text-gray-600 mt-3">{record.content}</p>
                  <div className="dashboard-record-meta mt-4 text-xs text-gray-500">
                    {t("version")}: {record.version}
                  </div>
                </motion.div>
              ))}
              {records.length === 0 && (
                <div className="dashboard-no-records col-span-full text-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No health records found</p>
                  <p className="text-gray-400 text-sm mt-2">Your medical records will appear here</p>
                </div>
              )}
            </div>
          </motion.div>
        );

      default:
        return (
          <div className="dashboard-card">
            <h3 className="dashboard-card-title">Welcome to your dashboard</h3>
            <p>Select a section from the menu to get started.</p>
          </div>
        );
    }
  };

  return (
    <>
      <DriverTour
        isActive={showTour}
        onComplete={() => setShowTour(false)}
        tourType="migrant"
      />
      
      <div className="dashboard-container min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex">
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

      <motion.div
        className={`dashboard-sidebar fixed lg:relative z-50 lg:z-auto transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } w-80 bg-gradient-to-b from-blue-600 to-blue-800 text-white shadow-2xl`}
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="dashboard-sidebar-header">
          {/* Close button for mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="dashboard-sidebar-logo">
            <Heart className="dashboard-sidebar-logo-icon h-8 w-8 text-red-400" />
            <span className="dashboard-sidebar-logo-text">{t("appName")}</span>
          </div>

          <div
            className="dashboard-user-profile"
            onClick={() => setActiveTab("profile")}
          >
            <div className="dashboard-user-avatar">
              {getInitials(migrant.name)}
            </div>
            <div className="dashboard-user-info">
              <div className="dashboard-user-name">{migrant.name}</div>
              <div className="dashboard-user-role">{t("userType.migrant")}</div>
            </div>
          </div>
        </div>

        <div className="dashboard-nav">
          <div
            className={`dashboard-nav-item ${
              activeTab === "overview" ? "active" : ""
            }`}
            onClick={() => setActiveTab("overview")}
          >
            <div className="dashboard-nav-icon">
              <Home className="h-5 w-5" />
            </div>
            <div className="dashboard-nav-text">{t("home")}</div>
          </div>

          <div
            className={`dashboard-nav-item ${
              activeTab === "records" ? "active" : ""
            }`}
            onClick={() => setActiveTab("records")}
          >
            <div className="dashboard-nav-icon">
              <FileText className="h-5 w-5" />
            </div>
            <div className="dashboard-nav-text">
              {t("migrant.dashboard.myRecords")}
            </div>
          </div>

          <div
            className={`dashboard-nav-item ${
              activeTab === "appointments" ? "active" : ""
            }`}
            onClick={() => setActiveTab("appointments")}
          >
            <div className="dashboard-nav-icon">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="dashboard-nav-text">
              {t("migrant.dashboard.upcomingAppointments")}
            </div>
          </div>

          <div
            className={`dashboard-nav-item ${
              activeTab === "medications" ? "active" : ""
            }`}
            onClick={() => setActiveTab("medications")}
          >
            <div className="dashboard-nav-icon">
              <Pill className="h-5 w-5" />
            </div>
            <div className="dashboard-nav-text">
              {t("migrant.dashboard.medications")}
            </div>
          </div>
        </div>

        <div className="dashboard-sidebar-footer">
          <div className="dashboard-logout-btn" onClick={handleLogout}>
            <div className="dashboard-nav-icon">
              <LogOut className="h-5 w-5" />
            </div>
            <div className="dashboard-nav-text">{t("logout")}</div>
          </div>
        </div>
      </motion.div>

      <div className="dashboard-main flex-1 lg:ml-0">
        <div className="dashboard-header flex justify-between items-center p-6 bg-white shadow-sm border-b border-gray-200">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
          
          <h1 className="dashboard-title text-2xl lg:text-3xl font-bold text-gray-900">
            {t(`migrant.dashboard.${activeTab}`)}
          </h1>
          
          <motion.button
            onClick={startTour}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Help</span>
          </motion.button>
        </div>

        <div className="dashboard-content p-6">{renderContent()}</div>
      </div>
    </div>
    </>
  );
}
