package gr.wind.FullStackSpring_Review.controllers;

import gr.wind.FullStackSpring_Review.model.DateFields;
import gr.wind.FullStackSpring_Review.model.DateRange;
import gr.wind.FullStackSpring_Review.model.NumOfRequestsPerMethod;
import gr.wind.FullStackSpring_Review.stats.StatsService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("api/charts")
public class ChartsController {

    private StatsService statsService;
    private String userNameLoggedIn;
    private static final Logger logger = LogManager.getLogger(ChartsController.class);

    // TODO: Change for Live Environment
    private static String Environment = "TEST Environment ";

    @Autowired
    public ChartsController(StatsService statsService) {
        this.statsService = statsService;
    }

    // /num_of_requests_per_method
    @CrossOrigin
    @PostMapping(path= "/num_of_requests_per_method", produces = "application/json")
    public List<NumOfRequestsPerMethod> getStatsNumOfRequestsPerMethodForDates(@Valid @RequestBody DateRange myDateRange) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + userNameLoggedIn + " -> Getting Stats from /num_of_requests_per_method controller path");

        System.out.println(myDateRange.toString());
        return statsService.getStatsForDateRange(myDateRange.startDate(), myDateRange.endDate());
    }
}
