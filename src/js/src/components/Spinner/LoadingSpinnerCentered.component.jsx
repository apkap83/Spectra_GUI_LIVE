import { Spin } from "antd";
const LoadingSpinnerCentered = (props) => {
  if (props.isFetching) {
    return (
      <div className="loadingIndicatorCentered">
        <Spin size="large" />
        <span style={{ marginTop: "5px" }}>Please wait...</span>
      </div>
    );
  } else {
    return props.children;
  }
};

export default LoadingSpinnerCentered;
