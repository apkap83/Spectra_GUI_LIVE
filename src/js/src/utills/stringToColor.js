import stc from "string-to-color";

const calculateBackgroundColor = (incidentId) => {
  return stc(incidentId);
};

export default calculateBackgroundColor;
