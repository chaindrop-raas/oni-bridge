import { StatusReturnType } from "../../types";
import { statusStep } from "../../utils";

const SVG = ({ children }: { children: React.ReactNode }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {children}
  </svg>
);

const ClockIcon = () => {
  return (
    <>
      <circle cx="14" cy="14" r="7.5" stroke="#9E9BA6" strokeWidth="1.25" />
      <path
        d="M14 9L14 14L17.3333 16.9167"
        stroke="#9E9BA6"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </>
  );
};

export const WithdrawalStatusIcon = ({
  status,
  step,
}: {
  status: StatusReturnType;
  step: number;
}) => {
  const currentStep = statusStep(status);

  if (currentStep > step) {
    return (
      <SVG>
        <rect width="24" height="24" rx="12" fill="#00B295" />
        <path
          d="M7 12.5L10.5 16L17 9.5"
          stroke="#FEFEFE"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </SVG>
    );
  }

  if (step === 0) {
    return (
      <SVG>
        <path
          d="M15 7L20 12L15 17"
          stroke="#9E9BA6"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 12L19 12"
          stroke="#9E9BA6"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </SVG>
    );
  }

  if (step === 1) {
    return (
      <SVG>
        <ClockIcon />
      </SVG>
    );
  }

  if (step === 2) {
    return (
      <SVG>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.155 3.50965C12.0521 3.49678 11.9479 3.49678 11.845 3.50965L5.84496 4.25965C5.21942 4.33784 4.75 4.8696 4.75 5.5V14.409C4.75 16.2191 5.6825 17.9016 7.21751 18.8609L11.3375 21.4359C11.7428 21.6893 12.2572 21.6893 12.6625 21.4359L16.7825 18.8609C18.3175 17.9016 19.25 16.2191 19.25 14.409V5.5C19.25 4.8696 18.7806 4.33784 18.155 4.25965L12.155 3.50965ZM11.6589 2.02124C11.8854 1.99292 12.1146 1.99292 12.3411 2.02124L18.3411 2.77124C19.7173 2.94326 20.75 4.11311 20.75 5.5V14.409C20.75 16.7363 19.5511 18.8995 17.5775 20.1329L13.4575 22.7079C12.5658 23.2653 11.4342 23.2653 10.5425 22.7079L6.42251 20.1329C4.44893 18.8995 3.25 16.7363 3.25 14.409V5.5C3.25 4.11311 4.28273 2.94326 5.6589 2.77124L11.6589 2.02124Z"
          fill="#9E9BA6"
        />
      </SVG>
    );
  }

  if (step === 3) {
    return (
      <SVG>
        <ClockIcon />
      </SVG>
    );
  }

  return (
    <SVG>
      <path
        d="M7 12L12 17L17 12"
        stroke="#9E9BA6"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 20L19 20"
        stroke="#9E9BA6"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 4L12 16"
        stroke="#9E9BA6"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </SVG>
  );
};
