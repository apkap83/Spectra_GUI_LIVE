package gr.wind.FullStackSpring_Review.model;

public class RemedyTicketsPerResolution {
    private final String DslamOwnerGroup;
    private final String ResolCateg;
    private final String Tickets;
    private final String UniqDslams;
    private final String AffectedSessions;

    public RemedyTicketsPerResolution(String dslamOwnerGroup, String resolCateg, String tickets, String uniqDslams, String affectedSessions) {
        DslamOwnerGroup = dslamOwnerGroup;
        ResolCateg = resolCateg;
        Tickets = tickets;
        UniqDslams = uniqDslams;
        AffectedSessions = affectedSessions;
    }

    public String getDslamOwnerGroup() {
        return DslamOwnerGroup;
    }

    public String getResolCateg() {
        return ResolCateg;
    }

    public String getTickets() {
        return Tickets;
    }

    public String getUniqDslams() {
        return UniqDslams;
    }

    public String getAffectedSessions() {
        return AffectedSessions;
    }
}