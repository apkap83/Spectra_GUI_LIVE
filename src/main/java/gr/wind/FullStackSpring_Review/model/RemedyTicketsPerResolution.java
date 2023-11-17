package gr.wind.FullStackSpring_Review.model;

public class RemedyTicketsPerResolution {
    private final String resolCategTier1;

    private final String resolutionCategTier2;

    private final String tickets;

    private final String dslams;

    private final String dslamsWindNova;

    private final String dslamsOteVF;

    private final String affectedSessions;

    public RemedyTicketsPerResolution(String resolCategTier1, String resolutionCategTier2, String tickets, String dslams, String dslamsWindNova, String dslamsOteVF, String affectedSessions) {
        this.resolCategTier1 = resolCategTier1;
        this.resolutionCategTier2 = resolutionCategTier2;
        this.tickets = tickets;
        this.dslams = dslams;
        this.dslamsWindNova = dslamsWindNova;
        this.dslamsOteVF = dslamsOteVF;
        this.affectedSessions = affectedSessions;
    }

    public String getResolCategTier1() {
        return resolCategTier1;
    }

    public String getResolutionCategTier2() {
        return resolutionCategTier2;
    }

    public String getTickets() {
        return tickets;
    }

    public String getDslams() {
        return dslams;
    }

    public String getDslamsWindNova() {
        return dslamsWindNova;
    }

    public String getDslamsOteVF() {
        return dslamsOteVF;
    }

    public String getAffectedSessions() {
        return affectedSessions;
    }
}