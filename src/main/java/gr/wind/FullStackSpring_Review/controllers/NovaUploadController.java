package gr.wind.FullStackSpring_Review.controllers;

import gr.wind.FullStackSpring_Review.exception.ApiRequestException;
import gr.wind.FullStackSpring_Review.incident.IncidentService;
import gr.wind.FullStackSpring_Review.incident.NovaIncidentService;
import gr.wind.FullStackSpring_Review.model.AdHocOutageSubscriber;
import gr.wind.FullStackSpring_Review.uploadingfiles.StorageFileNotFoundException;
import gr.wind.FullStackSpring_Review.uploadingfiles.StorageService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
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
public class NovaUploadController {
    private final StorageService storageService;
    private final NovaIncidentService novaIncidentService;
    private String userNameLoggedIn;
    private static final Logger logger = LogManager.getLogger(NovaUploadController.class);

    @Value("${app.MyEnvironmentDescription}")
    private String Environment;

    @Autowired
    public NovaUploadController(StorageService storageService, NovaIncidentService novaIncidentService) {
        this.storageService = storageService;
        this.novaIncidentService = novaIncidentService;
    }

    @CrossOrigin
    @PostMapping(path = "/nova_uploadadhocfile", produces = "application/json")
    public List<AdHocOutageSubscriber> handleFileUpload(@RequestParam("file") MultipartFile file,
                                                        RedirectAttributes redirectAttributes) throws IOException, ParseException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userNameLoggedIn = authentication.getName();
        logger.info(Environment + userNameLoggedIn + " -> Uploading AdHoc File: " + file.getOriginalFilename());

        storageService.store(file);
        List<AdHocOutageSubscriber> adhocSubsList = null;
        try {
            adhocSubsList = novaIncidentService.loadExcelFileToDB(file);
        }
        catch (Exception e) {
            logger.error(Environment + userNameLoggedIn + "Error: " + e.getMessage());
            throw new ApiRequestException("Error: " + e.getMessage());
        }
        redirectAttributes.addFlashAttribute("message",
                "You successfully uploaded " + file.getOriginalFilename() + "!");

        return adhocSubsList;
    }


//    @GetMapping(path="/getlistofuploadedfiles")
//    public String listUploadedFiles(Model model) throws IOException {
//
//        model.addAttribute("files", storageService.loadAll().map(
//                        path -> MvcUriComponentsBuilder.fromMethodName(UploadController.class,
//                                "serveFile", path.getFileName().toString()).build().toUri().toString())
//                .collect(Collectors.toList()));
//
//        return "uploadForm";
//    }

//    @GetMapping("/files/{filename:.+}")
//    @ResponseBody
//    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
//
//        Resource file = storageService.loadAsResource(filename);
//        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,
//                "attachment; filename=\"" + file.getFilename() + "\"").body(file);
//    }



    @ExceptionHandler(StorageFileNotFoundException.class)
    public ResponseEntity<?> handleStorageFileNotFound(StorageFileNotFoundException exc) {
        return ResponseEntity.notFound().build();
    }
}
