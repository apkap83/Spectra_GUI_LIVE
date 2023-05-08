package gr.wind.FullStackSpring_Review.incident;

import gr.wind.FullStackSpring_Review.model.AdHocOutageSubscriber;
import gr.wind.FullStackSpring_Review.model.Incident;
import gr.wind.FullStackSpring_Review.model.IncidentCallerStats;
import gr.wind.FullStackSpring_Review.model.IncidentPosNLURequests;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Repository
public class NovaIncidentDataAccessService {

    @Value("${app.NovaTablePrefix}")
    private String TablePrefix;

    private final JdbcTemplate jdbcTemplate;

    public NovaIncidentDataAccessService(@Qualifier("jdbcTemplateForNovaDB") JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Incident> selectAllIncidents() {
        String sql = "SELECT " +
                "ID, " +
                "IncidentID, " +
                "IncidentStatus, " +
                "WillBePublished, " +
                "OutageMsg, " +
                "BackupEligible, " +
                "OutageID, " +
                "UserID, " +
                "Scheduled, " +
                "RequestTimestamp, " +
                "StartTime, " +
                "EndTime, " +
                "Duration, " +
                "AffectedServices, " +
                "HierarchySelected, " +
                "AffectedVoiceCustomers, " +
                "AffectedDataCustomers, " +
                "TVCustomersAffected, " +
                "AffectedCLICustomers, " +
                "IncidentAffectedVoiceCustomers, " +
                "IncidentAffectedDataCustomers, " +
                "IncidentAffectedIPTVCustomers " +
                "from " + TablePrefix + "SubmittedIncidents order by ID DESC LIMIT 1000";

        List<Incident> incidents = jdbcTemplate.query(sql, (resultSet, i) -> {
            int id = resultSet.getInt("ID");
            String incidentId = resultSet.getString("IncidentID");
            String incidentStatus = resultSet.getString("IncidentStatus");
            String willBePublished = resultSet.getString("WillBePublished");
            String outageMsg = resultSet.getString("OutageMsg");
            String backupEligible = resultSet.getString("backupEligible");
            String outageId = resultSet.getString("OutageID");
            String userId = resultSet.getString("userId");
            String scheduled = resultSet.getString("scheduled");
            String startDateString = "null";
            String endDateString = "null";

            Date startDateFromDB = resultSet.getTimestamp("startTime");
            Date endDateFromDB = resultSet.getTimestamp("endTime");
            String requestTimestamp = "null";
            Date requestTimestampFromDB = resultSet.getTimestamp("RequestTimestamp");

            if (requestTimestampFromDB != null) {
                requestTimestamp = new SimpleDateFormat("dd MMM yyyy HH:mm:ss").format(requestTimestampFromDB);
            }

            if (startDateFromDB != null) {
                startDateString = new SimpleDateFormat("dd MMM yyyy HH:mm:ss").format(startDateFromDB);
            }

            if (endDateFromDB != null) {
                endDateString = new SimpleDateFormat("dd MMM yyyy HH:mm:ss").format(endDateFromDB);
            }

            String duration = resultSet.getString("duration");
            String affectedServices = resultSet.getString("AffectedServices");
            String hierarchySelected = resultSet.getString("HierarchySelected");

            int outageAffectedVoice = resultSet.getInt("AffectedVoiceCustomers");
            int outageAffectedData = resultSet.getInt("AffectedDataCustomers");
            int outageAffectedIPTV = resultSet.getInt("TVCustomersAffected");
            int outageAffectedCLI = resultSet.getInt("AffectedCLICustomers");

            int incidentAffectedVoice = resultSet.getInt("IncidentAffectedVoiceCustomers");
            int incidentAffectedData = resultSet.getInt("IncidentAffectedDataCustomers");
            int incidentAffectedIPTV = resultSet.getInt("IncidentAffectedIPTVCustomers");


            return new Incident(id,
                    incidentId,
                    incidentStatus,
                    willBePublished,
                    outageMsg,
                    backupEligible,
                    outageId,
                    userId,
                    scheduled,
                    requestTimestamp,
                    startDateString,
                    endDateString,
                    affectedServices,
                    duration,
                    hierarchySelected,
                    incidentAffectedVoice,
                    incidentAffectedData,
                    incidentAffectedIPTV,
                    outageAffectedVoice,
                    outageAffectedData,
                    outageAffectedIPTV,
                    outageAffectedCLI);
        });

        return incidents;
    }

    public List<Incident> selectOpenIncidents() {
        String sql = "SELECT " +
                "ID, " +
                "IncidentID, " +
                "IncidentStatus, " +
                "WillBePublished, " +
                "OutageMsg, " +
                "BackupEligible, " +
                "OutageID, " +
                "UserID, " +
                "Scheduled, " +
                "RequestTimestamp, " +
                "StartTime, " +
                "EndTime, " +
                "Duration, " +
                "AffectedServices, " +
                "HierarchySelected, " +
                "AffectedVoiceCustomers, " +
                "AffectedDataCustomers, " +
                "TVCustomersAffected, " +
                "AffectedCLICustomers, " +
                "IncidentAffectedVoiceCustomers, " +
                "IncidentAffectedDataCustomers, " +
                "IncidentAffectedIPTVCustomers " +
                "from " + TablePrefix + "SubmittedIncidents WHERE IncidentStatus = 'OPEN' order by ID DESC LIMIT 1000";

        List<Incident> incidents = jdbcTemplate.query(sql, (resultSet, i) -> {
            int id = resultSet.getInt("ID");
            String incidentId = resultSet.getString("IncidentID");
            String incidentStatus = resultSet.getString("IncidentStatus");
            String willBePublished = resultSet.getString("WillBePublished");
            String outageMsg = resultSet.getString("OutageMsg");
            String backupEligible = resultSet.getString("backupEligible");
            String outageId = resultSet.getString("OutageID");
            String userId = resultSet.getString("userId");
            String scheduled = resultSet.getString("scheduled");

            String startDateString = "null";
            String endDateString = "null";
            Date startDateFromDB = resultSet.getTimestamp("startTime");
            Date endDateFromDB = resultSet.getTimestamp("endTime");

            String requestTimestamp = "null";
            Date requestTimestampFromDB = resultSet.getTimestamp("RequestTimestamp");
            if (requestTimestampFromDB != null) {
                requestTimestamp = new SimpleDateFormat("dd MMM yyyy HH:mm:ss").format(requestTimestampFromDB);
            }

            if (startDateFromDB != null) {
                startDateString = new SimpleDateFormat("dd MMM yyyy HH:mm:ss").format(startDateFromDB);
            }

            if (endDateFromDB != null) {
                endDateString = new SimpleDateFormat("dd MMM yyyy HH:mm:ss").format(endDateFromDB);
            }

            String duration = resultSet.getString("duration");
            String affectedServices = resultSet.getString("AffectedServices");
            String hierarchySelected = resultSet.getString("HierarchySelected");
            int outageAffectedVoice = resultSet.getInt("AffectedVoiceCustomers");
            int outageAffectedData = resultSet.getInt("AffectedDataCustomers");
            int outageAffectedIPTV = resultSet.getInt("TVCustomersAffected");
            int outageAffectedCLI = resultSet.getInt("AffectedCLICustomers");
            int incidentAffectedVoice = resultSet.getInt("IncidentAffectedVoiceCustomers");
            int incidentAffectedData = resultSet.getInt("IncidentAffectedDataCustomers");
            int incidentAffectedIPTV = resultSet.getInt("IncidentAffectedIPTVCustomers");

            return new Incident(id, incidentId, incidentStatus, willBePublished, outageMsg, backupEligible, outageId, userId, scheduled, requestTimestamp, startDateString, endDateString, affectedServices, duration, hierarchySelected, incidentAffectedVoice, incidentAffectedData, incidentAffectedIPTV, outageAffectedVoice, outageAffectedData, outageAffectedIPTV, outageAffectedCLI);
        });

        return incidents;
    }

    public int setWillBePublishedNOForOutageID(int outageID) {
        String sql = "" +
                "update " + TablePrefix + "SubmittedIncidents " +
                "set WillBePublished = 'No' " +
                "where OutageID = ?";

        return jdbcTemplate.update(
                sql,
                outageID
        );
    }

    public int setWillBePublishedYESForOutageID(int outageID) {
        String sql = "" +
                "update " + TablePrefix + "SubmittedIncidents " +
                "set WillBePublished = 'Yes' " +
                "where OutageID = ?";

        return jdbcTemplate.update(
                sql,
                outageID
        );
    }

    public int setWillBePublishedNOForIncidentID(String incidentId) {
        String sql = "" +
                "update " + TablePrefix + "SubmittedIncidents " +
                "set WillBePublished = 'No' " +
                "where IncidentID = ?";

        return jdbcTemplate.update(
                sql,
                incidentId
        );
    }

    public int setWillBePublishedYESForIncidentID(String incidentId) {
        String sql = "" +
                "update " + TablePrefix + "SubmittedIncidents " +
                "set WillBePublished = 'Yes' " +
                "where IncidentID = ?";

        return jdbcTemplate.update(
                sql,
                incidentId
        );
    }

    public List<Incident> selectOpenNonScheduledIncidents() {
        String sql = "SELECT " +
                "ID, " +
                "IncidentID, " +
                "IncidentStatus, " +
                "WillBePublished, " +
                "OutageMsg, " +
                "BackupEligible, " +
                "OutageID, " +
                "UserID, " +
                "Scheduled, " +
                "RequestTimestamp, " +
                "StartTime, " +
                "EndTime, " +
                "Duration, " +
                "AffectedServices, " +
                "HierarchySelected, " +
                "AffectedVoiceCustomers, " +
                "AffectedDataCustomers, " +
                "TVCustomersAffected, " +
                "AffectedCLICustomers, " +
                "IncidentAffectedVoiceCustomers, " +
                "IncidentAffectedDataCustomers, " +
                "IncidentAffectedIPTVCustomers " +
                "from " + TablePrefix + "SubmittedIncidents WHERE IncidentStatus = 'OPEN' and Scheduled = 'No' order by ID DESC LIMIT 1000";

        List<Incident> incidents = jdbcTemplate.query(sql, (resultSet, i) -> {
            int id = resultSet.getInt("ID");
            String incidentId = resultSet.getString("IncidentID");
            String incidentStatus = resultSet.getString("IncidentStatus");
            String willBePublished = resultSet.getString("WillBePublished");
            String outageMsg = resultSet.getString("OutageMsg");
            String backupEligible = resultSet.getString("backupEligible");
            String outageId = resultSet.getString("OutageID");
            String userId = resultSet.getString("userId");
            String scheduled = resultSet.getString("scheduled");

            String startDateString = "null";
            String endDateString = "null";
            Date startDateFromDB = resultSet.getTimestamp("startTime");
            Date endDateFromDB = resultSet.getTimestamp("endTime");

            String requestTimestamp = "null";
            Date requestTimestampFromDB = resultSet.getTimestamp("RequestTimestamp");
            if (requestTimestampFromDB != null) {
                requestTimestamp = new SimpleDateFormat("dd MMM yyyy HH:mm:ss").format(requestTimestampFromDB);
            }

            if (startDateFromDB != null) {
                startDateString = new SimpleDateFormat("dd MMM yyyy HH:mm:ss").format(startDateFromDB);
            }

            if (endDateFromDB != null) {
                endDateString = new SimpleDateFormat("dd MMM yyyy HH:mm:ss").format(endDateFromDB);
            }

            String duration = resultSet.getString("duration");
            String affectedServices = resultSet.getString("AffectedServices");
            String hierarchySelected = resultSet.getString("HierarchySelected");
            int outageAffectedVoice = resultSet.getInt("AffectedVoiceCustomers");
            int outageAffectedData = resultSet.getInt("AffectedDataCustomers");
            int outageAffectedIPTV = resultSet.getInt("TVCustomersAffected");
            int outageAffectedCLI = resultSet.getInt("AffectedCLICustomers");
            int incidentAffectedVoice = resultSet.getInt("IncidentAffectedVoiceCustomers");
            int incidentAffectedData = resultSet.getInt("IncidentAffectedDataCustomers");
            int incidentAffectedIPTV = resultSet.getInt("IncidentAffectedIPTVCustomers");

            return new Incident(id, incidentId, incidentStatus, willBePublished, outageMsg, backupEligible, outageId, userId, scheduled, requestTimestamp, startDateString, endDateString, affectedServices, duration, hierarchySelected, incidentAffectedVoice, incidentAffectedData, incidentAffectedIPTV, outageAffectedVoice, outageAffectedData, outageAffectedIPTV, outageAffectedCLI);
        });

        return incidents;
    }

    public List<Incident> selectAllNonScheduledIncidents() {
        String sql = "SELECT " +
                "ID, " +
                "IncidentID, " +
                "IncidentStatus, " +
                "WillBePublished, " +
                "OutageMsg, " +
                "BackupEligible, " +
                "OutageID, " +
                "UserID, " +
                "Scheduled, " +
                "RequestTimestamp, " +
                "StartTime, " +
                "EndTime, " +
                "Duration, " +
                "AffectedServices, " +
                "HierarchySelected, " +
                "AffectedVoiceCustomers, " +
                "AffectedDataCustomers, " +
                "TVCustomersAffected, " +
                "AffectedCLICustomers, " +
                "IncidentAffectedVoiceCustomers, " +
                "IncidentAffectedDataCustomers, " +
                "IncidentAffectedIPTVCustomers " +
                "from " + TablePrefix + "SubmittedIncidents WHERE Scheduled = 'No' order by ID DESC LIMIT 1000";

        List<Incident> incidents = jdbcTemplate.query(sql, (resultSet, i) -> {
            int id = resultSet.getInt("ID");
            String incidentId = resultSet.getString("IncidentID");
            String incidentStatus = resultSet.getString("IncidentStatus");
            String willBePublished = resultSet.getString("WillBePublished");
            String outageMsg = resultSet.getString("OutageMsg");
            String backupEligible = resultSet.getString("backupEligible");
            String outageId = resultSet.getString("OutageID");
            String userId = resultSet.getString("userId");
            String scheduled = resultSet.getString("scheduled");

            String startDateString = "null";
            String endDateString = "null";
            Date startDateFromDB = resultSet.getTimestamp("startTime");
            Date endDateFromDB = resultSet.getTimestamp("endTime");

            String requestTimestamp = "null";
            Date requestTimestampFromDB = resultSet.getTimestamp("RequestTimestamp");
            if (requestTimestampFromDB != null) {
                requestTimestamp = new SimpleDateFormat("dd MMM yyyy HH:mm:ss").format(requestTimestampFromDB);
            }

            if (startDateFromDB != null) {
                startDateString = new SimpleDateFormat("dd MMM yyyy HH:mm:ss").format(startDateFromDB);
            }

            if (endDateFromDB != null) {
                endDateString = new SimpleDateFormat("dd MMM yyyy HH:mm:ss").format(endDateFromDB);
            }

            String duration = resultSet.getString("duration");
            String affectedServices = resultSet.getString("AffectedServices");
            String hierarchySelected = resultSet.getString("HierarchySelected");
            int outageAffectedVoice = resultSet.getInt("AffectedVoiceCustomers");
            int outageAffectedData = resultSet.getInt("AffectedDataCustomers");
            int outageAffectedIPTV = resultSet.getInt("TVCustomersAffected");
            int outageAffectedCLI = resultSet.getInt("AffectedCLICustomers");
            int incidentAffectedVoice = resultSet.getInt("IncidentAffectedVoiceCustomers");
            int incidentAffectedData = resultSet.getInt("IncidentAffectedDataCustomers");
            int incidentAffectedIPTV = resultSet.getInt("IncidentAffectedIPTVCustomers");

            return new Incident(id, incidentId, incidentStatus, willBePublished, outageMsg, backupEligible, outageId, userId, scheduled, requestTimestamp, startDateString, endDateString, affectedServices, duration, hierarchySelected, incidentAffectedVoice, incidentAffectedData, incidentAffectedIPTV, outageAffectedVoice, outageAffectedData, outageAffectedIPTV, outageAffectedCLI);
        });
        return incidents;
    }

    public int changeMessageForOutageId(String outageId, String message) {
        // If "null" string is detected in message then we insert null value in DB
        if (message.equals("null")) {
            message = null;
        }
        String sql = "" +
                "update " + TablePrefix + "SubmittedIncidents " +
                "set OutageMsg = ? " +
                "where OutageID = ?";

        return jdbcTemplate.update(
                sql,
                message,
                outageId
        );
    }

    public int changeMessageForIncident(String incidentId, String message) {
        // If "null" string is detected in message then we insert null value in DB
        if (message.equals("null")) {
            message = null;
        }

        String sql = "" +
                "update " + TablePrefix + "SubmittedIncidents " +
                "set OutageMsg = ? " +
                "where incidentId = ?";

        return jdbcTemplate.update(
                sql,
                message,
                incidentId
        );
    }

    public int alterBackupPolicyForIncident(String incidentId, String yesorno) {
        if (yesorno == null) {
            yesorno = "No";
        }
        String sql = "" +
                "update " + TablePrefix + "SubmittedIncidents " +
                "set BackupEligible = ? " +
                "where IncidentID = ?";

        return jdbcTemplate.update(
                sql,
                yesorno,
                incidentId
        );
    }

    public void insertMultipleAdHocOutageSubscribers(List<AdHocOutageSubscriber> adHocOutageSubs) {
        String SQL_STUDENT_INSERT = "INSERT INTO " + TablePrefix + "AdHocOutage_CLIS(CliValue,Start_DateTime,End_DateTime,BackupEligible,Message) values(?,?,?,?,?)";

        jdbcTemplate.batchUpdate(SQL_STUDENT_INSERT, new BatchPreparedStatementSetter() {

            public void setValues(PreparedStatement pStmt, int j) throws SQLException {
                AdHocOutageSubscriber aoSub = adHocOutageSubs.get(j);

                pStmt.setString(1, aoSub.getCliValue());
                pStmt.setTimestamp(2, new Timestamp(aoSub.getStart_DateTime().getTime()));
                pStmt.setTimestamp(3, new Timestamp(aoSub.getEnd_DateTime().getTime()));
                pStmt.setString(4, aoSub.getBackupEligible());
                pStmt.setString(5, aoSub.getMessage());
            }

            @Override
            public int getBatchSize() {
                return adHocOutageSubs.size();
            }
        });
    }

    public List<AdHocOutageSubscriber> getAllAdHocOutages() {
        String sql = "SELECT " +
                "id, " +
                "CliValue, " +
                "Start_DateTime, " +
                "End_DateTime, " +
                "BackupEligible, " +
                "Message " +
                "FROM " + TablePrefix + "AdHocOutage_CLIS ORDER BY id DESC;";

        List<AdHocOutageSubscriber> adHocOutages = jdbcTemplate.query(sql, (resultSet, i) -> {
            int id = resultSet.getInt("id");
            String cliValue = resultSet.getString("CliValue");

            String startDateString = "null";
            String endDateString = "null";
            Date Start_DateTime = resultSet.getTimestamp("Start_DateTime");
            Date End_DateTime = resultSet.getTimestamp("End_DateTime");

            if (Start_DateTime != null) {
                startDateString = new SimpleDateFormat("dd MMM yyyy HH:mm:ss").format(Start_DateTime);
            }

            if (End_DateTime != null) {
                endDateString = new SimpleDateFormat("dd MMM yyyy HH:mm:ss").format(End_DateTime);
            }

            String BackupEligible = resultSet.getString("BackupEligible");
            String Message = resultSet.getString("Message");
            return new AdHocOutageSubscriber(id, cliValue, Start_DateTime, End_DateTime, BackupEligible, Message);
        });

        return adHocOutages;
    }

    public int deleteAdHocIncidentById(int id) {
        String sql = "" +
                "delete from " + TablePrefix + "AdHocOutage_CLIS " +
                "where id = ?";
        System.out.println("id =" +id);
        return jdbcTemplate.update(
                sql,
                id
        );
    }


    public List<IncidentCallerStats> getIncidentCallerStats(String incidentID) {
        String sql = "" +
                "SELECT Requestor, count(DISTINCT CliValue) as 'Positive Responses' " +
                " FROM Nova_SmartOutageDB_Static_Tables.Nova_Caller_Data " +
                " where Affected_by_IncidentID = ? " +
                " group by Requestor";

        List<IncidentCallerStats> incidentStats = jdbcTemplate.query(sql, (resultSet, i) -> {
            String requestor = resultSet.getString("Requestor");
            String positiveResponses = resultSet.getString("Positive Responses");

            return new IncidentCallerStats(requestor, positiveResponses);
        }, incidentID);

        return incidentStats;
    }

    public List<IncidentPosNLURequests> getPositiveRequestsForIncident(String incidentID) {
        String sql = "" +
                "SELECT DateTime, Requestor, IncidentID, AffectedService, Scheduled, CliValue, TimesCalled " +
                " FROM Nova_SmartOutageDB_Static_Tables.Nova_Stats_Pos_NLU_Requests " +
                " WHERE IncidentID = ? order by DateTime ASC";

        List<IncidentPosNLURequests> incidentStats = jdbcTemplate.query(sql, (resultSet, i) -> {
            String dateTime = resultSet.getString("DateTime");
            String requestor = resultSet.getString("Requestor");
            String incidentId = resultSet.getString("IncidentID");
            String affectedService = resultSet.getString("AffectedService");
            String scheduled = resultSet.getString("Scheduled");
            String cliValue = resultSet.getString("CliValue");
            String timesCalled = resultSet.getString("TimesCalled");

            return new IncidentPosNLURequests(dateTime, requestor, incidentId, affectedService, scheduled, cliValue, timesCalled);
        }, incidentID);

        return incidentStats;
    }
}