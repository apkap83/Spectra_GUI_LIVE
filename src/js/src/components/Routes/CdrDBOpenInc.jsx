import { CdrDBOutages } from "../CdrDBOutages.component";

export const CdrDBOpenOutages = () => {
  return <CdrDBOutages specificRequest="getOpenCdrDBIncidents" />;
};
