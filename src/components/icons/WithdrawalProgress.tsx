import { TransactionReceipt } from "viem";
import { useGetWithdrawalStatus } from "../../hooks";
import { useEffect, useState } from "react";
import { statusStep } from "../../utils";
import clsx from "clsx";

export const WithdrawalProgressIcon = ({
  transaction,
}: {
  transaction: TransactionReceipt;
}) => {
  const { status } = useGetWithdrawalStatus(transaction);
  const [segmentProgress, setSegmentProgress] = useState<number>(0);

  useEffect(() => {
    setSegmentProgress(statusStep(status));
  }, [status]);

  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        {/* segment one */}
        <path
          className={clsx({
            "fill-accent": segmentProgress >= 1,
            "fill-faded": segmentProgress === 0,
          })}
          d="M26.5771 13.5195C27.3573 13.4897 27.973 12.8311 27.8647 12.0578C27.4441 9.05479 26.0568 6.2551 23.8933 4.09428C21.7297 1.93345 18.9283 0.549719 15.9247 0.132902C15.1513 0.0255755 14.4935 0.642079 14.4647 1.42235C14.4358 2.20262 15.0479 2.8494 15.8183 2.97646C18.1082 3.35413 20.2365 4.43838 21.8952 6.09491C23.5538 7.75144 24.6407 9.87845 25.0212 12.1678C25.1493 12.9381 25.7968 13.5493 26.5771 13.5195Z"
        />
        {/* segment two */}
        <path
          d="M26.5771 14.4805C27.3573 14.5103 27.973 15.1689 27.8647 15.9422C27.4441 18.9452 26.0568 21.7449 23.8933 23.9057C21.7297 26.0665 18.9283 27.4503 15.9247 27.8671C15.1513 27.9744 14.4935 27.3579 14.4647 26.5777C14.4358 25.7974 15.0479 25.1506 15.8183 25.0235C18.1082 24.6459 20.2365 23.5616 21.8952 21.9051C23.5538 20.2486 24.6407 18.1216 25.0212 15.8322C25.1493 15.0619 25.7968 14.4507 26.5771 14.4805Z"
          className={clsx({
            "fill-accent": segmentProgress >= 2,
            "fill-faded": segmentProgress < 2,
          })}
        />
        {/* segment three */}
        <path
          d="M1.42294 14.4805C0.64271 14.5103 0.0270348 15.1689 0.135334 15.9422C0.555929 18.9452 1.94319 21.7449 4.10674 23.9057C6.27028 26.0665 9.07171 27.4503 12.0753 27.8671C12.8487 27.9744 13.5065 27.3579 13.5353 26.5777C13.5642 25.7974 12.9521 25.1506 12.1817 25.0235C9.89184 24.6459 7.76346 23.5616 6.10485 21.9051C4.44623 20.2486 3.35931 18.1216 2.97876 15.8322C2.85072 15.0619 2.20318 14.4507 1.42294 14.4805Z"
          className={clsx({
            "fill-accent": segmentProgress >= 3,
            "fill-faded": segmentProgress < 3,
          })}
        />
        {/* segment four */}
        <path
          d="M1.42294 13.5195C0.64271 13.4897 0.0270348 12.8311 0.135334 12.0578C0.555929 9.05479 1.94319 6.2551 4.10674 4.09428C6.27028 1.93345 9.07171 0.549719 12.0753 0.132902C12.8487 0.0255755 13.5065 0.642079 13.5353 1.42235C13.5642 2.20262 12.9521 2.8494 12.1817 2.97646C9.89184 3.35413 7.76346 4.43838 6.10485 6.09491C4.44623 7.75144 3.35931 9.87845 2.97876 12.1678C2.85072 12.9381 2.20318 13.5493 1.42294 13.5195Z"
          className={clsx({
            "fill-accent": segmentProgress >= 4,
            "fill-faded": segmentProgress < 4,
          })}
        />
        {/* clock icon */}
        {segmentProgress <= 1 && (
          <>
            <circle
              className="stroke-subdued"
              cx="14"
              cy="14"
              r="7.5"
              strokeWidth="1.25"
            />
            <path
              className="stroke-subdued"
              d="M14 9L14 14L17.3333 16.9167"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
          </>
        )}
        {/* shield icon */}
        {segmentProgress == 2 && (
          <path
            className="fill-subdued"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.129 6.92601C14.0432 6.91529 13.9564 6.91529 13.8706 6.92601L8.87059 7.55101C8.34931 7.61617 7.95813 8.0593 7.95813 8.58464V16.0088C7.95813 17.5172 8.73522 18.9193 10.0144 19.7188L13.4477 21.8646C13.7855 22.0757 14.2141 22.0757 14.5519 21.8646L17.9852 19.7188C19.2644 18.9193 20.0415 17.5172 20.0415 16.0088V8.58464C20.0415 8.0593 19.6503 7.61617 19.129 7.55101L14.129 6.92601ZM13.7155 5.68567C13.9043 5.66207 14.0953 5.66207 14.284 5.68567L19.284 6.31067C20.4309 6.45402 21.2915 7.4289 21.2915 8.58464V16.0088C21.2915 17.9482 20.2924 19.7508 18.6477 20.7788L15.2144 22.9246C14.4713 23.389 13.5283 23.389 12.7852 22.9246L9.35189 20.7788C7.70724 19.7508 6.70813 17.9482 6.70813 16.0088V8.58464C6.70813 7.4289 7.56873 6.45402 8.71555 6.31067L13.7155 5.68567Z"
          />
        )}
        {/* arrow icon */}
        {segmentProgress == 3 && (
          <>
            <path
              className="stroke-subdued"
              d="M16.5 9.83203L20.6667 13.9987L16.5 18.1654"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              className="stroke-subdued"
              d="M8.1665 13.998L19.8332 13.998"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
          </>
        )}
        {/* claim icon */}
        {segmentProgress == 4 && (
          <>
            <path
              className="stroke-subdued"
              d="M9.83301 14L13.9997 18.1667L18.1663 14"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              className="stroke-subdued"
              d="M8.16699 20.666L19.8337 20.666"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
            <path
              className="stroke-subdued"
              d="M14 7.33398L14 17.334"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
          </>
        )}
        {/* finalized icon */}
        {segmentProgress == 5 && (
          <>
            <path
              d="M7 12.5L10.5 16L17 9.5"
              className="stroke-accent"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform="translate(2 2.5)"
            />
          </>
        )}
      </g>
    </svg>
  );
};
