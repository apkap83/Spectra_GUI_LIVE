package gr.wind.FullStackSpring_Review.stats;

import gr.wind.FullStackSpring_Review.model.AaaOutagesRemedy;
import gr.wind.FullStackSpring_Review.model.AaaOutagesRemedy2;
import gr.wind.FullStackSpring_Review.model.TopAffected;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSetMetaData;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Repository
public class RemedyStatsDataAccessService {

    private final JdbcTemplate jdbcTemplate;

    public RemedyStatsDataAccessService(@Qualifier("jdbcTemplateForCDRDB") JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static String generateCountCaseStatement(LocalDate date, DateTimeFormatter formatter) {
        String dateString = formatter.format(date);
        return "COUNT(CASE WHEN TRUNC(A.ALARM_DATE) = TO_DATE('" + dateString + "','DD/MM/YYYY') THEN 1 ELSE NULL END) \"" + dateString + "\"";
    }

    private static String generateCountCaseStatements(Date startDateObj, Date endDateObj) {
        // Convert Dates to LocalDates
        LocalDate startDate = startDateObj.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate endDate = endDateObj.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

        // Define the formatter for output
        DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        // Use StringBuilder to construct the query part
        StringBuilder queryBuilder = new StringBuilder();

        // Track the first iteration to avoid adding a comma before it
        boolean firstIteration = true;

        // Generate a COUNT CASE statement for each day
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            if (firstIteration) {
                firstIteration = false;
            } else {
                // Append a comma and newline for separation between statements
                queryBuilder.append(",\n");
            }
            // Append the COUNT CASE statement for the current date
            queryBuilder.append(generateCountCaseStatement(date, outputFormatter));
        }

        return queryBuilder.toString();
    }

    public List<AaaOutagesRemedy> getStatsForDatesQuery1(Date StartDate, Date EndDate) {

        String sql = """
        WITH
           DATA AS
           (
              SELECT /*+ MATERIALIZE*/
                TRUNC(M.ALARM_START_DATE) ALARM_DATE,
                 (CASE
                  WHEN M.DSLAM_OWNER IN ('WIND','NOVA') THEN
                    'WIND+NOVA'
                  WHEN M.DSLAM_OWNER ='UNKNOWN' THEN
                    'UNKNOWN'
                  ELSE
                    'OTE+VF'
                  END) DSLAM_OWNER_GROUP,
                 M.*
              FROM Z_DSLAM_OUTAGES_MERGED M
              WHERE M.DATA_SOURCE = 'AAA'
      
              AND   M.ALARM_START_DATE >= ?
              AND   M.ALARM_START_DATE <= ?
                                          
        
        
              AND   M.AAA_RMD_MATCHING_COMMENTS IN
                       (
                          '01.a. AAA outage found in Remedy with +- 60 minutes difference',
                          '02.a. AAA outage found in Remedy with +- 3 hours difference',
                          '04.a.1 question for NOC: Remedy not found /AAA >= 10% calls',
                          '04.b. question for NOC: Remedy not found /AAA < 10% calls',
                          '05. Less than 12 minutes AAA outage',
                          '06. AAA outage with 0 calls'
                       )
           )
        SELECT
           A.DSLAM_OWNER_GROUP,
           A.AAA_RMD_MATCHING_COMMENTS COMMENTS,
           """ +
        generateCountCaseStatements(StartDate, EndDate) + """
                
        FROM DATA A
        GROUP BY\s
           A.DSLAM_OWNER_GROUP,
           A.AAA_RMD_MATCHING_COMMENTS
        ORDER BY
           COMMENTS,
           DSLAM_OWNER_GROUP DESC
        
        """;

        List<AaaOutagesRemedy> stats = jdbcTemplate.query(sql,
                new Object[]{StartDate, EndDate},
                (resultSet, i) -> {
                    // First 2 Columns are Static
                    String DSLAM_OWNER_GROUP = resultSet.getString("DSLAM_OWNER_GROUP");
                    String COMMENTS = resultSet.getString("COMMENTS");

                    // Create a new HashMap and add some key-value pairs
                    Map<String, Integer> newMap = new HashMap<>();

                    // Rest of Columns are Dynamic - from position 3 and afterwards...
                    ResultSetMetaData metaData = resultSet.getMetaData();
                    int columnCount = metaData.getColumnCount(); // Number of column
                    for (int column = 3; column <= columnCount; column++) {
                        String columnName = metaData.getColumnName(column); // Get column name
                        Integer columnValue = resultSet.getInt(column); // Get column value

                        newMap.put(columnName, columnValue);
                    }


                    return new AaaOutagesRemedy(i, DSLAM_OWNER_GROUP, COMMENTS, newMap);
                });

        return stats;
    }


    public List<AaaOutagesRemedy2> getStatsForDatesQuery2(Date StartDate, Date EndDate) {

        String sql = """
           WITH
              STATUSES AS
              (
                 SELECT '01. Remedy Tickets On Time' STATUS FROM DUAL UNION ALL
                 SELECT '02. Remedy Tickets Not On Time' STATUS FROM DUAL UNION ALL
                 SELECT '03. Remedy Tickets no AAA Outage' STATUS FROM DUAL
              ),
              INC AS
              (
                 SELECT
                    TRUNC(M.ALARM_START_DATE) ALARM_DATE,
                    M.INCIDENT_NUMBER,
                    COUNT(DECODE(M.AAA_RMD_MATCHING_COMMENTS,'01.b. AAA outage found in Remedy with +- 60 minutes difference',1,NULL)) MATCH_IN_TIME,
                    COUNT(DECODE(M.AAA_RMD_MATCHING_COMMENTS,'02.b. AAA outage found in Remedy with +- 3 hours difference',1,NULL)) MATCH_OUT_OF_TIME,
                    COUNT(DECODE(M.AAA_RMD_MATCHING_COMMENTS,'03.a. question for IP: Remedy found/AAA not found',1,NULL)) NOT_IN_AAA,
                    COUNT(DECODE(M.AAA_RMD_MATCHING_COMMENTS,'03.b. Other DSLAMs in same Ticket were matched with AAA Outages',1,NULL)) OTHER_DSLAMS_MATCHED
                 FROM DIOANNID.Z_DSLAM_OUTAGES_MERGED M
                 WHERE M.INCIDENT_NUMBER IS NOT NULL
                 AND   M.ALARM_START_DATE >= ?
                 AND   M.ALARM_START_DATE <= ?
                 GROUP BY
                    TRUNC(M.ALARM_START_DATE),
                    M.INCIDENT_NUMBER
              ),
              INC_STATS AS
              (
                 SELECT
                    A.*,
                    (
                       CASE\s
                       WHEN MATCH_IN_TIME != 0 THEN
                          '01. Remedy Tickets On Time'
                       WHEN MATCH_OUT_OF_TIME != 0 THEN
                          '02. Remedy Tickets Not On Time'
                       WHEN NOT_IN_AAA != 0 THEN
                          '03. Remedy Tickets no AAA Outage'
                       ELSE
                          '04. Other'
                       END
                    ) INCIDENT_STATUS
                 FROM INC A
              )
           SELECT
              INCIDENT_STATUS,""" +
                generateCountCaseStatements(StartDate, EndDate)   + """
           FROM INC_STATS A
           GROUP BY
              INCIDENT_STATUS
           ORDER BY
              INCIDENT_STATUS
                """;

        List<AaaOutagesRemedy2> stats = jdbcTemplate.query(sql,
                new Object[]{StartDate, EndDate},
                (resultSet, i) -> {
                    // First 2 Columns are Static
                    String DSLAM_OWNER_GROUP = resultSet.getString("INCIDENT_STATUS");

                    // Create a new HashMap and add some key-value pairs
                    Map<String, Integer> newMap = new HashMap<>();

                    // Rest of Columns are Dynamic - from position 2 and afterwards...
                    ResultSetMetaData metaData = resultSet.getMetaData();
                    int columnCount = metaData.getColumnCount(); // Number of column
                    for (int column = 2; column <= columnCount; column++) {
                        String columnName = metaData.getColumnName(column); // Get column name
                        Integer columnValue = resultSet.getInt(column); // Get column value

                        newMap.put(columnName, columnValue);
                    }
                    return new AaaOutagesRemedy2(i, DSLAM_OWNER_GROUP, newMap);
                });

        return stats;
    }


    public List<TopAffected> getStatsForTopXAffected(Date startDate, Date endDate) {

        // Add one day in endDate
        // Create a Calendar instance and set the time to startDate
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(endDate);

        // Add one day
        calendar.add(Calendar.DAY_OF_MONTH, 1);

        // Get the new date
        Date newDate = calendar.getTime();

        System.out.println("startDate" + startDate.toString());
        System.out.println("endDate" + endDate.toString());
        System.out.println("newDate" + newDate.toString());
        String sql = """
                            WITH
                               DAILY_OUTAGES AS
                               (
                                  SELECT
                                     OTE_SITE_AREA,
                                     COUNT(1) OUTAGES,
                                     ROW_NUMBER() OVER (ORDER BY COUNT(1) DESC) ORDERING
                                  FROM DIOANNID.Z_OUTAGES_MERGED_AAA_RAW_V M
                                  WHERE M.DATA_SOURCE = 'AAA'
                                  AND   M.ALARM_START_DATE >= ?
                                  AND   M.ALARM_START_DATE <  ?
                                  GROUP BY OTE_SITE_AREA
                                  ORDER BY OUTAGES DESC
                               )
                            SELECT
                               OTE_SITE_AREA TOP_5_AREAS
                            FROM DAILY_OUTAGES
                            WHERE ORDERING <= 5
                            ORDER BY ORDERING
                                
                """;

        List<TopAffected> stats = jdbcTemplate.query(sql,
                new Object[]{startDate, newDate},
                (resultSet, i) -> {
                    // First 2 Columns are Static
                    String top5Area = resultSet.getString("TOP_5_AREAS");

                    return new TopAffected(top5Area);
                });

        return stats;

    }
}
