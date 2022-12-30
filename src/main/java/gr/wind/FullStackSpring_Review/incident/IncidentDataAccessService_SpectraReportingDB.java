package gr.wind.FullStackSpring_Review.incident;

import gr.wind.FullStackSpring_Review.exception.ApiRequestException;
import gr.wind.FullStackSpring_Review.model.AdHocOutageSubscriber;
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
public class IncidentDataAccessService_SpectraReportingDB {

    @Value("${app.TablePrefix}")
    private String TablePrefix;
    private final JdbcTemplate jdbcTemplate;

    public IncidentDataAccessService_SpectraReportingDB(@Qualifier("jdbcTemplateForReportingDB") JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
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

        if (yesorno.equals("Yes") || yesorno.equals("No")) {
            String sql = "" +
                    "update " + TablePrefix + "SubmittedIncidents " +
                    "set BackupEligible = ? " +
                    "where IncidentID = ?";

            return jdbcTemplate.update(
                    sql,
                    yesorno,
                    incidentId
            );
        } else
        {
            throw new ApiRequestException("Policy for backup should be Yes or No");
        }
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
}
