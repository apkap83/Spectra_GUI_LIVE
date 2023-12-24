package gr.wind.FullStackSpring_Review.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PowerVSNTWOutagesTotal {
    private final int Id;
    private final String OUTAGE_TYPE;
    private final String TOTAL;
    private final String WIND_NOVA;

    public PowerVSNTWOutagesTotal(
            int id,
            @JsonProperty("OUTAGE_TYPE") String OUTAGE_TYPE,
            @JsonProperty("TOTAL") String TOTAL,
            @JsonProperty("WIND_NOVA") String WIND_NOVA) {
        Id = id;
        this.OUTAGE_TYPE = OUTAGE_TYPE;
        this.TOTAL = TOTAL;
        this.WIND_NOVA = WIND_NOVA;
    }

    public int getId() {
        return Id;
    }

    public String getOUTAGE_TYPE() {
        return OUTAGE_TYPE;
    }

    public String getTOTAL() {
        return TOTAL;
    }

    public String getWIND_NOVA() {
        return WIND_NOVA;
    }
}
