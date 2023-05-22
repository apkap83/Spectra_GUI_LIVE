import { Spin } from "antd";
import "./myloadingspinner.scss";

export const MyLoadingSpinner = (props) => {
  return (
    <div className="loadingIndicator">
      <Spin className="loadingIndicator__spinner" size="small" />
      <span className="loadingIndicator__message">Please wait...</span>
    </div>
  );
};
