package gr.wind.FullStackSpring_Review.stats;

import gr.wind.FullStackSpring_Review.model.NumOfRequestsPerMethod;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class NovaStatsService {

    private final NovaStatsDataAccessService novaStatsDataAccessService;

    @Autowired
    public NovaStatsService(NovaStatsDataAccessService novaStatsDataAccessService) {
        this.novaStatsDataAccessService = novaStatsDataAccessService;
    }

    public List<NumOfRequestsPerMethod> getStatsForDateRange(Date startDate, Date endDate) {
        return novaStatsDataAccessService.getStatsForDates(startDate, endDate);
    }
}
