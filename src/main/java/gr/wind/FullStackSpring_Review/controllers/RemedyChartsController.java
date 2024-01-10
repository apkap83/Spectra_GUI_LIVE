package gr.wind.FullStackSpring_Review.controllers;

import gr.wind.FullStackSpring_Review.model.*;
import gr.wind.FullStackSpring_Review.stats.RemedyStatsService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.HandlerMapping;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.Enumeration;
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
        logger.info(Environment + " " + userNameLoggedIn + " -> Getting Graph AAA-Remedy Alignment Stats");

        return remedyStatsService.getStatsForDateRangeQuery1(myDateRange.startDate(), myDateRange.endDate());

    }

    @CrossOrigin
    @PostMapping(path= "/aaa_outages_plus_remedy_query2", produces = "application/json")
    public List<AaaOutagesRemedy2> getStatsNumOfRequestsPerMethodForDatesQuery2(@Valid @RequestBody DateRange myDateRange) {

//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        userNameLoggedIn = authentication.getName();
////        logger.info(Environment + " " + userNameLoggedIn + " -> Getting Graph AAA Outages Plus Remedy Query 2");

        return remedyStatsService.getStatsForDateRangeQuery2(myDateRange.startDate(), myDateRange.endDate());

    }

    @CrossOrigin
    @PostMapping(path= "/aaa_outages_plus_remedy_query3", produces = "application/json")
    public List<AaaOutagesRemedy> getStatsNumOfRequestsPerMethodForDatesQuery3(@Valid @RequestBody DateRange myDateRange) {
        return remedyStatsService.getStatsForDateRangeQuery3(myDateRange.startDate(), myDateRange.endDate());
    }

    @CrossOrigin
    @PostMapping(path= "/getPowerVSNTWOutagesWindNova", produces = "application/json")
    public List<PowerVSNTWOutages> getPowerVSNTWOutagesWindNova(@Valid @RequestBody DateRange myDateRange) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();

        logger.info(Environment + " " + userNameLoggedIn + " -> Getting Graph AAA-Remedy Alignment Stats");
        return remedyStatsService.getPowerVSNTWOutagesWindNova(myDateRange.startDate(), myDateRange.endDate());
    }

    @CrossOrigin
    @PostMapping(path= "/getPowerVSNTWOutagesOteVF", produces = "application/json")
    public List<PowerVSNTWOutages> getPowerVSNTWOutagesOteVF(@Valid @RequestBody DateRange myDateRange) {
        return remedyStatsService.getPowerVSNTWOutagesOteVF(myDateRange.startDate(), myDateRange.endDate());
    }

    @CrossOrigin
    @PostMapping(path= "/getPowerVSNTWOutagesTotal", produces = "application/json")
    public List<PowerVSNTWOutagesTotal> getPowerVSNTWOutagesTotal(@Valid @RequestBody DateRange myDateRange) {
        return remedyStatsService.getPowerVSNTWOutagesTotal(myDateRange.startDate(), myDateRange.endDate());
    }

    @CrossOrigin
    @PostMapping(path= "/aaa_outages_top_affected_areas", produces = "application/json")
    public List<TopAffected> getStatsForTopAffectedAreas(@Valid @RequestBody DateRange myDateRange) {

//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        userNameLoggedIn = authentication.getName();
//        logger.info(Environment + " " + userNameLoggedIn + " -> Getting Stat for Top Affected Areas");

        return remedyStatsService.getStatsForTopXAffected(myDateRange.startDate(), myDateRange.endDate());

    }

    @CrossOrigin
    @PostMapping(path= "/aaa_avg_outages_perday_uniq_dslam_sess_affacted", produces = "application/json")
    public List<AaaAverageOutagesPerDayUniqDslamSessAffected> getAvgOutagesPerDay(@Valid @RequestBody DateRange myDateRange) {

//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        userNameLoggedIn = authentication.getName();
//        logger.info(Environment + " " + userNameLoggedIn + " -> Getting Stat for Avg Outages Per Uniq Dslam");

        return remedyStatsService.getAvgOutagPerDayPlusUniqDslamPlusSessAffected(myDateRange.startDate(), myDateRange.endDate());

    }


    @CrossOrigin
    @PostMapping(path= "/remedy_tickets_per_resolution", produces = "application/json")
    public List<RemedyTicketsPerResolution> getUniqueUsersAffected(@Valid @RequestBody DateRange myDateRange) {

//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        userNameLoggedIn = authentication.getName();
//        logger.info(Environment + " " + userNameLoggedIn + " -> Getting Stat for Top Affected Areas");

        return remedyStatsService.getUniqueUsersAffected(myDateRange.startDate(), myDateRange.endDate());

    }


    @CrossOrigin
    @PostMapping(path= "/getTopXSitesAllTechs", produces = "application/json")
    public List<TopXSitesAllTechs> getTopXSSitesAllTechs(@Valid @RequestBody DateRange myDateRange) {

//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        userNameLoggedIn = authentication.getName();
//        logger.info(Environment + " " + userNameLoggedIn + " -> Getting Stat for Top Affected Areas");

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

    @CrossOrigin
    @PostMapping(path="/getAAARawData", produces="application/json")
    public List<AAARawData1> getAAARawData(@Valid @RequestBody DateRange myDateRange) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();

        logger.info(Environment + " " + userNameLoggedIn + " -> Getting AAA-Raw data");

        return remedyStatsService.getAAARawData(myDateRange.startDate(), myDateRange.endDate());
    }

    /*
    @CrossOrigin()
    @GetMapping("/openaifunctionspage/{dynamicUserName}/**")
    public ResponseEntity<byte[]> getOpenAIFunctionsPAge(@PathVariable String dynamicUserName, HttpServletRequest request) throws Exception {
        // Extract the additional path beyond the dynamic user name
        String additionalPath = (String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
        String bestMatchingPattern = (String) request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);
        String path = new AntPathMatcher().extractPathWithinPattern(bestMatchingPattern, additionalPath);

//        System.out.println("Path: " + path );
//        System.out.println("additionalPath"+additionalPath);
//        System.out.println("bestMatchingPattern"+bestMatchingPattern);
//        System.out.println("path: " + path );

        // Base URL for forwarding
        String url = "http://10.10.18.121:1900";

        String intermediatePath = "";
        // Check if the request is not for a static resource (like CSS)
        if (!path.matches(".*(css|js|png|jpg|jpeg|gif|svg)$")) {
            // For other requests, include the dynamic user name
            url += String.format("/dynamicPageSpectra/%s", dynamicUserName);
        } else {
            url += additionalPath.replace("/api/charts/openaifunctionspage", "");
        }

        // Determine the MIME type based on the file extension
        String mimeType = "text/html"; // Default MIME type
        if (path.endsWith(".css")) {
            mimeType = "text/css";
        } else if (path.endsWith(".js")) {
            mimeType = "text/javascript";
        } else if (path.endsWith(".png")) {
            mimeType = "image/png";
        } else if (path.endsWith(".jpg") || path.endsWith(".jpeg")) {
            mimeType = "image/jpeg";
        } else if (path.endsWith(".gif")) {
            mimeType = "image/gif";
        } else if (path.endsWith(".svg")) {
            mimeType = "image/svg+xml";
        } else if (path.endsWith(".woff2")) {
            mimeType = "font/woff2";
        } else if (path.endsWith(".ttf")) {
            mimeType = "font/ttf";
        } else if (path.endsWith(".js.map")) {
            mimeType = "application/json";
        }
//        System.out.println("URL: " +  url);
        // Fetch the resource
        ResponseEntity<byte[]> response = restTemplate.getForEntity(url, byte[].class);

        HttpHeaders headers = new HttpHeaders();
        headers.addAll(response.getHeaders());
        headers.setContentType(MediaType.parseMediaType(mimeType));

        // Remove X-Frame-Options and set Content-Security-Policy
        headers.remove("X-Frame-Options");
        headers.set("Content-Security-Policy", "frame-ancestors *");

        return ResponseEntity.status(response.getStatusCode())
                .headers(headers)
                .body(response.getBody());
    }


    @CrossOrigin()
    @PostMapping("/openaifunctionspage/performSelectSpectra")
    public ResponseEntity<byte[]> postOpenAIFunctionsPage(HttpServletRequest request, @RequestBody(required = false) byte[] requestBody) throws Exception {
        String targetUrl = "http://10.10.18.121:1900/performSelectSpectra";

        System.out.println(256);
        HttpHeaders headers = new HttpHeaders();
        // Consider adding only necessary headers
        // Example: headers.set("Content-Type", request.getHeader("Content-Type"));

        HttpEntity<byte[]> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<byte[]> response = restTemplate.exchange(targetUrl, HttpMethod.POST, entity, byte[].class);

        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.addAll(response.getHeaders());
        responseHeaders.remove("X-Frame-Options");
        responseHeaders.remove("Access-Control-Allow-Origin");
        responseHeaders.set("Content-Security-Policy", "frame-ancestors *");

        return ResponseEntity.status(response.getStatusCode())
                .headers(responseHeaders)
                .body(response.getBody());
    }

*/

}
