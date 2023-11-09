package gr.wind.FullStackSpring_Review.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class DateRange {

    private final DateFields dateFields;

    public DateRange(
            @JsonProperty("dateRange") DateFields dateFields) {
        this.dateFields = dateFields;
    }

    public Date startDate() {
        return dateFields.getStartDate();
    }

    public Date endDate() {
        return dateFields.getEndDate();
    }

    @Override
    public String toString() {
        return "DateRange{" +
                "dateFields=" + dateFields +
                '}';
    }
}
