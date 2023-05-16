import { ReactComponent as NovaLogo } from "../../assets/novaLogo.svg";
import { ReactComponent as WindLogo } from "../../assets/windLogo.svg";

export const LogoAndTitle = ({ company, title }) => {
  if (company === "WIND") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "10px",
          marginBottom: "15px",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          width: "110px",
        }}
      >
        <WindLogo style={{ width: "100px" }} />
        {
          <span
            style={{
              fontWeight: 600,
              fontSize: "12px",
            }}
          >
            {title}
          </span>
        }
      </div>
    );
  }

  if (company === "NOVA") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "10px",
          marginBottom: "15px",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          width: "110px",
        }}
      >
        <NovaLogo style={{ width: "100px" }} />
        <span
          style={{
            fontWeight: 600,
            fontSize: "12px",
          }}
        >
          {title}
        </span>
      </div>
    );
  }
};
