
import { useRef, useState } from "react";

const acceptedTypes = ".jpeg,.jpg,.png,.pdf,.doc,.docx";
const maxFileSize = 5 * 1024 * 1024;

const documents = [
  {
    id: "registration",
    title: "Proof of Business Registration",
    description:
      "DTI for Sole Proprietorship / SEC for Corporations and Partnerships / CDA for Cooperatives",
    required: true,
  },
  {
    id: "lease",
    title: "Contract of Lease",
    description:
      "If leased, or Tax Declaration if owned",
    required: true,
  },
  {
    id: "other",
    title: "Other documentary file/s as needed",
    description: "",
    required: false,
  },
];

const photos = [
  {
    id: "front",
    title: "Front View of Business Establishment",
  },
  {
    id: "area",
    title: "Area of Business Activity",
  },
  {
    id: "left",
    title: "Street View of Business Establishment (Left)",
  },
  {
    id: "right",
    title: "Street View of Business Establishment (Right)",
  },
];

function UploadField({ files = [], onChange, accept = acceptedTypes }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const validateFiles = (selected) => {
    const allowedExtensions = accept
      .split(",")
      .map((extension) => extension.trim().toLowerCase());

    const valid = selected.filter((file) => {
      const extension = `.${file.name.split(".").pop().toLowerCase()}`;

      return (
        allowedExtensions.includes(extension) &&
        file.size <= maxFileSize
      );
    });

    if (valid.length !== selected.length) {
      window.alert(
        "Only supported files up to 5 MB each are allowed."
      );
    }

    if (valid.length > 0) {
      onChange(valid);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    validateFiles(Array.from(event.dataTransfer.files));
  };

  return (
    <div className="doc-upload-wrapper">
      <div
        className={`doc-upload-zone ${dragging ? "dragging" : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <i className="bi bi-cloud-arrow-up" />

        <span className="doc-upload-hint">
          Drag and drop files here or
        </span>

        <button
          type="button"
          className="doc-browse-button"
          onClick={() => inputRef.current?.click()}
        >
          Browse
        </button>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          hidden
          onChange={(event) => {
            validateFiles(Array.from(event.target.files || []));
            event.target.value = "";
          }}
        />
      </div>

      {files.length > 0 && (
        <div className="doc-uploaded-files">
          {files.map((file, index) => (
            <div
              className="doc-uploaded-file"
              key={`${file.name}-${index}`}
            >
              <i className="bi bi-file-earmark-check" />
              <span title={file.name}>{file.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DocumentaryRequirements({
  onBack,
  onContinue,
}) {
  const [nanoEnterprise, setNanoEnterprise] = useState("");
  const [files, setFiles] = useState({});
  const [photosExpanded, setPhotosExpanded] = useState(false);
  const [checkedDocuments, setCheckedDocuments] = useState({});
  const [error, setError] = useState("");

  const today = new Date();
  const date = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const handleFiles = (id, selectedFiles) => {
    setFiles((previous) => ({
      ...previous,
      [id]: selectedFiles,
    }));

    setCheckedDocuments((previous) => ({
      ...previous,
      [id]: true,
    }));

    setError("");
  };

  const toggleDocument = (id) => {
    setCheckedDocuments((previous) => ({
      ...previous,
      [id]: !previous[id],
    }));
  };

  const handleContinue = () => {
  setError("");
  onContinue();
    };

  return (
    <div className="documentary-page">
      <div className="documentary-government-header">
        <div className="documentary-government-logo">
          <img
            src="/assets/images/qc-logo.png"
            alt="Quezon City Government"
          />
        </div>

        <div className="documentary-government-title">
          <div>REPUBLIC OF THE PHILIPPINES</div>
          <div>QUEZON CITY</div>
          <div>BUSINESS PERMITS AND LICENSING DEPARTMENT</div>
          <small>Tel. no. 8988-4242 (Loc. 8174 / 8282)</small>
        </div>

        <div className="documentary-government-logo">
          <img
            src="/assets/images/qc-tree.png"
            alt="Quezon City Government"
          />
        </div>
      </div>

      <div className="documentary-application-info">
        <div className="documentary-info-column">
          <div className="documentary-info-row">
            <label>Application Type:</label>
            <span className="documentary-application-type">
              NEW
            </span>
          </div>

          <div className="documentary-info-row">
            <label>FISCAL YEAR:</label>
            <input
              type="text"
              value={today.getFullYear()}
              readOnly
            />
          </div>
        </div>

        <div className="documentary-info-column">
          <div className="documentary-info-row">
            <label>Date of Receipt:</label>
            <input type="text" value={date} readOnly />
          </div>

          <div className="documentary-info-row">
            <label>Tracking Number:</label>
            <input type="text" value="" readOnly />
          </div>
        </div>
      </div>

      <div className="documentary-section-heading">
        <div>
          <h3>Basic Documentary Requirements</h3>
          <p>
            (Allowed file types: .jpeg, .jpg, .png, .pdf, .doc and
            .docx)
          </p>
        </div>
      </div>

      <section className="documentary-requirements-card">
        <div className="nano-enterprise-row">
          <div className="nano-enterprise-question">
            <span className="document-required">*</span>
            <span>
              Are you a nano-enterprise with an asset size not
              exceeding Php 50,000?
            </span>

            <span
              className="document-help-icon"
              title="Select Yes if your business is a nano-enterprise with assets not exceeding Php 50,000."
            >
              <i className="bi bi-question-circle" />
            </span>
          </div>

          <div className="nano-enterprise-options">
            <label>
              <input
                type="radio"
                name="nanoEnterprise"
                value="yes"
                checked={nanoEnterprise === "yes"}
                onChange={() => {
                  setNanoEnterprise("yes");
                  setError("");
                }}
              />
              Yes
            </label>

            <label>
              <input
                type="radio"
                name="nanoEnterprise"
                value="no"
                checked={nanoEnterprise === "no"}
                onChange={() => {
                  setNanoEnterprise("no");
                  setError("");
                }}
              />
              No
            </label>
          </div>
        </div>

        <div className="documentary-upload-list">
          {documents.slice(0, 2).map((document) => (
            <div className="documentary-upload-row" key={document.id}>
              <div className="documentary-upload-description">
                <input
                  type="checkbox"
                  checked={Boolean(checkedDocuments[document.id])}
                  onChange={() => toggleDocument(document.id)}
                />

                <div>
                  <div className="documentary-upload-title">
                    <span className="document-required">*</span>
                    <strong>{document.title}</strong>
                    <span>({document.description})</span>
                  </div>
                  <small>Required</small>
                </div>
              </div>

              <UploadField
                files={files[document.id]}
                onChange={(selected) =>
                  handleFiles(document.id, selected)
                }
              />
            </div>
          ))}

          <div className="documentary-photo-section">
            <div className="documentary-photo-heading">
              <div className="documentary-upload-description">
                <input
                  type="checkbox"
                  checked={photos.every((photo) => files[photo.id]?.length)}
                  onChange={(event) => {
                    if (event.target.checked) {
                      setPhotosExpanded(true);
                    } else {
                      setPhotosExpanded(false);
                    }
                  }}
                />

                <div className="documentary-upload-title">
                  <span className="document-required">*</span>
                  <strong>Photos of location of business</strong>
                  <small>(Required)</small>
                </div>
              </div>

              <button
                type="button"
                className="documentary-expand-button"
                onClick={() => setPhotosExpanded((previous) => !previous)}
                aria-expanded={photosExpanded}
                aria-label="Toggle photo requirements"
              >
                <i
                  className={`bi ${
                    photosExpanded
                      ? "bi-chevron-up"
                      : "bi-chevron-down"
                  }`}
                />
              </button>
            </div>

            {photosExpanded && (
              <div className="documentary-photo-list">
                {photos.map((photo) => (
                  <div
                    className="documentary-upload-row documentary-photo-row"
                    key={photo.id}
                  >
                    <div className="documentary-upload-description">
                      <i className="bi bi-camera" />

                      <div className="documentary-upload-title">
                        <span className="document-required">*</span>
                        <strong>{photo.title}</strong>
                      </div>
                    </div>

                    <UploadField
                      files={files[photo.id]}
                      accept=".jpeg,.jpg,.png"
                      onChange={(selected) =>
                        handleFiles(photo.id, selected)
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="documentary-upload-row">
            <div className="documentary-upload-description">
              <input
                type="checkbox"
                checked={Boolean(checkedDocuments.other)}
                onChange={() => toggleDocument("other")}
              />

              <div className="documentary-upload-title">
                <span>Other documentary file/s as needed</span>
              </div>
            </div>

            <UploadField
              files={files.other}
              onChange={(selected) => handleFiles("other", selected)}
            />
          </div>
        </div>

        {error && (
          <div className="documentary-error" role="alert">
            <i className="bi bi-exclamation-circle" />
            {error}
          </div>
        )}
      </section>

      <div className="application-actions documentary-actions">
        <button
          type="button"
          className="btn-back"
          onClick={onBack}
        >
          <i className="bi bi-arrow-left" />
          BACK
        </button>

        <button
          type="button"
          className="btn-continue"
          onClick={handleContinue}
        >
          CONTINUE
          <i className="bi bi-arrow-right" />
        </button>
      </div>
    </div>
  );
}
