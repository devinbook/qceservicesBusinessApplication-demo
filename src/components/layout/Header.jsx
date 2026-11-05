
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Header() {
  const [clock, setClock] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarTop, setSidebarTop] = useState(null);
  const menuButtonRef = useRef(null);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  useEffect(() => {
    const tick = () => {
      const formatted = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(new Date());

      setClock(formatted.toUpperCase());
    };

    tick();

    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, []);

  useLayoutEffect(() => {
    const updateSidebarPosition = () => {
      if (!menuButtonRef.current) return;

      const rect = menuButtonRef.current.getBoundingClientRect();

      setSidebarTop(Math.max(0, rect.top));
    };

    updateSidebarPosition();

    window.addEventListener("resize", updateSidebarPosition);
    window.addEventListener("scroll", updateSidebarPosition, {
      passive: true,
    });

    const observer = new ResizeObserver(updateSidebarPosition);

    const header = document.getElementById("header-container");

    if (header) {
      observer.observe(header);
    }

    return () => {
      window.removeEventListener("resize", updateSidebarPosition);
      window.removeEventListener("scroll", updateSidebarPosition);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div id="header-container">
        <header className="qces-header">
          <div className="qces-navbar">
            <div className="container-fluid px-3 px-lg-4">
              <div className="qces-navbar-inner">
                <Link to="/" className="qces-logo">
                  <img
                    src="/assets/images/qc-logo.png"
                    alt="Quezon City Government"
                    className="qc-logo-img"
                  />

                  <img
                    src="/assets/images/qceservices-logo.png"
                    alt="QCeServices"
                    className="qceservices-logo-img"
                  />
                </Link>

                <nav className="qces-navigation d-none d-lg-flex">
                  <Link to="/" className="qces-nav-link">
                    HOME
                  </Link>

                  <div className="dropdown qces-nav-dropdown">
                    <button
                      type="button"
                      className="qces-nav-link qces-dropdown-button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      SERVICES
                      <i className="bi bi-chevron-down" />
                    </button>

                    <ul className="dropdown-menu qces-dropdown-menu">
                      <li>
                        <Link to="/" className="dropdown-item">
                          Business Permits
                        </Link>
                      </li>

                      <li>
                        <a href="#" className="dropdown-item">
                          Other Services
                        </a>
                      </li>
                    </ul>
                  </div>

                  <a href="#" className="qces-nav-link">
                    CITIZEN'S CHARTER
                  </a>

                  <a href="#" className="qces-nav-link">
                    CONTACT US
                  </a>

                  <div className="dropdown qces-user-dropdown">
                    <button
                      type="button"
                      className="qces-user-button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="bi bi-person-circle" />

                      <span>Hi, WENDELL ALFRE</span>

                      <i className="bi bi-chevron-down user-chevron" />
                    </button>

                    <ul className="dropdown-menu dropdown-menu-end qces-dropdown-menu">
                      <li>
                        <a href="#" className="dropdown-item">
                          My Profile
                        </a>
                      </li>

                      <li>
                        <a href="#" className="dropdown-item">
                          My Applications
                        </a>
                      </li>

                      <li>
                        <hr className="dropdown-divider" />
                      </li>

                      <li>
                        <a href="#" className="dropdown-item">
                          Logout
                        </a>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    className="qces-search-button"
                    aria-label="Search"
                  >
                    <i className="bi bi-search" />
                  </button>
                </nav>

                <button
                  className="qces-mobile-toggle d-lg-none"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#mobileNavigation"
                  aria-controls="mobileNavigation"
                  aria-label="Open navigation"
                >
                  <i className="bi bi-list" />
                </button>
              </div>
            </div>
          </div>

          <div className="qces-date-bar">
            <div className="container-fluid px-3 px-lg-4">
              <span>{clock}</span>
            </div>
          </div>

          <button
            ref={menuButtonRef}
            id="qces-menu-trigger"
            className="qces-menu-tab"
            type="button"
            onClick={() => setSidebarOpen((previous) => !previous)}
            aria-label={
              sidebarOpen ? "Close sidebar menu" : "Open sidebar menu"
            }
            aria-controls="qces-sidebar"
            aria-expanded={sidebarOpen}
          >
            <i className="bi bi-list" />
            <span>MENU</span>
          </button>
        </header>
      </div>

      <Sidebar
        open={sidebarOpen}
        onClose={closeSidebar}
        top={sidebarTop}
      />

      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="mobileNavigation"
        aria-labelledby="mobileNavigationTitle"
      >
        <div className="offcanvas-header">
          <div
            className="mobile-menu-brand"
            id="mobileNavigationTitle"
          >
            <img
              src="/assets/images/qc-logo.png"
              alt="Quezon City Government"
            />

            <img
              src="/assets/images/qceservices-logo.png"
              alt="QCeServices"
            />
          </div>

          <button
            className="btn-close"
            type="button"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>

        <div className="offcanvas-body">
          <nav className="mobile-navigation">
            <Link to="/">Home</Link>
            <Link to="/">Business Permits</Link>
            <a href="#">Citizen's Charter</a>
            <a href="#">Contact Us</a>
            <a href="#">My Applications</a>
            <a href="#">My Profile</a>
            <a href="#">Logout</a>
          </nav>
        </div>
      </div>
    </>
  );
}
