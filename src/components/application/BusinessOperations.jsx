import { useEffect, useMemo, useState } from "react";

import "../../styles/businessOperations.css";

// UI development only. Set to false to restore required-field validation.
const TEST_MODE = true;

const emptyForm = {

  businessArea: "",

  floorArea: "",

  operatingFrom: "",

  operatingTo: "",

  employeesMale: "",

  employeesFemale: "",

  qcResidentEmployees: "",

  deliveryVanTruck: "",

  deliveryMotorcycle: "",

  sameAsMainOffice: false,

  houseNumber: "",

  buildingName: "",

  blockNumber: "",

  lotNumber: "",

  street: "",

  subdivision: "",

  province: "Metro Manila",

  city: "Quezon City",

  enableSubMunicipality: false,

  subMunicipality: "",

  barangay: "",

  zipCode: "",

  district: "",

  locationBarangay: "",

  locationAddress: "",

  latitude: "",

  longitude: "",

  zoningClass: "",

  locationDescription: "",

  taxDeclarationNo: "",

  propertyIdentificationNo: "",

  transferCertificateTitle: "",

  registeredOwner: "",

};

const addressKeys = [

  "houseNumber",

  "buildingName",

  "blockNumber",

  "lotNumber",

  "street",

  "subdivision",

  "province",

  "city",

  "enableSubMunicipality",

  "subMunicipality",

  "barangay",

  "zipCode",

  "district",

];

const getMainOfficeValues = (source) => {

  const values = {};

  addressKeys.forEach((key) => {

    values[key] = source?.[key] ?? emptyForm[key];

  });

  return values;

};

const validCoordinate = (value, min, max) => {

  if (String(value ?? "").trim() === "") return false;

  const number = Number(value);

  return Number.isFinite(number) && number >= min && number <= max;

};

const calculateDistance = (lat1, lon1, lat2, lon2) => {

  const radians = (degrees) => (degrees * Math.PI) / 180;

  const radius = 6371000;

  const dLat = radians(lat2 - lat1);

  const dLon = radians(lon2 - lon1);

  const a =

    Math.sin(dLat / 2) ** 2 +

    Math.cos(radians(lat1)) *

      Math.cos(radians(lat2)) *

      Math.sin(dLon / 2) ** 2;

  return (

    2 *

    radius *

    Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  );

};

function Input({

  label,

  name,

  value,

  onChange,

  type = "text",

  required = false,

  disabled = false,

  placeholder = "",

  min,

  step,

}) {

  return (

    <label className="bo-field">

      <span className="bo-label">

        {label}

        {required && <em> *</em>}

      </span>

      <input

        name={name}

        type={type}

        value={value ?? ""}

        onChange={onChange}

        disabled={disabled}

        placeholder={placeholder}

        min={min}

        step={step}

      />

    </label>

  );

}

function Select({

  label,

  name,

  value,

  onChange,

  options = [],

  required = false,

  disabled = false,

  placeholder = "SELECT",

}) {

  const normalizedOptions = options.map((option) =>

    typeof option === "string"

      ? { value: option, label: option }

      : option

  );

  if (

    value &&

    !normalizedOptions.some((option) => option.value === value)

  ) {

    normalizedOptions.unshift({ value, label: value });

  }

  return (

    <label className="bo-field">

      <span className="bo-label">

        {label}

        {required && <em> *</em>}

      </span>

      <select

        name={name}

        value={value ?? ""}

        onChange={onChange}

        disabled={disabled}

      >

        <option value="">-- {placeholder} --</option>

        {normalizedOptions.map((option) => (

          <option key={option.value} value={option.value}>

            {option.label}

          </option>

        ))}

      </select>

    </label>

  );

}

function Card({ title, action, children, noHeader = false }) {

  return (

    <section className="bo-card">

      {!noHeader && title && (

        <div className="bo-card-header">

          <h3>{title}</h3>

          {action}

        </div>

      )}

      <div className="bo-card-body">{children}</div>

    </section>

  );

}

export default function BusinessOperations({

  onBack,

  onContinue,

  onSaveDraft,

  mainOfficeAddress = {},

  initialData = {},

  barangays = [],

  referenceLocation = null,

}) {

  const [form, setForm] = useState(() => ({

    ...emptyForm,

    ...initialData,

  }));

  const [error, setError] = useState("");

  useEffect(() => {

    if (!form.sameAsMainOffice) return;

    setForm((previous) => {

      const updates = getMainOfficeValues(mainOfficeAddress);

      const unchanged = addressKeys.every(

        (key) => previous[key] === updates[key]

      );

      return unchanged

        ? previous

        : { ...previous, ...updates };

    });

  }, [mainOfficeAddress, form.sameAsMainOffice]);

  const handleChange = (event) => {

    const { name, value, type, checked } = event.target;

    setForm((previous) => {

      if (name === "sameAsMainOffice") {

        return checked

          ? {

              ...previous,

              ...getMainOfficeValues(mainOfficeAddress),

              sameAsMainOffice: true,

            }

          : {

              ...previous,

              sameAsMainOffice: false,

            };

      }

      const updated = {

        ...previous,

        [name]: type === "checkbox" ? checked : value,

      };

      if (name === "enableSubMunicipality" && !checked) {

        updated.subMunicipality = "";

      }

      if (name === "province") {

        updated.city = "";

        updated.barangay = "";

      }

      if (name === "city") {

        updated.barangay = "";

      }

      return updated;

    });

    setError("");

  };

  const completeAddress = useMemo(() => {

    return [

      form.houseNumber,

      form.buildingName,

      form.blockNumber ? `Block ${form.blockNumber}` : "",

      form.lotNumber ? `Lot ${form.lotNumber}` : "",

      form.street,

      form.subdivision,

      form.barangay,

      form.enableSubMunicipality

        ? form.subMunicipality

        : "",

      form.district ? `District ${form.district}` : "",

      form.city,

      form.province,

      form.zipCode,

    ]

      .map((part) => String(part ?? "").trim())

      .filter(Boolean)

      .join(", ");

  }, [form]);

  const coordinatesValid =

    validCoordinate(form.latitude, -90, 90) &&

    validCoordinate(form.longitude, -180, 180);

  const referenceValid =

    referenceLocation != null &&

    validCoordinate(referenceLocation.latitude, -90, 90) &&

    validCoordinate(referenceLocation.longitude, -180, 180);

  const distanceMeters =

    coordinatesValid && referenceValid

      ? calculateDistance(

          Number(referenceLocation.latitude),

          Number(referenceLocation.longitude),

          Number(form.latitude),

          Number(form.longitude)

        )

      : null;

  const locationMatches =

    distanceMeters !== null && distanceMeters <= 100;

  const handleMapOpen = () => {

    const query = coordinatesValid

      ? `${form.latitude},${form.longitude}`

      : completeAddress || "Quezon City Philippines";

    window.open(

      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(

        query

      )}`,

      "_blank",

      "noopener,noreferrer"

    );

  };

  const getPayload = () => ({

    ...form,

    completeAddress,

  });

  const handleDraft = () => {

    onSaveDraft?.(getPayload());

  };

  const handleSubmit = (event) => {

    event.preventDefault();

    if (TEST_MODE) {
      setError("");
      onContinue?.(getPayload());
      return;
    }

    const requiredFields = [

      ["businessArea", "Business Area"],

      ["floorArea", "Total Floor/Building Area"],

      ["operatingFrom", "Operating Time From"],

      ["operatingTo", "Operating Time To"],

      ["employeesMale", "Male Employees"],

      ["employeesFemale", "Female Employees"],

      ["houseNumber", "House/Bldg. No."],

      ["street", "Street"],

      ["province", "Province"],

      ["city", "City/Municipality"],

      ["barangay", "Barangay"],

      ["registeredOwner", "Registered Owner"],

    ];

    const missing = requiredFields.find(

      ([key]) => String(form[key] ?? "").trim() === ""

    );

    if (missing) {

      setError(`Please complete: ${missing[1]}.`);

      return;

    }

    if (

      form.enableSubMunicipality &&

      !form.subMunicipality.trim()

    ) {

      setError("Please enter the Sub-Municipality.");

      return;

    }

    if (

      (form.latitude !== "" || form.longitude !== "") &&

      !coordinatesValid

    ) {

      setError("Please enter valid latitude and longitude.");

      return;

    }

    if (

      !form.taxDeclarationNo.trim() &&

      !form.propertyIdentificationNo.trim() &&

      !form.transferCertificateTitle.trim()

    ) {

      setError("Please provide at least one property reference.");

      return;

    }

    const numericFields = [

      "businessArea",

      "floorArea",

      "employeesMale",

      "employeesFemale",

      "qcResidentEmployees",

      "deliveryVanTruck",

      "deliveryMotorcycle",

    ];

    if (

      numericFields.some((key) => {

        const value = String(form[key] ?? "").trim();

        return (

          value !== "" &&

          (!Number.isFinite(Number(value)) || Number(value) < 0)

        );

      })

    ) {

      setError("Numeric values cannot be negative.");

      return;

    }

    setError("");

    onContinue?.(getPayload());

  };

  const addressDisabled = form.sameAsMainOffice;

  return (

    <div className="bo-wrapper">

      <div className="bo-heading">

        <h3>Business Operations</h3>

        <p>

          Provide information about your business operations

          and exact business location.

        </p>

      </div>

      <form

        className="bo-form"

        onSubmit={handleSubmit}

        noValidate

      >

        <Card noHeader>

          <div className="bo-grid bo-grid-2">

            <div className="bo-stack">

              <div className="bo-grid bo-grid-2">

                <Input

                  label="Business Area (in sq. m.)"

                  name="businessArea"

                  type="number"

                  min="0"

                  step="any"

                  required

                  value={form.businessArea}

                  onChange={handleChange}

                />

                <Input

                  label="Total Floor/Building Area (in sq. m.)"

                  name="floorArea"

                  type="number"

                  min="0"

                  step="any"

                  required

                  value={form.floorArea}

                  onChange={handleChange}

                />

              </div>

              <div className="bo-field">

                <span className="bo-label">

                  Time of Operation <em>*</em>

                </span>

                <div className="bo-grid bo-grid-2">

                  <Input

                    label="From"

                    name="operatingFrom"

                    type="time"

                    value={form.operatingFrom}

                    onChange={handleChange}

                  />

                  <Input

                    label="To"

                    name="operatingTo"

                    type="time"

                    value={form.operatingTo}

                    onChange={handleChange}

                  />

                </div>

              </div>

              <div className="bo-field">

                <span className="bo-label">

                  Total No. of Employees in Establishment

                </span>

                <div className="bo-grid bo-grid-2">

                  <Input

                    label="Male"

                    name="employeesMale"

                    type="number"

                    min="0"

                    required

                    value={form.employeesMale}

                    onChange={handleChange}

                  />

                  <Input

                    label="Female"

                    name="employeesFemale"

                    type="number"

                    min="0"

                    required

                    value={form.employeesFemale}

                    onChange={handleChange}

                  />

                </div>

              </div>

            </div>

            <div className="bo-stack">

              <Input

                label="No. of Employees Residing within QC"

                name="qcResidentEmployees"

                type="number"

                min="0"

                value={form.qcResidentEmployees}

                onChange={handleChange}

              />

              <div className="bo-field">

                <span className="bo-label">

                  No. of Delivery Vehicles (if applicable)

                </span>

                <div className="bo-grid bo-grid-2">

                  <Input

                    label="Van/Truck"

                    name="deliveryVanTruck"

                    type="number"

                    min="0"

                    value={form.deliveryVanTruck}

                    onChange={handleChange}

                  />

                  <Input

                    label="Motorcycle"

                    name="deliveryMotorcycle"

                    type="number"

                    min="0"

                    value={form.deliveryMotorcycle}

                    onChange={handleChange}

                  />

                </div>

              </div>

            </div>

          </div>

        </Card>

        <Card

          title="Business Location Address"

          action={

            <label className="bo-checkbox">

              <input

                type="checkbox"

                name="sameAsMainOffice"

                checked={form.sameAsMainOffice}

                onChange={handleChange}

              />

              Same as Main Office Address

            </label>

          }

        >

          <div className="bo-grid bo-address-first">

            <Input

              label="House/Bldg. No."

              name="houseNumber"

              value={form.houseNumber}

              onChange={handleChange}

              required

              disabled={addressDisabled}

            />

            <Input

              label="Name of Building"

              name="buildingName"

              value={form.buildingName}

              onChange={handleChange}

              disabled={addressDisabled}

            />

            <Input

              label="Block No."

              name="blockNumber"

              value={form.blockNumber}

              onChange={handleChange}

              disabled={addressDisabled}

            />

            <Input

              label="Lot No."

              name="lotNumber"

              value={form.lotNumber}

              onChange={handleChange}

              disabled={addressDisabled}

            />

          </div>

          <div className="bo-grid bo-grid-2">

            <Input

              label="Street"

              name="street"

              value={form.street}

              onChange={handleChange}

              required

              disabled={addressDisabled}

            />

            <Input

              label="Subdivision"

              name="subdivision"

              value={form.subdivision}

              onChange={handleChange}

              disabled={addressDisabled}

            />

          </div>

          <div className="bo-grid bo-grid-3">

            <Select

              label="Province"

              name="province"

              value={form.province}

              onChange={handleChange}

              options={["Metro Manila"]}

              required

              disabled={addressDisabled}

            />

            <Select

              label="City/Municipality"

              name="city"

              value={form.city}

              onChange={handleChange}

              options={

                form.province === "Metro Manila"

                  ? ["Quezon City"]

                  : []

              }

              required

              disabled={addressDisabled}

            />

            <div className="bo-submunicipality">

              <label className="bo-checkbox">

                <input

                  type="checkbox"

                  name="enableSubMunicipality"

                  checked={form.enableSubMunicipality}

                  onChange={handleChange}

                  disabled={addressDisabled}

                />

                Enable Sub-Municipality

              </label>

              <input

                name="subMunicipality"

                value={form.subMunicipality}

                onChange={handleChange}

                disabled={

                  addressDisabled ||

                  !form.enableSubMunicipality

                }

                placeholder="SUB-MUNICIPALITY"

                aria-label="Sub-Municipality"

              />

            </div>

          </div>

          <div className="bo-grid bo-address-bottom">

            <Select

              label="Barangay"

              name="barangay"

              value={form.barangay}

              onChange={handleChange}

              options={barangays}

              placeholder="SELECT BARANGAY"

              required

              disabled={addressDisabled}

            />

            <Input

              label="Zip Code"

              name="zipCode"

              value={form.zipCode}

              onChange={handleChange}

              disabled={addressDisabled}

            />

            <Input

              label="District"

              name="district"

              value={form.district}

              onChange={handleChange}

              disabled={addressDisabled}

            />

          </div>

          <div className="bo-address-preview">

            <p className="bo-address-warning">

              Important Note: Your business address will be

              reflected in the Mayor&apos;s Permit as below:

            </p>

            <div className="bo-address-value">

              {completeAddress.toUpperCase() ||

                "BUSINESS ADDRESS WILL APPEAR HERE"}

            </div>

            <p className="bo-address-help">

              Please make sure that you enter the correct area

              and road classification (Block, Lot, St., Ave.,

              etc.) as indicated on your business permit.

            </p>

          </div>

          <div className="bo-location-divider" />

          <div className="bo-location-toolbar">

            <h3>Business Location Details</h3>

            <button

              type="button"

              className="bo-map-button"

              onClick={handleMapOpen}

            >

              <i className="bi bi-geo-alt-fill" />

              VIEW PINNED BUSINESS LOCATION

            </button>

          </div>

          <div className="bo-location-compact">

            <div className="bo-location-left">

              <Input

                label="Barangay"

                name="locationBarangay"

                value={form.locationBarangay}

                onChange={handleChange}

                placeholder="Pinned location barangay"

              />

              <Input

                label="Address"

                name="locationAddress"

                value={form.locationAddress}

                onChange={handleChange}

                placeholder="Pinned location address"

              />

              <div className="bo-grid bo-grid-2">

                <Input

                  label="Latitude"

                  name="latitude"

                  value={form.latitude}

                  onChange={handleChange}

                  placeholder="14.6760"

                />

                <Input

                  label="Longitude"

                  name="longitude"

                  value={form.longitude}

                  onChange={handleChange}

                  placeholder="121.0437"

                />

              </div>

              <Input

                label="Zoning Class"

                name="zoningClass"

                value={form.zoningClass}

                onChange={handleChange}

                placeholder="Verified zoning classification"

              />

            </div>

            <div className="bo-location-right">

              <div

                className={`bo-match-status ${

                  distanceMeters === null

                    ? "bo-match-pending"

                    : locationMatches

                    ? "bo-match-success"

                    : "bo-match-warning"

                }`}

              >

                <i

                  className={`bi ${

                    distanceMeters === null

                      ? "bi-info-circle"

                      : locationMatches

                      ? "bi-check-circle-fill"

                      : "bi-exclamation-triangle-fill"

                  }`}

                />

                <span>

                  {distanceMeters === null

                    ? "Location match not yet verified"

                    : locationMatches

                    ? "Pinned location is within 100 meters of the reference location"

                    : "Pinned location is more than 100 meters from the reference location"}

                </span>

              </div>

              <div className="bo-distance-box">

                <i className="bi bi-geo-alt-fill" />

                <div>

                  <strong>

                    Business Location vs. Pinned Location Distance

                  </strong>

                  <span>

                    {distanceMeters === null

                      ? "Distance unavailable"

                      : `${distanceMeters.toFixed(1)} meters`}

                  </span>

                </div>

              </div>

              <label className="bo-field bo-description-field">

                <span className="bo-label">Description</span>

                <textarea

                  name="locationDescription"

                  value={form.locationDescription}

                  onChange={handleChange}

                  placeholder="Enter zoning description or permissible uses"

                />

              </label>

            </div>

          </div>

        </Card>

        <Card title="Additional Information">

          <p className="bo-additional-note">

            Provide at least one property reference.

          </p>

          <div className="bo-grid bo-grid-3">

            <Input

              label="Tax Declaration No."

              name="taxDeclarationNo"

              value={form.taxDeclarationNo}

              onChange={handleChange}

            />

            <Input

              label="Property Identification No."

              name="propertyIdentificationNo"

              value={form.propertyIdentificationNo}

              onChange={handleChange}

            />

            <Input

              label="Transfer Certificate of Title"

              name="transferCertificateTitle"

              value={form.transferCertificateTitle}

              onChange={handleChange}

            />

          </div>

          <div className="bo-owner-choice">

            <span className="bo-label">

              Are you the registered owner? <em>*</em>

            </span>

            <label className="bo-radio">

              <input

                type="radio"

                name="registeredOwner"

                value="Yes"

                checked={form.registeredOwner === "Yes"}

                onChange={handleChange}

              />

              Yes

            </label>

            <label className="bo-radio">

              <input

                type="radio"

                name="registeredOwner"

                value="No"

                checked={form.registeredOwner === "No"}

                onChange={handleChange}

              />

              No

            </label>

          </div>

        </Card>

        {error && (

          <div className="bo-error" role="alert">

            <i className="bi bi-exclamation-circle" />

            {error}

          </div>

        )}

        <div className="bo-actions">

          <button

            type="button"

            className="bo-btn"

            onClick={onBack}

          >

            <i className="bi bi-arrow-left" />

            BACK

          </button>

          <div className="bo-actions-right">

            <button

              type="button"

              className="bo-btn"

              onClick={handleDraft}

              disabled={!onSaveDraft}

            >

              <i className="bi bi-floppy" />

              SAVE AS DRAFT

            </button>

            <button

              type="submit"

              className="bo-btn bo-btn-next"

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
