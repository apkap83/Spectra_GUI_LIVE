package gr.wind.FullStackSpring_Review.stats;

import gr.wind.FullStackSpring_Review.model.NumOfRequestsPerMethod;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public class StatsDataAccessService {

    @Value("${app.TablePrefix}")
    private String TablePrefix;
    private final JdbcTemplate jdbcTemplate;

    public StatsDataAccessService(@Qualifier("jdbcTemplateForLiveDB") JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<NumOfRequestsPerMethod> getStatsForDates(Date StartDate, Date EndDate) {

        // {"ID":1,"Date":"2019-12-27",
        // "GetHierarchy":10,
        // "SubmitOutage":0,
        // "ModifyOutage":0,
        // "CloseOutage":0,
        // "NLU_Active_Pos_Voice":0,
        // "NLU_Active_Pos_Data":0,
        // "NLU_Active_Pos_IPTV":0,
        // "NLU_Active_Neg":0,
        // "GetOutageStatus":0,
        // "CDR_DB_Neg":0,
        // "CDR_DB_Pos":0}

        String sql = "SELECT * from " + TablePrefix + "Stats_NumOfRequestsPerMethod " +
                "WHERE Date >= ? and Date <= ?";

        System.out.println("StartDate"+StartDate);
        System.out.println("EndDate"+EndDate);
        System.out.println("sql"+sql);
        List<NumOfRequestsPerMethod> stats = jdbcTemplate.query(sql,
                new Object[]{StartDate, EndDate},
                (resultSet, i) -> {
                    int ID = resultSet.getInt("ID");
                    String Date = resultSet.getString("Date");
                    int GetHierarchy = resultSet.getInt("GetHierarchy");
                    int SubmitOutage = resultSet.getInt("SubmitOutage");
                    int ModifyOutage = resultSet.getInt("ModifyOutage");
                    int CloseOutage = resultSet.getInt("CloseOutage");
                    int NLU_Active_Pos_Voice = resultSet.getInt("NLU_Active_Pos_Voice");
                    int NLU_Active_Pos_Data = resultSet.getInt("NLU_Active_Pos_Data");
                    int NLU_Active_Pos_IPTV = resultSet.getInt("NLU_Active_Pos_IPTV");
                    int NLU_Active_Neg = resultSet.getInt("NLU_Active_Neg");
                    int GetOutageStatus = resultSet.getInt("GetOutageStatus");
                    int CDR_DB_Neg = resultSet.getInt("CDR_DB_Neg");
                    int CDR_DB_Pos = resultSet.getInt("CDR_DB_Pos");
                    int AdHoc_Pos = resultSet.getInt("AdHoc_Pos");


                    return new NumOfRequestsPerMethod(ID, Date, GetHierarchy, SubmitOutage, ModifyOutage, CloseOutage, NLU_Active_Pos_Voice, NLU_Active_Pos_Data, NLU_Active_Pos_IPTV, NLU_Active_Neg, GetOutageStatus, CDR_DB_Neg, CDR_DB_Pos, AdHoc_Pos);
                });

        return stats;
    }
}
