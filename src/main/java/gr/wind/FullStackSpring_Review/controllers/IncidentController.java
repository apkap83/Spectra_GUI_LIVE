package gr.wind.FullStackSpring_Review.controllers;

import gr.wind.FullStackSpring_Review.model.CDR_DB_Incident;
import gr.wind.FullStackSpring_Review.incident.IncidentService;
import gr.wind.FullStackSpring_Review.model.Incident;
import gr.wind.FullStackSpring_Review.model.IncidentCallerStats;
import gr.wind.FullStackSpring_Review.model.IncidentPosNLURequests;
import gr.wind.FullStackSpring_Review.util.SearchFileByWildcard;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("api/incidents")
public class IncidentController {

    @Value("${app.ExportedFilesMainPath}")
    private String SERVER_LOCATION;

    private final IncidentService incidentService;
    private String userNameLoggedIn;
    private static final Logger logger = LogManager.getLogger(IncidentController.class);

    @Value("${app.MyEnvironmentDescription}")
    private String Environment;

    @Autowired
    public IncidentController(IncidentService incidentService) {
          this.incidentService = incidentService;
    }

    @CrossOrigin
    @GetMapping(path = "/getallincidents", produces = "application/json")
    public List<Incident> getAllIncidents() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> GET all WIND Incidents");
        return incidentService.getAllIncidents();
    }

    @CrossOrigin
    @GetMapping(path = "/getopenincidents", produces = "application/json")
    public List<Incident> getOpenIncidents() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> GET WIND open Incidents");

        return incidentService.getOpenIncidents();
    }

    @CrossOrigin
    @GetMapping(path = "/getallnonscheduledincidents", produces = "application/json")
    public List<Incident> getAllNonScheduledIncidents() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> GET all non scheduled Incidents");

        return incidentService.getAllNonScheduledIncidents();
    }
    @CrossOrigin
    @GetMapping(path = "/getopennonscheduledincidents", produces = "application/json")
    public List<Incident> getOpenNonScheduledIncidents() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> GET all open non scheduled Incidents");

        return incidentService.getOpenNonScheduledIncidents();
    }

    @CrossOrigin
    @PutMapping("/willbepublishednoforoutageid/{id}")
    public void setWillBePublishedNOforOutageId(@PathVariable int id) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> WIND Changing Will be published = NO for OutageID = " + id);

        incidentService.setWillBePublishedNOForOutageId(id);
    }

    @CrossOrigin
    @PutMapping("/willbepublishedyesforoutageid/{id}")
    public void setWillBePublishedYESforOutageId(@PathVariable int id) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> WIND Changing Will be published = YES for OutageID = " + id);

        incidentService.setWillBePublishedYESforOutageId(id);
    }

    @CrossOrigin
    @PutMapping("/willbepublishednoforincidentid/{incidentId}")
    public void setWillBePublishedNOforIncidentId(@PathVariable String incidentId) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> WIND Changing Will be published = NO for IncidentID = " + incidentId);

        incidentService.setWillBePublishedNOForIncidentId(incidentId);
    }

    @CrossOrigin
    @PutMapping("/willbepublishedyesforincidentid/{incidentId}")
    public void setWillBePublishedYESforIncidentId(@PathVariable String incidentId) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> WIND Changing Will be published = YES for IncidentID = " + incidentId);

        incidentService.setWillBePublishedYESforIncidentId(incidentId);
    }

    @CrossOrigin
    @PutMapping("/changemessageforoutageid/{outageId}/{message}")
    public void changeMessageforOutageId(@PathVariable String outageId, @PathVariable String message) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> WIND Changing to Message " + message + " for OutageID = " + outageId);

        incidentService.changeMessageForOutageId(outageId, message);
    }

    @CrossOrigin
    @PutMapping("/changemessageforincidentid/{incidentId}/{message}")
    public void changeMessageforIncidentId(@PathVariable String incidentId, @PathVariable String message) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> WIND Changing to Message " + message + " for IncidentID = " + incidentId);

        incidentService.changeMessageForIncidentId(incidentId, message);
    }

    @CrossOrigin
    @PutMapping("/alterbackuppolicyforincidentid/{incidentId}/{yesorno}")
    public void changeBackupPolicyforIncidentId(@PathVariable String incidentId, @PathVariable String yesorno) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> WIND Altering backup policy to " + yesorno + " for IncidentID = " + incidentId);

        incidentService.alterBackupPolicyForIncidentId(incidentId, yesorno);
    }


    @CrossOrigin
    @RequestMapping(path = "/downloadfile/{dirname1}/{fileNamePattern}", method = RequestMethod.GET)
    public ResponseEntity<Resource> download(@PathVariable String dirname1, @PathVariable String fileNamePattern) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();

        String fileNameToBeDownloaded = "";
        Path fileToBeDownloadedFullPath = null;
        ByteArrayResource resource = null;
        Path fileDirPath = Paths.get(SERVER_LOCATION, dirname1);

        // Find actual files from Glob pattern
        SearchFileByWildcard sfbw = new SearchFileByWildcard();
        List<String> listofFilesMatchedForGlob = sfbw.searchWithWc(fileDirPath, "glob:" + fileNamePattern);

        // File Was Found
        if (listofFilesMatchedForGlob.size() == 1)
        {
            fileNameToBeDownloaded = listofFilesMatchedForGlob.get(0);
            fileToBeDownloadedFullPath = Paths.get(fileDirPath.toString(), fileNameToBeDownloaded);
            resource = new ByteArrayResource(Files.readAllBytes(fileToBeDownloadedFullPath));

            logger.info(Environment + " " + userNameLoggedIn + " -> WIND Downloading file: " + fileToBeDownloadedFullPath);

            HttpHeaders header = new HttpHeaders();
            header.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=img.jpg");
            header.add("Cache-Control", "no-cache, no-store, must-revalidate");
            header.add("Pragma", "no-cache");
            header.add("Expires", "0");


            return ResponseEntity.ok()
                    .headers(header)
                    .contentLength(fileToBeDownloadedFullPath.toFile().length())
                    .contentType(MediaType.parseMediaType("application/octet-stream"))
                    .body(resource);

        } else if (listofFilesMatchedForGlob.size() > 1) { // Many Outage files are compacted into one
            Charset charset = StandardCharsets.UTF_8;
            List<String> allLines = new ArrayList<>();
            for (String fileName : listofFilesMatchedForGlob) {
                List<String> lines = Files.readAllLines( Paths.get(fileDirPath.toString(), fileName), charset);
                allLines.addAll(lines);
            }

            String totalStringStream = "";

            for (String item : allLines) {
                totalStringStream += item + System.lineSeparator();
            }

            logger.info(Environment + " " + userNameLoggedIn + " -> Downloading files matching pattern: " + fileDirPath.toString() + File.separator +  fileNamePattern);

            HttpHeaders header = new HttpHeaders();
            header.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=img.jpg");
            header.add("Cache-Control", "no-cache, no-store, must-revalidate");
            header.add("Pragma", "no-cache");
            header.add("Expires", "0");

            resource = new ByteArrayResource(totalStringStream.getBytes(charset));

            return ResponseEntity.ok()
                    .headers(header)
                    .contentLength(totalStringStream.getBytes(charset).length)
                    .contentType(MediaType.parseMediaType("application/octet-stream"))
                    .body(resource);

        } else  {
            // File was not found
            logger.error(Environment + " " + userNameLoggedIn + " -> WIND Cannot Download file: " + Paths.get(fileDirPath.toString(), fileNamePattern));
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }


    }

    /* CDR DB Methods */
    @CrossOrigin
    @GetMapping(path = "/getallcdrdbincidents", produces = "application/json")
    public List<CDR_DB_Incident> getAllcdrdbIncidents() {
//        throw new ApiRequestException("Error from my custom exception!");
//        throw new IllegalStateException("Oops cannot get list of incidents!");

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> GET all CDRDB Incidents");
        return incidentService.getAllCDR_DBIncidents();
    }

    @CrossOrigin
    @GetMapping(path = "/getopencdrdbincidents", produces = "application/json")
    public List<CDR_DB_Incident> getOpencdrdbIncidents() {
//        throw new ApiRequestException("Error from my custom exception!");
//        throw new IllegalStateException("Oops cannot get list of incidents!");

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> GET all Open CDRDB Incidents");
        return incidentService.getOpenCDR_DBIncidents();
    }

    @CrossOrigin
    @GetMapping(path = "/getclosedcdrdbincidents", produces = "application/json")
    public List<CDR_DB_Incident> getClosedcdrdbIncidents() {
//        throw new ApiRequestException("Error from my custom exception!");
//        throw new IllegalStateException("Oops cannot get list of incidents!");

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> GET all Closed CDRDB Incidents");
        return incidentService.getClosedCDR_DBIncidents();
    }

    @CrossOrigin
    @GetMapping(path = "/getclosedcdrdbincidentsafterdate/", produces = "application/json")
    public List<CDR_DB_Incident> getClosedcdrdbIncidentsAfterDate() {
//        throw new ApiRequestException("Error from my custom exception!");
//        throw new IllegalStateException("Oops cannot get list of incidents!");

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> GET all Closed CDRDB Incidents");
        return incidentService.getClosedCDR_DBIncidents();
    }


    @CrossOrigin
    @GetMapping(path="/getstatsforwindincidentid/{incidentId}", produces = "application/json")
    public List<IncidentCallerStats> getStatsForWindIncidentID(@PathVariable String incidentId) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> WIND Getting Stats for IncidentID = " + incidentId);

       return incidentService.getStatsForWindIncidentID(incidentId);
    }


    @CrossOrigin
    @RequestMapping(path = "/downloadcustomerscalledforwindincidentid/{incidentid}", method = RequestMethod.GET)
    public ResponseEntity<Resource> downloadCustomersCalledForIncident(@PathVariable String incidentid) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();

        String filename = "Positive_Spectra_Requests_For_" + incidentid + ".csv";

        logger.info(Environment + " " + userNameLoggedIn + " -> WIND Downloading file: " + filename);

        HttpHeaders header = new HttpHeaders();
        header.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=img.jpg");
        header.add("Cache-Control", "no-cache, no-store, must-revalidate");
        header.add("Pragma", "no-cache");
        header.add("Expires", "0");

        List<IncidentPosNLURequests> listOfPosRequestsForIncident = incidentService.getPositiveRequestsForWindIncidentID(incidentid);

        // Convert the list of IncidentPosNLURequests objects to a CSV string
        String csvData = "Date,Requestor,Incident ID,Affected Service,Scheduled,CliValue,TimesCalled\n";
        for (IncidentPosNLURequests d : listOfPosRequestsForIncident) {
            csvData += d.getCallerDate() + "," + d.getRequestor() + "," + d.getIncidentId() + "," + d.getAffectedService() + ","
                    + d.getScheduled() + "," + d.getCliValue() + "," + d.getTimesCalled() + "\n";
        }

        ByteArrayInputStream inputStream = new ByteArrayInputStream(csvData.getBytes(StandardCharsets.UTF_8));

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename);
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_PLAIN_VALUE);

        InputStreamResource resource = new InputStreamResource(inputStream);


        return ResponseEntity.ok().headers(headers).contentLength(csvData.length()).contentType(MediaType.TEXT_PLAIN).body(resource);
    }
}
