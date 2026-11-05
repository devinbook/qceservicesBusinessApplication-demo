
import { useState } from "react";

const amendmentOptions = [
  {
    id: "businessType",
    title: "Change of Business Type",
  },
  {
    id: "businessName",
    title: "Change of Business/Corporate Name Inclusion of Trade name",
  },
  {
    id: "ownership",
    title:
      "Change/Transfer of Ownership/Corp. President/Managing Partner/Marital Status",
  },
  {
    id: "businessAddress",
    title: "Transfer of Location/Correction of Address",
  },
  {
    id: "businessActivity",
    title: "Change/Addition of Line of Business",
  },
  {
    id: "officeOperation",
    title: "Change from Office to Actual Operation",
  },
  {
    id: "businessArea",
    title: "Additional/Reduction of Business Area",
  },
  {
    id: "employees",
    title: "Additional/Reduction in Number of Employees",
  },
  {
    id: "capital",
    title: "Additional Capital",
  },
  {
    id: "tin",
    title: "Tax Identification Number",
  },
  {
    id: "sss",
    title: "Social Security System Number",
  },
  {
    id: "partialRetirement",
    title: "Partial Retirement",
  },
];

export default function AmendmentNature({
  initialData = {},
  onBack,
  onContinue,
}) {
  const [selected, setSelected] = useState(
    initialData.selectedAmendments || []
  );

  const [error, setError] = useState("");

  const handleToggle = (id) => {
    setSelected((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );

    setError("");
  };

  const handleContinue = () => {
    if (selected.length === 0) {
      setError(
        "Please select at least one nature of amendment."
      );
      return;
    }

    onContinue?.({
      selectedAmendments: selected,
      amendmentDetails: amendmentOptions
        .filter((option) => selected.includes(option.id))
        .map((option) => ({
          id: option.id,
          label: option.title,
        })),
    });
  };

  return (
    <div className="amendment-nature">
      <div className="application-step-heading">
        <h2>Amendment Nature</h2>
        <p>
          Select the information you wish to amend in your
          existing business permit.
        </p>
      </div>

      <section className="amendment-nature-card">
        <p className="amendment-note">
          <strong>NOTE:</strong> Kindly select all necessary
          changes you want to amend. Please take note that
          after proceeding, you will not be able to change
          your amendment nature.
        </p>

        <div className="amendment-nature-grid">
          {amendmentOptions.map((option) => {
            const checked = selected.includes(option.id);

            return (
              <label
                key={option.id}
                className={`amendment-option ${
                  checked ? "selected" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleToggle(option.id)}
                />

                <strong>{option.title}</strong>
              </label>
            );
          })}
        </div>

        {error && (
          <p className="amendment-error" role="alert">
            {error}
          </p>
        )}
      </section>

      <div className="application-actions">
        <button
          type="button"
          className="btn-back"
          onClick={onBack}
        >
          BACK
        </button>

        <button
          type="button"
          className="btn-continue"
          onClick={handleContinue}
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
}
