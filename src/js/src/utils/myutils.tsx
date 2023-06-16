export const getCurrentYear = () => {
  var year = new Date().getFullYear();
  return year;
};

export const monthNameToNumber = (name: string) => {
  return "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(name) / 3 + 1;
};

export function yyyymmdd(dateIn: Date) {
  var yyyy = dateIn.getFullYear();
  var mm = dateIn.getMonth() + 1; // getMonth() is zero-based
  var dd = dateIn.getDate();
  return String(10000 * yyyy + 100 * mm + dd); // Leading zeros for mm and dd
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getColorYesNo: React.FC<string> = (text) => {
  if (text === "Yes") {
    return (
      <span style={{ color: "green" }}>
        <b>{text}</b>
      </span>
    );
  } else {
    return (
      <span style={{ color: "red" }}>
        <b>{text}</b>
      </span>
    );
  }
};

export const getColorMsg = (text: string) => {
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
