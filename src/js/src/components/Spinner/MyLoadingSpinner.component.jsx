import { Spin } from "antd";

export const MyLoadingSpinner = (props) => {
  return (
    <div className="loadingIndicator">
      <Spin className="loadingIndicator__spinner" size="medium" />
      <span className="loadingIndicator__message">Please wait...</span>
    </div>
  );
};
