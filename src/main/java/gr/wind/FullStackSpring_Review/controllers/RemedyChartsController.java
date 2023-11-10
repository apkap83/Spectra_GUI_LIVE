package gr.wind.FullStackSpring_Review.controllers;

import gr.wind.FullStackSpring_Review.model.AaaOutagesRemedy;
import gr.wind.FullStackSpring_Review.model.AaaOutagesRemedy2;
import gr.wind.FullStackSpring_Review.model.DateRange;
import gr.wind.FullStackSpring_Review.model.TopAffected;
import gr.wind.FullStackSpring_Review.stats.RemedyStatsService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("api/charts")
public class RemedyChartsController {
    private RemedyStatsService remedyStatsService;
    private String userNameLoggedIn;
    private static final Logger logger = LogManager.getLogger(NovaChartsController.class);

    @Value("${app.MyEnvironmentDescription}")
    private String Environment;

    @Autowired
    public RemedyChartsController(RemedyStatsService remedyStatsService) {
        this.remedyStatsService = remedyStatsService;
    }

    @CrossOrigin
    @PostMapping(path= "/aaa_outages_plus_remedy_query1", produces = "application/json")
    public List<AaaOutagesRemedy> getStatsNumOfRequestsPerMethodForDatesQuery1(@Valid @RequestBody DateRange myDateRange) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> Getting Graph AAA Outages Plus Remedy Query 1");

        System.out.println("myDateRange" + myDateRange);
        return remedyStatsService.getStatsForDateRangeQuery1(myDateRange.startDate(), myDateRange.endDate());

    }

    @CrossOrigin
    @PostMapping(path= "/aaa_outages_plus_remedy_query2", produces = "application/json")
    public List<AaaOutagesRemedy2> getStatsNumOfRequestsPerMethodForDatesQuery2(@Valid @RequestBody DateRange myDateRange) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> Getting Graph AAA Outages Plus Remedy Query 2");

        return remedyStatsService.getStatsForDateRangeQuery2(myDateRange.startDate(), myDateRange.endDate());

    }

    @CrossOrigin
    @PostMapping(path= "/aaa_outages_top_affected_areas", produces = "application/json")
    public List<TopAffected> getStatsForTopAffectedAreas(@Valid @RequestBody DateRange myDateRange) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> Getting Stat for Top Affected Areas");

        return remedyStatsService.getStatsForTopXAffected(myDateRange.startDate(), myDateRange.endDate());

    }
}
