package gr.wind.FullStackSpring_Review.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.security.core.parameters.P;

import java.util.Optional;

public class Incident {

    private final int ID;
    private final String incidentId;
    private final String incidentStatus;
    private final String willBePublished;
    private final String outageMsg;
    private final String outageId;
    private final String backupEligible;
    private final String userId;
    private final String scheduled;
    private final String requestTimestamp;
    private final String startTime;
    private final String endTime;
    private final String affectedServices;
    private final String duration;
    private final String hierarchySelected;
    private final int incidentAffectedVoice;
    private final int incidentAffectedData;
    private final int incidentAffectedIPTV;
    private final int outageAffectedVoice;
    private final int outageAffectedData;
    private final int outageAffectedIPTV;
    private final int outageAffectedCLI;

    public Incident(int id,
                    @JsonProperty("incidentId") String incidentId,
                    @JsonProperty("incidentStatus") String incidentStatus,
                    @JsonProperty("willBePublished") String willBePublished,
                    @JsonProperty("outageMsg") String outageMsg,
                    @JsonProperty("backupEligible") String backupEligible,
                    @JsonProperty("outageId") String outageId,
                    @JsonProperty("userId") String userId,
                    @JsonProperty("scheduled") String scheduled,
                    @JsonProperty("requestTimestamp") String requestTimestamp,
                    @JsonProperty("startTime") String startTime,
                    @JsonProperty("endTime") String endTime,
                    @JsonProperty("affectedServices") String affectedServices,
                    @JsonProperty("duration") String duration,
                    @JsonProperty("hierarchySelected") String hierarchySelected,
                    @JsonProperty("incidentAffectedVoice") int incidentAffectedVoice,
                    @JsonProperty("incidentAffectedData") int incidentAffectedData,
                    @JsonProperty("incidentAffectedIPTV") int incidentAffectedIPTV,
                    @JsonProperty("outageAffectedVoice") int outageAffectedVoice,
                    @JsonProperty("outageAffectedData") int outageAffectedData,
                    @JsonProperty("outageAffectedIPTV") int outageAffectedIPTV,
                    @JsonProperty("outageAffectedCLI") int outageAffectedCLI) {

        this.ID = id;
        this.incidentId = incidentId;
        this.incidentStatus = incidentStatus;
        this.willBePublished = willBePublished;
        this.outageMsg = Optional.ofNullable(outageMsg).orElse("Default");
        this.outageId = outageId;
        this.backupEligible = Optional.ofNullable(backupEligible).orElse("No");
        this.userId = userId;
        this.scheduled = scheduled;
        this.requestTimestamp = requestTimestamp;
        this.startTime = startTime;
        this.endTime = endTime;
        this.affectedServices = affectedServices;
        this.duration = Optional.ofNullable(duration).orElse("None");
        this.hierarchySelected = hierarchySelected;
        this.incidentAffectedVoice = incidentAffectedVoice;
        this.incidentAffectedData = incidentAffectedData;
        this.incidentAffectedIPTV = incidentAffectedIPTV;
        this.outageAffectedVoice = outageAffectedVoice;
        this.outageAffectedData = outageAffectedData;
        this.outageAffectedIPTV = outageAffectedIPTV;
        this.outageAffectedCLI = outageAffectedCLI;
    }

    public String getBackupEligible() {
        return backupEligible;
    }

    public String getRequestTimestamp() {
        return requestTimestamp;
    }

    public int getOutageAffectedCLI() {
        return outageAffectedCLI;
    }

    public int getOutageAffectedVoice() {
        return outageAffectedVoice;
    }

    public int getOutageAffectedData() {
        return outageAffectedData;
    }

    public int getOutageAffectedIPTV() {
        return outageAffectedIPTV;
    }

    public String getOutageMsg() {
        return outageMsg;
    }

    public int getID() {
        return ID;
    }

    public int getIncidentAffectedVoice() {
        return incidentAffectedVoice;
    }

    public int getIncidentAffectedData() {
        return incidentAffectedData;
    }

    public int getIncidentAffectedIPTV() {
        return incidentAffectedIPTV;
    }

    public String getHierarchySelected() {
        return hierarchySelected;
    }

    public String getAffectedServices() {
        return affectedServices;
    }

    public String getIncidentId() {
        return incidentId;
    }

    public String getOutageId() {
        return outageId;
    }

    public String getUserId() {
        return userId;
    }

    public String getScheduled() {
        return scheduled;
    }

    public String getStartTime() {
        return startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public String getDuration() {
        return duration;
    }

    public String getIncidentStatus() {
        return incidentStatus;
    }

    public String getWillBePublished() {
        return willBePublished;
    }

    @Override
    public String toString() {
        return "Incident{" +
                "incidentId='" + incidentId + '\'' +
                ", outageId='" + outageId + '\'' +
                ", userId='" + userId + '\'' +
                ", scheduled='" + scheduled + '\'' +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", duration=" + duration +
                '}';
    }
}
