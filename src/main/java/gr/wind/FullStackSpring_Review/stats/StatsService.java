package gr.wind.FullStackSpring_Review.stats;

import gr.wind.FullStackSpring_Review.model.NumOfRequestsPerMethod;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class StatsService {

    private final StatsDataAccessService statsDataAccessService;

    @Autowired
    public StatsService(StatsDataAccessService statsDataAccessService) {
        this.statsDataAccessService = statsDataAccessService;
    }

    public List<NumOfRequestsPerMethod> getStatsForDateRange(Date startDate, Date endDate) {
        return statsDataAccessService.getStatsForDates(startDate, endDate);
    }
}
