import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ClientPortal from "./pages/ClientPortal";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminLogin from "./pages/Admin/AdminLogin";
function App() {
  return (
    <Router>
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/client" element={<ClientPortal />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin-login" element={<AdminLogin />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
