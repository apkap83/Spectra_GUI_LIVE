package gr.wind.FullStackSpring_Review.incident;

import gr.wind.FullStackSpring_Review.datasource.excel.ReadExcelFile;
import gr.wind.FullStackSpring_Review.model.AdHocOutageSubscriber;
import gr.wind.FullStackSpring_Review.model.CDR_DB_Incident;
import gr.wind.FullStackSpring_Review.model.Incident;
import gr.wind.FullStackSpring_Review.uploadingfiles.StorageProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.ParseException;
import java.util.List;

@Service
public class NovaIncidentService {

    private final NovaIncidentDataAccessService novaIncidentDataAccessService;
    private final Path rootLocation;

    @Autowired
    public NovaIncidentService(NovaIncidentDataAccessService incidentDataAccessService,
                               StorageProperties properties
                           ) {
        this.novaIncidentDataAccessService = incidentDataAccessService;
        this.rootLocation = Paths.get(properties.getLocation());
    }

    public List<AdHocOutageSubscriber> loadExcelFileToDB(MultipartFile file) throws IOException, ParseException {
        Path destinationFile = this.rootLocation.resolve(
                        Paths.get(file.getOriginalFilename()))
                .normalize().toAbsolutePath();

        ReadExcelFile readExcelFile = new ReadExcelFile(destinationFile.toString());

        List<AdHocOutageSubscriber> excelSubsList = readExcelFile.getExcelSubs();
        novaIncidentDataAccessService.insertMultipleAdHocOutageSubscribers(excelSubsList);
        return excelSubsList;
    }

    public List<AdHocOutageSubscriber> previewExcelFile(MultipartFile file) throws IOException, ParseException {
        Path destinationFile = this.rootLocation.resolve(
                        Paths.get(file.getOriginalFilename()))
                .normalize().toAbsolutePath();

        ReadExcelFile readExcelFile = new ReadExcelFile(destinationFile.toString());

        List<AdHocOutageSubscriber> excelSubsList = readExcelFile.getExcelSubs();
//        incidentDataAccessService.insertMultipleAdHocOutageSubscribers(excelSubsList);
        return excelSubsList;
    }
    public void insertMultipleAdHocOutageSubscribers(List<AdHocOutageSubscriber> adHocOutageSubs) {
        novaIncidentDataAccessService.insertMultipleAdHocOutageSubscribers(adHocOutageSubs);
    }

    public List<Incident> getAllIncidents() {
        return novaIncidentDataAccessService.selectAllIncidents();

    }

    public List<Incident> getOpenIncidents() {
        return novaIncidentDataAccessService.selectOpenIncidents();
    }

    public void setWillBePublishedNOForOutageId(int outageID) {
        novaIncidentDataAccessService.setWillBePublishedNOForOutageID(outageID);
    }

    public void setWillBePublishedYESforOutageId(int outageID) {
        novaIncidentDataAccessService.setWillBePublishedYESForOutageID(outageID);
    }

    public void setWillBePublishedNOForIncidentId(String incidentId) {
        novaIncidentDataAccessService.setWillBePublishedNOForIncidentID(incidentId);

    }

    public void setWillBePublishedYESforIncidentId(String incidentId) {
        novaIncidentDataAccessService.setWillBePublishedYESForIncidentID(incidentId);
    }

    public List<Incident> getOpenNonScheduledIncidents() {
        return novaIncidentDataAccessService.selectOpenNonScheduledIncidents();
    }

    public List<Incident> getAllNonScheduledIncidents() {
        return novaIncidentDataAccessService.selectAllNonScheduledIncidents();
    }

    public List<AdHocOutageSubscriber> getAllAdHocOutages() {
        return novaIncidentDataAccessService.getAllAdHocOutages();
    }

    public void changeMessageForOutageId(String outageId, String message) {
        novaIncidentDataAccessService.changeMessageForOutageId(outageId, message);
    }

    public void changeMessageForIncidentId(String incidentId, String message) {
        novaIncidentDataAccessService.changeMessageForIncident(incidentId, message);
    }

    public void alterBackupPolicyForIncidentId(String incidentId, String yesorno) {
        novaIncidentDataAccessService.alterBackupPolicyForIncident(incidentId, yesorno);
    }


    public int deleteAdHocIncidentByID(int id) {
        return novaIncidentDataAccessService.deleteAdHocIncidentById(id);
    }
}
