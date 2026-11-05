
import { useState } from "react";

/* =========================================
   INITIAL FORM DATA
========================================= */

const initialForm = {
  businessType: "",
  registrationNumber: "",
  tin: "",
  sssNumber: "",
  businessName: "",
  tradeName: "",
  sameAsBusinessName: false,

  houseNumber: "",
  buildingName: "",
  blockNumber: "",
  lotNumber: "",
  street: "",
  subdivision: "",
  province: "",
  city: "",
  enableSubMunicipality: false,
  subMunicipality: "",
  barangay: "",
  zipCode: "",
  district: "",

  telephone: "",
  email: "",
  mobile: "",

  surname: "",
  givenName: "",
  middleName: "",
  suffix: "",
  gender: "",
  filipinoOwnership: "",
  foreignOwnership: "",
};

/* =========================================
   BUSINESS TYPES
========================================= */

const businessTypes = [
  {
    value: "Sole Proprietorship",
    label: "Sole Proprietorship",
    description: "Individually owned business",
    icon: "bi-person-workspace",
  },
  {
    value: "Partnership",
    label: "Partnership",
    description: "Business owned by partners",
    icon: "bi-people",
  },
  {
    value: "Corporation",
    label: "Corporation",
    description: "Registered corporate entity",
    icon: "bi-buildings",
  },
  {
    value: "Cooperative",
    label: "Cooperative",
    description: "Member-owned organization",
    icon: "bi-people-fill",
  },
  {
    value: "One Person Corporation",
    label: "One Person Corporation",
    description: "Single-stockholder corporation",
    icon: "bi-building",
  },
];

/* =========================================
   REUSABLE INPUT FIELD
========================================= */

function Field({
  label,
  name,
  value,
  onChange,
  required = false,
  type = "text",
  placeholder = "",
  disabled = false,
}) {
  return (
    <div className="business-field">
      <label htmlFor={name}>
        {label}
        {required && (
          <span className="business-required"> *</span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete="off"
      />
    </div>
  );
}

/* =========================================
   REUSABLE SELECT FIELD
========================================= */

function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "SELECT",
  required = false,
}) {
  return (
    <div className="business-field">
      <label htmlFor={name}>
        {label}
        {required && (
          <span className="business-required"> *</span>
        )}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="">
          -- {placeholder} --
        </option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

/* =========================================
   REUSABLE SECTION
========================================= */

function Section({ title, children }) {
  return (
    <section className="business-form-section">
      <div className="business-form-section-header">
        <h3>{title}</h3>
      </div>

      <div className="business-form-section-body">
        {children}
      </div>
    </section>
  );
}

/* =========================================
   BUSINESS TYPE CARD
========================================= */

function BusinessTypeCard({
  type,
  selected,
  onChange,
}) {
  return (
    <label
      className={`business-type-card ${
        selected ? "selected" : ""
      }`}
    >
      <input
        type="radio"
        name="businessType"
        value={type.value}
        checked={selected}
        onChange={onChange}
      />

      {selected && (
        <span className="business-type-check">
          <i className="bi bi-check-lg" />
        </span>
      )}

      <div className="business-type-card-icon-wrapper">
        <i
          className={`bi ${type.icon} business-type-card-icon`}
        />
      </div>

      <strong className="business-type-card-title">
        {type.label}
      </strong>

      <span className="business-type-card-description">
        {type.description}
      </span>
    </label>
  );
}

/* =========================================
   MAIN COMPONENT
========================================= */

export default function BusinessInformation({
  onBack,
  onContinue,
}) {
  const [form, setForm] = useState(initialForm);

  /* =========================================
     HANDLE FORM CHANGES
  ========================================= */

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    const nextValue =
      type === "checkbox" ? checked : value;

    setForm((previous) => {
      const updated = {
        ...previous,
        [name]: nextValue,
      };

      // Automatically update trade name
      if (
        name === "businessName" &&
        previous.sameAsBusinessName
      ) {
        updated.tradeName = value;
      }

      // Same as Business Name checkbox
      if (name === "sameAsBusinessName") {
        updated.tradeName = checked
          ? previous.businessName
          : "";
      }

      // Sub-municipality checkbox
      if (
        name === "enableSubMunicipality" &&
        !checked
      ) {
        updated.subMunicipality = "";
      }

      // Reset dependent address fields
      if (name === "province") {
        updated.city = "";
        updated.barangay = "";
      }

      if (name === "city") {
        updated.barangay = "";
      }

      return updated;
    });
  };

  /* =========================================
     COMPLETE ADDRESS
  ========================================= */

  const completeAddress = [
    form.houseNumber,
    form.buildingName,

    form.blockNumber
      ? `Block ${form.blockNumber}`
      : "",

    form.lotNumber
      ? `Lot ${form.lotNumber}`
      : "",

    form.street,
    form.subdivision,
    form.barangay,

    form.enableSubMunicipality
      ? form.subMunicipality
      : "",

    form.city,
    form.province,
    form.zipCode,
  ]
    .map((part) => String(part || "").trim())
    .filter(Boolean)
    .join(", ");

  /* =========================================
     SUBMIT
  ========================================= */

  const handleSubmit = (event) => {
    event.preventDefault();

    onContinue?.({
      ...form,
      completeAddress,
    });
  };

  return (
    <div className="business-information-wrapper">

      {/* =====================================
          PAGE HEADING
      ===================================== */}

      <div className="business-information-heading">
        <div>
          <h2>
            Business Information and Registration
          </h2>

          <p>
            Please fill out the complete details of
            your business. Ensure that the information
            matches your official records.
          </p>
        </div>
      </div>

      {/* =====================================
          FORM CONTAINER
      ===================================== */}

      <div className="business-information-page">
        <form
          onSubmit={handleSubmit}
          noValidate
          autoComplete="off"
        >

          {/* =================================
              BUSINESS TYPE AND REGISTRATION
          ================================= */}

          <Section title="Business Type and Registration Details">

            {/* MODERN BUSINESS TYPE CARDS */}

            <div className="business-type-selection">
              <span className="business-type-label">
                Business Type
                <span className="business-required">
                  {" "}*
                </span>
              </span>

              <div className="business-type-card-grid">
                {businessTypes.map((type) => (
                  <BusinessTypeCard
                    key={type.value}
                    type={type}
                    selected={
                      form.businessType === type.value
                    }
                    onChange={handleChange}
                  />
                ))}
              </div>
            </div>

            {/* REGISTRATION DETAILS */}

            <div className="business-grid business-grid-3">
              <Field
                label="Registration Number"
                name="registrationNumber"
                value={form.registrationNumber}
                onChange={handleChange}
                required
              />

              <Field
                label="Tax Identification Number (TIN)"
                name="tin"
                value={form.tin}
                onChange={handleChange}
                required
              />

              <Field
                label="SSS Number"
                name="sssNumber"
                value={form.sssNumber}
                onChange={handleChange}
              />
            </div>

            {/* BUSINESS NAME */}

            <Field
              label="Business Name"
              name="businessName"
              value={form.businessName}
              onChange={handleChange}
              required
            />

            {/* TRADE NAME */}

            <div className="business-trade-row">
              <Field
                label="Trade Name"
                name="tradeName"
                value={form.tradeName}
                onChange={handleChange}
                disabled={form.sameAsBusinessName}
              />

              <label className="business-inline-checkbox">
                <input
                  type="checkbox"
                  name="sameAsBusinessName"
                  checked={form.sameAsBusinessName}
                  onChange={handleChange}
                />

                Same as Business Name
              </label>
            </div>
          </Section>

          {/* =================================
              MAIN OFFICE ADDRESS
          ================================= */}

          <Section title="Main Office Address">

            {/* BUILDING DETAILS */}

            <div className="business-grid business-address-grid">
              <Field
                label="House/Bldg. No."
                name="houseNumber"
                value={form.houseNumber}
                onChange={handleChange}
                required
              />

              <Field
                label="Name of Building"
                name="buildingName"
                value={form.buildingName}
                onChange={handleChange}
              />

              <Field
                label="Block No."
                name="blockNumber"
                value={form.blockNumber}
                onChange={handleChange}
              />

              <Field
                label="Lot No."
                name="lotNumber"
                value={form.lotNumber}
                onChange={handleChange}
              />
            </div>

            {/* STREET AND SUBDIVISION */}

            <div className="business-grid business-street-subdivision-grid">
              <Field
                label="Street"
                name="street"
                value={form.street}
                onChange={handleChange}
                required
              />

              <Field
                label="Subdivision"
                name="subdivision"
                value={form.subdivision}
                onChange={handleChange}
              />
            </div>

            {/* PROVINCE, CITY, SUB-MUNICIPALITY */}

            <div className="business-grid business-grid-3">
              <SelectField
                label="Province"
                name="province"
                value={form.province}
                onChange={handleChange}
                options={["Metro Manila"]}
                placeholder="SELECT PROVINCE"
                required
              />

              <SelectField
                label="City/Municipality"
                name="city"
                value={form.city}
                onChange={handleChange}
                options={
                  form.province === "Metro Manila"
                    ? ["Quezon City"]
                    : []
                }
                placeholder="SELECT CITY"
                required
              />

              <div className="business-submunicipality">
                <label className="business-inline-checkbox">
                  <input
                    type="checkbox"
                    name="enableSubMunicipality"
                    checked={form.enableSubMunicipality}
                    onChange={handleChange}
                  />

                  Enable Sub-Municipality
                </label>

                <input
                  type="text"
                  name="subMunicipality"
                  value={form.subMunicipality}
                  onChange={handleChange}
                  disabled={!form.enableSubMunicipality}
                  placeholder="SUB-MUNICIPALITY"
                  aria-label="Sub-Municipality"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* BARANGAY AND LOCATION */}

            <div className="business-grid business-location-grid">
              <SelectField
                label="Barangay"
                name="barangay"
                value={form.barangay}
                onChange={handleChange}
                options={[]}
                placeholder="SELECT BARANGAY"
                required
              />

              <Field
                label="Zip Code"
                name="zipCode"
                value={form.zipCode}
                onChange={handleChange}
              />

              <Field
                label="District"
                name="district"
                value={form.district}
                onChange={handleChange}
              />
            </div>

            {/* COMPLETE ADDRESS PREVIEW */}

            <div className="business-complete-address">
              <label>
                Complete Address
              </label>

              <div>
                {completeAddress ||
                  "Complete address will appear here automatically."}
              </div>
            </div>
          </Section>

          {/* =================================
              CONTACT INFORMATION
          ================================= */}

          <Section title="Contact Information">
            <div className="business-grid business-grid-3">
              <Field
                label="Telephone Number"
                name="telephone"
                value={form.telephone}
                onChange={handleChange}
                type="tel"
              />

              <Field
                label="Email Address"
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                required
              />

              <Field
                label="Mobile Number"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                type="tel"
                required
              />
            </div>
          </Section>

          {/* =================================
              OWNER'S INFORMATION
          ================================= */}

          <Section title="Owner's Information">

            {/* OWNER NAME */}

            <div className="business-grid business-grid-4">
              <Field
                label="Surname"
                name="surname"
                value={form.surname}
                onChange={handleChange}
                required
              />

              <Field
                label="Given Name"
                name="givenName"
                value={form.givenName}
                onChange={handleChange}
                required
              />

              <Field
                label="Middle Name"
                name="middleName"
                value={form.middleName}
                onChange={handleChange}
              />

              <Field
                label="Suffix"
                name="suffix"
                value={form.suffix}
                onChange={handleChange}
              />
            </div>

            {/* GENDER AND OWNERSHIP */}

            <div className="business-owner-bottom">

              {/* GENDER */}

              <div className="business-gender-group">
                <span>Gender</span>

                {[
                  "Male",
                  "Female",
                  "Non-Binary",
                ].map((gender) => (
                  <label key={gender}>
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={form.gender === gender}
                      onChange={handleChange}
                    />

                    {gender}
                  </label>
                ))}
              </div>

              {/* OWNERSHIP PERCENTAGE */}

              <div className="business-ownership-group">
                <strong>
                  Ownership Percentage
                </strong>

                <label>
                  Filipino

                  <input
                    type="number"
                    name="filipinoOwnership"
                    value={form.filipinoOwnership}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    placeholder="%"
                  />
                </label>

                <label>
                  Foreign

                  <input
                    type="number"
                    name="foreignOwnership"
                    value={form.foreignOwnership}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    placeholder="%"
                  />
                </label>
              </div>
            </div>
          </Section>

          {/* =================================
              NAVIGATION BUTTONS
          ================================= */}

          <div className="business-form-actions">

            <button
              type="button"
              className="btn-back"
              onClick={onBack}
            >
              <i className="bi bi-arrow-left" />
              BACK
            </button>

            <button
              type="submit"
              className="btn-continue"
            >
              CONTINUE
              <i className="bi bi-arrow-right" />
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}
