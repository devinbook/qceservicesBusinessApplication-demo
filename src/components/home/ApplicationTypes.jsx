
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const applications = [
  {
    type: "new",
    title: "NEW BUSINESS",
    icon: "bi-building-add",
    description:
      "All prospective business owners intending to establish a new enterprise within the city must apply for a New Business Permit.",
    image: "/assets/images/new-business.jpg",
    action: "Start Application",
  },
  {
    type: "renewal",
    title: "RENEWAL",
    icon: "bi-arrow-repeat",
    description:
      "Annual renewal of business permits is mandatory for all existing and operational businesses within the city.",
    image: "/assets/images/renewal.jpg",
    action: "Start Renewal",
  },
  {
    type: "amendment",
    title: "AMENDMENT",
    icon: "bi-file-earmark-text",
    description:
      "Update your registered business information or amend your existing permit.",
    image: "/assets/images/amendment.jpg",
    action: "Start Amendment",
  },
  {
    type: "special",
    title: "SPECIAL PERMIT",
    icon: "bi-calendar-event",
    description:
      "Apply for permits for special events, temporary activities, and other business operations.",
    image: "/assets/images/special-permit.jpg",
    action: "Apply for Special Permit",
  },
];

const forms = [
  {
    title: "Appoint an Authorized Representative",
    description:
      "Authorize another person to represent you in your business permit transaction.",
    icon: "bi-person-check",
    url: "https://oubpas.quezoncity.gov.ph/registration/registration_zau_approval_form/file_get_attachment/Authorization_Form.pdf",
  },
  {
    title: "Revoke an Authorized Representative",
    description:
      "Revoke a previously submitted authorization of a representative.",
    icon: "bi-person-x",
    url: "https://oubpas.quezoncity.gov.ph/registration/registration_zau_approval_form/file_get_attachment/Revocation_of_Authority.pdf",
  },
  {
    title: "Change Contact Information",
    description:
      "Update the contact information registered under your Mayor's Permit.",
    icon: "bi-person-lines-fill",
    url: "https://oubpas.quezoncity.gov.ph/registration/registration_zau_approval_form/file_get_attachment/Replacement_of_Contact_Information.pdf",
  },
];

export default function ApplicationTypes() {
  const navigate = useNavigate();
  const [formsExpanded, setFormsExpanded] = useState(false);

  const handleApplicationClick = (type) => {
    navigate(`/application/${type}`);
  };

  const handleApplicationKeyDown = (event, type) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleApplicationClick(type);
    }
  };

  return (
    <div className="home-page">
      <fieldset className="home-application-frame">
        <legend className="home-frame-title">HOME</legend>

        <div className="home-frame-inner">
          <section className="application-section">
            <div className="container-fluid application-container">
              <div className="application-heading">
                <h1>TYPE OF APPLICATION</h1>
                <p>
                  Select the type of business permit transaction you want to
                  process.
                </p>
              </div>

              <div className="application-image-grid">
                {applications.map((application) => (
                  <article
                    className="application-image-card"
                    key={application.type}
                    role="link"
                    tabIndex={0}
                    aria-label={`${application.action}: ${application.title}`}
                    onClick={() =>
                      handleApplicationClick(application.type)
                    }
                    onKeyDown={(event) =>
                      handleApplicationKeyDown(
                        event,
                        application.type
                      )
                    }
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <div
                      className="application-image-background"
                      style={{
                        backgroundImage: `url("${application.image}")`,
                      }}
                    />

                    <div className="application-image-overlay" />

                    <div className="application-image-card-content">
                      <div className="application-image-icon">
                        <i className={`bi ${application.icon}`} />
                      </div>

                      <h2 className="application-image-title">
                        {application.title}
                      </h2>

                      <p className="application-image-description">
                        {application.description}
                      </p>

                      <span
                        className="application-image-action"
                        aria-hidden="true"
                      >
                        <span>{application.action}</span>
                        <i className="bi bi-arrow-right" />
                      </span>
                    </div>
                  </article>
                ))}
              </div>

              <section className="forms-section">
                <div className="forms-heading">
                  <div className="forms-heading-icon">
                    <i className="bi bi-file-earmark-text" />
                  </div>

                  <div className="forms-heading-content">
                    <h2>Forms & Authorization</h2>
                    <p>
                      Download forms for authorized representatives and contact
                      information changes.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="forms-toggle"
                    onClick={() => setFormsExpanded(!formsExpanded)}
                    aria-expanded={formsExpanded}
                  >
                    <span>
                      {formsExpanded ? "Hide Forms" : "View Forms"}
                    </span>

                    <i
                      className={`bi ${
                        formsExpanded
                          ? "bi-chevron-up"
                          : "bi-chevron-down"
                      }`}
                    />
                  </button>
                </div>

                {formsExpanded && (
                  <div className="forms-list">
                    {forms.map((form) => (
                      <div className="form-item" key={form.title}>
                        <div className="form-item-icon">
                          <i className={`bi ${form.icon}`} />
                        </div>

                        <div className="form-item-content">
                          <h3>{form.title}</h3>
                          <p>{form.description}</p>
                        </div>

                        <a
                          href={form.url}
                          className="form-download-button"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="bi bi-download" />
                          <span>Download Form</span>
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </section>
        </div>
      </fieldset>

      <section className="help-section">
        <div className="container-fluid application-container">
          <div className="help-content">
            <div>
              <h2>Need help choosing an application type?</h2>
              <p>
                Review the Citizen's Charter or contact us for assistance with
                your business permit transaction.
              </p>
            </div>

            <a href="#" className="help-link">
              View Citizen's Charter
              <i className="bi bi-arrow-right" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
