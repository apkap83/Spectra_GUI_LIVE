package gr.wind.FullStackSpring_Review.incident;

import gr.wind.FullStackSpring_Review.model.CDR_DB_Incident;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Repository
public class IncidentDataAccessService_CDRDB {

    private final JdbcTemplate jdbcTemplate;

    public IncidentDataAccessService_CDRDB(@Qualifier("jdbcTemplateForCDRDB") JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }


    public List<CDR_DB_Incident> selectAllIncidents() {
        String sql = "SELECT * " +
                        "FROM " +
                        "(SELECT OUTAGE_ID, " +
                        "STATUS, " +
                        "CAPTURE_DATE, " +
                        "DSLAM, " +
                        "DSLAM_OWNER, " +
                        "LAST_OCCURRED, " +
                        "CLEARED_ON, " +
                        "DURATION_PRETTY, " +
                        "DURATION_SEC, " +
                        "DISCONNECTED_USERS, " +
                        "RECONNECTED_USERS, " +
                        "DSLAM_USERS, " +
                        "DISCONNECTIONS_RATIO, " +
                        "RECONNECTIONS_RATIO, " +
                        "TOTAL_CALLS, " +
                        "TOTAL_USERS_CALLED " +
                        "FROM Z_AAA_DSLAM_OUTAGES_GUI_V " +
                        "ORDER BY OUTAGE_ID DESC) " +
                        "WHERE ROWNUM <= 100000";


        List<CDR_DB_Incident> incidents = jdbcTemplate.query(sql, (resultSet, i) -> {
            Long Outage_ID = resultSet.getLong("OUTAGE_ID");
            String Status = resultSet.getString("STATUS");

            String formattedCaptureDate = "null";
            Date CaptureDate = resultSet.getTimestamp("CAPTURE_DATE");
            if (CaptureDate != null)
            {
                formattedCaptureDate = new SimpleDateFormat("dd MMM yyyy HH:mm:ss").format(CaptureDate);
            }
            String DSLAM = resultSet.getString("DSLAM");
            String dslam_owner = resultSet.getString("DSLAM_OWNER");

            String formattedLastOccurred = "null";
            Date last_occured = resultSet.getTimestamp("LAST_OCCURRED");
            if (last_occured != null)
            {
                formattedLastOccurred = new SimpleDateFormat("dd MMM yyyy HH:mm:ss").format(last_occured);
            }

            String formattedCleared_on = "null";
            Date cleared_on = resultSet.getTimestamp("CLEARED_ON");
//            Date cleared_on = null;
            if (cleared_on != null)
            {
                formattedCleared_on = new SimpleDateFormat("dd MMM yyyy HH:mm:ss").format(cleared_on);
            }

            String duration_pretty = resultSet.getString("DURATION_PRETTY");
            int duration_sec = resultSet.getInt("DURATION_SEC");
            int disconnected_users = resultSet.getInt("DISCONNECTED_USERS");
            int reconnected_users  = resultSet.getInt("RECONNECTED_USERS");
            int dslam_users        = resultSet.getInt("DSLAM_USERS");
            String disconnections_ratio = resultSet.getString("DISCONNECTIONS_RATIO");
            String reconnections_ratio  = resultSet.getString("RECONNECTIONS_RATIO");

            int total_calls = resultSet.getInt("TOTAL_CALLS");
            int total_users_called = resultSet.getInt("TOTAL_USERS_CALLED");

            return new CDR_DB_Incident(Outage_ID,
                   Status,
                   formattedCaptureDate, DSLAM, dslam_owner, formattedLastOccurred, formattedCleared_on, duration_pretty, duration_sec, disconnected_users, reconnected_users, dslam_users, disconnections_ratio, reconnections_ratio, total_calls, total_users_called);
        });

        return incidents;
    }

    public List<CDR_DB_Incident> selectOpenIncidents() {
        String sql = "SELECT OUTAGE_ID, " +
                "STATUS, " +
                "CAPTURE_DATE, " +
                "DSLAM, " +
                "DSLAM_OWNER, " +
                "LAST_OCCURRED, " +
                "CLEARED_ON, " +
                "DURATION_PRETTY, " +
                "DURATION_SEC, " +
                "DISCONNECTED_USERS, " +
                "RECONNECTED_USERS, " +
                "DSLAM_USERS, " +
                "DISCONNECTIONS_RATIO, " +
                "RECONNECTIONS_RATIO, " +
                "TOTAL_CALLS, " +
                "TOTAL_USERS_CALLED " +
                "FROM Z_AAA_DSLAM_OUTAGES_GUI_V " +
                "WHERE STATUS = 'Open'";


        List<CDR_DB_Incident> incidents = jdbcTemplate.query(sql, (resultSet, i) -> {
            Long Outage_ID = resultSet.getLong("OUTAGE_ID");
            String Status = resultSet.getString("STATUS");

            String formattedCaptureDate = "null";
            Date CaptureDate = resultSet.getTimestamp("CAPTURE_DATE");
            if (CaptureDate != null)
            {
                formattedCaptureDate = new SimpleDateFormat("dd MMM yyyy HH:mm:ss").format(CaptureDate);
            }
            String DSLAM = resultSet.getString("DSLAM");
            String dslam_owner = resultSet.getString("DSLAM_OWNER");

            String formattedLastOccurred = "null";
            Date last_occured = resultSet.getTimestamp("LAST_OCCURRED");
            if (last_occured != null)
            {
                formattedLastOccurred = new SimpleDateFormat("dd MMM yyyy HH:mm:ss").format(last_occured);
            }

            String formattedCleared_on = "null";
            Date cleared_on = resultSet.getTimestamp("CLEARED_ON");
//            Date cleared_on = null;
            if (cleared_on != null)
            {
                formattedCleared_on = new SimpleDateFormat("dd MMM yyyy HH:mm:ss").format(cleared_on);
            }

            String duration_pretty = resultSet.getString("DURATION_PRETTY");
            int duration_sec = resultSet.getInt("DURATION_SEC");
            int disconnected_users = resultSet.getInt("DISCONNECTED_USERS");
            int reconnected_users  = resultSet.getInt("RECONNECTED_USERS");
            int dslam_users        = resultSet.getInt("DSLAM_USERS");
            String disconnections_ratio = resultSet.getString("DISCONNECTIONS_RATIO");
            String reconnections_ratio  = resultSet.getString("RECONNECTIONS_RATIO");

            int total_calls = resultSet.getInt("TOTAL_CALLS");
            int total_users_called = resultSet.getInt("TOTAL_USERS_CALLED");

            return new CDR_DB_Incident(Outage_ID,
                    Status,
                    formattedCaptureDate, DSLAM, dslam_owner, formattedLastOccurred, formattedCleared_on, duration_pretty, duration_sec, disconnected_users, reconnected_users, dslam_users, disconnections_ratio, reconnections_ratio, total_calls, total_users_called);
        });

        return incidents;
    }

    public List<CDR_DB_Incident> selectClosedIncidents() {
        String sql = "SELECT * " +
                "FROM " +
                "(SELECT OUTAGE_ID, " +
                "STATUS, " +
                "CAPTURE_DATE, " +
                "DSLAM, " +
                "DSLAM_OWNER, " +
                "LAST_OCCURRED, " +
                "CLEARED_ON, " +
                "DURATION_PRETTY, " +
                "DURATION_SEC, " +
                "DISCONNECTED_USERS, " +
                "RECONNECTED_USERS, " +
                "DSLAM_USERS, " +
                "DISCONNECTIONS_RATIO, " +
                "RECONNECTIONS_RATIO, " +
                "TOTAL_CALLS, " +
                "TOTAL_USERS_CALLED " +
                "FROM Z_AAA_DSLAM_OUTAGES_GUI_V " +
                "WHERE STATUS = 'Closed') " +
                "WHERE ROWNUM <= 5000";


        List<CDR_DB_Incident> incidents = jdbcTemplate.query(sql, (resultSet, i) -> {
            Long Outage_ID = resultSet.getLong("OUTAGE_ID");
            String Status = resultSet.getString("STATUS");

            String formattedCaptureDate = "null";
            Date CaptureDate = resultSet.getTimestamp("CAPTURE_DATE");
            if (CaptureDate != null)
            {
                formattedCaptureDate = new SimpleDateFormat("dd MMM yyyy HH:mm:ss").format(CaptureDate);
            }
            String DSLAM = resultSet.getString("DSLAM");
            String dslam_owner = resultSet.getString("DSLAM_OWNER");

            String formattedLastOccurred = "null";
            Date last_occured = resultSet.getTimestamp("LAST_OCCURRED");
            if (last_occured != null)
            {
                formattedLastOccurred = new SimpleDateFormat("dd MMM yyyy HH:mm:ss").format(last_occured);
            }

            String formattedCleared_on = "null";
            Date cleared_on = resultSet.getTimestamp("CLEARED_ON");
//            Date cleared_on = null;
            if (cleared_on != null)
            {
                formattedCleared_on = new SimpleDateFormat("dd MMM yyyy HH:mm:ss").format(cleared_on);
            }

            String duration_pretty = resultSet.getString("DURATION_PRETTY");
            int duration_sec = resultSet.getInt("DURATION_SEC");
            int disconnected_users = resultSet.getInt("DISCONNECTED_USERS");
            int reconnected_users  = resultSet.getInt("RECONNECTED_USERS");
            int dslam_users        = resultSet.getInt("DSLAM_USERS");
            String disconnections_ratio = resultSet.getString("DISCONNECTIONS_RATIO");
            String reconnections_ratio  = resultSet.getString("RECONNECTIONS_RATIO");

            int total_calls = resultSet.getInt("TOTAL_CALLS");
            int total_users_called = resultSet.getInt("TOTAL_USERS_CALLED");

            return new CDR_DB_Incident(Outage_ID,
                    Status,
                    formattedCaptureDate, DSLAM, dslam_owner, formattedLastOccurred, formattedCleared_on, duration_pretty, duration_sec, disconnected_users, reconnected_users, dslam_users, disconnections_ratio, reconnections_ratio, total_calls, total_users_called);
        });

        return incidents;
    }
}
