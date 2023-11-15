package gr.wind.FullStackSpring_Review.stats;

import gr.wind.FullStackSpring_Review.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class RemedyStatsService {

    private final RemedyStatsDataAccessService remedyStatsDataAccessService;

    @Autowired
    public RemedyStatsService(RemedyStatsDataAccessService remedyStatsDataAccessService) {
        this.remedyStatsDataAccessService = remedyStatsDataAccessService;
    }

    public List<AaaOutagesRemedy> getStatsForDateRangeQuery1(Date startDate, Date endDate) {
        return remedyStatsDataAccessService.getStatsForDatesQuery1(startDate, endDate);
    }

    public List<AaaOutagesRemedy2> getStatsForDateRangeQuery2(Date startDate, Date endDate) {
        return remedyStatsDataAccessService.getStatsForDatesQuery2(startDate, endDate);
    }

    public List<TopAffected> getStatsForTopXAffected(Date startDate, Date endDate) {
        return remedyStatsDataAccessService.getStatsForTopXAffected(startDate, endDate);
    }


    public List<AaaAverageOutagesPerDayUniqDslamSessAffected> getAvgOutagPerDayPlusUniqDslamPlusSessAffected(Date startDate, Date endDate) {
        return remedyStatsDataAccessService.getAvgOutagPerDayPlusUniqDslamPlusSessAffected(startDate, endDate);
    }

    public List<RemedyTicketsPerResolution> getUniqueUsersAffected(Date startDate, Date endDate) {
        return remedyStatsDataAccessService.getUniqueUsersAffected(startDate, endDate);
    }

    public List<TopXSitesAllTechs> getTopXSitesAllTechs(Date startDate, Date endDate) {
        return remedyStatsDataAccessService.getTopXSitesAllTechs(startDate, endDate);
    }
}
