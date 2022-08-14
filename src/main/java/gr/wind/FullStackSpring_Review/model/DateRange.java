package gr.wind.FullStackSpring_Review.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class DateRange {

    private final DateFields dateFields;

    public DateRange(
            @JsonProperty("dateRange") DateFields dateFields) {
        this.dateFields = dateFields;
    }

    public String startDate() {
        return dateFields.getStartDate();
    }

    public String endDate() {
        return dateFields.getEndDate();
    }
    @Override
    public String toString() {
        return "DateRange{" +
                "dateFields=" + dateFields +
                '}';
    }
}
