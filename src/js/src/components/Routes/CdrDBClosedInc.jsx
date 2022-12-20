import { CdrDBOutagesTable } from "../CdrDBOutagesTable";

export const CdrDBClosedOutagesTable = () => {
  return <CdrDBOutagesTable specificRequest="getClosedCdrDBIncidents" />;
};
