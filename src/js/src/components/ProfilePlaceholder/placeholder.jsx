import { ReactComponent as ProfilePlaceholder } from "../../assets/profile.svg";

export function PlaceHolder({ text = "" }) {
  return (
    <div
      style={{
        width: "3rem",
        height: "3rem",
        position: "relative",
        display: "inline-block",
      }}
    >
      <ProfilePlaceholder
        style={{ width: "3rem", height: "3rem" }}
      ></ProfilePlaceholder>
      <span
        style={{
          color: "white",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          zIndex: "100",
          opacity: "50%",
          fontSize: "1.5rem",
          lineHeight: "150%",
        }}
      >
        {/* {text.charAt(0).toUpperCase()} */}
        {text}
      </span>
    </div>
  );
}
