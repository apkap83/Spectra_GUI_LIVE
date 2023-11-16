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

export function formatNumberWithThousandsSeparator(number) {
  return number.toLocaleString();
}

export function formatDateForIFrame(date) {
  if (date) {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0"); // JavaScript months are 0-indexed
    let day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
}
