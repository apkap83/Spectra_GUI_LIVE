export const getCurrentYear = () => {
  var year = new Date().getFullYear();
  return year;
};

export const monthNameToNumber = (name) => {
  return "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(name) / 3 + 1;
};

export function yyyymmdd(dateIn) {
  var yyyy = dateIn.getFullYear();
  var mm = dateIn.getMonth() + 1; // getMonth() is zero-based
  var dd = dateIn.getDate();
  return String(10000 * yyyy + 100 * mm + dd); // Leading zeros for mm and dd
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getColorYesNo = (text) => {
  if (text === "Yes") {
    return (
      <span style={{ color: "green" }}>
        <b>{text}</b>
      </span>
    );
  }

  return (
    <span style={{ color: "red" }}>
      <b>{text}</b>
    </span>
  );
};

export const getColorMsg = (text) => {
  if (text.startsWith("msg")) {
    return (
      <span style={{ color: "#1890ff" }}>
        <b>{text}</b>
      </span>
    );
  } else {
    return <span>{text}</span>;
  }
};
