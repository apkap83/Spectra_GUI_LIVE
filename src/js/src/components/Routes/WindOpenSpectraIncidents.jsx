import SpectraIncidentsTable from "../SpectraIncidentsTable.component";

export const WindOpenSpectraIncidents = () => {
  return (
    <SpectraIncidentsTable specificRequest="getOpenSpectraIncidents_forWind" />
  );
};
