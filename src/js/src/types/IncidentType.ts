export interface IncidentType {
  id: number;
  affectedServices: string;
  backupEligible: string;
  duration: number;
  endTime: string;
  hierarchySelected: string;
  incidentAffectedVoice: number;
  incidentAffectedData: number;
  incidentAffectedIPTV: number;
  incidentId: string;
  incidentStatus: string;
  outageAffectedCLI: number;
  outageAffectedData: number;
  outageAffectedIPTV: number;
  outageAffectedVoice: number;
  outageId: number;
  outageMsg: string;
  requestTimestamp: string;
  scheduled: string;
  startTime: string;
  userId: string;
  willBePublished: string;
}
