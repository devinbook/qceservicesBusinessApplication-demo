
import { useState } from "react";
import { useParams, Link } from "react-router-dom";

import { applicationTypes } from "../config/applicationTypes.js";

import ApplicationStepper from "../components/application/ApplicationStepper.jsx";

import DocumentaryRequirements from "../components/application/new-business/DocumentaryRequirements.jsx";
import BusinessInformation from "../components/application/new-business/BusinessInformation.jsx";
import BusinessOperations from "../components/application/new-business/BusinessOperations.jsx";
import BusinessActivity from "../components/application/new-business/BusinessActivity.jsx";
import OtherRequiredInformation from "../components/application/new-business/OtherRequiredInformation.jsx";

import AmendmentNature from "../components/application/amendment/AmendmentNature.jsx";
import AmendmentDocumentaryRequirements from "../components/application/amendment/DocumentaryRequirements.jsx";

import "../styles/amendment.css";

const notes = [
  "Subject to permissibility evaluation of the Zoning Administration Unit",
  "Subject to proof of ownership/right to use property by the City Assessor's Office",
  "Required to comply with other local ancillary agencies and national regulatory permits",
  "Travel agencies are required to submit surety bond",
];

const additionalRequirements = [
  "Tax Incentive Certificates",
  "Community Tax Certificate (Cedula)",
  "BMBE Certificate of Authority from DTI",
  "Letter of No Objection (LONO)",
  "Gambling Regulatory Advisory Council Resolution (GRAC)",
  "Special Permit / Fixed Term Special Permit",
  "Market Certificate",
  "Certificate of PEZA Accreditation",
  "Certificate of Exemption from DOST",
  "ID of Authorized Representative",
  "Signed Authorization Form",
];

function General({ type, onContinue }) {
  const [agreed, setAgreed] = useState(false);

  const config = applicationTypes[type];

  return (
    <>
      <div className="application-step-heading">
        <h2>Welcome To Unified Online Business Permit Application</h2>
      </div>

      <section className="requirements-detail-card">
        <div className="requirements-card-header">
          <div className="requirements-card-icon">
            <i className="bi bi-clipboard-check" />
          </div>

          <div>
            <h3>Application Requirements</h3>
            <p>
              Before proceeding, please prepare the following
              documents.
            </p>
          </div>
        </div>

        <div className="requirements-content">
          <h4 className="requirements-subheading">
            <i className="bi bi-exclamation-circle" />
            Required Documents
          </h4>

          {type === "new" ? (
            <>
              <div className="requirements-grid">
                <div>
                  <ol className="requirements-list">
                    <li>
                      <strong>
                        Proof of Business Registration
                      </strong>
                      <p>
                        DTI for sole proprietorships,
                        SEC for corporations and
                        partnerships, or CDA for
                        cooperatives.
                      </p>
                    </li>

                    <li>
                      <strong>
                        Contract of Lease or Tax Declaration
                      </strong>
                      <p>
                        Contract of Lease if the property
                        is leased, or Tax Declaration if
                        the property is owned.
                      </p>
                    </li>
                  </ol>
                </div>

                <div>
                  <ol
                    start="3"
                    className="requirements-list"
                  >
                    <li>
                      <strong>
                        Sketch and Photos of Business Location
                      </strong>
                      <p>
                        Prepare a sketch and photographs
                        of the business premises, when
                        applicable.
                      </p>
                    </li>

                    <li>
                      <strong>
                        Valid ID of the Business Owner
                      </strong>
                      <p>
                        Prepare a clear copy of the
                        owner's valid identification
                        document.
                      </p>
                    </li>
                  </ol>
                </div>
              </div>

              <div className="requirement-reminder">
                <strong>
                  Contract of Lease reminders:
                </strong>

                <ul>
                  <li>
                    Include the TCT or property description.
                  </li>
                  <li>
                    Must be duly signed and notarized.
                  </li>
                  <li>
                    Must indicate the lessor and lessee.
                  </li>
                  <li>
                    Must specify the use of the premises
                    as a place of business.
                  </li>
                </ul>
              </div>

              <h4 className="requirements-subheading additional-heading">
                <i className="bi bi-file-earmark-plus" />
                Other Requirements That May Be Needed
              </h4>

              <p className="requirements-note">
                Additional documents may be requested
                depending on your business activity,
                classification, and applicable
                regulatory requirements.
              </p>

              <div className="additional-requirements-grid">
                {additionalRequirements.map((item) => (
                  <div
                    className="additional-requirement"
                    key={item}
                  >
                    <i className="bi bi-check-circle" />
                    {item}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="requirements-note">
              Documentary requirements depend on the
              application type and requested changes.
              Confirm the applicable checklist before
              submitting.
            </p>
          )}

          <div className="file-guidelines">
            <i className="bi bi-info-circle" />

            <div>
              <strong>Accepted file types</strong>
              <p>
                JPEG, JPG, PNG, PDF, DOC and DOCX.
                Maximum file size: 5 MB per file.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="info-card">
        <h3>General Instructions</h3>

        <ol>
          <li>
            Complete all required fields clearly
            and accurately.
          </li>

          <li>
            Attach all necessary supporting documents.
            Incomplete applications may be returned
            for completion.
          </li>
        </ol>
      </section>

      <section className="info-card authorization-card">
        <h3>Authorization Form</h3>

        <p>
          For applications processed by an authorized
          representative, download the{" "}
          <a
            href="https://oubpas.quezoncity.gov.ph/registration/registration_zau_approval_form/file_get_attachment/Authorization_Form.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Authorization Form
          </a>
          , have it signed by the owner, and prepare
          valid IDs of the owner and representative.
        </p>
      </section>

      {type === "new" && (
        <section className="important-notes-card">
          <h3>
            <i className="bi bi-exclamation-triangle" />
            Important Notes / Reminders
          </h3>

          <ol>
            {notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ol>
        </section>
      )}

      <div className="application-agreement">
        <label className="agreement-label">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) =>
              setAgreed(event.target.checked)
            }
          />

          <span>
            I confirm that I have read and agree to the{" "}
            <strong>
              Unified Online Business Permit
              Application Guidelines.
            </strong>
          </span>
        </label>
      </div>

      <div className="application-actions">
        <Link to="/" className="btn-back">
          BACK
        </Link>

        <button
          type="button"
          className="btn-continue"
          disabled={!agreed}
          onClick={onContinue}
        >
          CONTINUE
        </button>
      </div>
    </>
  );
}

function PlaceholderStep({
  title,
  step,
  totalSteps,
  onBack,
  onContinue,
  isLastStep = false,
}) {
  return (
    <div className="placeholder-step">
      <div className="application-step-heading">
        <span>
          STEP {step} OF {totalSteps}
        </span>

        <h2>{title}</h2>

        <p>
          {title === "Summary Page"
            ? "Review your business permit application details before submission."
            : title === "Evaluation History"
            ? "View the evaluation history of your amendment application."
            : "Complete the information required for this application step."}
        </p>
      </div>

      {title === "Summary Page" && (
        <section className="info-card">
          <h3>Application Summary</h3>

          <p>
            The application summary and final submission
            functionality will be added on this page.
          </p>
        </section>
      )}

      <div className="application-actions">
        <button
          type="button"
          className="btn-back"
          onClick={onBack}
        >
          BACK
        </button>

        {!isLastStep && (
          <button
            type="button"
            className="btn-continue"
            onClick={onContinue}
          >
            CONTINUE
          </button>
        )}
      </div>
    </div>
  );
}

export default function Application() {
  const { type } = useParams();

  const config = applicationTypes[type];

  const [step, setStep] = useState(1);

  const [
    businessInformation,
    setBusinessInformation,
  ] = useState({});

  const [
    businessOperations,
    setBusinessOperations,
  ] = useState({});

  const [
    businessActivity,
    setBusinessActivity,
  ] = useState({});

  const [
    otherRequiredInformation,
    setOtherRequiredInformation,
  ] = useState({});

  const [
    amendmentNature,
    setAmendmentNature,
  ] = useState({});

  const [
    amendmentDocuments,
    setAmendmentDocuments,
  ] = useState({});

  if (!config) {
    return (
      <div className="container py-5">
        <h2>Application type not found</h2>

        <Link to="/">
          Back to Home
        </Link>
      </div>
    );
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleContinue = () => {
    setStep((previous) =>
      Math.min(
        previous + 1,
        config.steps.length
      )
    );

    scrollToTop();
  };

  const handleBack = () => {
    setStep((previous) =>
      Math.max(previous - 1, 1)
    );

    scrollToTop();
  };

  const handleStepClick = (selectedStep) => {
    if (
      selectedStep < 1 ||
      selectedStep > config.steps.length
    ) {
      return;
    }

    setStep(selectedStep);
    scrollToTop();
  };

  const handleAmendmentNatureContinue = (data) => {
    setAmendmentNature(data);
    handleContinue();
  };

  const handleAmendmentDocumentsContinue = (data) => {
    setAmendmentDocuments(data);
    handleContinue();
  };

  const handleBusinessInformationContinue = (data) => {
    setBusinessInformation(data);
    handleContinue();
  };

  const handleBusinessOperationsContinue = (data) => {
    setBusinessOperations(data);
    handleContinue();
  };

  const handleBusinessActivityContinue = (data) => {
    setBusinessActivity(data);
    handleContinue();
  };

  const handleOtherRequiredInformationContinue = (data) => {
    setOtherRequiredInformation(data);
    handleContinue();
  };

  const handleBusinessOperationsSaveDraft = (data) => {
    setBusinessOperations(data);

    localStorage.setItem(
      "qces-business-operations-draft",
      JSON.stringify(data)
    );
  };

  const handleBusinessActivitySaveDraft = (data) => {
    setBusinessActivity(data);

    localStorage.setItem(
      "qces-business-activity-draft",
      JSON.stringify(data)
    );
  };

  const handleOtherRequiredInformationSaveDraft = (data) => {
    setOtherRequiredInformation(data);

    const {
      scannedId,
      ...serializableData
    } = data;

    localStorage.setItem(
      "qces-other-required-information-draft",
      JSON.stringify(serializableData)
    );
  };

  const renderStep = () => {
    if (step === 1) {
      return (
        <General
          type={type}
          onContinue={handleContinue}
        />
      );
    }

    if (
      type === "amendment" &&
      step === 2
    ) {
      return (
        <AmendmentNature
          initialData={amendmentNature}
          onBack={handleBack}
          onContinue={
            handleAmendmentNatureContinue
          }
        />
      );
    }

    if (
      type === "amendment" &&
      step === 3
    ) {
      return (
        <AmendmentDocumentaryRequirements
          initialData={amendmentDocuments}
          onBack={handleBack}
          onContinue={
            handleAmendmentDocumentsContinue
          }
        />
      );
    }

    if (type === "new") {
      switch (step) {
        case 2:
          return (
            <DocumentaryRequirements
              onBack={handleBack}
              onContinue={handleContinue}
            />
          );

        case 3:
          return (
            <BusinessInformation
              onBack={handleBack}
              onContinue={
                handleBusinessInformationContinue
              }
            />
          );

        case 4:
          return (
            <BusinessOperations
              onBack={handleBack}
              onContinue={
                handleBusinessOperationsContinue
              }
              onSaveDraft={
                handleBusinessOperationsSaveDraft
              }
              mainOfficeAddress={
                businessInformation
              }
              initialData={
                businessOperations
              }
              barangays={[]}
            />
          );

        case 5:
          return (
            <BusinessActivity
              onBack={handleBack}
              onContinue={
                handleBusinessActivityContinue
              }
              onSaveDraft={
                handleBusinessActivitySaveDraft
              }
              initialData={
                businessActivity
              }
            />
          );

        case 6:
          return (
            <OtherRequiredInformation
              onBack={handleBack}
              onContinue={
                handleOtherRequiredInformationContinue
              }
              onSaveDraft={
                handleOtherRequiredInformationSaveDraft
              }
              initialData={
                otherRequiredInformation
              }
            />
          );

        default:
          break;
      }
    }

    return (
      <PlaceholderStep
        title={config.steps[step - 1]}
        step={step}
        totalSteps={config.steps.length}
        onBack={handleBack}
        onContinue={handleContinue}
        isLastStep={
          step === config.steps.length
        }
      />
    );
  };

  return (
    <section className="application-page">
      <fieldset className="unified-application-container">
        <legend className="unified-application-title">
          UNIFIED ONLINE BUSINESS PERMIT APPLICATION
        </legend>

        <div className="application-page-inner">
          <div className="application-page-heading">
            <Link
              to="/"
              className="back-home-button"
            >
              <i className="bi bi-arrow-left" />
              <span>Back to Home</span>
            </Link>

            {type !== "new" && (
              <div className="application-page-title">
                <h1>{config.title}</h1>
                <p>{config.description}</p>
              </div>
            )}
          </div>

          <ApplicationStepper
            steps={config.steps}
            currentStep={step}
            onStepClick={handleStepClick}
          />

          {renderStep()}
        </div>
      </fieldset>
    </section>
  );
}
