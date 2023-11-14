package gr.wind.FullStackSpring_Review.model;

public class AaaAverageOutagesPerDayUniqDslamSessAffected {
    private final String AvgOutagesPerDay;
    private final String UniqueDslam;
    private final String SessionAffected;

    public AaaAverageOutagesPerDayUniqDslamSessAffected(String avgOutagesPerDay, String uniqueDslam, String sessionAffected) {
        AvgOutagesPerDay = avgOutagesPerDay;
        UniqueDslam = uniqueDslam;
        SessionAffected = sessionAffected;
    }

    public String getAvgOutagesPerDay() {
        return AvgOutagesPerDay;
    }

    public String getUniqueDslam() {
        return UniqueDslam;
    }

    public String getSessionAffected() {
        return SessionAffected;
    }
}