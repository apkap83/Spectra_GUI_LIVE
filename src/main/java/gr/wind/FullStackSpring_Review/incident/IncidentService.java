package gr.wind.FullStackSpring_Review.incident;

import gr.wind.FullStackSpring_Review.excel.ReadExcelFile;
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
public class IncidentService {

    private final IncidentDataAccessService incidentDataAccessService;
    private final IncidentDataAccessService_SpectraReportingDB incidentDataAccessService_SpectraReporting;
    private final IncidentDataAccessService_CDRDB incidentDataAccessService_cdrdb;
    private final Path rootLocation;

    @Autowired
    public IncidentService(IncidentDataAccessService incidentDataAccessService,
                           IncidentDataAccessService_SpectraReportingDB incidentDataAccessService_spectraReporting,
                           IncidentDataAccessService_CDRDB incidentDataAccessService_cdrdb,
                           StorageProperties properties
                           ) {
        this.incidentDataAccessService = incidentDataAccessService;
        this.incidentDataAccessService_SpectraReporting = incidentDataAccessService_spectraReporting;
        this.incidentDataAccessService_cdrdb = incidentDataAccessService_cdrdb;
        this.rootLocation = Paths.get(properties.getLocation());
    }

    public List<AdHocOutageSubscriber> loadExcelFileToDB(MultipartFile file) throws IOException, ParseException {
        Path destinationFile = this.rootLocation.resolve(
                        Paths.get(file.getOriginalFilename()))
                .normalize().toAbsolutePath();

        ReadExcelFile readExcelFile = new ReadExcelFile(destinationFile.toString());

        List<AdHocOutageSubscriber> excelSubsList = readExcelFile.getExcelSubs();
        incidentDataAccessService.insertMultipleAdHocOutageSubscribers(excelSubsList);
        incidentDataAccessService_SpectraReporting.insertMultipleAdHocOutageSubscribers(excelSubsList);
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
        incidentDataAccessService.insertMultipleAdHocOutageSubscribers(adHocOutageSubs);
    }

    public List<Incident> getAllIncidents() {
        return incidentDataAccessService.selectAllIncidents();

    }

    public List<Incident> getOpenIncidents() {
        return incidentDataAccessService.selectOpenIncidents();
    }

    public void setWillBePublishedNOForOutageId(int outageID) {
        incidentDataAccessService.setWillBePublishedNOForOutageID(outageID);
        incidentDataAccessService_SpectraReporting.setWillBePublishedNOForOutageID(outageID);
    }

    public void setWillBePublishedYESforOutageId(int outageID) {
        incidentDataAccessService.setWillBePublishedYESForOutageID(outageID);
        incidentDataAccessService_SpectraReporting.setWillBePublishedYESForOutageID(outageID);
    }

    public void setWillBePublishedNOForIncidentId(String incidentId) {
        incidentDataAccessService.setWillBePublishedNOForIncidentID(incidentId);
        incidentDataAccessService_SpectraReporting.setWillBePublishedNOForIncidentID(incidentId);

    }

    public void setWillBePublishedYESforIncidentId(String incidentId) {
        incidentDataAccessService.setWillBePublishedYESForIncidentID(incidentId);
        incidentDataAccessService_SpectraReporting.setWillBePublishedYESForIncidentID(incidentId);
    }

    public List<Incident> getOpenNonScheduledIncidents() {
        return incidentDataAccessService.selectOpenNonScheduledIncidents();
    }

    public List<Incident> getAllNonScheduledIncidents() {
        return incidentDataAccessService.selectAllNonScheduledIncidents();
    }

    public List<AdHocOutageSubscriber> getAllAdHocOutages() {
        return incidentDataAccessService.getAllAdHocOutages();
    }

    public void changeMessageForOutageId(String outageId, String message) {
        incidentDataAccessService.changeMessageForOutageId(outageId, message);
        incidentDataAccessService_SpectraReporting.changeMessageForOutageId(outageId, message);
    }

    public void changeMessageForIncidentId(String incidentId, String message) {
        incidentDataAccessService.changeMessageForIncident(incidentId, message);
        incidentDataAccessService_SpectraReporting.changeMessageForIncident(incidentId, message);
    }

    public void alterBackupPolicyForIncidentId(String incidentId, String yesorno) {
        incidentDataAccessService.alterBackupPolicyForIncident(incidentId, yesorno);
        incidentDataAccessService_SpectraReporting.alterBackupPolicyForIncident(incidentId, yesorno);
    }
    /* NEW CDR DB Methods */
    public List<CDR_DB_Incident> getAllCDR_DBIncidents() {
        return incidentDataAccessService_cdrdb.selectAllIncidents();
    }

    public List<CDR_DB_Incident> getOpenCDR_DBIncidents() {
        return incidentDataAccessService_cdrdb.selectOpenIncidents();
    }

    public List<CDR_DB_Incident> getClosedCDR_DBIncidents() {
        return incidentDataAccessService_cdrdb.selectClosedIncidents();
    }


    public int deleteAdHocIncidentByID(int id) {
        return incidentDataAccessService.deleteAdHocIncidentById(id);
    }
}
