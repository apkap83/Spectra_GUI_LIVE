package gr.wind.FullStackSpring_Review.stats;

import gr.wind.FullStackSpring_Review.model.*;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigInteger;
import java.sql.ResultSetMetaData;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
        for (LocalDate date = startDate; !date.isAfter(endDate.minusDays(1)); date = date.plusDays(1)) {
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

    private static String generateCountCaseStatement2(LocalDate date, DateTimeFormatter formatter) {
        String dateString = formatter.format(date);
        return "COUNT(CASE WHEN TRUNC(A.ALARM_DAY) = TO_DATE('" + dateString + "','DD/MM/YYYY') THEN 1 ELSE NULL END) \"" + dateString + "\"";
    }

    private static String generateCountCaseStatements2(Date startDateObj, Date endDateObj) {
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
        for (LocalDate date = startDate; !date.isAfter(endDate.minusDays(1)); date = date.plusDays(1)) {
            if (firstIteration) {
                firstIteration = false;
            } else {
                // Append a comma and newline for separation between statements
                queryBuilder.append(",\n");
            }
            // Append the COUNT CASE statement for the current date
            queryBuilder.append(generateCountCaseStatement2(date, outputFormatter));
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
              AND   M.ALARM_START_DATE < ?
                                          
        
        
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
                 AND   M.ALARM_START_DATE < ?
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

    public List<AaaOutagesRemedy> getStatsForDatesQuery3(Date StartDate, Date EndDate) {

        String sql = """
        SELECT
           SYSTEM_FOUND,
           DSLAM_OWNER_GROUP,
           """ +
                generateCountCaseStatements2(StartDate, EndDate) + """
         FROM DIOANNID.Z_OUTAGES_MERGED_AAA_RAW A
        WHERE DATA_SOURCE = 'AAA'
        AND   A.ALARM_DAY >= ?
        AND   A.ALARM_DAY <  ?
        GROUP BY\s
           SYSTEM_FOUND,
           DSLAM_OWNER_GROUP
        ORDER BY
           SYSTEM_FOUND,
           DSLAM_OWNER_GROUP
        """;

        List<AaaOutagesRemedy> stats = jdbcTemplate.query(sql,
                new Object[]{StartDate, EndDate},
                (resultSet, i) -> {
                    // First 2 Columns are Static
                    String DSLAM_OWNER_GROUP = resultSet.getString("DSLAM_OWNER_GROUP");
                    String SYSTEM_FOUND = resultSet.getString("SYSTEM_FOUND");

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


                    return new AaaOutagesRemedy(i, DSLAM_OWNER_GROUP, SYSTEM_FOUND, newMap);
                });

        return stats;
    }



    public List<PowerVSNTWOutages> getPowerVSNTWOutagesWindNova(Date StartDate, Date EndDate) {

        String sql = """
        SELECT
        DECODE(OUTAGE_TYPE,'n','Network','p','Power','u', 'Unknown') OUTAGE_TYPE,
           """ +
                generateCountCaseStatements2(StartDate, EndDate) + """
         FROM DIOANNID.Z_OUTAGES_MERGED_AAA_RAW A
         WHERE DATA_SOURCE = 'AAA'
         AND   A.DSLAM_OWNER_GROUP = 'WIND+NOVA'
         AND   A.ALARM_DAY >= ?
         AND   A.ALARM_DAY <  ?
         GROUP BY
            DECODE(OUTAGE_TYPE,'n','Network','p','Power','u', 'Unknown')
         ORDER BY
            OUTAGE_TYPE
        """;

        List<PowerVSNTWOutages> stats = jdbcTemplate.query(sql,
                new Object[]{StartDate, EndDate},
                (resultSet, i) -> {
                    // First 2 Columns are Static
                    String OUTAGE_TYPE = resultSet.getString("OUTAGE_TYPE");

                    // Create a new HashMap and add some key-value pairs
                    Map<String, Integer> newMap = new HashMap<>();

                    // Rest of Columns are Dynamic - from position 3 and afterwards...
                    ResultSetMetaData metaData = resultSet.getMetaData();
                    int columnCount = metaData.getColumnCount(); // Number of column

                    for (int column = 2; column <= columnCount; column++) {
                        String columnName = metaData.getColumnName(column); // Get column name
                        Integer columnValue = resultSet.getInt(column); // Get column value

                        newMap.put(columnName, columnValue);
                    }


                    return new PowerVSNTWOutages(i, OUTAGE_TYPE, newMap);
                });

        return stats;
    }

    public List<PowerVSNTWOutages> getPowerVSNTWOutagesOteVF(Date StartDate, Date EndDate) {

        String sql = """
        SELECT
        DECODE(OUTAGE_TYPE,'n','Network','p','Power','u', 'Unknown') OUTAGE_TYPE,
           """ +
                generateCountCaseStatements2(StartDate, EndDate) + """
         FROM DIOANNID.Z_OUTAGES_MERGED_AAA_RAW A
         WHERE DATA_SOURCE = 'AAA'
         AND   A.DSLAM_OWNER_GROUP = 'OTE+VF'
         AND   A.ALARM_DAY >= ?
         AND   A.ALARM_DAY <  ?
         GROUP BY
            DECODE(OUTAGE_TYPE,'n','Network','p','Power','u', 'Unknown')
         ORDER BY
            OUTAGE_TYPE
        """;

        List<PowerVSNTWOutages> stats = jdbcTemplate.query(sql,
                new Object[]{StartDate, EndDate},
                (resultSet, i) -> {
                    // First 2 Columns are Static
                    String OUTAGE_TYPE = resultSet.getString("OUTAGE_TYPE");

                    // Create a new HashMap and add some key-value pairs
                    Map<String, Integer> newMap = new HashMap<>();

                    // Rest of Columns are Dynamic - from position 3 and afterwards...
                    ResultSetMetaData metaData = resultSet.getMetaData();
                    int columnCount = metaData.getColumnCount(); // Number of column

                    for (int column = 2; column <= columnCount; column++) {
                        String columnName = metaData.getColumnName(column); // Get column name
                        Integer columnValue = resultSet.getInt(column); // Get column value

                        newMap.put(columnName, columnValue);
                    }


                    return new PowerVSNTWOutages(i, OUTAGE_TYPE, newMap);
                });

        return stats;
    }

    public List<PowerVSNTWOutagesTotal> getPowerVSNTWOutagesTotal(Date StartDate, Date EndDate) {

        String sql = """
        SELECT
        DECODE(OUTAGE_TYPE,'n','Network','p','Power','u', 'Unknown') OUTAGE_TYPE,
        COUNT(1) TOTAL,
        COUNT(CASE WHEN DSLAM_OWNER_GROUP = 'WIND+NOVA' then 1 else null end) WIND_NOVA
         FROM DIOANNID.Z_OUTAGES_MERGED_AAA_RAW A
         WHERE DATA_SOURCE = 'AAA'
         AND   A.ALARM_DAY >= ?
         AND   A.ALARM_DAY <  ?
         GROUP BY
            DECODE(OUTAGE_TYPE,'n','Network','p','Power','u', 'Unknown')
         ORDER BY
            OUTAGE_TYPE
        """;

        List<PowerVSNTWOutagesTotal> stats = jdbcTemplate.query(sql,
                new Object[]{StartDate, EndDate},
                (resultSet, i) -> {
                    String OUTAGE_TYPE = resultSet.getString("OUTAGE_TYPE");
                    String TOTAL = resultSet.getString("TOTAL");
                    String WIND_NOVA = resultSet.getString("WIND_NOVA");

                   return new PowerVSNTWOutagesTotal(i, OUTAGE_TYPE, TOTAL, WIND_NOVA);
                });

        return stats;
    }

    public List<TopAffected> getStatsForTopXAffected(Date startDate, Date endDate) {
        String sql = """
                            WITH
                               DAILY_OUTAGES AS
                               (
                                  SELECT
                                     OTE_SITE_AREA,
                                     COUNT(1) OUTAGES,
                                     ROW_NUMBER() OVER (ORDER BY COUNT(1) DESC) ORDERING
                                  FROM DIOANNID.Z_OUTAGES_MERGED_AAA_RAW M
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
                new Object[]{startDate, endDate},
                (resultSet, i) -> {
                    // First 2 Columns are Static
                    String top5Area = resultSet.getString("TOP_5_AREAS");

                    return new TopAffected(top5Area);
                });

        return stats;

    }

    public List<AaaAverageOutagesPerDayUniqDslamSessAffected> getAvgOutagPerDayPlusUniqDslamPlusSessAffected(Date startDate, Date endDate) {
        String sql = """
                      SELECT
                         CEIL(COUNT(1) / COUNT(DISTINCT ALARM_DAY)) AVG_OUTAGES_PER_DAY,
                         COUNT(DISTINCT M.DSLAM) UNIQUE_DSLAM,
                         SUM(M.DATA_AFFECTED) SESSION_AFFECTED
                      FROM DIOANNID.Z_OUTAGES_MERGED_AAA_RAW M
                      WHERE M.ALARM_START_DATE >= ?
                      AND   M.ALARM_START_DATE <  ?
                """;

        List<AaaAverageOutagesPerDayUniqDslamSessAffected> stats = jdbcTemplate.query(sql,
                new Object[]{startDate, endDate},
                (resultSet, i) -> {
                    String avgOutagesPerDay = resultSet.getString("AVG_OUTAGES_PER_DAY");
                    String uniqueDslam = resultSet.getString("UNIQUE_DSLAM");
                    String sessionAffected = resultSet.getString("SESSION_AFFECTED");

                    return new AaaAverageOutagesPerDayUniqDslamSessAffected(avgOutagesPerDay, uniqueDslam, sessionAffected);
                });

        return stats;
    }

    public List<RemedyTicketsPerResolution> getUniqueUsersAffected(Date startDate, Date endDate) {
        String sql = """
                         SELECT
                         NVL(M.RMD_RESOLUTION_CATEG_TIER_1,'<undefined>') RESOLUTION_CATEG_TIER_1,
                         NVL(M.RMD_RESOLUTION_CATEG_TIER_2,'<undefined>') RESOLUTION_CATEG_TIER_2,
                         COUNT(DISTINCT M.RMD_INCIDENT_NUMBER) TICKETS,
                         COUNT(DISTINCT M.DSLAM) DSLAMS,
                         COUNT(DISTINCT CASE WHEN M.DSLAM_OWNER_GROUP = 'WIND+NOVA' THEN M.DSLAM ELSE NULL END) DSLAMS_WIND_NOVA,
                         COUNT(DISTINCT CASE WHEN M.DSLAM_OWNER_GROUP = 'OTE+VF' THEN M.DSLAM ELSE NULL END) DSLAMS_OTE_VF,
                         SUM(M.DATA_AFFECTED) AFFECTED_SESSIONS
                      FROM DIOANNID.Z_OUTAGES_MERGED_AAA_RAW M
                      WHERE M.RMD_INCIDENT_NUMBER IS NOT NULL
                      AND   M.ALARM_START_DATE >= ?
                      AND   M.ALARM_START_DATE <  ?
                      GROUP BY
                         NVL(M.RMD_RESOLUTION_CATEG_TIER_1,'<undefined>'),
                         NVL(M.RMD_RESOLUTION_CATEG_TIER_2,'<undefined>')
                      ORDER BY
                         RESOLUTION_CATEG_TIER_1,
                         RESOLUTION_CATEG_TIER_2
                """;

        List<RemedyTicketsPerResolution> stats = jdbcTemplate.query(sql,
                new Object[]{startDate, endDate},
                (resultSet, i) -> {
                    String RESOLUTION_CATEG_TIER_1 = resultSet.getString("RESOLUTION_CATEG_TIER_1");
                    String RESOLUTION_CATEG_TIER_2 = resultSet.getString("RESOLUTION_CATEG_TIER_2");
                    String TICKETS = resultSet.getString("TICKETS");
                    String DSLAMS = resultSet.getString("DSLAMS");
                    String DSLAMS_WIND_NOVA = resultSet.getString("DSLAMS_WIND_NOVA");
                    String DSLAMS_OTE_VF = resultSet.getString("DSLAMS_OTE_VF");
                    String AFFECTED_SESSIONS = resultSet.getString("AFFECTED_SESSIONS");

                   return new RemedyTicketsPerResolution(RESOLUTION_CATEG_TIER_1,RESOLUTION_CATEG_TIER_2,TICKETS,DSLAMS,DSLAMS_WIND_NOVA,DSLAMS_OTE_VF,AFFECTED_SESSIONS);
                });

        return stats;
    }

    public List<TopXSitesAllTechs> getTopXSitesAllTechs(Date startDate, Date endDate) {
        String sql = """
                      WITH
                         OUTAGES AS
                         (
                            SELECT
                               A.DSLAM,
                               A.DSLAM_OWNER_GROUP,
                               COUNT(1) OUTAGES,
                               COUNT(A.RMD_INCIDENT_NUMBER) MATCHED_WITH_TICKETS,
                               SUM(DATA_AFFECTED) AFFECTED_SESSIONS,
                               ROW_NUMBER() OVER (ORDER BY COUNT(1) DESC) ORDERING
                            FROM Z_OUTAGES_MERGED_AAA_RAW A
                            WHERE A.ALARM_START_DATE >= ?
                            AND   A.ALARM_START_DATE < ?
                            GROUP BY
                               A.DSLAM,
                               A.NETWORK,
                               A.DSLAM_OWNER_GROUP
                            ORDER BY
                               OUTAGES DESC
                         )
                      SELECT\s
                         A.DSLAM,
                         A.DSLAM_OWNER_GROUP,
                         A.OUTAGES,
                         A.MATCHED_WITH_TICKETS
                      FROM OUTAGES A
                      WHERE ORDERING <= 30
                """;

        List<TopXSitesAllTechs> stats = jdbcTemplate.query(sql,
                new Object[]{startDate, endDate},
                (resultSet, i) -> {
                    String DSLAM = resultSet.getString("DSLAM");
                    String DSLAM_OWNER_GROUP = resultSet.getString("DSLAM_OWNER_GROUP");

                    String OUTAGES = resultSet.getString("OUTAGES");

                    String MATCHED_WITH_TICKETS = resultSet.getString("MATCHED_WITH_TICKETS");

                    return new TopXSitesAllTechs(DSLAM,DSLAM_OWNER_GROUP,OUTAGES,MATCHED_WITH_TICKETS);
                });

        return stats;
    }

    public List<AAARawData1> getAAARawData(Date startDate, Date endDate) {
        String sql = """
                     WITH
                   DATA AS\s
                   (
                                   
                SELECT
                   ALARM_DAY,
                   MATCHING_COMMENTS,
                   NETWORK,
                   DSLAM_OWNER,
                   DSLAM_OWNER_GROUP,
                   OUTAGE_ID,
                   ALARM_START_DATE,
                   ALARM_END_DATE,
                   AAA_OUTAGE_DURATION_SEC,
                   MAINTENANCE_PERIOD,
                   DSLAM,
                   DSLAM_SLOT,
                   TECHNOLOGY,
                   OTE_SITE_NAME,
                   OTE_SITE_AREA,
                   POST_CODE,
                   
                   OTHER_CARRIER_SYMEFS,
                   NOVA_SYMEFS,
                   
                   LONGITUDE,
                   LATITUDE,
                   PROBLEM,
                   DSLAM_USERS,
                   DATA_AFFECTED,
                   TOTAL_USERS_CALLED,
                   SMP_UNIQUE_USERS,
                   RMD_INCIDENT_NUMBER,
                   RMD_IS_SCHEDULED,
                   RMD_ALARM_START_DATE,
                   RMD_ALARM_END_DATE,
                   RMD_SPECTRA_HIERARCHY,
                   RMD_OPERATIONAL_CATEG_TIER_1,
                   RMD_OPERATIONAL_CATEG_TIER_2,
                   RMD_OPERATIONAL_CATEG_TIER_3,
                   RMD_RESOLUTION_CATEG_TIER_1,
                   RMD_RESOLUTION_CATEG_TIER_2,
                   
                   RTCS_INCIDENT_NUMBER,
                   RTCS_ALARM_START_DATE,
                   RTCS_ALARM_END_DATE,
                   RTCS_NOTES,
                   RTCS_OPERATIONAL_CATEG_TIER_1,
                   RTCS_OPERATIONAL_CATEG_TIER_2,
                   RTCS_OPERATIONAL_CATEG_TIER_3,
                   RTCS_RESOLUTION_CATEG_TIER_1,
                   RTCS_RESOLUTION_CATEG_TIER_2,	
                   
                   
                   ZBX_EVENT_ID,
                   ZBX_PROBLEM,
                   ZBX_ALARM_START_DATE,
                   ZBX_ALARM_END_DATE,
                   
                   ZBX_RMU_EVENT_ID,
                   ZBX_RMU_PROBLEM,
                   ZBX_RMU_ALARM_START_DATE,
                   ZBX_RMU_ALARM_END_DATE,
                   
                   
                   NCE_EVENT_ID,
                   NCE_ALARM_START_DATE,
                   NCE_ALARM_END_DATE,
                   NCE_PROBLEM,
                   NCE_OPERATIONAL_DATA,
                   AMS_EVENT_TIME,
                   
                   AMS_CLEARED_TIME,
                   
                   AMS_PROBABLE_CAUSE,
                   AMS_SPECIFIC_PROBLEM,
                   AMS_FTTH_EVENT_TIME,
                   
                   AMS_FTTH_CLEARED_TIME,
                   
                   AMS_FTTH_PROBABLE_CAUSE,
                   AMS_FTTH_SPECIFIC_PROBLEM,
                   SOEM_EVENT_ID,
                   SOEM_RAISED_ON,
                   SOEM_ALARM_TYPE,
                   SOEM_PROBABLE_CAUSE,
                   
                   SYMEFS_ALARM_EVENT_ID,
                   SYMEFS_ALARM_SYMEFS_NAME,
                   SYMEFS_ALARM_EVENT_TIME,
                   SYMEFS_ALARM_VALUE,
                   
                   HDM_LAST_SNAPSHOT_DATE,
                   HDM_REDEFINED_OUTCOME,
                   HDM_MATCHING_OUTCOME_FULL,
                   
                   IS_FILTERED,
                   
                   SYSTEM_FOUND,
                   SYSTEM_GROUP_FOUND,
                   OUTAGE_TYPE_DESC,
                   OUTAGE_TYPE,
                   
                   ROW_NUMBER() OVER (ORDER BY ALARM_START_DATE) ORDERING --do not show
                FROM DIOANNID.Z_OUTAGES_MERGED_AAA_RAW
                WHERE ALARM_START_DATE >= ?
                AND   ALARM_START_DATE <  ?
                )
                SELECT *
                FROM DATA
                WHERE ORDERING <= 1048570
                ORDER BY ALARM_START_DATE DESC
                """;

        List<AAARawData1> stats = jdbcTemplate.query(sql,
                new Object[]{startDate, endDate},
                (resultSet, i) -> {

                    BigInteger ID = BigInteger.valueOf(i);
                    String ALARM_DAY = resultSet.getString("ALARM_DAY");
                    String MATCHING_COMMENTS = resultSet.getString("MATCHING_COMMENTS");
                    String NETWORK = resultSet.getString("NETWORK");

                    String DSLAM_OWNER = resultSet.getString("DSLAM_OWNER");
                    String DSLAM_OWNER_GROUP = resultSet.getString("DSLAM_OWNER_GROUP");
                    String OUTAGE_ID = resultSet.getString("OUTAGE_ID");
                    String ALARM_START_DATE = resultSet.getString("ALARM_START_DATE");
                    String ALARM_END_DATE = resultSet.getString("ALARM_END_DATE");
                    String AAA_OUTAGE_DURATION_SEC = resultSet.getString("AAA_OUTAGE_DURATION_SEC");
                    String MAINTENANCE_PERIOD = resultSet.getString("MAINTENANCE_PERIOD");
                    String DSLAM = resultSet.getString("DSLAM");
                    String DSLAM_SLOT = resultSet.getString("DSLAM_SLOT");
                    String TECHNOLOGY = resultSet.getString("TECHNOLOGY");
                    String OTE_SITE_NAME = resultSet.getString("OTE_SITE_NAME");
                    String OTE_SITE_AREA = resultSet.getString("OTE_SITE_AREA");
                    String POST_CODE = resultSet.getString("POST_CODE");

                    String OTHER_CARRIER_SYMEFS = resultSet.getString("OTHER_CARRIER_SYMEFS");
                    String NOVA_SYMEFS = resultSet.getString("NOVA_SYMEFS");

                    String LONGITUDE = resultSet.getString("LONGITUDE");
                    String LATITUDE = resultSet.getString("LATITUDE");
                    String PROBLEM = resultSet.getString("PROBLEM");
                    String DSLAM_USERS = resultSet.getString("DSLAM_USERS");
                    String DATA_AFFECTED = resultSet.getString("DATA_AFFECTED");
                    String TOTAL_USERS_CALLED = resultSet.getString("TOTAL_USERS_CALLED");
                    String SMP_UNIQUE_USERS = resultSet.getString("SMP_UNIQUE_USERS");
                    String RMD_INCIDENT_NUMBER = resultSet.getString("RMD_INCIDENT_NUMBER");
                    String RMD_IS_SCHEDULED = resultSet.getString("RMD_IS_SCHEDULED");
                    String RMD_ALARM_START_DATE = resultSet.getString("RMD_ALARM_START_DATE");
                    String RMD_ALARM_END_DATE = resultSet.getString("RMD_ALARM_END_DATE");
                    String RMD_SPECTRA_HIERARCHY = resultSet.getString("RMD_SPECTRA_HIERARCHY");
                    String RMD_OPERATIONAL_CATEG_TIER_1 = resultSet.getString("RMD_OPERATIONAL_CATEG_TIER_1");
                    String RMD_OPERATIONAL_CATEG_TIER_2 = resultSet.getString("RMD_OPERATIONAL_CATEG_TIER_2");
                    String RMD_OPERATIONAL_CATEG_TIER_3 = resultSet.getString("RMD_OPERATIONAL_CATEG_TIER_3");
                    String RMD_RESOLUTION_CATEG_TIER_1 = resultSet.getString("RMD_RESOLUTION_CATEG_TIER_1");
                    String RMD_RESOLUTION_CATEG_TIER_2 = resultSet.getString("RMD_RESOLUTION_CATEG_TIER_2");

                    String RTCS_INCIDENT_NUMBER = resultSet.getString("RTCS_INCIDENT_NUMBER");
                    String RTCS_ALARM_START_DATE = resultSet.getString("RTCS_ALARM_START_DATE");
                    String RTCS_ALARM_END_DATE = resultSet.getString("RTCS_ALARM_END_DATE");
                    String RTCS_NOTES = resultSet.getString("RTCS_NOTES");
                    String RTCS_OPERATIONAL_CATEG_TIER_1 = resultSet.getString("RTCS_OPERATIONAL_CATEG_TIER_1");
                    String RTCS_OPERATIONAL_CATEG_TIER_2 = resultSet.getString("RTCS_OPERATIONAL_CATEG_TIER_2");
                    String RTCS_OPERATIONAL_CATEG_TIER_3 = resultSet.getString("RTCS_OPERATIONAL_CATEG_TIER_3");
                    String RTCS_RESOLUTION_CATEG_TIER_1 = resultSet.getString("RTCS_RESOLUTION_CATEG_TIER_1");
                    String RTCS_RESOLUTION_CATEG_TIER_2 = resultSet.getString("RTCS_RESOLUTION_CATEG_TIER_2");

                    String ZBX_EVENT_ID = resultSet.getString("ZBX_EVENT_ID");
                    String ZBX_PROBLEM = resultSet.getString("ZBX_PROBLEM");
                    String ZBX_ALARM_START_DATE = resultSet.getString("ZBX_ALARM_START_DATE");
                    String ZBX_ALARM_END_DATE = resultSet.getString("ZBX_ALARM_END_DATE");


                    String ZBX_RMU_EVENT_ID = resultSet.getString("ZBX_RMU_EVENT_ID");
                    String ZBX_RMU_PROBLEM = resultSet.getString("ZBX_RMU_PROBLEM");
                    String ZBX_RMU_ALARM_START_DATE = resultSet.getString("ZBX_RMU_ALARM_START_DATE");
                    String ZBX_RMU_ALARM_END_DATE = resultSet.getString("ZBX_RMU_ALARM_END_DATE");

                    String NCE_EVENT_ID = resultSet.getString("NCE_EVENT_ID");
                    String NCE_ALARM_START_DATE = resultSet.getString("NCE_ALARM_START_DATE");
                    String NCE_ALARM_END_DATE = resultSet.getString("NCE_ALARM_END_DATE");
                    String NCE_PROBLEM = resultSet.getString("NCE_PROBLEM");
                    String NCE_OPERATIONAL_DATA = resultSet.getString("NCE_OPERATIONAL_DATA");

                    String AMS_EVENT_TIME = resultSet.getString("AMS_EVENT_TIME");
                    String AMS_CLEARED_TIME = resultSet.getString("AMS_CLEARED_TIME");
                    String AMS_PROBABLE_CAUSE = resultSet.getString("AMS_PROBABLE_CAUSE");
                    String AMS_SPECIFIC_PROBLEM = resultSet.getString("AMS_SPECIFIC_PROBLEM");
                    String AMS_FTTH_EVENT_TIME = resultSet.getString("AMS_FTTH_EVENT_TIME");
                    String AMS_FTTH_CLEARED_TIME = resultSet.getString("AMS_FTTH_CLEARED_TIME");
                    String AMS_FTTH_PROBABLE_CAUSE = resultSet.getString("AMS_FTTH_PROBABLE_CAUSE");
                    String AMS_FTTH_SPECIFIC_PROBLEM = resultSet.getString("AMS_FTTH_SPECIFIC_PROBLEM");
                    String SOEM_EVENT_ID = resultSet.getString("SOEM_EVENT_ID");
                    String SOEM_RAISED_ON = resultSet.getString("SOEM_RAISED_ON");
                    String SOEM_ALARM_TYPE = resultSet.getString("SOEM_ALARM_TYPE");
                    String SOEM_PROBABLE_CAUSE = resultSet.getString("SOEM_PROBABLE_CAUSE");

                    String SYMEFS_ALARM_EVENT_ID = resultSet.getString("SYMEFS_ALARM_EVENT_ID");
                    String SYMEFS_ALARM_SYMEFS_NAME = resultSet.getString("SYMEFS_ALARM_SYMEFS_NAME");
                    String SYMEFS_ALARM_EVENT_TIME = resultSet.getString("SYMEFS_ALARM_EVENT_TIME");
                    String SYMEFS_ALARM_VALUE = resultSet.getString("SYMEFS_ALARM_VALUE");

                    String HDM_LAST_SNAPSHOT_DATE = resultSet.getString("HDM_LAST_SNAPSHOT_DATE");
                    String HDM_MATCHING_OUTCOME = resultSet.getString("HDM_REDEFINED_OUTCOME");
                    String HDM_MATCHING_OUTCOME_FULL = resultSet.getString("HDM_MATCHING_OUTCOME_FULL");

                    String IS_FILTERED = resultSet.getString("IS_FILTERED");

                    String SYSTEM_FOUND = resultSet.getString("SYSTEM_FOUND");
                    String SYSTEM_GROUP_FOUND = resultSet.getString("SYSTEM_GROUP_FOUND");
                    String OUTAGE_TYPE_DESC = resultSet.getString("OUTAGE_TYPE_DESC");
                    String OUTAGE_TYPE = resultSet.getString("OUTAGE_TYPE");

                    return new AAARawData1(ID, ALARM_DAY, MATCHING_COMMENTS, NETWORK, DSLAM_OWNER,
                            DSLAM_OWNER_GROUP, OUTAGE_ID, ALARM_START_DATE, ALARM_END_DATE, AAA_OUTAGE_DURATION_SEC, MAINTENANCE_PERIOD, DSLAM, DSLAM_SLOT,
                            TECHNOLOGY, OTE_SITE_NAME, OTE_SITE_AREA, POST_CODE, OTHER_CARRIER_SYMEFS, NOVA_SYMEFS, LONGITUDE, LATITUDE, PROBLEM,
                            DSLAM_USERS, DATA_AFFECTED, TOTAL_USERS_CALLED, SMP_UNIQUE_USERS, RMD_INCIDENT_NUMBER, RMD_IS_SCHEDULED, RMD_ALARM_START_DATE,
                            RMD_ALARM_END_DATE, RMD_SPECTRA_HIERARCHY, RMD_OPERATIONAL_CATEG_TIER_1, RMD_OPERATIONAL_CATEG_TIER_2,
                            RMD_OPERATIONAL_CATEG_TIER_3, RMD_RESOLUTION_CATEG_TIER_1, RMD_RESOLUTION_CATEG_TIER_2,
                            RTCS_INCIDENT_NUMBER,
                            RTCS_ALARM_START_DATE,
                            RTCS_ALARM_END_DATE,
                            RTCS_NOTES,
                            RTCS_OPERATIONAL_CATEG_TIER_1,
                            RTCS_OPERATIONAL_CATEG_TIER_2,
                            RTCS_OPERATIONAL_CATEG_TIER_3,
                            RTCS_RESOLUTION_CATEG_TIER_1,
                            RTCS_RESOLUTION_CATEG_TIER_2,
                            ZBX_EVENT_ID, ZBX_PROBLEM, ZBX_ALARM_START_DATE, ZBX_ALARM_END_DATE,
                            ZBX_RMU_EVENT_ID, ZBX_RMU_PROBLEM, ZBX_RMU_ALARM_START_DATE, ZBX_RMU_ALARM_END_DATE,
                            NCE_EVENT_ID, NCE_ALARM_START_DATE,
                            NCE_ALARM_END_DATE, NCE_PROBLEM, NCE_OPERATIONAL_DATA,
                            AMS_EVENT_TIME,
                            AMS_CLEARED_TIME,
                            AMS_PROBABLE_CAUSE,
                            AMS_SPECIFIC_PROBLEM,
                            AMS_FTTH_EVENT_TIME,
                            AMS_FTTH_CLEARED_TIME,
                            AMS_FTTH_PROBABLE_CAUSE,
                            AMS_FTTH_SPECIFIC_PROBLEM,
                            SOEM_EVENT_ID,
                            SOEM_RAISED_ON,
                            SOEM_ALARM_TYPE,
                            SOEM_PROBABLE_CAUSE,

                            SYMEFS_ALARM_EVENT_ID,
                            SYMEFS_ALARM_SYMEFS_NAME,
                            SYMEFS_ALARM_EVENT_TIME,
                            SYMEFS_ALARM_VALUE,

                            HDM_LAST_SNAPSHOT_DATE,
                            HDM_MATCHING_OUTCOME,
                            HDM_MATCHING_OUTCOME_FULL,
                            IS_FILTERED,
                            SYSTEM_FOUND,
                            SYSTEM_GROUP_FOUND,
                            OUTAGE_TYPE_DESC,
                            OUTAGE_TYPE
                            );
                });

        return stats;
    }
}
