import { rangePickerMaxIntervalInYears } from "../config/generalParameters";

export const datesWithinRange = (dates) => {
  if (dates) {
    const [start, end] = dates;
    const oneYearAfterStart = start
      .clone()
      .add(rangePickerMaxIntervalInYears, "years");

    if (end.isAfter(oneYearAfterStart)) {
      infoNotification("Dates Range", "Date range should not exceed 2 years.");
      return false;
    }
    return true;
  }
};
