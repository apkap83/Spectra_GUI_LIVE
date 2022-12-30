package gr.wind.FullStackSpring_Review.model;

public class CDR_DB_Incident {

    private final Long Outage_ID;
    private final String Status;
    private final String Capture_Date;
    private final String Network;
    private final String DSLAM;
    private final String DSLAM_Owner;
    private final String Last_Occurred;
    private final String Cleared_On;
    private final String Duration_Pretty;
    private final int Duration_Sec;
    private final int Disconnected_Users;
    private final int Reconnected_Users;
    private final int DSLAM_Users;
    private final String Disconnections_Ratio;
    private final String Reconnections_Ratio;
    private final int Total_Calls;
    private final int Total_Users_Called;




    public CDR_DB_Incident(Long outage_ID,
                           String status,
                           String capture_date,
                           String network,
                           String DSLAM,
                           String dslam_owner,
                           String last_occurred,
                           String cleared_on,
                           String duration_Pretty,
                           int duration_sec,
                           int disconnected_users,
                           int reconnected_users,
                           int dslam_users,
                           String disconnections_ratio,
                           String reconnections_ratio, int total_calls, int total_users_called) {
        Outage_ID = outage_ID;
        Status = status;
        Capture_Date = capture_date;
        this.Network = network;
        this.DSLAM = DSLAM;
        DSLAM_Owner = dslam_owner;
        Last_Occurred = last_occurred;
        Cleared_On = cleared_on;
        Duration_Pretty = duration_Pretty;
        Duration_Sec = duration_sec;
        Disconnected_Users = disconnected_users;
        Reconnected_Users = reconnected_users;
        DSLAM_Users = dslam_users;
        Disconnections_Ratio = disconnections_ratio;
        Reconnections_Ratio = reconnections_ratio;
        Total_Calls = total_calls;
        Total_Users_Called = total_users_called;
    }

    public String getLast_Occurred() {
        return Last_Occurred;
    }

    public int getTotal_Calls() {
        return Total_Calls;
    }

    public int getTotal_Users_Called() {
        return Total_Users_Called;
    }

    public Long getOutage_ID() {
        return Outage_ID;
    }

    public String getStatus() {
        return Status;
    }

    public String getCapture_Date() {
        return Capture_Date;
    }
    public String getNetwork() {
        return Network;
    }
    public String getDSLAM() {
        return DSLAM;
    }

    public String getDSLAM_Owner() {
        return DSLAM_Owner;
    }

    public String getLast_Occured() {
        return Last_Occurred;
    }

    public String getCleared_On() {
        return Cleared_On;
    }

    public String getDuration_Pretty() {
        return Duration_Pretty;
    }

    public int getDuration_Sec() {
        return Duration_Sec;
    }

    public int getDisconnected_Users() {
        return Disconnected_Users;
    }

    public int getReconnected_Users() {
        return Reconnected_Users;
    }

    public int getDSLAM_Users() {
        return DSLAM_Users;
    }

    public String getDisconnections_Ratio() {
        return Disconnections_Ratio;
    }

    public String getReconnections_Ratio() {
        return Reconnections_Ratio;
    }

    @Override
    public String toString() {
        return "CDR_DB_Incident{" +
                "Outage_ID=" + Outage_ID +
                ", Status='" + Status + '\'' +
                ", Capture_Date='" + Capture_Date + '\'' +
                ", DSLAM='" + DSLAM + '\'' +
                ", DSLAM_Owner='" + DSLAM_Owner + '\'' +
                ", Last_Occured='" + Last_Occurred + '\'' +
                ", Cleared_On='" + Cleared_On + '\'' +
                ", Duration_Sec='" + Duration_Sec + '\'' +
                ", Disconnected_Users='" + Disconnected_Users + '\'' +
                ", Reconnected_Users='" + Reconnected_Users + '\'' +
                ", DSLAM_Users='" + DSLAM_Users + '\'' +
                ", Disconnections_Ratio='" + Disconnections_Ratio + '\'' +
                ", Reconnections_Ratio='" + Reconnections_Ratio + '\'' +
                '}';
    }
}
