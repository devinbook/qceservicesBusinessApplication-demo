
import { useRef, useState } from "react";
import "../../../styles/otherRequiredInformation.css";

const questions = [
  "Is the location/area to be used for office purposes only?",
  "Will there be walk-in transactions or sales?",
  "Will there be storage or display of merchandise?",
  "Are you serving or selling liquor?",
  "Is your business located inside a city-owned market, private market or private talipapa?",
  "Do you have a Community Tax Certificate?",
  "Is your business registered as Barangay Micro Business Enterprise (BMBE)?",
  "Is your business activity covered by PAGCOR, Games Amusement Board (GAB), or PCSO regulations? (e.g. POGO, E-Games, E-Bingo, OTB, OCBS, Cockpit, STL, etc.)",
  "Is your business qualified for any tax exemption program?",
  "Is the owner of the business a Person with Disability?",
  "Does the business employ Persons with Disability?",
  "Does your business utilize an internet service subscription?",
];

const createInitialForm = (initialData = {}) => ({
  answers: Object.fromEntries(
    questions.map((_, index) => [
      `question${index + 1}`,
      initialData.answers?.[`question${index + 1}`] ?? "",
    ])
  ),
  applicantType: initialData.applicantType || "Business Owner",
  applicantName: initialData.applicantName || "",
  scannedId: initialData.scannedId || null,
});

export default function OtherRequiredInformation({
  initialData = {},
  onBack,
  onContinue,
  onSaveDraft,
}) {
  const [form, setForm] = useState(() =>
    createInitialForm(initialData)
  );

  const [error, setError] = useState("");
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef(null);

  const updateAnswer = (questionNumber, answer) => {
    setForm((previous) => ({
      ...previous,
      answers: {
        ...previous.answers,
        [`question${questionNumber}`]: answer,
      },
    }));

    setError("");
  };

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setFileError(
        "Please upload a PDF, JPG, or PNG file."
      );
      event.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      setFileError(
        "The selected file must not exceed 5 MB."
      );
      event.target.value = "";
      return;
    }

    updateField("scannedId", file);
    setFileError("");
  };

  const removeFile = () => {
    updateField("scannedId", null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setFileError("");
  };

  const getPayload = () => ({
    ...form,
    scannedId: form.scannedId,
  });

  const handleContinue = (event) => {
    event.preventDefault();

    const unanswered = questions.findIndex(
      (_, index) =>
        !form.answers[`question${index + 1}`]
    );

    if (unanswered !== -1) {
      setError(
        `Please answer Question ${unanswered + 1}.`
      );
      return;
    }

    if (!form.applicantType) {
      setError("Please select an applicant type.");
      return;
    }

    if (!form.applicantName.trim()) {
      setError("Please enter the applicant's full name.");
      return;
    }

    if (!form.scannedId) {
      setError("Please upload a scanned valid ID.");
      return;
    }

    setError("");
    onContinue?.(getPayload());
  };

  const handleSaveDraft = () => {
    onSaveDraft?.(getPayload());
  };

  const renderQuestion = (question, index) => {
    const number = index + 1;
    const value = form.answers[`question${number}`];

    
return (
  <div className="ori-question" key={number}>
    <div className="ori-question-number">
      {String(number).padStart(2, "0")}
    </div>

    <div className="ori-question-content">
      <p className="ori-question-text">
        {question}
        <span className="ori-required"> *</span>
      </p>

      <div
        className="ori-radio-group"
        role="radiogroup"
        aria-label={`Question ${number}: ${question}`}
      >
        {["Yes", "No"].map((option) => (
          <label
            key={option}
            className={`ori-radio-option ${
              value === option
                ? "ori-radio-selected"
                : ""
            }`}
          >
            <input
              type="radio"
              name={`question${number}`}
              value={option}
              checked={value === option}
              onChange={() =>
                updateAnswer(number, option)
              }
            />

            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  </div>
);
    };

  return (
    <div className="ori-wrapper">
      <div className="ori-heading">
        <h3>Other Required Information</h3>

        <p>
          Please provide the following additional
          information about your business.
        </p>
      </div>

      <form
        className="ori-form"
        onSubmit={handleContinue}
        noValidate
        autoComplete="off"
      >
        <section className="ori-card">
          <div className="ori-questionnaire-grid">
            <div className="ori-question-column">
              {questions
                .slice(0, 6)
                .map((question, index) =>
                  renderQuestion(question, index)
                )}
            </div>

            <div className="ori-question-column">
              {questions
                .slice(6, 12)
                .map((question, index) =>
                  renderQuestion(question, index + 6)
                )}
            </div>
          </div>
        </section>

        <section className="ori-card ori-applied-card">
          <div className="ori-section-heading">
            <div className="ori-section-icon">
              <i className="bi bi-person-vcard" />
            </div>

            <div>
              <h3>Applied By</h3>
              <p>
                Provide the details of the person
                submitting this application.
              </p>
            </div>
          </div>

          <div className="ori-applicant-grid">
            <div className="ori-field">
              <label htmlFor="ori-applicant-type">
                Applicant Type
                <span className="ori-required"> *</span>
              </label>

              <select
                id="ori-applicant-type"
                value={form.applicantType}
                onChange={(event) =>
                  updateField(
                    "applicantType",
                    event.target.value
                  )
                }
              >
                <option value="Business Owner">
                  Business Owner
                </option>

                <option value="Authorized Representative">
                  Authorized Representative
                </option>
              </select>
            </div>

            <div className="ori-field">
              <label htmlFor="ori-applicant-name">
                Full Name
                <span className="ori-required"> *</span>
              </label>

              <input
                id="ori-applicant-name"
                type="text"
                placeholder="Enter applicant's full name"
                value={form.applicantName}
                onChange={(event) =>
                  updateField(
                    "applicantName",
                    event.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="ori-upload-section">
            <label className="ori-upload-label">
              Scanned Valid ID of the Applicant
              <span className="ori-required"> *</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              id="ori-file-input"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="ori-hidden-input"
            />

            {!form.scannedId ? (
              <label
                htmlFor="ori-file-input"
                className="ori-upload-box"
              >
                <span className="ori-upload-icon">
                  <i className="bi bi-cloud-arrow-up" />
                </span>

                <strong>
                  Click to upload a scanned valid ID
                </strong>

                <span>
                  PDF, JPG, or PNG (Maximum 5 MB)
                </span>

                <span className="ori-upload-button">
                  <i className="bi bi-folder2-open" />
                  CHOOSE FILE
                </span>
              </label>
            ) : (
              <div className="ori-uploaded-file">
                <div className="ori-file-icon">
                  <i className="bi bi-file-earmark-check" />
                </div>

                <div className="ori-file-info">
                  <strong>
                    {form.scannedId.name ||
                      form.scannedId.fileName ||
                      "Previously uploaded document"}
                  </strong>

                  <span>
                    {form.scannedId.size
                      ? `${(
                          form.scannedId.size /
                          (1024 * 1024)
                        ).toFixed(2)} MB`
                      : "File selected"}
                  </span>
                </div>

                <button
                  type="button"
                  className="ori-remove-file"
                  onClick={removeFile}
                  aria-label="Remove uploaded file"
                >
                  <i className="bi bi-x-lg" />
                </button>
              </div>
            )}

            {fileError && (
              <p className="ori-file-error">
                {fileError}
              </p>
            )}
          </div>

          <div className="ori-important-note">
            <i className="bi bi-info-circle" />

            <p>
              <strong>Important:</strong> Do not upload
              any authorization form other than the
              downloaded form provided on this website.
              Uploading other authorization forms may
              result in your application being placed
              on hold or rejected.
            </p>
          </div>

          <div className="ori-sanitary-note">
            <i className="bi bi-clipboard2-pulse" />

            <span>
              Don't have a Sanitary Permit yet?{" "}
              <a
                href="#"
                onClick={(event) =>
                  event.preventDefault()
                }
              >
                Click here to apply.
              </a>
            </span>
          </div>
        </section>

        {error && (
          <div className="ori-error" role="alert">
            <i className="bi bi-exclamation-circle" />
            {error}
          </div>
        )}

        <div className="ori-navigation">
          <button
            type="button"
            className="ori-nav-button"
            onClick={onBack}
          >
            <i className="bi bi-arrow-left" />
            BACK
          </button>

          <div className="ori-navigation-right">
            <button
              type="button"
              className="ori-nav-button"
              onClick={handleSaveDraft}
              disabled={!onSaveDraft}
            >
              <i className="bi bi-floppy" />
              SAVE AS DRAFT
            </button>

            <button
              type="submit"
              className="ori-nav-button ori-primary-button"
            >
              CONTINUE
              <i className="bi bi-arrow-right" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
