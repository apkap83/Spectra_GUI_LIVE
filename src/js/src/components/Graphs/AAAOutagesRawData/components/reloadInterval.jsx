import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

export const ReloadInterval = ({
  defaultRefreshIntervalTime,
  refreshIntervalTime,
  setRefreshIntervalTime,
  refreshIntervalInputRef,
}) => {
  const handleInput = (event) => {
    const cursorPosition = refreshIntervalInputRef.current.selectionStart;
    const newInputChar = event.nativeEvent.data; // Get the newly entered character

    // Check if the new input is a valid number
    if (!isNaN(newInputChar)) {
      let newValue = refreshIntervalTime.toString().split(""); // Convert the value to an array of characters
      newValue[0] = newInputChar; // Replace the character at the cursor position

      newValue = newValue.join(""); // Convert the array back to a string

      setRefreshIntervalTime(newValue);
    }
  };

  return (
    <div className="aaa__header__reloadInterval">
      <Switch
        {...label}
        checked={!!refreshIntervalTime}
        onClick={() => {
          if (refreshIntervalTime) {
            setRefreshIntervalTime(0);
          } else {
            setRefreshIntervalTime(defaultRefreshIntervalTime);
          }
        }}
      />
      <TextField
        ref={refreshIntervalInputRef}
        className={`aaa__header__reloadInterval__time ${
          refreshIntervalTime ? "active" : "inactive"
        }`}
        id="outlined-basic"
        variant="outlined"
        value={refreshIntervalTime}
        onInput={handleInput}
        sx={{
          "& .MuiInputBase-root": {
            fontSize: "2rem",
            lineHeight: "2rem",
            width: "5rem",
            textAlign: "center",
            height: "3.2rem",
          },

          "& .MuiInputBase-input": {
            textAlign: "center",
            height: "1rem",
          },
        }}
      />
      <span
        className={`aaa__header__reloadInterval__time ${
          refreshIntervalTime ? "active" : "inactive"
        }`}
        style={{
          lineHeight: "0.5rem",
          height: "0.5rem",
          paddingTop: "2.5rem",
          paddingLeft: "0.5rem",
          fontWeight: 600,
          fontSize: "1.3rem",
        }}
      >
        sec
      </span>
    </div>
  );
};
