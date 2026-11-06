import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Header from "./components/layout/Header.jsx";
import BreadCrumb from "./components/layout/BreadCrumb.jsx";
import Footer from "./components/layout/Footer.jsx";

import Home from "./pages/Home.jsx";
import Application from "./pages/Application.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <BreadCrumb />

      <main className="main-content">
        <Routes>
          {/* Default Home Page */}
          <Route path="/" element={<Home />} />

          {/* Business Permit Application Pages */}
          <Route
            path="/application/:type"
            element={<Application />}
          />

          {/* Redirect Invalid URLs to Home */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}