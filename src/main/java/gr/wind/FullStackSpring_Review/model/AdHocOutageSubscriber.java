package gr.wind.FullStackSpring_Review.model;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

public class AdHocOutageSubscriber {

    private final int ID;
    private final String CliValue;
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone="Europe/Athens")
    private final Date Start_DateTime;
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone="Europe/Athens")
    private final Date End_DateTime;
    private final String BackupEligible;
    private final String Message;

    public AdHocOutageSubscriber(int id, String cliValue, Date start_DateTime, Date end_DateTime, String backupEligible, String message) {
        ID = id;
        CliValue = cliValue;
        Start_DateTime = start_DateTime;
        End_DateTime = end_DateTime;
        BackupEligible = backupEligible;
        Message = message;
    }

    @Override
    public String toString() {
        return "AdHocOutageSubscriber{" +
                "CliValue='" + CliValue + '\'' +
                ", Start_DateTime=" + Start_DateTime +
                ", End_DateTime=" + End_DateTime +
                ", BackupEligible='" + BackupEligible + '\'' +
                ", Message='" + Message + '\'' +
                '}';
    }

    public int getID() {
        return ID;
    }

    public String getCliValue() {
        return CliValue;
    }

    public Date getStart_DateTime() {
        return Start_DateTime;
    }

    public Date getEnd_DateTime() {
        return End_DateTime;
    }

    public String getBackupEligible() {
        return BackupEligible;
    }

    public String getMessage() {
        return Message;
    }
}
