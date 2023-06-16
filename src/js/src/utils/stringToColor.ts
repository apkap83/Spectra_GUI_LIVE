import stc from "string-to-color";

const calculateBackgroundColor = (incidentId: string): string => {
  return stc(incidentId);
};

export default calculateBackgroundColor;
