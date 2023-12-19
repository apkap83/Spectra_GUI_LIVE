package gr.wind.FullStackSpring_Review.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Map;

public class PowerVSNTWOutages {
    private final int Id;
    private final String OUTAGE_TYPE;
    private final Map<String, Integer> DateValuePair;


    public PowerVSNTWOutages(
            int id,
            @JsonProperty("OUTAGE_TYPE") String OUTAGE_TYPE,
            Map<String, Integer> dateValuePair) {
        Id = id;
        this.OUTAGE_TYPE = OUTAGE_TYPE;
        this.DateValuePair = dateValuePair;
    }

    public int getId() {
        return Id;
    }

    @JsonProperty("OUTAGE_TYPE")
    public String getCOMMENTS() {
        return OUTAGE_TYPE;
    }

    public Map<String, Integer> getDateValuePair() {
        return DateValuePair;
    }
}
