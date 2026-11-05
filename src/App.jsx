
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
          <Route path="/" element={<Home />} />
          <Route path="/application/:type" element={<Application />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}
