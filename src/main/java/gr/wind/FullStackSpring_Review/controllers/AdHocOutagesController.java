package gr.wind.FullStackSpring_Review.controllers;

import gr.wind.FullStackSpring_Review.exception.ApiRequestException;
import gr.wind.FullStackSpring_Review.incident.IncidentService;
import gr.wind.FullStackSpring_Review.model.AdHocOutageSubscriber;
import gr.wind.FullStackSpring_Review.uploadingfiles.StorageService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;

@RestController
@RequestMapping("api/incidents")
public class AdHocOutagesController {

    private final StorageService storageService;
    private static final Logger logger = LogManager.getLogger(AdHocOutagesController.class);
    private final IncidentService incidentService;
    private String userNameLoggedIn;

    @Value("${app.MyEnvironmentDescription}")
    private String Environment;

    @Autowired
    public AdHocOutagesController(StorageService storageService, IncidentService incidentService) {
        this.storageService = storageService;
        this.incidentService = incidentService;
    }

    @CrossOrigin
    @GetMapping(path = "/getalladhocoutages", produces = "application/json")
    public List<AdHocOutageSubscriber> getAllIncidents() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> GET WIND all AdHoc Outages");
        return incidentService.getAllAdHocOutages();
    }

    @CrossOrigin
    @PostMapping(path = "/previewadhocfile", produces = "application/json")
    public List<AdHocOutageSubscriber> handleFilePreview(@RequestParam("file") MultipartFile file,
                                                         RedirectAttributes redirectAttributes) throws IOException, ParseException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> Uploading AdHoc File: " + file.getOriginalFilename());

        storageService.store(file);
        List<AdHocOutageSubscriber> adhocSubsList = null;
        try {
            adhocSubsList = incidentService.previewExcelFile(file);
        }
        catch (Exception e) {
            logger.error(Environment + " " + userNameLoggedIn + e.getMessage());
            throw new ApiRequestException("Error: " + e.getMessage());
        }
        redirectAttributes.addFlashAttribute("message",
                "You successfully uploaded " + file.getOriginalFilename() + "!");

        return adhocSubsList;
    }

    @CrossOrigin
    @DeleteMapping("/deleteadhocincident/{id}")
    public void deleteAdhocIncident(@PathVariable int id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + " " + userNameLoggedIn + " -> Deleting AdHoc Incident with ID: " + id);

        incidentService.deleteAdHocIncidentByID(id);
    }
}
