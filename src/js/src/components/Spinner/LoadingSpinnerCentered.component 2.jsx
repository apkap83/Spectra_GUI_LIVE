import { Spin } from "antd";
const LoadingSpinnerCentered = (props) => {
  if (props.isFetching) {
    return (
      <>
        <Spin className="loadingIndicatorCentered" size="large" />
        <span
          className="loadingIndicatorCentered"
          style={{ marginTop: "20px", textAlign: "center" }}
        >
          Please wait...
        </span>
      </>
    );
  } else {
    return props.children;
  }
};

export default LoadingSpinnerCentered;