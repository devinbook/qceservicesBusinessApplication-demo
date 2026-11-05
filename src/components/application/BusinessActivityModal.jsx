
import { useEffect, useState } from "react";

const emptyEquipment = () => ({
  units: "",
  description: "",
  size: "",
});

const emptyActivity = () => ({
  mainActivity: "",
  subActivity: "",
  section: "",
  division: "",
  businessDescription: "",
  psicCode: "",
  riskClassification: "",
  equipment: [emptyEquipment()],
});

export default function BusinessActivityModal({
  open,
  initialData,
  onClose,
  onSave,
}) {
  const [activity, setActivity] = useState(emptyActivity);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setActivity(
      initialData
        ? {
            ...emptyActivity(),
            ...initialData,
            equipment:
              initialData.equipment?.length > 0
                ? initialData.equipment.map((item) => ({ ...item }))
                : [emptyEquipment()],
          }
        : emptyActivity()
    );

    setError("");
  }, [open, initialData]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  const updateField = (name, value) => {
    setActivity((previous) => ({
      ...previous,
      [name]: value,
    }));
    setError("");
  };

  const updateEquipment = (index, name, value) => {
    setActivity((previous) => ({
      ...previous,
      equipment: previous.equipment.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, [name]: value }
          : item
      ),
    }));
  };

  const addEquipment = () => {
    setActivity((previous) => ({
      ...previous,
      equipment: [...previous.equipment, emptyEquipment()],
    }));
  };

  const removeEquipment = (index) => {
    setActivity((previous) => ({
      ...previous,
      equipment:
        previous.equipment.length === 1
          ? [emptyEquipment()]
          : previous.equipment.filter(
              (_, itemIndex) => itemIndex !== index
            ),
    }));
  };

  const handleSave = () => {
    if (!activity.mainActivity.trim()) {
      setError("Please enter the Main Activity.");
      return;
    }

    if (!activity.subActivity.trim()) {
      setError("Please enter the Sub Activity.");
      return;
    }

    const invalidEquipment = activity.equipment.some(
      (item) =>
        item.units !== "" &&
        (!Number.isFinite(Number(item.units)) ||
          Number(item.units) < 0)
    );

    if (invalidEquipment) {
      setError("Please enter a valid number of equipment units.");
      return;
    }

    const equipment = activity.equipment.filter(
      (item) =>
        item.units !== "" ||
        item.description.trim() !== "" ||
        item.size.trim() !== ""
    );

    onSave({
      ...activity,
      id: initialData?.id ?? crypto.randomUUID(),
      equipment,
    });
  };

  return (
    <div
      className="ba-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="ba-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ba-modal-title"
      >
        <div className="ba-modal-header">
          <h2 id="ba-modal-title">
            {initialData ? "Edit Entry" : "Add Entry"}
          </h2>

          <button
            type="button"
            className="ba-modal-x"
            onClick={onClose}
            aria-label="Close"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="ba-modal-body">
          <div className="ba-modal-grid">
            <label className="ba-field">
              <span className="ba-label">
                Main Activity <em>*</em>
              </span>

              <input
                type="text"
                value={activity.mainActivity}
                onChange={(event) =>
                  updateField("mainActivity", event.target.value)
                }
                placeholder="Enter main activity"
              />
            </label>

            <label className="ba-field">
              <span className="ba-label">
                Sub Activity <em>*</em>
              </span>

              <input
                type="text"
                value={activity.subActivity}
                onChange={(event) =>
                  updateField("subActivity", event.target.value)
                }
                placeholder="Enter sub activity"
              />
            </label>
          </div>

          <div className="ba-psic-section">
            <div className="ba-psic-label">
              <span className="ba-label">
                PSIC Code - Description
              </span>
              <span className="ba-psic-help">
                <i className="bi bi-info-circle-fill" />
                Classification details
              </span>
            </div>

            <div className="ba-psic-fields">
              <label className="ba-field">
                <span className="ba-label">PSIC Code</span>
                <input
                  type="text"
                  value={activity.psicCode}
                  onChange={(event) =>
                    updateField("psicCode", event.target.value)
                  }
                  placeholder="Enter PSIC code"
                />
              </label>

              <label className="ba-field">
                <span className="ba-label">Business Description</span>
                <input
                  type="text"
                  value={activity.businessDescription}
                  onChange={(event) =>
                    updateField(
                      "businessDescription",
                      event.target.value
                    )
                  }
                  placeholder="Enter business description"
                />
              </label>
            </div>

            <div className="ba-classification-grid">
              <label className="ba-field">
                <span className="ba-label">Section</span>
                <input
                  value={activity.section}
                  onChange={(event) =>
                    updateField("section", event.target.value)
                  }
                  placeholder="Section"
                />
              </label>

              <label className="ba-field">
                <span className="ba-label">Division</span>
                <input
                  value={activity.division}
                  onChange={(event) =>
                    updateField("division", event.target.value)
                  }
                  placeholder="Division"
                />
              </label>

              <label className="ba-field">
                <span className="ba-label">Risk Classification</span>
                <select
                  value={activity.riskClassification}
                  onChange={(event) =>
                    updateField(
                      "riskClassification",
                      event.target.value
                    )
                  }
                >
                  <option value="">-- SELECT --</option>
                  <option value="LOW RISK">LOW RISK</option>
                  <option value="MEDIUM RISK">MEDIUM RISK</option>
                  <option value="HIGH RISK">HIGH RISK</option>
                </select>
              </label>
            </div>
          </div>

          <div className="ba-equipment-heading">
            <h3>Equipment (If Applicable)</h3>

            <button
              type="button"
              className="ba-outline-button"
              onClick={addEquipment}
            >
              <i className="bi bi-plus-lg" />
              ADD AN EQUIPMENT
            </button>
          </div>

          <div className="ba-equipment-table">
            <div className="ba-equipment-table-header">
              <span />
              <span>No. of Units</span>
              <span>Description</span>
              <span>Size</span>
            </div>

            {activity.equipment.map((item, index) => (
              <div className="ba-equipment-row" key={index}>
                <button
                  type="button"
                  className="ba-remove-equipment"
                  onClick={() => removeEquipment(index)}
                  aria-label={`Remove equipment ${index + 1}`}
                >
                  <i className="bi bi-trash-fill" />
                </button>

                <input
                  type="number"
                  min="0"
                  value={item.units}
                  onChange={(event) =>
                    updateEquipment(
                      index,
                      "units",
                      event.target.value
                    )
                  }
                  aria-label="Number of units"
                />

                <input
                  type="text"
                  value={item.description}
                  onChange={(event) =>
                    updateEquipment(
                      index,
                      "description",
                      event.target.value
                    )
                  }
                  placeholder="Equipment description"
                  aria-label="Equipment description"
                />

                <input
                  type="text"
                  value={item.size}
                  onChange={(event) =>
                    updateEquipment(
                      index,
                      "size",
                      event.target.value
                    )
                  }
                  placeholder="Size"
                  aria-label="Equipment size"
                />
              </div>
            ))}
          </div>

          {error && (
            <div className="ba-error" role="alert">
              <i className="bi bi-exclamation-circle" />
              {error}
            </div>
          )}
        </div>

        <div className="ba-modal-footer">
          <button
            type="button"
            className="ba-outline-button"
            onClick={onClose}
          >
            CLOSE
          </button>

          <button
            type="button"
            className="ba-primary-button"
            onClick={handleSave}
          >
            <i className="bi bi-plus-lg" />
            {initialData ? "SAVE CHANGES" : "ADD TO LIST"}
          </button>
        </div>
      </div>
    </div>
  );
}
