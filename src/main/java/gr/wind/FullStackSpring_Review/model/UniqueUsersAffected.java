package gr.wind.FullStackSpring_Review.model;

public class UniqueUsersAffected {
    private final String DslamOwnerGroup;
    private final String MatchedWithTicket;
    private final String ResolCategTier1;
    private final String ResolCategTier2;
    private final String UniqueTickets;
    private final String UniqDslams;
    private final String AffectedSessions;

    public UniqueUsersAffected(String dslamOwnerGroup, String matchedWithTicket, String resolCategTier1, String resolCategTier2, String uniqueTickets, String uniqDslams, String affectedSessions) {
        DslamOwnerGroup = dslamOwnerGroup;
        MatchedWithTicket = matchedWithTicket;
        ResolCategTier1 = resolCategTier1;
        ResolCategTier2 = resolCategTier2;
        UniqueTickets = uniqueTickets;
        UniqDslams = uniqDslams;
        AffectedSessions = affectedSessions;
    }


    public String getDslamOwnerGroup() {
        return DslamOwnerGroup;
    }

    public String getMatchedWithTicket() {
        return MatchedWithTicket;
    }

    public String getResolCategTier1() {
        return ResolCategTier1;
    }

    public String getResolCategTier2() {
        return ResolCategTier2;
    }

    public String getUniqueTickets() {
        return UniqueTickets;
    }

    public String getUniqDslams() {
        return UniqDslams;
    }

    public String getAffectedSessions() {
        return AffectedSessions;
    }
}