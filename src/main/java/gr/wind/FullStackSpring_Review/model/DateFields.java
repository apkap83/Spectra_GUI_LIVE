package gr.wind.FullStackSpring_Review.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class DateFields {
    private String startDate;
    private String endDate;

    public DateFields(
            @JsonProperty("startDate") String startDate,
            @JsonProperty("endDate") String endDate) {
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public String getStartDate() {
        return startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    @Override
    public String toString() {
        return "DateRange{" +
                "startDate='" + startDate + '\'' +
                ", endDate='" + endDate + '\'' +
                '}';
    }
}
