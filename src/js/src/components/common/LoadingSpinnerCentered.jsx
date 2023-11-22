import { Spin } from "antd";

export const LoadingSpinnerCentered = () => {
  return (
    <>
      <div className="loadingIndicatorCentered">
        <Spin className="loadingIndicatorCentered__spinner" size="medium" />
        <span className="loadingIndicatorCentered__message">Loading...</span>
      </div>
    </>
  );
};
