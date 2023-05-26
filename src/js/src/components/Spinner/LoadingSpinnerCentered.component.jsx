import { Spin } from "antd";
const LoadingSpinnerCentered = (props) => {
  if (props.isFetching) {
    return (
      <div className="loadingIndicatorCentered">
        <Spin size="large" />
        <span
          style={{
            fontSize: "1,7rem !important",
            color: "#000",
            marginTop: "5px",
          }}
        >
          Please wait...
        </span>
      </div>
    );
  } else {
    return props.children;
  }
};

export default LoadingSpinnerCentered;
