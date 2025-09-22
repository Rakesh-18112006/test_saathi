import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import Analytics from "./Analytics";
import { Html5QrcodeScanner } from "html5-qrcode";
import { motion } from "framer-motion";
import DriverTour from "../../components/DriverTour";
import { QrCode, User, FileText, Brain, Camera, X, Menu, LogOut, Home, Stethoscope } from "lucide-react";
import "./DoctorDashboard.css";
import axiosInstance from "../../api/axiosInstance";

// Default values for demonstration
const DEFAULT_DOCTOR = {
  name: "Dr. Sarah Johnson",
  email: "sarah.johnson@hospital.com",
  specialization: "Cardiologist",
  hospital: "City General Hospital",
  experience: "8 years",
  phone: "+1 (555) 123-4567",
};

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [migrantId, setMigrantId] = useState("");
  const [requestId, setRequestId] = useState("");
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [records, setRecords] = useState<any[]>([]);
  const [migrant, setMigrant] = useState<any>(null);
  const [scanning, setScanning] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showTour, setShowTour] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // new state for health record creation
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [recordTitle, setRecordTitle] = useState("");
  const [recordContent, setRecordContent] = useState("");
  // new state for AI summary
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  // Initialize QR scanner when scanning = true
  useEffect(() => {
    if (scanning && !scannerRef.current) {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render(
        (decodedText: string) => {
          try {
            const parsed = JSON.parse(decodedText);
            if (parsed.uniqueId) {
              setMigrantId(parsed.uniqueId);
              setMigrant({
                name: parsed.name || "",
                dob: parsed.dob || "",
                phone: parsed.phone || "",
              });
              toast.success("QR Code scanned successfully!");
            } else {
              setMigrantId(decodedText);
              toast.success("QR Code scanned (plain text)!");
            }
          } catch {
            setMigrantId(decodedText);
            toast.success("QR Code scanned (plain text)!");
          }

          setScanning(false);
          scanner.clear().catch(() => {});
          scannerRef.current = null;
        },
        (errorMessage: string) => {
          console.warn("QR Scan error:", errorMessage);
        }
      );

      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [scanning]);

  // Request OTP
  const handleRequestOtp = async () => {
    try {
      const res = await axiosInstance.post("/access/request", { migrantId });
      setRequestId(res.data.requestId);
      setRequestSent(true);
      toast.success(res.data.message || "OTP sent to migrant's phone");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "OTP request failed");
    }
  };

  // Fetch migrant profile
  const fetchMigrantProfile = async () => {
    try {
      const res = await axiosInstance.get(`/access/profile/${migrantId}`);
      setMigrant(res.data.migrant);
      toast.success("Migrant profile fetched successfully");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to fetch migrant profile"
      );
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    try {
      const res = await axiosInstance.post("/access/verify", {
        requestId,
        otp,
      });

      toast.success(res.data.message || "OTP verified successfully!");
      setOtpVerified(true);

      // Fetch migrant profile after OTP verification
      await fetchMigrantProfile();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    }
  };

  // Fetch health records
  const fetchRecords = async () => {
    try {
      const res = await axiosInstance.get(`/access/records/${migrantId}`);
      setRecords(res.data.records);

      if (res.data.records.length > 0) {
        setMigrant({
          name: res.data.records[0]?.migrantName || "",
          phone: res.data.records[0]?.migrantPhone || "",
          dob: res.data.records[0]?.migrantDob || "",
          bloodGroup: res.data.records[0]?.bloodGroup || "N/A",
          allergies: res.data.records[0]?.allergies || "None",
          emergencyContact: res.data.records[0]?.emergencyContact || "N/A",
        });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch records");
    }
  };

  // Create new health record
  const handleCreateRecord = async () => {
    if (!recordTitle || !recordContent) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      const res = await axiosInstance.post(
        `/access/health-records/${migrantId}`,
        {
          title: recordTitle,
          content: recordContent,
        }
      );
      toast.success(res.data.message || "Health record created successfully");
      setShowCreateForm(false);
      setRecordTitle("");
      setRecordContent("");
      fetchRecords(); // refresh list
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create record");
    }
  };

  // Fetch AI summary
  const handleFetchSummary = async () => {
    setIsLoadingSummary(true);
    setSummary(null); // Reset previous summary
    try {
      const res = await axiosInstance.get(`/access/aiSummary/${migrantId}`);
      setSummary(res.data.summary);
      toast.success("Summary fetched successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch summary");
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const startTour = () => {
    setShowTour(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <>
            <motion.div className="doctor-card bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="doctor-card-title">
                <QrCode className="h-5 w-5 text-blue-600" />
                Access Migrant Records
              </h3>

              {!migrantId && !scanning && (
                <motion.button
                  onClick={() => setScanning(true)}
                  className="doctor-btn doctor-btn-primary px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Camera className="h-5 w-5" />
                  Scan QR Code
                </motion.button>
              )}

              {scanning && (
                <div className="doctor-qr-section space-y-4">
                  <div className="doctor-qr-scanner relative bg-gray-100 rounded-xl overflow-hidden">
                    <div id="reader" className="w-full h-64"></div>
                  </div>
                  <motion.button
                    onClick={() => setScanning(false)}
                    className="doctor-btn doctor-btn-danger px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <X className="h-5 w-5" />
                    Cancel Scan
                  </motion.button>
                </div>
              )}

              {migrantId && !requestSent && (
                <motion.button
                  onClick={handleRequestOtp}
                  className="doctor-btn doctor-btn-primary mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FileText className="h-5 w-5" />
                  Request OTP
                </motion.button>
              )}

              {requestSent && !otpVerified && (
                <motion.div className="doctor-otp-section space-y-4 mt-4">
                  <div className="doctor-input-group">
                    <label className="doctor-input-label text-sm font-medium text-gray-700 mb-2 block">Enter OTP</label>
                    <input
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP sent to migrant"
                      className="doctor-input w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <motion.button
                    onClick={handleVerifyOtp}
                    className="doctor-btn doctor-btn-primary px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FileText className="h-5 w-5" />
                    Verify OTP
                  </motion.button>
                </motion.div>
              )}
            </motion.div>

            {/* After OTP verification */}
            {migrant && otpVerified && (
              <>
                {/* Profile */}
                <motion.div className="doctor-card bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mt-6">
                  <h3 className="doctor-card-title">
                    <User className="h-5 w-5 text-blue-600" />
                    Migrant Profile
                  </h3>
                  <div className="doctor-profile-grid grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="doctor-profile-item">
                      <span className="doctor-profile-label text-sm font-medium text-gray-500 mb-1 block">Name</span>
                      <span className="doctor-profile-value text-lg font-semibold text-gray-900">
                        {migrant.name}
                      </span>
                    </div>
                    <div className="doctor-profile-item">
                      <span className="doctor-profile-label text-sm font-medium text-gray-500 mb-1 block">Phone</span>
                      <span className="doctor-profile-value text-lg font-semibold text-gray-900">
                        {migrant.phone}
                      </span>
                    </div>
                    <div className="doctor-profile-item">
                      <span className="doctor-profile-label text-sm font-medium text-gray-500 mb-1 block">
                        Date of Birth
                      </span>
                      <span className="doctor-profile-value text-lg font-semibold text-gray-900">
                        {migrant.dob
                          ? new Date(migrant.dob).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="doctor-action-buttons mt-6 flex flex-wrap gap-3">
                    <motion.button
                      onClick={() => setShowCreateForm(true)}
                      className="doctor-btn doctor-btn-primary px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FileText className="h-5 w-5" />
                      Create Health Record
                    </motion.button>

                    <motion.button
                      onClick={fetchRecords}
                      className="doctor-btn doctor-btn-secondary px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center space-x-2"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FileText className="h-5 w-5" />
                      View Records
                    </motion.button>

                    <motion.button
                      onClick={handleFetchSummary}
                      className="doctor-btn doctor-btn-secondary px-6 py-3 bg-purple-100 text-purple-700 rounded-xl font-semibold hover:bg-purple-200 transition-colors flex items-center space-x-2"
                      disabled={isLoadingSummary}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Brain className="h-5 w-5" />
                      {isLoadingSummary ? "Loading..." : "Quick Summary"}
                    </motion.button>
                  </div>
                </motion.div>

                {/* Create form */}
                {showCreateForm && (
                  <motion.div className="doctor-card bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mt-6">
                    <h3 className="doctor-card-title text-xl font-semibold text-gray-900 mb-6">New Health Record</h3>
                    <div className="doctor-input-group">
                      <label className="doctor-input-label text-sm font-medium text-gray-700 mb-2 block">Title</label>
                      <input
                        value={recordTitle}
                        onChange={(e) => setRecordTitle(e.target.value)}
                        className="doctor-input w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Record title"
                      />
                    </div>
                    <div className="doctor-input-group mt-4">
                      <label className="doctor-input-label text-sm font-medium text-gray-700 mb-2 block">Content</label>
                      <textarea
                        value={recordContent}
                        onChange={(e) => setRecordContent(e.target.value)}
                        className="doctor-input w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-32 resize-none"
                        placeholder="Record details"
                      />
                    </div>
                    <div className="flex gap-3 mt-6">
                      <motion.button
                        onClick={handleCreateRecord}
                        className="doctor-btn doctor-btn-primary px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Save Record
                      </motion.button>
                      <motion.button
                        onClick={() => setShowCreateForm(false)}
                        className="doctor-btn doctor-btn-danger px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </>
            )}

            {/* Records */}
            {otpVerified && records.length > 0 && (
              <motion.div className="doctor-card bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mt-6">
                <h3 className="doctor-card-title">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Health Records
                </h3>
                <div className="doctor-records-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {records.map((record, index) => (
                    <motion.div
                      key={record._id || index}
                      className="doctor-record-card bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all duration-300 border border-gray-200"
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      <div className="doctor-record-header">
                        <h4 className="doctor-record-title text-lg font-semibold text-gray-900">{record.title}</h4>
                        <span className="doctor-record-date text-sm text-gray-500">
                          {new Date(record.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="doctor-record-details text-gray-600 mt-3 line-clamp-3">{record.content}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* AI Summary */}
            {otpVerified && summary && (
              <motion.div className="doctor-card bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg p-6 border border-purple-200 mt-6">
                <h3 className="doctor-card-title">
                  <Brain className="h-5 w-5 text-purple-600" />
                  AI-Generated Summary
                </h3>
                <div className="bg-white rounded-xl p-4 mt-4">
                  <p className="doctor-record-details text-gray-700 leading-relaxed">{summary}</p>
                </div>
              </motion.div>
            )}

            <Analytics />
          </>
        );

      case "profile":
        return (
          <motion.div className="doctor-card bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="doctor-card-title">
              <Stethoscope className="h-5 w-5 text-blue-600" />
              Doctor Profile
            </h3>
            <div className="doctor-profile-grid grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="doctor-profile-item">
                <span className="doctor-profile-label text-sm font-medium text-gray-500 mb-1 block">Name</span>
                <span className="doctor-profile-value text-lg font-semibold text-gray-900">
                  {user?.name || DEFAULT_DOCTOR.name}
                </span>
              </div>
              <div className="doctor-profile-item">
                <span className="doctor-profile-label text-sm font-medium text-gray-500 mb-1 block">Email</span>
                <span className="doctor-profile-value text-lg font-semibold text-gray-900">
                  {user?.email || DEFAULT_DOCTOR.email}
                </span>
              </div>
              <div className="doctor-profile-item">
                <span className="doctor-profile-label text-sm font-medium text-gray-500 mb-1 block">Specialization</span>
                <span className="doctor-profile-value text-lg font-semibold text-gray-900">
                  {DEFAULT_DOCTOR.specialization}
                </span>
              </div>
            </div>
          </motion.div>
        );

      default:
        return (
          <div className="doctor-card bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="doctor-card-title text-xl font-semibold text-gray-900">Welcome to your dashboard</h3>
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
        tourType="doctor"
      />
      
      <div className="doctor-dashboard-container min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex">
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
        className={`doctor-sidebar fixed lg:relative z-50 lg:z-auto transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } w-80 bg-gradient-to-b from-slate-800 to-slate-900 text-white shadow-2xl`}
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      <motion.div className="doctor-sidebar">
        <div className="doctor-sidebar-header">
          {/* Close button for mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="doctor-sidebar-logo">
            <Stethoscope className="doctor-sidebar-logo-icon h-8 w-8 text-blue-400" />
            <span className="doctor-sidebar-logo-text">ArogyaSaathi</span>
          </div>
        </div>
        <div className="doctor-nav">
          <div
            className={`doctor-nav-item ${
              activeTab === "dashboard" ? "active" : ""
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </div>
          <div
            className={`doctor-nav-item ${
              activeTab === "profile" ? "active" : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <User className="h-5 w-5" />
            <span>Profile</span>
          </div>
        </div>
        <div className="doctor-sidebar-footer">
          <div className="doctor-logout-btn" onClick={logout}>
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </div>
        </div>
      </motion.div>

      <div className="doctor-main flex-1 lg:ml-0">
        <div className="doctor-header flex justify-between items-center p-6 bg-white shadow-sm border-b border-gray-200">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
          
          <h1 className="doctor-title text-2xl lg:text-3xl font-bold text-gray-900">
            {activeTab === "dashboard"
              ? "Doctor Dashboard"
              : activeTab === "profile"
              ? "My Profile"
              : activeTab}
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
        
        <div className="doctor-content p-6">{renderContent()}</div>
      </div>
    </div>
    </>
  );
}
