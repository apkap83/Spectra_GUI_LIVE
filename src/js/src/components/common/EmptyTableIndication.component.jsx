import { ReactComponent as NoDataLogo } from "../../assets/noData.svg";

export const EmptyTableIndication = ({ recordsNumber }) => {
  if (recordsNumber === 0) {
    return (
      <div
        style={{
          height: "86vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <NoDataLogo />
          <p style={{ marginTop: "20px" }}>No data</p>
        </div>
      </div>
    );
  }
};
