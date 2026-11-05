
import { useState } from "react";
import BusinessActivityModal from "./BusinessActivityModal";
import "../../styles/businessActivity.css";

const emptyForm = {
  capitalInvestment: "",
  hasTaxIncentives: "",
  businessActivityType: "Main Office",
  businessOperationDescription: "",
  activities: [],
};

const activityTypes = [
  {
    value: "Main Office",
    icon: "bi-building",
    description: "Primary business location",
  },
  {
    value: "Branch",
    icon: "bi-shop",
    description: "Branch establishment",
  },
  {
    value: "Admin Office Only",
    icon: "bi-bank",
    description: "Administrative operations",
  },
];

export default function BusinessActivity({
  initialData = {},
  onBack,
  onContinue,
  onSaveDraft,
}) {
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    ...initialData,
    activities: Array.isArray(initialData.activities)
      ? initialData.activities
      : [],
  }));

  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [error, setError] = useState("");

  const updateField = (name, value) => {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const openAddModal = () => {
    setEditingIndex(null);
    setModalOpen(true);
  };

  const openEditModal = (index) => {
    setEditingIndex(index);
    setModalOpen(true);
  };

  const saveActivity = (activity) => {
    setForm((previous) => {
      const activities = [...previous.activities];

      if (editingIndex === null) {
        activities.push(activity);
      } else {
        activities[editingIndex] = activity;
      }

      return {
        ...previous,
        activities,
      };
    });

    setModalOpen(false);
    setEditingIndex(null);
    setError("");
  };

  const deleteActivity = (index) => {
    if (!window.confirm("Delete this business activity?")) {
      return;
    }

    setForm((previous) => ({
      ...previous,
      activities: previous.activities.filter(
        (_, activityIndex) => activityIndex !== index
      ),
    }));
  };

  const handleContinue = (event) => {
    event.preventDefault();

    if (
      form.capitalInvestment === "" ||
      !Number.isFinite(Number(form.capitalInvestment)) ||
      Number(form.capitalInvestment) < 0
    ) {
      setError("Please enter a valid Total Capital Investment.");
      return;
    }

    if (!form.hasTaxIncentives) {
      setError("Please select whether you have tax incentives.");
      return;
    }

    if (!form.businessActivityType) {
      setError("Please select your Business Activity type.");
      return;
    }

    if (form.activities.length === 0) {
      setError("Please add at least one business activity.");
      return;
    }

    setError("");
    onContinue?.(form);
  };

  const handleSaveDraft = () => {
    onSaveDraft?.(form);
  };

  const formatCurrency = (value) => {
    if (value === "" || value === null || value === undefined) {
      return "0.00";
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
      return "0.00";
    }

    return number.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="ba-wrapper">
      <div className="ba-heading">
        <h3>Business Activity</h3>
        <p>
          Provide details of your business activities,
          investments, and equipment.
        </p>
      </div>

      <form
        className="ba-form"
        onSubmit={handleContinue}
        noValidate
        autoComplete="off"
      >
        <section className="ba-card ba-information-card">
          <div className="ba-information-body">
            <div className="ba-information-top">
              <div className="ba-investment-panel">
                <div className="ba-section-title">
                  <h4>
                    Capital Investment <em>*</em>
                  </h4>
                </div>

                <label
                  className="ba-capital-label"
                  htmlFor="ba-capital"
                >
                  Total Capital Investment (PHP)
                </label>

                <div className="ba-capital-input">
                  <span className="ba-peso-symbol">₱</span>

                  <input
                    id="ba-capital"
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    value={form.capitalInvestment}
                    onChange={(event) =>
                      updateField(
                        "capitalInvestment",
                        event.target.value
                      )
                    }
                    placeholder="0.00"
                  />
                </div>

                <div className="ba-capital-preview">
                  <span>Entered Capital Investment</span>
                  <strong>
                    ₱ {formatCurrency(form.capitalInvestment)}
                  </strong>
                </div>

                <p className="ba-capital-help">
                  Paid-up Capital + Lease Expenses + Equipment
                </p>
              </div>

              <div className="ba-incentives-panel">
                <div className="ba-section-title">
                  <h4>
                    Government Tax Incentives <em>*</em>
                  </h4>
                </div>

                <p className="ba-section-description">
                  Does your business receive tax incentives
                  from any government entity?
                </p>

                <div className="ba-incentive-options">
                  <label
                    className={`ba-select-card ${
                      form.hasTaxIncentives === "Yes"
                        ? "ba-selected"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="taxIncentives"
                      value="Yes"
                      checked={form.hasTaxIncentives === "Yes"}
                      onChange={() =>
                        updateField("hasTaxIncentives", "Yes")
                      }
                    />

                    <span className="ba-custom-radio" />

                    <span className="ba-option-content">
                      <strong>Yes, with certificate</strong>
                      <small>
                        Please attach a copy of your certificate
                      </small>
                    </span>
                  </label>

                  <label
                    className={`ba-select-card ${
                      form.hasTaxIncentives === "No"
                        ? "ba-selected"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="taxIncentives"
                      value="No"
                      checked={form.hasTaxIncentives === "No"}
                      onChange={() =>
                        updateField("hasTaxIncentives", "No")
                      }
                    />

                    <span className="ba-custom-radio" />

                    <span className="ba-option-content">
                      <strong>No</strong>
                      <small>
                        No government tax incentives
                      </small>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="ba-classification-section">
              <div className="ba-section-title">
                <h4>
                  Business Activity Classification <em>*</em>
                </h4>
              </div>

              <p className="ba-section-description">
                Select the classification that applies
                to your business establishment.
              </p>

              <div className="ba-business-type-grid">
                {activityTypes.map((option) => (
                  <label
                    key={option.value}
                    className={`ba-business-type-card ${
                      form.businessActivityType === option.value
                        ? "ba-selected"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="businessActivityType"
                      value={option.value}
                      checked={
                        form.businessActivityType === option.value
                      }
                      onChange={() =>
                        updateField(
                          "businessActivityType",
                          option.value
                        )
                      }
                    />

                    <span className="ba-business-type-check">
                      <i className="bi bi-check-lg" />
                    </span>

                    <i className={`bi ${option.icon}`} />

                    <strong>{option.value}</strong>

                    <small>{option.description}</small>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="ba-card">
          <div className="ba-card-body">
            {form.activities.length === 0 ? (
              <div className="ba-empty">
                <div className="ba-empty-icon">
                  <i className="bi bi-clipboard-plus" />
                </div>

                <strong>
                  No business activity added yet
                </strong>

                <span>
                  Click Add an Entry to provide business
                  activity information.
                </span>
              </div>
            ) : (
              <div className="ba-entry-list">
                {form.activities.map((activity, index) => (
                  <div
                    className="ba-entry"
                    key={activity.id ?? index}
                  >
                    <div className="ba-entry-actions">
                      <strong className="ba-entry-number">
                        Activity {index + 1}
                      </strong>

                      <button
                        type="button"
                        className="ba-action-edit"
                        onClick={() => openEditModal(index)}
                      >
                        <i className="bi bi-pencil-square" />
                        EDIT
                      </button>

                      <button
                        type="button"
                        className="ba-action-delete"
                        onClick={() => deleteActivity(index)}
                      >
                        <i className="bi bi-trash" />
                        DELETE
                      </button>
                    </div>

                    <div className="ba-entry-details">
                      {[
                        ["Section", activity.section],
                        ["Division", activity.division],
                        [
                          "Business Description",
                          activity.businessDescription,
                        ],
                        ["PSIC Code", activity.psicCode],
                        [
                          "Risk Classification",
                          activity.riskClassification,
                        ],
                        ["Main Activity", activity.mainActivity],
                        ["Sub Activity", activity.subActivity],
                      ].map(([label, value]) => (
                        <div
                          className="ba-detail-row"
                          key={label}
                        >
                          <strong>{label}:</strong>
                          <span>{value || "—"}</span>
                        </div>
                      ))}

                      {activity.equipment?.length > 0 && (
                        <div className="ba-entry-equipment">
                          <strong>Equipment</strong>

                          <div className="ba-equipment-summary">
                            {activity.equipment.map(
                              (item, equipmentIndex) => (
                                <span key={equipmentIndex}>
                                  {item.units || "—"} unit(s) —{" "}
                                  {item.description ||
                                    "Not specified"}
                                  {item.size
                                    ? ` (${item.size})`
                                    : ""}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="ba-add-entry-row">
              <button
                type="button"
                className="ba-outline-button"
                onClick={openAddModal}
              >
                <i className="bi bi-plus-lg" />
                ADD AN ENTRY
              </button>
            </div>

            <div className="ba-description-section">
              <label className="ba-field">
                <span className="ba-label">
                  Description of Business Operation
                </span>

                <textarea
                  rows={4}
                  value={form.businessOperationDescription}
                  onChange={(event) =>
                    updateField(
                      "businessOperationDescription",
                      event.target.value
                    )
                  }
                  placeholder="Describe the nature of your business operations"
                />
              </label>
            </div>
          </div>
        </section>

        {error && (
          <div className="ba-error" role="alert">
            <i className="bi bi-exclamation-circle" />
            {error}
          </div>
        )}

        <div className="ba-navigation">
          <button
            type="button"
            className="ba-nav-button"
            onClick={onBack}
          >
            <i className="bi bi-arrow-left" />
            BACK
          </button>

          <div className="ba-navigation-right">
            <button
              type="button"
              className="ba-nav-button"
              onClick={handleSaveDraft}
              disabled={!onSaveDraft}
            >
              <i className="bi bi-floppy" />
              SAVE AS DRAFT
            </button>

            <button
              type="submit"
              className="ba-nav-button ba-primary-button"
            >
              CONTINUE
              <i className="bi bi-arrow-right" />
            </button>
          </div>
        </div>
      </form>

      <BusinessActivityModal
        open={modalOpen}
        initialData={
          editingIndex === null
            ? null
            : form.activities[editingIndex]
        }
        onClose={() => {
          setModalOpen(false);
          setEditingIndex(null);
        }}
        onSave={saveActivity}
      />
    </div>
  );
}
