
import { useEffect, useRef, useState } from "react";
import "../../../styles/amendmentDocumentary.css";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ACCEPTED_TYPES = ".pdf,.jpg,.jpeg,.png,.doc,.docx";

const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".doc",
  ".docx",
];

const requirements = [
  {
    id: "mayorsPermit",
    title: "Mayor's Permit Original",
  },
  {
    id: "latestReceipt",
    title: "Bill & O.R. Latest (Updated)",
  },
  {
    id: "dti",
    title: "DTI",
  },
  {
    id: "lease",
    title:
      "Contract of Lease (if rented) / Proof of Ownership (if owned)",
  },
  {
    id: "propertyDocuments",
    title: "TCT / Tax Declaration / RPT",
  },
  {
    id: "barangayClearance",
    title: "Barangay Clearance (if applicable)",
  },
  {
    id: "others",
    title: "Others",
  },
];

function formatDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}

function DocumentRow({
  document,
  files,
  onSelect,
  onRemove,
  onView,
}) {
  const inputRef = useRef(null);
  const selectedFiles = files || [];
  const isOthers = document.id === "others";

  const handleFileChange = (event) => {
    const selected = Array.from(event.target.files || []);

    if (selected.length > 0) {
      onSelect(document.id, selected);
    }

    event.target.value = "";
  };

  return (
    <div className="amendment-document-row">
      <div className="amendment-document-name">
        <i className="bi bi-file-earmark-text" />
        <span>{document.title}</span>
      </div>

      <div className="amendment-document-files">
        {selectedFiles.length > 0 ? (
          selectedFiles.map((file, index) => (
            <div
              className="amendment-attached-file"
              key={`${file.name}-${index}`}
            >
              <i className="bi bi-file-earmark-check" />

              <span
                className="amendment-file-name"
                title={file.name}
              >
                {file.name}
              </span>

              <button
                type="button"
                className="amendment-view-button"
                onClick={() => onView(file)}
              >
                <i className="bi bi-eye" />
                VIEW
              </button>

              <button
                type="button"
                className="amendment-remove-button"
                title="Remove file"
                aria-label={`Remove ${file.name}`}
                onClick={() => onRemove(document.id, index)}
              >
                <i className="bi bi-x-circle" />
              </button>
            </div>
          ))
        ) : (
          <span className="amendment-no-file">
            No document selected
          </span>
        )}
      </div>

      <div className="amendment-document-upload">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          multiple={isOthers}
          hidden
          onChange={handleFileChange}
        />

        <button
          type="button"
          className="amendment-upload-button"
          onClick={() => inputRef.current?.click()}
        >
          <i className="bi bi-upload" />
          {selectedFiles.length > 0
            ? isOthers
              ? "ADD FILES"
              : "REPLACE"
            : "SELECT FILE"}
        </button>
      </div>
    </div>
  );
}

export default function DocumentaryRequirements({
  initialData = {},
  onBack,
  onContinue,
}) {
  const [files, setFiles] = useState(
    initialData.files || {}
  );

  const [error, setError] = useState("");

  const [applicationDate] = useState(
    () => initialData.applicationDate || formatDate(new Date())
  );

  const [preview, setPreview] = useState(null);
  const previewUrlRef = useRef(null);

  const mayorsPermitNumber =
    initialData.mayorsPermitNumber || "17-012265";

  const trackingNumber =
    initialData.trackingNumber || "AMEND2026";

  const closePreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setPreview(null);
  };

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const handleSelectFiles = (id, selectedFiles) => {
    const invalidFile = selectedFiles.find((file) => {
      const extension = `.${file.name
        .split(".")
        .pop()
        .toLowerCase()}`;

      return (
        !ALLOWED_EXTENSIONS.includes(extension) ||
        file.size > MAX_FILE_SIZE
      );
    });

    if (invalidFile) {
      setError(
        "Only PDF, JPG, JPEG, PNG, DOC and DOCX files up to 5 MB each are allowed."
      );
      return;
    }

    setFiles((previous) => ({
      ...previous,
      [id]:
        id === "others"
          ? [...(previous[id] || []), ...selectedFiles]
          : selectedFiles.slice(0, 1),
    }));

    setError("");
  };

  const handleRemoveFile = (id, index) => {
    setFiles((previous) => ({
      ...previous,
      [id]: (previous[id] || []).filter(
        (_, fileIndex) => fileIndex !== index
      ),
    }));

    setError("");
  };

  const handleViewFile = (file) => {
    closePreview();

    const url = URL.createObjectURL(file);

    previewUrlRef.current = url;

    setPreview({
      name: file.name,
      type: file.type,
      url,
    });
  };

  const handleContinue = () => {
    onContinue?.({
      files,
      applicationType: "AMENDMENT",
      applicationDate,
      mayorsPermitNumber,
      trackingNumber,
    });
  };

  const totalFiles = Object.values(files).reduce(
    (total, fileList) => total + fileList.length,
    0
  );

  const canPreview = preview
    ? preview.type === "application/pdf" ||
      preview.type.startsWith("image/") ||
      /\.(pdf|jpe?g|png)$/i.test(preview.name)
    : false;

  return (
    <div className="amendment-documentary">
      <div className="amendment-government-header">
        <div className="amendment-government-logo">
          <img
            src="/assets/images/qc-logo.png"
            alt="Quezon City Government"
          />
        </div>

        <div className="amendment-government-title">
          <div>REPUBLIC OF THE PHILIPPINES</div>
          <div>QUEZON CITY</div>
          <div>
            BUSINESS PERMITS AND LICENSING DEPARTMENT
          </div>
          <small>
            Tel. no. 8988-4242 (Loc. 8174 / 8282)
          </small>
        </div>

        <div className="amendment-government-logo">
          <img
            src="/assets/images/qc-tree.png"
            alt="Quezon City Government"
          />
        </div>
      </div>

      <div className="amendment-application-details">
        <div className="amendment-details-column">
          <div className="amendment-details-row">
            <label>Application Type:</label>
            <span className="amendment-type">
              AMENDMENT
            </span>
          </div>

          <div className="amendment-details-row">
            <label>Mayor's Permit Number:</label>
            <input
              type="text"
              value={mayorsPermitNumber}
              readOnly
            />
          </div>
        </div>

        <div className="amendment-details-column">
          <div className="amendment-details-row">
            <label>Application Date:</label>
            <input
              type="text"
              value={applicationDate}
              readOnly
            />
          </div>

          <div className="amendment-details-row">
            <label>Tracking Number:</label>
            <input
              type="text"
              value={trackingNumber}
              readOnly
            />
          </div>
        </div>
      </div>

      <section className="amendment-documentary-card">
        <div className="amendment-documentary-header">
          <div>
            <h3>Supporting Documents</h3>
            <p>
              Select the applicable files for your
              amendment request.
            </p>
          </div>

          <span className="amendment-document-count">
            {totalFiles} File(s) Selected
          </span>
        </div>

        <div className="amendment-document-table">
          <div className="amendment-document-table-header">
            <span>DOCUMENT REQUIREMENTS</span>
            <span>ATTACHED DOCUMENT</span>
            <span>ACTION</span>
          </div>

          {requirements.map((document) => (
            <DocumentRow
              key={document.id}
              document={document}
              files={files[document.id] || []}
              onSelect={handleSelectFiles}
              onRemove={handleRemoveFile}
              onView={handleViewFile}
            />
          ))}
        </div>

        <div className="amendment-document-guidelines">
          <i className="bi bi-info-circle" />

          <span>
            Accepted formats: PDF, JPG, JPEG, PNG,
            DOC and DOCX. Maximum file size is 5 MB
            per file. Documentary requirements may
            vary depending on the nature of amendment.
          </span>
        </div>

        {error && (
          <div
            className="amendment-document-error"
            role="alert"
          >
            <i className="bi bi-exclamation-circle" />
            {error}
          </div>
        )}
      </section>

      <div className="application-actions amendment-documentary-actions">
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

      {preview && (
        <div
          className="amendment-preview-overlay"
          role="presentation"
          onClick={closePreview}
        >
          <div
            className="amendment-preview-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Document preview"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="amendment-preview-header">
              <strong>{preview.name}</strong>

              <button
                type="button"
                onClick={closePreview}
                aria-label="Close preview"
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>

            {canPreview ? (
              <iframe
                src={preview.url}
                title={preview.name}
              />
            ) : (
              <div className="amendment-preview-message">
                Preview is not available for this
                file type. You can download the file
                and open it using a compatible application.
              </div>
            )}

            <a
              href={preview.url}
              download={preview.name}
              className="amendment-download-link"
            >
              <i className="bi bi-download" />
              Download File
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
