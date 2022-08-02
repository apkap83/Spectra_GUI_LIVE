package gr.wind.FullStackSpring_Review.controllers;

import gr.wind.FullStackSpring_Review.model.CDR_DB_Incident;
import gr.wind.FullStackSpring_Review.incident.IncidentService;
import gr.wind.FullStackSpring_Review.model.Incident;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.ParseException;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("api/incidents")
public class IncidentController {

    // Download
    private static final String SERVER_LOCATION = "/opt/ExportedFiles";
    private final IncidentService incidentService;
    private String userNameLoggedIn;
    private static final Logger logger = LogManager.getLogger(IncidentController.class);

    // TODO: Change for Live Environment
    private static String Environment = "TEST Environment ";

    @Autowired
    public IncidentController(IncidentService incidentService) {
          this.incidentService = incidentService;
    }

    @CrossOrigin
    @GetMapping(path = "/getallincidents", produces = "application/json")
    public List<Incident> getAllIncidents() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + userNameLoggedIn + " -> GET all Incidents");
        return incidentService.getAllIncidents();
    }

    @CrossOrigin
    @GetMapping(path = "/getopenincidents", produces = "application/json")
    public List<Incident> getOpenIncidents() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + userNameLoggedIn + " -> GET open Incidents");

        return incidentService.getOpenIncidents();
    }

    @CrossOrigin
    @GetMapping(path = "/getallnonscheduledincidents", produces = "application/json")
    public List<Incident> getAllNonScheduledIncidents() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + userNameLoggedIn + " -> GET all non scheduled Incidents");

        return incidentService.getAllNonScheduledIncidents();
    }
    @CrossOrigin
    @GetMapping(path = "/getopennonscheduledincidents", produces = "application/json")
    public List<Incident> getOpenNonScheduledIncidents() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + userNameLoggedIn + " -> GET all open non scheduled Incidents");

        return incidentService.getOpenNonScheduledIncidents();
    }

    @CrossOrigin
    @PutMapping("/willbepublishednoforoutageid/{id}")
    public void setWillBePublishedNOforOutageId(@PathVariable int id) {

        System.out.println("HERE!!!");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + userNameLoggedIn + " -> Changing Will be published = NO for OutageID = " + id);

        incidentService.setWillBePublishedNOForOutageId(id);
    }

    @CrossOrigin
    @PutMapping("/willbepublishedyesforoutageid/{id}")
    public void setWillBePublishedYESforOutageId(@PathVariable int id) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + userNameLoggedIn + " -> Changing Will be published = YES for OutageID = " + id);

        incidentService.setWillBePublishedYESforOutageId(id);
    }

    @CrossOrigin
    @PutMapping("/willbepublishednoforincidentid/{incidentId}")
    public void setWillBePublishedNOforIncidentId(@PathVariable String incidentId) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + userNameLoggedIn + " -> Changing Will be published = NO for IncidentID = " + incidentId);

        incidentService.setWillBePublishedNOForIncidentId(incidentId);
    }

    @CrossOrigin
    @PutMapping("/willbepublishedyesforincidentid/{incidentId}")
    public void setWillBePublishedYESforIncidentId(@PathVariable String incidentId) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + userNameLoggedIn + " -> Changing Will be published = YES for IncidentID = " + incidentId);

        incidentService.setWillBePublishedYESforIncidentId(incidentId);
    }

    @CrossOrigin
    @PutMapping("/changemessageforoutageid/{outageId}/{message}")
    public void changeMessageforOutageId(@PathVariable String outageId, @PathVariable String message) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + userNameLoggedIn + " -> Changing to Message " + message + " for OutageID = " + outageId);

        incidentService.changeMessageForOutageId(outageId, message);
    }

    @CrossOrigin
    @PutMapping("/changemessageforincidentid/{incidentId}/{message}")
    public void changeMessageforIncidentId(@PathVariable String incidentId, @PathVariable String message) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + userNameLoggedIn + " -> Changing to Message " + message + " for IncidentID = " + incidentId);

        incidentService.changeMessageForIncidentId(incidentId, message);
    }

    @CrossOrigin
    @PutMapping("/alterbackuppolicyforincidentid/{incidentId}/{yesorno}")
    public void changeBackupPolicyforIncidentId(@PathVariable String incidentId, @PathVariable String yesorno) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + userNameLoggedIn + " -> Altering backup policy to " + yesorno + " for IncidentID = " + incidentId);

        incidentService.alterBackupPolicyForIncidentId(incidentId, yesorno);
    }


    @CrossOrigin
    @RequestMapping(path = "/downloadfile/{dirname1}/{dirname2}/{filename}", method = RequestMethod.GET)
    public ResponseEntity<Resource> download(@PathVariable String dirname1, @PathVariable String dirname2, @PathVariable String filename) throws IOException {
        File file = new File(SERVER_LOCATION + File.separator + dirname1 + File.separator + dirname2 + File.separator + filename);

        HttpHeaders header = new HttpHeaders();
        header.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=img.jpg");
        header.add("Cache-Control", "no-cache, no-store, must-revalidate");
        header.add("Pragma", "no-cache");
        header.add("Expires", "0");

        Path path = Paths.get(file.getAbsolutePath());
        ByteArrayResource resource = new ByteArrayResource(Files.readAllBytes(path));


        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + userNameLoggedIn + " -> Downloading file: " + filename);


        return ResponseEntity.ok()
                .headers(header)
                .contentLength(file.length())
                .contentType(MediaType.parseMediaType("application/octet-stream"))
                .body(resource);
    }

    /* CDR DB Methods */
    @CrossOrigin
    @GetMapping(path = "/getallcdrdbincidents", produces = "application/json")
    public List<CDR_DB_Incident> getAllcdrdbIncidents() {
//        throw new ApiRequestException("Error from my custom exception!");
//        throw new IllegalStateException("Oops cannot get list of incidents!");

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + userNameLoggedIn + " -> GET all CDRDB Incidents");
        return incidentService.getAllCDR_DBIncidents();
    }

    @CrossOrigin
    @GetMapping(path = "/getopencdrdbincidents", produces = "application/json")
    public List<CDR_DB_Incident> getOpencdrdbIncidents() {
//        throw new ApiRequestException("Error from my custom exception!");
//        throw new IllegalStateException("Oops cannot get list of incidents!");

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + userNameLoggedIn + " -> GET all Open CDRDB Incidents");
        return incidentService.getOpenCDR_DBIncidents();
    }

    @CrossOrigin
    @GetMapping(path = "/getclosedcdrdbincidents", produces = "application/json")
    public List<CDR_DB_Incident> getClosedcdrdbIncidents() {
//        throw new ApiRequestException("Error from my custom exception!");
//        throw new IllegalStateException("Oops cannot get list of incidents!");

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + userNameLoggedIn + " -> GET all Closed CDRDB Incidents");
        return incidentService.getClosedCDR_DBIncidents();
    }

    @CrossOrigin
    @GetMapping(path = "/getclosedcdrdbincidentsafterdate/", produces = "application/json")
    public List<CDR_DB_Incident> getClosedcdrdbIncidentsAfterDate() {
//        throw new ApiRequestException("Error from my custom exception!");
//        throw new IllegalStateException("Oops cannot get list of incidents!");

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + userNameLoggedIn + " -> GET all Closed CDRDB Incidents");
        return incidentService.getClosedCDR_DBIncidents();
    }
}
