package gr.wind.FullStackSpring_Review.controllers;

import gr.wind.FullStackSpring_Review.model.*;
import gr.wind.FullStackSpring_Review.stats.RemedyStatsService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import javax.validation.Valid;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("api/charts")
public class RemedyChartsController {
    private RemedyStatsService remedyStatsService;
    private String userNameLoggedIn;
    private static final Logger logger = LogManager.getLogger(NovaChartsController.class);

    @Autowired
    private RestTemplate restTemplate;

    @Value("${app.MyEnvironmentDescription}")
    private String Environment;

    @Autowired
    public RemedyChartsController(RemedyStatsService remedyStatsService, RestTemplate restTemplate) {
        this.remedyStatsService = remedyStatsService;
        this.restTemplate = restTemplate;
    }

    @CrossOrigin
    @PostMapping(path= "/aaa_outages_plus_remedy_query1", produces = "application/json")
    public List<AaaOutagesRemedy> getStatsNumOfRequestsPerMethodForDatesQuery1(@Valid @RequestBody DateRange myDateRange) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> Getting Graph AAA Outages Plus Remedy Query 1");

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

    @CrossOrigin
    @PostMapping(path= "/aaa_avg_outages_perday_uniq_dslam_sess_affacted", produces = "application/json")
    public List<AaaAverageOutagesPerDayUniqDslamSessAffected> getAvgOutagesPerDay(@Valid @RequestBody DateRange myDateRange) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> Getting Stat for Top Affected Areas");

        return remedyStatsService.getAvgOutagPerDayPlusUniqDslamPlusSessAffected(myDateRange.startDate(), myDateRange.endDate());

    }


    @CrossOrigin
    @PostMapping(path= "/remedy_tickets_per_resolution", produces = "application/json")
    public List<RemedyTicketsPerResolution> getUniqueUsersAffected(@Valid @RequestBody DateRange myDateRange) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> Getting Stat for Top Affected Areas");

        return remedyStatsService.getUniqueUsersAffected(myDateRange.startDate(), myDateRange.endDate());

    }


    @CrossOrigin
    @PostMapping(path= "/getTopXSitesAllTechs", produces = "application/json")
    public List<TopXSitesAllTechs> getTopXSSitesAllTechs(@Valid @RequestBody DateRange myDateRange) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> Getting Stat for Top Affected Areas");

        return remedyStatsService.getTopXSitesAllTechs(myDateRange.startDate(), myDateRange.endDate());

    }

    @CrossOrigin
    @GetMapping("/proxy/dslam-outage")
    public ResponseEntity<String> getDslamOutageData(
            @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam("dataset") Integer dataSet
            )
    {

        // Formatting the date
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        String url = String.format("http://10.10.18.121:5000/dslam_outage/map?from=%s&to=%s&dataset=%s",
                sdf.format(Date.from(from.atStartOfDay(ZoneId.systemDefault()).toInstant())),
                sdf.format(Date.from(to.atStartOfDay(ZoneId.systemDefault()).toInstant())),
                dataSet
                );

//        String url = String.format("http://localhost:5000/dslam_outage/map?from=%s&to=%s&dataset=%s",
//                sdf.format(Date.from(from.atStartOfDay(ZoneId.systemDefault()).toInstant())),
//                sdf.format(Date.from(to.atStartOfDay(ZoneId.systemDefault()).toInstant())),
//                dataSet
//        );


        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        HttpHeaders headers = new HttpHeaders();
        headers.addAll(response.getHeaders());

        // Remove X-Frame-Options
        headers.remove("X-Frame-Options");
        // Set Content-Security-Policy to allow framing from anywhere
        headers.set("Content-Security-Policy", "frame-ancestors *");
        return ResponseEntity.status(response.getStatusCode())
                .headers(headers)
                .body(response.getBody());
    }


}
