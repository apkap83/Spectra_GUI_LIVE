package gr.wind.FullStackSpring_Review.controllers;

import gr.wind.FullStackSpring_Review.incident.IncidentService;
import gr.wind.FullStackSpring_Review.incident.NovaIncidentService;
import gr.wind.FullStackSpring_Review.model.CDR_DB_Incident;
import gr.wind.FullStackSpring_Review.model.Incident;
import gr.wind.FullStackSpring_Review.util.SearchFileByWildcard;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("api/incidents")
public class NovaIncidentController {

    // Download

    @Value("${app.NovaExportedFilesBaseDirName}")
    private String NovaExportedFilesBaseDirName;

    @Value("${app.ExportedFilesMainPath}")
    private String SERVER_LOCATION;

    private final NovaIncidentService novaIncidentService;
    private String userNameLoggedIn;
    private static final Logger logger = LogManager.getLogger(NovaIncidentController.class);
    @Value("${app.MyEnvironmentDescription}")
    private String Environment;

    @Autowired
    public NovaIncidentController(NovaIncidentService novaIncidentService) {
          this.novaIncidentService = novaIncidentService;
    }

    @CrossOrigin
    @GetMapping(path = "/nova_getallincidents", produces = "application/json")
    public List<Incident> getAllIncidents() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> GET NOVA all Incidents");
        return novaIncidentService.getAllIncidents();
    }

    @CrossOrigin
    @GetMapping(path = "/nova_getopenincidents", produces = "application/json")
    public List<Incident> getOpenIncidents() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> GET NOVA open Incidents");

        return novaIncidentService.getOpenIncidents();
    }

    @CrossOrigin
    @GetMapping(path = "/nova_getallnonscheduledincidents", produces = "application/json")
    public List<Incident> getAllNonScheduledIncidents() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> GET all non scheduled Incidents");

        return novaIncidentService.getAllNonScheduledIncidents();
    }
    @CrossOrigin
    @GetMapping(path = "/nova_getopennonscheduledincidents", produces = "application/json")
    public List<Incident> getOpenNonScheduledIncidents() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> GET all open non scheduled Incidents");

        return novaIncidentService.getOpenNonScheduledIncidents();
    }

    @CrossOrigin
    @PutMapping("/nova_willbepublishednoforoutageid/{id}")
    public void setWillBePublishedNOforOutageId(@PathVariable int id) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> Changing Will be published = NO for OutageID = " + id);

        novaIncidentService.setWillBePublishedNOForOutageId(id);
    }

    @CrossOrigin
    @PutMapping("/nova_willbepublishedyesforoutageid/{id}")
    public void setWillBePublishedYESforOutageId(@PathVariable int id) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> Changing Will be published = YES for OutageID = " + id);

        novaIncidentService.setWillBePublishedYESforOutageId(id);
    }

    @CrossOrigin
    @PutMapping("/nova_willbepublishednoforincidentid/{incidentId}")
    public void setWillBePublishedNOforIncidentId(@PathVariable String incidentId) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> Changing Will be published = NO for IncidentID = " + incidentId);

        novaIncidentService.setWillBePublishedNOForIncidentId(incidentId);
    }

    @CrossOrigin
    @PutMapping("/nova_willbepublishedyesforincidentid/{incidentId}")
    public void setWillBePublishedYESforIncidentId(@PathVariable String incidentId) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> Changing Will be published = YES for IncidentID = " + incidentId);

        novaIncidentService.setWillBePublishedYESforIncidentId(incidentId);
    }

    @CrossOrigin
    @PutMapping("/nova_changemessageforoutageid/{outageId}/{message}")
    public void changeMessageforOutageId(@PathVariable String outageId, @PathVariable String message) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> Changing to Message " + message + " for OutageID = " + outageId);

        novaIncidentService.changeMessageForOutageId(outageId, message);
    }

    @CrossOrigin
    @PutMapping("/nova_changemessageforincidentid/{incidentId}/{message}")
    public void changeMessageforIncidentId(@PathVariable String incidentId, @PathVariable String message) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> Changing to Message " + message + " for IncidentID = " + incidentId);

        novaIncidentService.changeMessageForIncidentId(incidentId, message);
    }

    @CrossOrigin
    @PutMapping("/nova_alterbackuppolicyforincidentid/{incidentId}/{yesorno}")
    public void changeBackupPolicyforIncidentId(@PathVariable String incidentId, @PathVariable String yesorno) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> Altering backup policy to " + yesorno + " for IncidentID = " + incidentId);

        novaIncidentService.alterBackupPolicyForIncidentId(incidentId, yesorno);
    }


    @CrossOrigin
    @RequestMapping(path = "/nova_downloadfile/{dirname1}/{fileNamePattern}", method = RequestMethod.GET)
    public ResponseEntity<Resource> download(@PathVariable String dirname1, @PathVariable String fileNamePattern) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();

        String fileNameToBeDownloaded = "";
        Path fileToBeDownloadedFullPath = null;
        ByteArrayResource resource = null;
        Path fileDirPath = Paths.get(SERVER_LOCATION, dirname1, NovaExportedFilesBaseDirName);

        // Find actual files from Glob pattern
        SearchFileByWildcard sfbw = new SearchFileByWildcard();
        List<String> listofFilesMatchedForGlob = sfbw.searchWithWc(fileDirPath, "glob:" + fileNamePattern);

        // File Was Found
        if (listofFilesMatchedForGlob.size() == 1)
        {
            fileNameToBeDownloaded = listofFilesMatchedForGlob.get(0);
            fileToBeDownloadedFullPath = Paths.get(fileDirPath.toString(), fileNameToBeDownloaded);
            resource = new ByteArrayResource(Files.readAllBytes(fileToBeDownloadedFullPath));

            logger.info(Environment + " " + userNameLoggedIn + " -> Downloading file: " + fileToBeDownloadedFullPath);

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
            logger.error(Environment + " " + userNameLoggedIn + " -> Cannot Download file: " + Paths.get(fileDirPath.toString(), fileNamePattern));
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }


    }
}
