import { CdrDBOutages } from "../CdrDBOutages.component";

export const CdrDBClosedOutages = () => {
  return <CdrDBOutages specificRequest="getClosedCdrDBIncidents" />;
};
