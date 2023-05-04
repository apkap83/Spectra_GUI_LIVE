package gr.wind.FullStackSpring_Review.model;

public class IncidentPosNLURequests {
    private final String callerDate;
    private final String requestor;
    private final String incidentId;
    private final String affectedService;
    private final String scheduled;
    private final String cliValue;
    private final String timesCalled;

    public IncidentPosNLURequests(String callerDate, String requestor, String incidentId, String affectedService, String scheduled, String cliValue, String timesCalled) {
        this.callerDate = callerDate;
        this.requestor = requestor;
        this.incidentId = incidentId;
        this.affectedService = affectedService;
        this.scheduled = scheduled;
        this.cliValue = cliValue;
        this.timesCalled = timesCalled;
    }

    public String getRequestor() {
        return requestor;
    }

    public String getCallerDate() {
        return callerDate;
    }

    public String getIncidentId() {
        return incidentId;
    }

    public String getAffectedService() {
        return affectedService;
    }

    public String getScheduled() {
        return scheduled;
    }

    public String getCliValue() {
        return cliValue;
    }

    public String getTimesCalled() {
        return timesCalled;
    }

    @Override
    public String toString() {
        return "IncidentPosNLURequests{" +
                "callerDate='" + callerDate + '\'' +
                ", incidentId='" + incidentId + '\'' +
                ", affectedService='" + affectedService + '\'' +
                ", scheduled='" + scheduled + '\'' +
                ", cliValue='" + cliValue + '\'' +
                ", timesCalled='" + timesCalled + '\'' +
                '}';
    }
}
