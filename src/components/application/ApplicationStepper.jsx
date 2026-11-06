
export default function ApplicationStepper({
  steps = [],
  currentStep = 1,
  onStepClick,
}) {
  return (
    <div className="application-progress-card">
      <div className="application-progress-header">
        <div>
          <span className="progress-eyebrow">
            APPLICATION PROGRESS
          </span>

          <h2>{steps[currentStep - 1]}</h2>
        </div>

        <span className="progress-step-count">
          Step {currentStep} of {steps.length}
        </span>
      </div>

      {/* Horizontally scrollable stepper */}
      <div
        className="application-stepper-scroll"
        role="region"
        aria-label="Application progress steps"
        tabIndex={0}
      >
        <div className="application-stepper">
          {steps.map((stepName, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;

            return (
              <div
                className={`application-step ${
                  isActive
                    ? "active"
                    : isCompleted
                    ? "completed"
                    : ""
                }`}
                key={`${stepName}-${index}`}
              >
                <div className="step-top">
                  <button
                    type="button"
                    className="step-number"
                    onClick={() => onStepClick?.(stepNumber)}
                    aria-label={`Go to step ${stepNumber}: ${stepName}`}
                    aria-current={isActive ? "step" : undefined}
                    title={`Go to ${stepName}`}
                    style={{ cursor: "pointer" }}
                  >
                    {isCompleted ? (
                      <i
                        className="bi bi-check-lg"
                        style={{ display: "block" }}
                      />
                    ) : (
                      <span>{stepNumber}</span>
                    )}
                  </button>

                  {index < steps.length - 1 && (
                    <div className="step-line" />
                  )}
                </div>

                <button
                  type="button"
                  className="step-content"
                  onClick={() => onStepClick?.(stepNumber)}
                  aria-label={`Go to ${stepName}`}
                  style={{
                    cursor: "pointer",
                    border: "none",
                    background: "transparent",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  <span className="step-status">
                    {isActive
                      ? "CURRENT"
                      : isCompleted
                      ? "COMPLETED"
                      : "INCOMPLETE"}
                  </span>

                  <span className="step-name">
                    {stepName
                      .split(" ")
                      .map((word, index, words) => (
                        <span key={index}>
                          {word}
                          {index < words.length - 1 &&
                            (index % 2 === 1 ? <br /> : " ")}
                        </span>
                      ))}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
