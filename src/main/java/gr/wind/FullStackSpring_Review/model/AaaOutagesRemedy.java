package gr.wind.FullStackSpring_Review.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Map;

public class AaaOutagesRemedy {
    private final int Id;
    private final String DSLAM_OWNER_GROUP;
    private final String COMMENTS;
    private final Map<String, Integer> DateValuePair;


    public AaaOutagesRemedy(
            int id, @JsonProperty("DSLAM_OWNER_GROUP") String DSLAM_OWNER_GROUP,
            @JsonProperty("COMMENTS") String COMMENTS,
            Map<String, Integer> dateValuePair) {
        Id = id;
        this.DSLAM_OWNER_GROUP = DSLAM_OWNER_GROUP;
        this.COMMENTS = COMMENTS;
        this.DateValuePair = dateValuePair;
    }

    public int getId() {
        return Id;
    }

    @JsonProperty("DSLAM_OWNER_GROUP")
    public String getDSLAM_OWNER_GROUP() {
        return DSLAM_OWNER_GROUP;
    }

    @JsonProperty("COMMENTS")
    public String getCOMMENTS() {
        return COMMENTS;
    }

    public Map<String, Integer> getDateValuePair() {
        return DateValuePair;
    }
}
