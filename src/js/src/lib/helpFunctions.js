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

export function showSelectedDates(dateRange, masterLoading) {
  if (masterLoading) {
    return null;
  }
  if (dateRange) {
    const startDate = dateRange["startDate"].format("DD MMM YYYY");
    const endDate = dateRange["endDate"].format("DD MMM YYYY");
    if (startDate === endDate) {
      return (
        <>
          {/* <p className="fixedDate__dateInd fixedDate__dateInd--1">
            Selected Date
          </p> */}
          <span className="fixedDate__dateInd__date">{startDate}</span>
        </>
      );
    } else {
      return (
        <>
          {/* <p className="fixedDate__dateInd fixedDate__dateInd--2">
            Selected Dates
          </p> */}
          <span className="fixedDate__dateInd__date">
            {`${startDate}`}
            <br />
            {`${endDate}`}
          </span>
        </>
      );
    }
  }
}
