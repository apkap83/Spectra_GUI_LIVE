package gr.wind.FullStackSpring_Review.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class NumOfRequestsPerMethod {

    // {"ID":1,"Date":"2019-12-27",
    // "GetHierarchy":10,
    // "SubmitOutage":0,
    // "ModifyOutage":0,
    // "CloseOutage":0,
    // "NLU_Active_Pos_Voice":0,
    // "NLU_Active_Pos_Data":0,
    // "NLU_Active_Pos_IPTV":0,
    // "NLU_Active_Neg":0,
    // "GetOutageStatus":0,
    // "CDR_DB_Neg":0,
    // "CDR_DB_Pos":0}

    private final int id;
    private final String date;
    private final int getHierarchy;
    private final int submitOutage;
    private final int modifyOutage;
    private final int closeOutage;
    private final int nLUActivePosVoice;
    private final int nLUActivePosData;
    private final int nLUActivePosIPTV;
    private final int nLUActiveNeg;
    private final int getOutageStatus;
    private final int cdrDBNeg;
    private final int cdrDBPos;
    private final int adHocPos;

    public NumOfRequestsPerMethod(
            @JsonProperty("ID") int id,
            @JsonProperty("Date") String date,
            @JsonProperty("GetHierarchy") int getHierarchy,
            @JsonProperty("SubmitOutage") int submitOutage,
            @JsonProperty("ModifyOutage") int modifyOutage,
            @JsonProperty("CloseOutage") int closeOutage,
            @JsonProperty("NLU_Active_Pos_Voice") int nLUActivePosVoice,
            @JsonProperty("NLU_Active_Pos_Data") int nLUActivePosData,
            @JsonProperty("NLU_Active_Pos_IPTV") int nLUActivePosIPTV,
            @JsonProperty("NLU_Active_Neg") int nLUActiveNeg,
            @JsonProperty("GetOutageStatus") int getOutageStatus,
            @JsonProperty("CDR_DB_Neg") int cdrDBNeg,
            @JsonProperty("CDR_DB_Pos") int cdrDBPos,
            @JsonProperty("AdHoc_Pos") int AdHoc_Pos) {
        this.id = id;
        this.date = date;
        this.getHierarchy = getHierarchy;
        this.submitOutage = submitOutage;
        this.modifyOutage = modifyOutage;
        this.closeOutage = closeOutage;
        this.nLUActivePosVoice = nLUActivePosVoice;
        this.nLUActivePosData = nLUActivePosData;
        this.nLUActivePosIPTV = nLUActivePosIPTV;
        this.nLUActiveNeg = nLUActiveNeg;
        this.getOutageStatus = getOutageStatus;
        this.cdrDBNeg = cdrDBNeg;
        this.cdrDBPos = cdrDBPos;
        this.adHocPos = AdHoc_Pos;
    }

    public int getID() {
        return id;
    }

    public String getDate() {
        return date;
    }

    public int getGetHierarchy() {
        return getHierarchy;
    }

    public int getSubmitOutage() {
        return submitOutage;
    }

    public int getModifyOutage() {
        return modifyOutage;
    }

    public int getCloseOutage() {
        return closeOutage;
    }

    @JsonProperty("NLU_Active_Pos_Voice")
    public int getNLU_Active_Pos_Voice() {
        return nLUActivePosVoice;
    }

    @JsonProperty("NLU_Active_Pos_Data")
    public int getNLU_Active_Pos_Data() {
        return nLUActivePosData;
    }

    @JsonProperty("NLU_Active_Pos_IPTV")
    public int getNLU_Active_Pos_IPTV() {
        return nLUActivePosIPTV;
    }

    @JsonProperty("NLU_Active_Neg")
    public int getNLU_Active_Neg() {
        return nLUActiveNeg;
    }

    @JsonProperty("GetOutageStatus")
    public int getGetOutageStatus() {
        return getOutageStatus;
    }

    @JsonProperty("CDR_DB_Neg")
    public int getCDR_DB_Neg() {
        return cdrDBNeg;
    }

    @JsonProperty("CDR_DB_Pos")
    public int getCDR_DB_Pos() {
        return cdrDBPos;
    }

    @JsonProperty("AdHoc_Pos")
    public int getAdHoc_Pos() {
        return adHocPos;
    }


}
