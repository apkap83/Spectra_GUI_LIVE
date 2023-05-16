import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

export function HideScheduledCheckBox({ setHideScheduled }) {
  return (
    <FormGroup>
      <FormControlLabel
        control={<Checkbox onClick={() => setHideScheduled((prev) => !prev)} />}
        label="Hide Scheduled"
      />
    </FormGroup>
  );
}
