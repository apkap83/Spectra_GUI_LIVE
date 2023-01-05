import SpectraIncidentsTable from "../SpectraIncidentsTable.component";

export const NovaOpenSpectraIncidents = () => {
  return (
    <SpectraIncidentsTable specificRequest="getOpenSpectraIncidents_forNova" />
  );
};
