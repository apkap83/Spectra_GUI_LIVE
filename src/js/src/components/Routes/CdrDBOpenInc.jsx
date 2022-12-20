import { CdrDBOutagesTable } from "../CdrDBOutagesTable";

export const CdrDBOpenOutagesTable = () => {
  return <CdrDBOutagesTable specificRequest="getOpenCdrDBIncidents" />;
};
