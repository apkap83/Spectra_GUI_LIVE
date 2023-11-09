package gr.wind.FullStackSpring_Review.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Map;

public class AaaOutagesRemedy2 {
    private final int id;
    private final String DSLAM_OWNER_GROUP;

    private final Map<String, Integer> DateValuePair;


    public AaaOutagesRemedy2(
            int id, @JsonProperty("DSLAM_OWNER_GROUP") String DSLAM_OWNER_GROUP,

            Map<String, Integer> dateValuePair) {
        this.id = id;
        this.DSLAM_OWNER_GROUP = DSLAM_OWNER_GROUP;

        this.DateValuePair = dateValuePair;
    }

    public int getId() {
        return id;
    }

    @JsonProperty("DSLAM_OWNER_GROUP")
    public String getDSLAM_OWNER_GROUP() {
        return DSLAM_OWNER_GROUP;
    }


    public Map<String, Integer> getDateValuePair() {
        return DateValuePair;
    }
}
