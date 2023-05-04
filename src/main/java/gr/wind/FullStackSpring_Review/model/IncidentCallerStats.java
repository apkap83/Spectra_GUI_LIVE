package gr.wind.FullStackSpring_Review.model;

public class IncidentCallerStats {
    private final String requestor;
    private final String positiveResponses;

    public IncidentCallerStats(String requestor, String positiveResponses) {
        this.requestor = requestor;
        this.positiveResponses = positiveResponses;
    }

    public String getRequestor() {
        return requestor;
    }

    public String getPositiveResponses() {
        return positiveResponses;
    }

    @Override
    public String toString() {
        return "IncidentCallerStats{" +
                "requestor='" + requestor + '\'' +
                ", positiveResponses='" + positiveResponses + '\'' +
                '}';
    }
}
