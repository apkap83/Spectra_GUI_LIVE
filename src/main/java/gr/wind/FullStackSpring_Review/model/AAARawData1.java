package gr.wind.FullStackSpring_Review.model;

import java.math.BigInteger;

public class AAARawData1 {
    private final BigInteger id;
    private final String ALARM_DAY;
    private final String MATCHING_COMMENTS;
    private final String NETWORK;
    private final String DSLAM_OWNER;
    private final String DSLAM_OWNER_GROUP;
    private final String OUTAGE_ID;
    private final String ALARM_START_DATE;
    private final String ALARM_END_DATE;
    private final String AAA_OUTAGE_DURATION_SEC;
    private final String MAINTENANCE_PERIOD;
    private final String DSLAM;
    private final String DSLAM_SLOT;
    private final String TECHNOLOGY;
    private final String OTE_SITE_NAME;
    private final String OTE_SITE_AREA;
    private final String POST_CODE;
    private final String LONGITUDE;
    private final String LATITUDE;
    private final String PROBLEM;
    private final String DSLAM_USERS;
    private final String DATA_AFFECTED;
    private final String TOTAL_USERS_CALLED;
    private final String SMP_UNIQUE_USERS;
    private final String RMD_INCIDENT_NUMBER;
    private final String RMD_IS_SCHEDULED;
    private final String RMD_ALARM_START_DATE;
    private final String RMD_ALARM_END_DATE;
    private final String RMD_SPECTRA_HIERARCHY;
    private final String RMD_OPERATIONAL_CATEG_TIER_1;
    private final String RMD_OPERATIONAL_CATEG_TIER_2;
    private final String RMD_OPERATIONAL_CATEG_TIER_3;
    private final String RMD_RESOLUTION_CATEG_TIER_1;
    private final String RMD_RESOLUTION_CATEG_TIER_2;
    private final String ZBX_EVENT_ID;
    private final String ZBX_PROBLEM;
    private final String ZBX_ALARM_START_DATE;
    private final String ZBX_ALARM_END_DATE;

    private final String ZBX_RMU_EVENT_ID;
    private final String ZBX_RMU_PROBLEM;
    private final String ZBX_RMU_ALARM_START_DATE;
    private final String ZBX_RMU_ALARM_END_DATE;

    private final String NCE_EVENT_ID;
    private final String NCE_ALARM_START_DATE;
    private final String NCE_ALARM_END_DATE;
    private final String NCE_PROBLEM;
    private final String NCE_OPERATIONAL_DATA;

    private final String AMS_EVENT_TIME;
    private final String AMS_PROBABLE_CAUSE;
    private final String AMS_SPECIFIC_PROBLEM;
    private final String AMS_FTTH_EVENT_TIME;
    private final String AMS_FTTH_PROBABLE_CAUSE;
    private final String AMS_FTTH_SPECIFIC_PROBLEM;
    private final String SOEM_EVENT_ID;
    private final String SOEM_RAISED_ON;
    private final String SOEM_ALARM_TYPE;
    private final String SOEM_PROBABLE_CAUSE;
    private final String HDM_LAST_SNAPSHOT_DATE;
    private final String HDM_MATCHING_OUTCOME;
    private final String HDM_MATCHING_OUTCOME_FULL;
    private final String SYSTEM_FOUND;
    private final String SYSTEM_GROUP_FOUND;
    private final String OUTAGE_TYPE_DESC;
    private final String OUTAGE_TYPE;

    public AAARawData1(BigInteger id, String ALARM_DAY, String MATCHING_COMMENTS, String NETWORK,
                       String DSLAM_OWNER, String DSLAM_OWNER_GROUP, String OUTAGE_ID,
                       String ALARM_START_DATE, String ALARM_END_DATE, String AAA_OUTAGE_DURATION_SEC, String MAINTENANCE_PERIOD,
                       String DSLAM, String DSLAM_SLOT, String TECHNOLOGY, String OTE_SITE_NAME,
                       String OTE_SITE_AREA, String POST_CODE, String LONGITUDE, String LATITUDE,
                       String PROBLEM, String DSLAM_USERS, String DATA_AFFECTED, String TOTAL_USERS_CALLED, String SMP_UNIQUE_USERS,
                       String RMD_INCIDENT_NUMBER, String RMD_IS_SCHEDULED, String RMD_ALARM_START_DATE,
                       String RMD_ALARM_END_DATE, String RMD_SPECTRA_HIERARCHY,
                       String RMD_OPERATIONAL_CATEG_TIER_1, String RMD_OPERATIONAL_CATEG_TIER_2,
                       String RMD_OPERATIONAL_CATEG_TIER_3, String RMD_RESOLUTION_CATEG_TIER_1,
                       String RMD_RESOLUTION_CATEG_TIER_2, String ZBX_EVENT_ID,
                       String ZBX_PROBLEM, String ZBX_ALARM_START_DATE, String ZBX_ALARM_END_DATE,

                       String ZBX_RMU_EVENT_ID,
                       String ZBX_RMU_PROBLEM,
                       String ZBX_RMU_ALARM_START_DATE,
                       String ZBX_RMU_ALARM_END_DATE,

                       String NCE_EVENT_ID, String NCE_ALARM_START_DATE, String NCE_ALARM_END_DATE,
                       String NCE_PROBLEM, String NCE_OPERATIONAL_DATA,
                       String AMS_EVENT_TIME,
                       String AMS_PROBABLE_CAUSE,
                       String AMS_SPECIFIC_PROBLEM,
                       String AMS_FTTH_EVENT_TIME,
                       String AMS_FTTH_PROBABLE_CAUSE,
                       String AMS_FTTH_SPECIFIC_PROBLEM,
                       String SOEM_EVENT_ID,
                       String SOEM_RAISED_ON,
                       String SOEM_ALARM_TYPE,
                       String SOEM_PROBABLE_CAUSE,
                       String HDM_LAST_SNAPSHOT_DATE,
                       String HDM_MATCHING_OUTCOME,
                       String HDM_MATCHING_OUTCOME_FULL,
                       String SYSTEM_FOUND,
                       String SYSTEM_GROUP_FOUND,
                       String OUTAGE_TYPE_DESC,
                       String OUTAGE_TYPE


                       ) {
        this.id = id;
        this.ALARM_DAY = ALARM_DAY;
        this.MATCHING_COMMENTS = MATCHING_COMMENTS;
        this.NETWORK = NETWORK;
        this.DSLAM_OWNER = DSLAM_OWNER;
        this.DSLAM_OWNER_GROUP = DSLAM_OWNER_GROUP;
        this.OUTAGE_ID = OUTAGE_ID;
        this.ALARM_START_DATE = ALARM_START_DATE;
        this.ALARM_END_DATE = ALARM_END_DATE;
        this.AAA_OUTAGE_DURATION_SEC = AAA_OUTAGE_DURATION_SEC;
        this.MAINTENANCE_PERIOD = MAINTENANCE_PERIOD;
        this.DSLAM = DSLAM;
        this.DSLAM_SLOT = DSLAM_SLOT;
        this.TECHNOLOGY = TECHNOLOGY;
        this.OTE_SITE_NAME = OTE_SITE_NAME;
        this.OTE_SITE_AREA = OTE_SITE_AREA;
        this.POST_CODE = POST_CODE;
        this.LONGITUDE = LONGITUDE;
        this.LATITUDE = LATITUDE;
        this.PROBLEM = PROBLEM;
        this.DSLAM_USERS = DSLAM_USERS;
        this.DATA_AFFECTED = DATA_AFFECTED;
        this.TOTAL_USERS_CALLED = TOTAL_USERS_CALLED;
        this.SMP_UNIQUE_USERS = SMP_UNIQUE_USERS;
        this.RMD_INCIDENT_NUMBER = RMD_INCIDENT_NUMBER;
        this.RMD_IS_SCHEDULED = RMD_IS_SCHEDULED;
        this.RMD_ALARM_START_DATE = RMD_ALARM_START_DATE;
        this.RMD_ALARM_END_DATE = RMD_ALARM_END_DATE;
        this.RMD_SPECTRA_HIERARCHY = RMD_SPECTRA_HIERARCHY;
        this.RMD_OPERATIONAL_CATEG_TIER_1 = RMD_OPERATIONAL_CATEG_TIER_1;
        this.RMD_OPERATIONAL_CATEG_TIER_2 = RMD_OPERATIONAL_CATEG_TIER_2;
        this.RMD_OPERATIONAL_CATEG_TIER_3 = RMD_OPERATIONAL_CATEG_TIER_3;
        this.RMD_RESOLUTION_CATEG_TIER_1 = RMD_RESOLUTION_CATEG_TIER_1;
        this.RMD_RESOLUTION_CATEG_TIER_2 = RMD_RESOLUTION_CATEG_TIER_2;
        this.ZBX_EVENT_ID = ZBX_EVENT_ID;
        this.ZBX_PROBLEM = ZBX_PROBLEM;
        this.ZBX_ALARM_START_DATE = ZBX_ALARM_START_DATE;
        this.ZBX_ALARM_END_DATE = ZBX_ALARM_END_DATE;

        this.ZBX_RMU_EVENT_ID = ZBX_RMU_EVENT_ID;
        this.ZBX_RMU_PROBLEM = ZBX_RMU_PROBLEM;
        this.ZBX_RMU_ALARM_START_DATE = ZBX_RMU_ALARM_START_DATE;
        this.ZBX_RMU_ALARM_END_DATE = ZBX_RMU_ALARM_END_DATE;

        this.NCE_EVENT_ID = NCE_EVENT_ID;
        this.NCE_ALARM_START_DATE = NCE_ALARM_START_DATE;
        this.NCE_ALARM_END_DATE = NCE_ALARM_END_DATE;
        this.NCE_PROBLEM = NCE_PROBLEM;
        this.NCE_OPERATIONAL_DATA = NCE_OPERATIONAL_DATA;
        this.AMS_EVENT_TIME = AMS_EVENT_TIME;
        this.AMS_PROBABLE_CAUSE = AMS_PROBABLE_CAUSE;
        this.AMS_SPECIFIC_PROBLEM = AMS_SPECIFIC_PROBLEM;
        this.AMS_FTTH_EVENT_TIME = AMS_FTTH_EVENT_TIME;
        this.AMS_FTTH_PROBABLE_CAUSE = AMS_FTTH_PROBABLE_CAUSE;
        this.AMS_FTTH_SPECIFIC_PROBLEM = AMS_FTTH_SPECIFIC_PROBLEM;
        this.SOEM_EVENT_ID = SOEM_EVENT_ID;
        this.SOEM_RAISED_ON = SOEM_RAISED_ON;
        this.SOEM_ALARM_TYPE =SOEM_ALARM_TYPE;
        this.SOEM_PROBABLE_CAUSE = SOEM_PROBABLE_CAUSE;
        this.HDM_LAST_SNAPSHOT_DATE = HDM_LAST_SNAPSHOT_DATE;
        this.HDM_MATCHING_OUTCOME = HDM_MATCHING_OUTCOME;
        this.HDM_MATCHING_OUTCOME_FULL = HDM_MATCHING_OUTCOME_FULL;
        this.SYSTEM_FOUND =SYSTEM_FOUND;
        this.SYSTEM_GROUP_FOUND = SYSTEM_GROUP_FOUND;
        this.OUTAGE_TYPE_DESC =OUTAGE_TYPE_DESC;
        this.OUTAGE_TYPE = OUTAGE_TYPE;

    }

    public String getZBX_RMU_EVENT_ID() {
        return ZBX_RMU_EVENT_ID;
    }

    public String getZBX_RMU_PROBLEM() {
        return ZBX_RMU_PROBLEM;
    }

    public String getZBX_RMU_ALARM_START_DATE() {
        return ZBX_RMU_ALARM_START_DATE;
    }

    public String getZBX_RMU_ALARM_END_DATE() {
        return ZBX_RMU_ALARM_END_DATE;
    }

    public String getAAA_OUTAGE_DURATION_SEC() {
        return AAA_OUTAGE_DURATION_SEC;
    }

    public String getSMP_UNIQUE_USERS() {
        return SMP_UNIQUE_USERS;
    }

    public String getAMS_EVENT_TIME() {
        return AMS_EVENT_TIME;
    }

    public String getAMS_PROBABLE_CAUSE() {
        return AMS_PROBABLE_CAUSE;
    }

    public String getAMS_SPECIFIC_PROBLEM() {
        return AMS_SPECIFIC_PROBLEM;
    }

    public String getAMS_FTTH_EVENT_TIME() {
        return AMS_FTTH_EVENT_TIME;
    }

    public String getAMS_FTTH_PROBABLE_CAUSE() {
        return AMS_FTTH_PROBABLE_CAUSE;
    }

    public String getAMS_FTTH_SPECIFIC_PROBLEM() {
        return AMS_FTTH_SPECIFIC_PROBLEM;
    }

    public String getSOEM_EVENT_ID() {
        return SOEM_EVENT_ID;
    }

    public String getSOEM_RAISED_ON() {
        return SOEM_RAISED_ON;
    }

    public String getSOEM_ALARM_TYPE() {
        return SOEM_ALARM_TYPE;
    }

    public String getSOEM_PROBABLE_CAUSE() {
        return SOEM_PROBABLE_CAUSE;
    }

    public String getHDM_LAST_SNAPSHOT_DATE() {
        return HDM_LAST_SNAPSHOT_DATE;
    }

    public String getHDM_MATCHING_OUTCOME() {
        return HDM_MATCHING_OUTCOME;
    }

    public String getHDM_MATCHING_OUTCOME_FULL() {
        return HDM_MATCHING_OUTCOME_FULL;
    }

    public String getSYSTEM_FOUND() {
        return SYSTEM_FOUND;
    }

    public String getSYSTEM_GROUP_FOUND() {
        return SYSTEM_GROUP_FOUND;
    }

    public String getOUTAGE_TYPE_DESC() {
        return OUTAGE_TYPE_DESC;
    }

    public String getOUTAGE_TYPE() {
        return OUTAGE_TYPE;
    }

    public String getRMD_IS_SCHEDULED() {
        return RMD_IS_SCHEDULED;
    }

    public String getMAINTENANCE_PERIOD() {
        return MAINTENANCE_PERIOD;
    }

    public BigInteger getId() {
        return id;
    }

    public String getALARM_DAY() {
        return ALARM_DAY;
    }

    public String getMATCHING_COMMENTS() {
        return MATCHING_COMMENTS;
    }

    public String getNETWORK() {
        return NETWORK;
    }

    public String getDSLAM_OWNER() {
        return DSLAM_OWNER;
    }

    public String getDSLAM_OWNER_GROUP() {
        return DSLAM_OWNER_GROUP;
    }

    public String getOUTAGE_ID() {
        return OUTAGE_ID;
    }

    public String getALARM_START_DATE() {
        return ALARM_START_DATE;
    }

    public String getALARM_END_DATE() {
        return ALARM_END_DATE;
    }

    public String getDSLAM() {
        return DSLAM;
    }

    public String getDSLAM_SLOT() {
        return DSLAM_SLOT;
    }

    public String getTECHNOLOGY() {
        return TECHNOLOGY;
    }

    public String getOTE_SITE_NAME() {
        return OTE_SITE_NAME;
    }

    public String getOTE_SITE_AREA() {
        return OTE_SITE_AREA;
    }

    public String getPOST_CODE() {
        return POST_CODE;
    }

    public String getLONGITUDE() {
        return LONGITUDE;
    }

    public String getLATITUDE() {
        return LATITUDE;
    }

    public String getPROBLEM() {
        return PROBLEM;
    }

    public String getDSLAM_USERS() {
        return DSLAM_USERS;
    }

    public String getDATA_AFFECTED() {
        return DATA_AFFECTED;
    }

    public String getTOTAL_USERS_CALLED() {
        return TOTAL_USERS_CALLED;
    }

    public String getRMD_INCIDENT_NUMBER() {
        return RMD_INCIDENT_NUMBER;
    }

    public String getRMD_ALARM_START_DATE() {
        return RMD_ALARM_START_DATE;
    }

    public String getRMD_ALARM_END_DATE() {
        return RMD_ALARM_END_DATE;
    }

    public String getRMD_SPECTRA_HIERARCHY() {
        return RMD_SPECTRA_HIERARCHY;
    }

    public String getRMD_OPERATIONAL_CATEG_TIER_1() {
        return RMD_OPERATIONAL_CATEG_TIER_1;
    }

    public String getRMD_OPERATIONAL_CATEG_TIER_2() {
        return RMD_OPERATIONAL_CATEG_TIER_2;
    }

    public String getRMD_OPERATIONAL_CATEG_TIER_3() {
        return RMD_OPERATIONAL_CATEG_TIER_3;
    }

    public String getRMD_RESOLUTION_CATEG_TIER_1() {
        return RMD_RESOLUTION_CATEG_TIER_1;
    }

    public String getRMD_RESOLUTION_CATEG_TIER_2() {
        return RMD_RESOLUTION_CATEG_TIER_2;
    }

    public String getZBX_EVENT_ID() {
        return ZBX_EVENT_ID;
    }

    public String getZBX_PROBLEM() {
        return ZBX_PROBLEM;
    }

    public String getZBX_ALARM_START_DATE() {
        return ZBX_ALARM_START_DATE;
    }

    public String getZBX_ALARM_END_DATE() {
        return ZBX_ALARM_END_DATE;
    }

    public String getNCE_EVENT_ID() {
        return NCE_EVENT_ID;
    }

    public String getNCE_ALARM_START_DATE() {
        return NCE_ALARM_START_DATE;
    }

    public String getNCE_ALARM_END_DATE() {
        return NCE_ALARM_END_DATE;
    }

    public String getNCE_PROBLEM() {
        return NCE_PROBLEM;
    }

    public String getNCE_OPERATIONAL_DATA() {
        return NCE_OPERATIONAL_DATA;
    }
}
