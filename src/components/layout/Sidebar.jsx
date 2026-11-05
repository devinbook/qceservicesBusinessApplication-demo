
import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import "../../styles/sidebar.css";

const menuItems = [
  {
    label: "Home",
    icon: "bi-house-door-fill",
    path: "/",
  },
  {
    label: "Application List",
    icon: "bi-card-checklist",
    path: "/application-list",
  },
  {
    label: "Liquor Permit Application",
    icon: "bi-cup-straw",
    path: "/liquor-permit",
  },
  {
    label: "Set Appointment",
    icon: "bi-calendar3",
    path: "/appointment",
  },
  {
    label: "Request for Certification",
    icon: "bi-file-earmark-check",
    path: "/certification",
  },
  {
    label: "Safety Seal Application List",
    icon: "bi-patch-check-fill",
    path: "/safety-seal-list",
  },
  {
    label: "Reference Files",
    icon: "bi-folder-fill",
    path: "/reference-files",
  },
  {
    label: "Business Permits Verification",
    icon: "bi-search",
    path: "/business-verification",
  },
  {
    label: "Frequently Asked Questions (Liquor Permit)",
    icon: "bi-question-circle-fill",
    path: "/faq-liquor",
  },
  {
    label: "Frequently Asked Questions",
    icon: "bi-chat-square-question",
    path: "/faq",
  },
  {
    label: "QC Safe Seal Application",
    icon: "bi-shield-check",
    path: "/qc-safe-seal",
  },
  {
    label: "BPLD Online Legal",
    icon: "bi-bank",
    path: "/online-legal",
  },
  {
    label: "On-Premise Queue System",
    icon: "bi-people-fill",
    path: "/queue-system",
  },
  {
    label: "On-Premise Queue Counter",
    icon: "bi-ticket-perforated-fill",
    path: "/queue-counter",
  },
];

export default function Sidebar({
  open = false,
  onClose = () => {},
  top = null,
}) {
  const sidebarRef = useRef(null);
  const closeButtonRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onCloseRef.current();
      }
    };

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const positionStyle =
    top === null
      ? undefined
      : {
          "--qces-sidebar-top": `${top}px`,
        };

  return (
    <>
      <div
        className={`qces-sidebar-backdrop ${
          open ? "visible" : ""
        }`}
        onClick={onClose}
        style={positionStyle}
        aria-hidden="true"
      />

      <aside
        ref={sidebarRef}
        id="qces-sidebar"
        className={`qces-sidebar ${open ? "open" : ""}`}
        style={positionStyle}
        aria-label="Main navigation"
        aria-hidden={!open}
        inert={!open}
      >
        <div className="qces-sidebar-header">
          <span className="qces-sidebar-title">
            NAVIGATION MENU
          </span>

          <button
            ref={closeButtonRef}
            type="button"
            className="qces-sidebar-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <nav className="qces-sidebar-navigation">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `qces-sidebar-item ${
                  isActive ? "active" : ""
                }`
              }
            >
              <span className="qces-sidebar-item-icon">
                <i className={`bi ${item.icon}`} />
              </span>

              <span className="qces-sidebar-item-label">
                {item.label}
              </span>

              <i className="bi bi-chevron-right qces-sidebar-arrow" />
            </NavLink>
          ))}
        </nav>

        <div className="qces-sidebar-footer">
          <div className="qces-sidebar-footer-icon">
            <i className="bi bi-shield-check" />
          </div>

          <div>
            <strong>QCeServices</strong>
            <span>Quezon City Government</span>
          </div>
        </div>
      </aside>
    </>
  );
}
