export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        minHeight: "100vh",
      }}
    >
      <h1>Spectra - Page not found</h1>
      <div style={{ width: "25%" }}>
        <span>
          Return to:&nbsp;
          <a style={{ display: "inline" }} href="/">
            Home Page
          </a>
        </span>
      </div>
    </div>
  );
}
